import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Job, Skill, Occupation } from './entities/job.entity';
import { ILike, Repository } from 'typeorm';
import { IUser } from 'src/users/user.interface';
import aqp from 'api-query-params';
const PDFExtract = require('pdf.js-extract').PDFExtract;
import TfIdf from 'node-tfidf';
// const TfIdf = require('node-tfidf');
// import { PDFExtract } from 'pdf.js-extract';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

interface PDFExtractOptions {
  firstPage?: number; // default:`1` - start extract at page nr
  lastPage?: number; //  stop extract at page nr, no default value
  password?: string; //  for decrypting password-protected PDFs., no default value
  verbosity?: number; // default:`-1` - log level of pdf.js
  normalizeWhitespace?: boolean; // default:`false` - replaces all occurrences of whitespace with standard spaces (0x20).
  disableCombineTextItems?: boolean; // default:`false` - do not attempt to combine  same line {@link TextItem}'s.
}

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
    @InjectRepository(Occupation)
    private occupationRepository: Repository<Occupation>,
    private configService: ConfigService,
  ) {}

  async create(createJobDto: CreateJobDto, user: IUser) {
    const skills = createJobDto?.skills;
    const skillArr = [];

    const occupations = createJobDto?.occupations;
    const occupationArr = [];

    const skillPromises = skills.map(async (skill) => {
      const existingSkill = await this.skillRepository.findOne({
        where: { name: skill },
      });

      if (existingSkill) {
        skillArr.push(existingSkill);
      } else {
        const skillSave = await this.skillRepository.create({
          name: skill,
        });

        const result = await this.skillRepository.save(skillSave);
        skillArr.push(result);
      }
    });
    await Promise.all(skillPromises);

    const occupationPromises = occupations.map(async (occupation) => {
      const existingOccupations = await this.occupationRepository.findOne({
        where: { name: occupation },
      });

      if (existingOccupations) {
        occupationArr.push(existingOccupations);
      } else {
        const occupationSave = await this.occupationRepository.create({
          name: occupation,
        });

        const result = await this.occupationRepository.save(occupationSave);
        occupationArr.push(result);
      }
    });
    await Promise.all(occupationPromises);

    const job = await this.jobRepository.create({
      ...createJobDto,
      company: {
        id: createJobDto.company.id,
      },
      skills: skillArr,
      occupations: occupationArr,
      createdBy: {
        id: user.id,
        email: user.email,
      },
    });

    const result = await this.jobRepository.save(job);
    return result;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (currentPage - 1) * limit;
    const defaultLimit = limit ? limit : 10;

    const regexFilter = {};

    // Chuyển đổi filter để áp dụng like cho mỗi trường
    Object.keys(filter).forEach((key) => {
      if (key === 'company') {
        regexFilter[key] = {
          id: filter[key],
        };
      } else {
        regexFilter[key] =
          key !== 'skills'
            ? ILike(`%${filter[key]}%`)
            : {
                name: ILike(`%${filter.skills}%`),
              };
      }
    });

    const [result, totalItems] = await this.jobRepository.findAndCount({
      where: regexFilter,
      take: defaultLimit,
      skip: offset,
      order: sort as any, // Ép kiểu dữ liệu
      relations: ['skills', 'occupations', 'company'],
    });

    result.map((job) => {
      job.company = {
        id: job.company.id,
        name: job.company.name,
        logo: job.company.logo,
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

  async getParamsOccupation() {
    const topOccupations = await this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.occupations', 'occupation')
      .select('occupation.name', 'name')
      .addSelect('COUNT(job.id)', 'job_count')
      .groupBy('occupation.name')
      .orderBy('job_count', 'DESC')
      .limit(5)
      .getRawMany();

    const fills = ['#11d769', '#308aff', '#da8300', '#1cfff1', '#ffe700'];

    return topOccupations.map((occupation, index) => ({
      name: occupation.name,
      jobCount: parseInt(occupation.job_count),
      fill: fills[index],
    }));
  }

  async getTotalJobs() {
    const totalJobs = await this.jobRepository.count();
    return totalJobs;
  }

  async findOne(id: number) {
    const job = await this.jobRepository.findOne({
      where: { id },
      relations: ['skills', 'occupations', 'company'],
    });

    const arrNameSkills: string[] = [];
    job.skills.forEach((skill: any) => {
      return arrNameSkills.push(skill.name);
    });

    const arrNameOccupations: string[] = [];
    job.occupations.forEach((occupation: any) => {
      return arrNameOccupations.push(occupation.name);
    });

    if (!job) {
      return `not found job`;
    } else {
      return {
        ...job,
        skills: arrNameSkills,
        occupations: arrNameOccupations,
      };
    }
  }

  async update(id: number, updateJobDto: UpdateJobDto, user: IUser) {
    const skills = updateJobDto?.skills;
    const skillArr = [];

    const occupations = updateJobDto?.occupations;
    const occupationArr = [];

    if (skills.length !== 0) {
      const skillPromises = skills.map(async (skill) => {
        const existingSkill = await this.skillRepository.findOne({
          where: { name: skill },
        });

        if (existingSkill) {
          skillArr.push(existingSkill);
        } else {
          const skillSave = await this.skillRepository.create({
            name: skill,
          });

          const result = await this.skillRepository.save(skillSave);
          skillArr.push(result);
        }
      });
      await Promise.all(skillPromises);
    }

    const occupationPromises = occupations.map(async (occupation) => {
      const existingOccupations = await this.occupationRepository.findOne({
        where: { name: occupation },
      });

      if (existingOccupations) {
        occupationArr.push(existingOccupations);
      } else {
        const occupationSave = await this.occupationRepository.create({
          name: occupation,
        });

        const result = await this.occupationRepository.save(occupationSave);
        occupationArr.push(result);
      }
    });
    await Promise.all(occupationPromises);

    const job = await this.jobRepository.findOne({ where: { id } });

    if (!job) {
      throw new BadRequestException(`Job with id ${id} not found.`);
    }

    await this.jobRepository.delete(job);
    return await this.jobRepository.save({
      id,
      ...updateJobDto,
      skills: skillArr,
      occupations: occupationArr,
      updatedBy: {
        id: user.id,
        email: user.email,
      },
    });
  }

  async remove(id: number, user: IUser) {
    const job = await this.jobRepository.findOne({
      where: { id },
    });

    if (!job) {
      throw new BadRequestException('not found job');
    } else {
      await this.jobRepository.update(
        { id },
        {
          deletedBy: {
            id: user.id,
            email: user.email,
          },
        },
      );

      return await this.jobRepository.softDelete(id);
    }
  }

  async getJobsSuggest(
    currentPage: number,
    limit: number,
    qs: string,
    filename: string,
  ) {
    try {
      const currentDate = new Date();
      const tfidf = new TfIdf();

      const { filter, sort } = aqp(qs);
      delete filter.current;
      delete filter.pageSize;

      const offset = (currentPage - 1) * limit;
      const defaultLimit = limit ? limit : 10;

      // Chuyển đổi filter để áp dụng like cho mỗi trường
      const regexFilter = {};
      Object.keys(filter).forEach((key) => {
        regexFilter[key] = ILike(`%${filter[key]}%`);
      });

      const [result, totalItems] = await this.jobRepository.findAndCount({
        relations: ['skills', 'occupations', 'company'],
      });

      result.map((job) => {
        job.company = {
          id: job.company.id,
          name: job.company.name,
          logo: job.company.logo,
        } as any;
      });

      const resultFilter = result.filter((job) => {
        return job?.endDate.getTime() - currentDate.getTime() > 0;
      });

      const publicDir = join(__dirname, '..', '..', 'public');
      const url = join(publicDir, 'images', 'resume', filename);

      const pdfExtract = new PDFExtract();
      const options: PDFExtractOptions = {}; /* see below */
      const textArr = [];
      const resultFinal = [];

      await new Promise((resolve, reject) => {
        // đọc file pdf
        pdfExtract.extract(url, options, (err, data) => {
          if (err) reject(err);
          data.pages[0].content.map((obj: any) => {
            textArr.push(obj.str); // push từng từ vào mảng textArr
          });
          // console.log(textArr.length);
          const textFile = textArr.join(''); // gộp các từ lại thành văn bản
          const cleanedText = textFile.replace(/[✉•\+\-]/g, ''); // xóa bỏ các ký tự đặc biệt
          const textFileLowerCase = cleanedText.toLocaleLowerCase();
          // console.log(textFileLowerCase.length);

          tfidf.addDocument(textFileLowerCase); // Sử dụng hàm addDocument của thư viện tfidf để thêm đối số là đoạn văn bản

          resultFilter.map((job) => {
            const measures = [];
            // Process skills
            job?.skills.forEach((skill) => {
              const skillNameLowerCase = skill.name.toLowerCase();
              tfidf.tfidfs(skillNameLowerCase, (i, measure) => {
                measures.push({ measure });
              });
            });

            // Process occupations
            job?.occupations.forEach((occupation) => {
              const occupationNameLowerCase = occupation.name.toLowerCase();
              tfidf.tfidfs(occupationNameLowerCase, (i, measure) => {
                measures.push({ measure });
              });
            });

            // Process job level
            if (job.level) {
              const levelLowerCase = job.level.toLowerCase();
              tfidf.tfidfs(levelLowerCase, (i, measure) => {
                measures.push({ measure });
              });
            }

            // Calculate total measure for the job
            const totalMeasures = measures.reduce(
              (total, currentValue) => total + currentValue.measure,
              0,
            );

            if (totalMeasures !== 0) {
              resultFinal.push({ ...job, totalMeasures });
            }
          });

          // Sắp xếp job có độ phù hợp với cv theo measure từ cao tới thấp
          resultFinal.sort(function (a, b) {
            return b.totalMeasures - a.totalMeasures;
          });

          resultFinal.forEach((job) => {
            delete job.totalMeasures;
          });
          resolve(resultFinal);
        });
      });
      let resultJobsFind = resultFinal.slice(0, limit);

      if (currentPage > 1) {
        if (!resultJobsFind) {
          resultJobsFind = [];
        } else {
          resultJobsFind = resultFinal.slice(offset, limit + offset);
        }
      }
      const totalPages = Math.ceil(resultFinal.length / defaultLimit);

      return {
        meta: {
          current: currentPage,
          pageSize: limit,
          pages: totalPages,
          total: resultFinal.length,
        },
        result: resultJobsFind,
      };
    } catch (error) {
      console.error(error);
    }
  }
}
