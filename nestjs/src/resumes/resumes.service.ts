import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserCvDto, UploadCvDto } from './dto/create-resume.dto';
import { IUser } from 'src/users/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, OrderByCondition, Repository } from 'typeorm';
import { History, Resume } from './entities/resume.entity';
import aqp from 'api-query-params';
const PDFExtract = require('pdf.js-extract').PDFExtract;
import TfIdf from 'node-tfidf';
import { Job } from 'src/jobs/entities/job.entity';
import { join } from 'path';
import { PDFExtractOptions } from 'pdf.js-extract';
import { v4 as uuidv4 } from 'uuid';

// import { fromPath } from 'pdf2pic';

@Injectable()
export class ResumesService {
  constructor(
    @InjectRepository(Resume)
    private resumeRepository: Repository<Resume>,
    @InjectRepository(History)
    private historyRepository: Repository<History>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

  async create(CreateUserCvDto: CreateUserCvDto, user: IUser) {
    const { url, companyId, jobId } = CreateUserCvDto;
    const token = uuidv4();

    const history = await this.historyRepository.create({
      status: 'Chưa giải quyết',
      updatedBy: {
        id: user.id,
        email: user.email,
      },
    });

    const result = await this.historyRepository.save(history);

    const newCV = await this.resumeRepository.create({
      url: url,
      company: {
        id: companyId,
      },
      job: {
        id: jobId,
      },
      email: user.email,
      userId: user.id,
      status: 'Chưa giải quyết',
      token: token,
      histories: [result],
      createdBy: {
        id: user.id,
        email: user.email,
      },
    });
    await this.resumeRepository.save(newCV);

    return {
      id: newCV?.id,
      createdAt: newCV?.createdAt,
    };
  }

  async uploadCV(UploadCvDto: UploadCvDto, user: IUser) {
    const { url } = UploadCvDto;

    const newCV = await this.resumeRepository.create({
      url,
      email: user.email,
      userId: user.id,
      createdBy: {
        id: user.id,
        email: user.email,
      },
    });
    await this.resumeRepository.save(newCV);

    return {
      id: newCV?.id,
      createdAt: newCV?.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (currentPage - 1) * limit;
    const defaultLimit = limit ? limit : 10;

    // Chuyển đổi filter để áp dụng like cho mỗi trường
    const regexFilter = {};
    // Object.keys(filter).forEach((key) => {
    //   regexFilter[key] = ILike(`%${filter[key]}%`);
    // });
    Object.keys(filter).forEach((key) => {
      regexFilter[key] =
        key !== 'company'
          ? ILike(`%${filter[key]}%`)
          : {
              name: ILike(`%${filter.company}%`),
            };
    });

    const [result, totalItems] = await this.resumeRepository.findAndCount({
      where: regexFilter,
      take: defaultLimit,
      skip: offset,
      order: sort as any, // Ép kiểu dữ liệu
      relations: ['histories', 'company', 'job', 'createdBy'],
    });

    result.map((resume) => {
      resume.company = {
        id: resume.company.id,
        name: resume.company.name,
        logo: resume.company.logo,
      } as any;

      resume.job = {
        id: resume.job.id,
        name: resume.job.name,
      } as any;

      resume.createdBy = {
        id: resume.createdBy.id,
        name: resume.createdBy.name,
      } as any;
    });
    const totalPages = Math.ceil(totalItems / defaultLimit);

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async findOne(id: number) {
    const resume = await this.resumeRepository.findOne({
      where: { id },
      relations: ['histories', 'company', 'job'],
    });

    resume.company = {
      id: resume.company.id,
      name: resume.company.name,
    } as any;

    resume.job = {
      id: resume.job.id,
      name: resume.job.name,
    } as any;

    if (!resume) {
      throw new BadRequestException(`not found resume`);
    } else {
      return { resume };
    }
  }

  async update(id: number, status: string, user: IUser) {
    const existingResume = await this.resumeRepository.findOne({
      where: { id },
      relations: ['histories'],
    });

    existingResume.histories.push({
      status,
      updatedAt: new Date(),
      updatedBy: {
        id: user.id,
        email: user.email,
      },
    } as any);

    if (!existingResume) {
      throw new BadRequestException(`Resume with id ${id} not found.`);
    }

    return await this.resumeRepository.save({
      id,
      email: user.email,
      userId: user.id,
      status,
      histories: existingResume.histories,
      updatedBy: {
        id: user.id,
        email: user.email,
      },
    });
  }

  async remove(id: number, user: IUser) {
    const job = await this.resumeRepository.findOne({
      where: { id },
    });

    if (!job) {
      throw new BadRequestException('not found company');
    } else {
      await this.resumeRepository.update(
        { id },
        {
          deletedBy: {
            id: user.id,
            email: user.email,
          },
        },
      );

      return await this.resumeRepository.softDelete(id);
    }
  }

  async getCvByUser(user: IUser) {
    const resumes = await this.resumeRepository.find({
      where: { createdBy: { id: user.id } },
      order: { createdAt: 'DESC' } as OrderByCondition,
      relations: ['company', 'job'],
    });

    resumes?.map((resume) => {
      resume.company = {
        id: resume?.company?.id,
        name: resume?.company?.name,
        logo: resume?.company?.logo,
      } as any;

      resume.job = {
        id: resume?.job?.id,
        name: resume?.job?.name,
      } as any;
    });

    return resumes;
  }

  async getResumesSuggest(
    currentPage: number,
    limit: number,
    qs: string,
    jobId: number,
  ) {
    const { filter, sort } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (currentPage - 1) * limit;
    const defaultLimit = limit ? limit : 10;

    // Chuyển đổi filter để áp dụng like cho mỗi trường
    const regexFilter = {};
    // Object.keys(filter).forEach((key) => {
    //   regexFilter[key] = ILike(`%${filter[key]}%`);
    // });
    Object.keys(filter).forEach((key) => {
      regexFilter[key] =
        key !== 'company'
          ? ILike(`%${filter[key]}%`)
          : {
              name: ILike(`%${filter.company}%`),
            };
    });

    const job = await this.jobRepository.findOne({
      where: { id: jobId && jobId },
      relations: ['skills', 'occupations', 'company'],
    });

    const [result, totalItems] = await this.resumeRepository.findAndCount({
      where: {
        ...regexFilter,
        job: {
          id: job.id,
        },
      },
      relations: ['histories', 'company', 'job', 'createdBy'],
    });

    // console.log('jobId', jobId);
    // console.log('job', job.id);
    result.map((resume) => {
      resume.company = {
        id: resume.company.id,
        name: resume.company.name,
        logo: resume.company.logo,
      } as any;

      resume.job = {
        id: resume.job.id,
        name: resume.job.name,
      } as any;

      resume.createdBy = {
        id: resume.createdBy.id,
        name: resume.createdBy.name,
      } as any;
    });
    // console.log('result', result);

    const publicDir = join(__dirname, '..', '..', 'public');
    const pdfExtract = new PDFExtract();
    const options: PDFExtractOptions = {}; /* see below */

    const resultFinal = [];
    for (const resume of result) {
      const url = join(publicDir, 'images', 'resume', resume.url);
      const textArr = [];
      const tfidf = new TfIdf();

      await new Promise((resolve, reject) => {
        pdfExtract.extract(url, options, (err, data) => {
          if (err) reject(err);
          data.pages[0].content.map((obj: any) => {
            textArr.push(obj.str);
          });
          const textFile = textArr.join('');
          const cleanedText = textFile.replace(/[✉•\+\-]/g, '');
          const textFileLowerCase = cleanedText.toLocaleLowerCase();

          //thêm tài liệu CV vào tfidf
          tfidf.addDocument(textFileLowerCase);

          // tf(t,d) = số lần xuất hiện của từ t trong tài liệu d / tổng số từ trong tài liệu d
          // idf(t,D) = log(Tổng số tài liệu / số tài liệu chứa từ t)
          // tf-idf = tf x idf
          // t là từ cần tính.
          // d là một tài liệu cụ thể (ở đây là một CV).
          // D là tập hợp tất cả các tài liệu (tức là toàn bộ CV).
          const measures = [];
          job?.skills.forEach((skill) => {
            const skillNameLowerCase = skill.name.toLowerCase();
            tfidf.tfidfs(skillNameLowerCase, (i, measure) => {
              measures.push({ measure });
            });
          });

          job?.occupations.forEach((occupation) => {
            const occupationNameLowerCase = occupation.name.toLowerCase();
            tfidf.tfidfs(occupationNameLowerCase, (i, measure) => {
              measures.push({ measure });
            });
          });

          if (job.name) {
            // Chuyển đổi job.name thành chữ thường và tách thành mảng các từ
            const jobNameWords = job.name.toLowerCase().split(' ');
            // Lặp qua từng từ và tính toán tfidf
            jobNameWords.forEach((word) => {
              tfidf.tfidfs(word, (i, measure) => {
                measures.push({ measure });
              });
            });
          }

          if (job.level) {
            const levelLowerCase = job.level.toLowerCase();
            tfidf.tfidfs(levelLowerCase, (i, measure) => {
              measures.push({ measure });
            });
          }

          if (job.location) {
            const locationLowerCase = job.location.toLowerCase();
            tfidf.tfidfs(locationLowerCase, (i, measure) => {
              measures.push({ measure });
            });
          }

          if (job.genderReq) {
            const genderReqLowerCase = job.genderReq.toLowerCase();
            tfidf.tfidfs(genderReqLowerCase, (i, measure) => {
              measures.push({ measure });
            });
          }

          const totalMeasures = measures.reduce(
            (total, currentValue) => total + currentValue.measure,
            0,
          );

          resultFinal.push({ ...resume, totalMeasures });

          resolve(resume);
        });
      });
    }
    // console.log(resultFinal);

    // Sắp xếp cv có độ phù hợp với job theo measure từ cao tới thấp
    resultFinal.sort(function (a, b) {
      return b.totalMeasures - a.totalMeasures;
    });

    resultFinal.forEach((resume) => {
      delete resume.totalMeasures;
    });

    //Gởi mail mời phòng vấn

    let resultResumesFind = resultFinal.slice(0, limit);

    if (currentPage > 1) {
      if (!resultResumesFind) {
        resultResumesFind = [];
      } else {
        resultResumesFind = resultFinal.slice(offset, limit + offset);
      }
    }
    // console.log(resultResumesFind);

    const totalPages = Math.ceil(resultFinal.length / defaultLimit);
    // const totalPages = Math.ceil(totalItems / defaultLimit);
    // console.log(resultFinal);

    // console.log('currentPage: ', currentPage);
    // console.log('limit: ', limit);
    // console.log('totalPages: ', totalPages);
    // console.log('totalItems: ', totalItems);

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: resultFinal.length,
      },
      result: resultFinal,
    };
  }

  async conformInterview(token: string) {
    const resume = await this.resumeRepository.findOne({
      where: { token, status: 'Liên hệ' },
    });

    if (!resume) {
      throw new BadRequestException(
        'Thư mời phỏng vấn đã được xác nhận hoặc không tồn tại',
      );
    } else {
      await this.resumeRepository.save({
        ...resume,
        status: 'Đã xác nhận',
      });
    }
  }
}
