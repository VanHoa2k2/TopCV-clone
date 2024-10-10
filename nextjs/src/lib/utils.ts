import { EntityError } from "@/lib/http";
import { UseFormSetError } from "react-hook-form";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { grey, green, blue, red, orange } from "@ant-design/colors";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: "server",
        message: item.message,
      });
    });
  } else {
    // toast({
    //   title: 'Lỗi',
    //   description: error?.payload?.message ?? 'Lỗi không xác định',
    //   variant: 'destructive',
    //   duration: duration ?? 5000
    // })
  }
};
/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

export const EMPLOYEE_SIZE_LIST = [
  { label: "1-9 nhân viên", value: "1-9 nhân viên" },
  { label: "10-24 nhân viên", value: "10-24 nhân viên" },
  { label: "25-99 nhân viên", value: "25-99 nhân viên" },
  { label: "100-499 nhân viên", value: "100-499 nhân viên" },
  { label: "500-1000 nhân viên", value: "500-1000 nhân viên" },
  { label: "1000+ nhân viên", value: "1000+ nhân viên" },
  { label: "3000+ nhân viên", value: "3000+ nhân viên" },
  { label: "5000+ nhân viên", value: "5000+ nhân viên" },
  { label: "10000+ nhân viên", value: "10000+ nhân viên" },
];

export const EXPERIENCES_LIST = [
  { label: "Không yêu cầu kinh nghiệm", value: "Không yêu cầu kinh nghiệm" },
  { label: "Dưới 1 năm", value: "Dưới 1 năm" },
  { label: "1 năm", value: "1 năm" },
  { label: "2 năm", value: "2 năm" },
  { label: "3 năm", value: "3 năm" },
  { label: "4 năm", value: "4 năm" },
  { label: "5 năm", value: "5 năm" },
];

export const GENDERREQ_LIST = [
  { label: "Không yêu cầu", value: "Không yêu cầu" },
  { label: "Nam", value: "Nam" },
  { label: "Nữ", value: "Nữ" },
];

export const EMPLOYMENTTYPE_LIST = [
  { label: "Toàn thời gian", value: "Toàn thời gian" },
  { label: "Bán thời gian", value: "Bán thời gian" },
];

export const LEVELS_LIST = [
  { label: "Nhân viên", value: "Nhân viên" },
  { label: "Phó phòng", value: "Phó phòng" },
  { label: "Trưởng phòng", value: "Trưởng phòng" },
  { label: "Phó phòng / Trưởng phòng", value: "Phó phòng / Trưởng phòng" },
  { label: "Giám đốc", value: "Giám đốc" },
  { label: "Quản lý / Giám sát", value: "Quản lý / Giám sát" },
];

export const SKILLS_LIST = [
  { label: "CSS", value: "CSS" },
  { label: "HTML", value: "HTML" },
  { label: "ReactJS", value: "REACTJS" },
  { label: "NextJS", value: "NEXTJS" },
  { label: "React Native", value: "REACT NATIVE" },
  { label: "VueJS", value: "VUEJS" },
  { label: "Angular", value: "ANGULAR" },
  { label: "NodeJS", value: "NODEJS" },
  { label: "NestJS", value: "NESTJS" },
  { label: "Laravel", value: "LARAVEL" },
  { label: "PHP", value: "PHP" },
  { label: "Python", value: "PYTHON" },
  { label: "C#", value: "C#" },
  { label: "Javascript", value: "JAVASCRIPT" },
  { label: "TypeScript", value: "TYPESCRIPT" },
  { label: "Java", value: "JAVA" },
  { label: "Flutter", value: "FLUTTER" },
  { label: "Spring", value: "SPRING" },
  { label: "Fullstack", value: "FULLSTACK" },
  { label: "PostgreSQL", value: "POSTGRESQL" },
  { label: "MySQL", value: "MYSQL" },
  { label: "MongoDB", value: "MONGODB" },
  { label: "Android", value: "Android" },
  { label: "iOS", value: "iOS" },
  { label: "Front-end", value: "Front-end" },
  { label: "Fullstack Developer", value: "Fullstack Developer" },
  { label: "Blockchain", value: "Blockchain" },
  { label: "Microsoft Office", value: "Microsoft Office" },
  { label: "Intermedidate English", value: "Intermedidate English" },
  { label: "Communication", value: "Communication" },
  { label: "Persuasion", value: "Persuasion" },
  { label: "English", value: "English" },
  { label: "SQL Server", value: "SQL Server" },
  { label: "Illustrator", value: "Illustrator" },
  { label: "After Effect", value: "After Effect" },
  { label: "Adobe Photoshop", value: "Adobe Photoshop" },
  { label: "Customer Service", value: "Customer Service" },
  { label: "Sale", value: "Sale" },
  { label: "Chăm sóc khách hàng", value: "Chăm sóc khách hàng" },
  { label: "Bán hàng", value: "Bán hàng" },
  { label: "Kinh doanh", value: "Kinh doanh" },
  { label: "Sales", value: "Sales" },
  { label: "Quan Hệ Khách Hàng", value: "Quan Hệ Khách Hàng" },
  { label: "Xử lý tình huống", value: "Xử lý tình huống" },
  { label: "Quản Lý Kho Hàng", value: "Quản Lý Kho Hàng" },
  { label: "Đóng Hàng", value: "Đóng Hàng" },
  { label: "Excel", value: "Excel" },
  { label: "Tin học văn phòng", value: "Tin học văn phòng" },
  { label: "Hành Chính Nhân Sự", value: "Hành Chính Nhân Sự" },
  { label: "Nghiệp Vụ Nhân Sự", value: "Nghiệp Vụ Nhân Sự" },
  { label: "Tuyển Dụng Nhân Sự", value: "Tuyển Dụng Nhân Sự" },
  { label: "Kỹ năng bán hàng", value: "Kỹ năng bán hàng" },
  { label: "Tư vấn", value: "Tư vấn" },
  { label: "Figma", value: "Figma" },
  { label: "Photoshop", value: "Photoshop" },
  { label: "BA", value: "BA" },
  { label: "May Mặc", value: "May Mặc" },
  { label: "Optitex", value: "Optitex" },
  { label: "Thiết Kế Photoshop", value: "Thiết Kế Photoshop" },
  { label: "Nghiên Cứu Thị Trường", value: "Nghiên Cứu Thị Trường" },
  {
    label: "Nghiên Cứu Và Phát Triển Sản Phẩm",
    value: "Nghiên Cứu Và Phát Triển Sản Phẩm",
  },
  { label: "Dựng phim", value: "Dựng phim" },
  { label: "Quay phim", value: "Quay phim" },
  { label: "Lập Kế Hoạch", value: "Lập Kế Hoạch" },
  { label: "Quay Dựng Video", value: "Quay Dựng Video" },
];

export const OCCUPATIONS_LIST = [
  { label: "IT - Phần mềm", value: "IT - Phần mềm" },
  { label: "Công nghệ thông tin", value: "Công nghệ thông tin" },
  { label: "Việc làm IT", value: "Việc làm IT" },
  { label: "Kinh doanh / Bán hàng", value: "Kinh doanh / Bán hàng" },
  { label: "Xây dựng", value: "Xây dựng" },
  { label: "Bán hàng kỹ thuật", value: "Bán hàng kỹ thuật" },
  {
    label: "Cơ khí / Chế tạo / Tự động hóa",
    value: "Cơ khí / Chế tạo / Tự động hóa",
  },
  { label: "Ngân hàng / Tài chính", value: "Ngân hàng / Tài chính" },
  { label: "Bất động sản", value: "Bất động sản" },
  { label: "Vận tải / Kho vận", value: "Vận tải / Kho vận" },
  { label: "Tư vấn", value: "Tư vấn" },
  { label: "Báo chí / Truyền hình", value: "Báo chí / Truyền hình" },
  {
    label: "Marketing / Truyền thông / Quảng cáo",
    value: "Marketing / Truyền thông / Quảng cáo",
  },
  { label: "Thiết kế đồ họa", value: "Thiết kế đồ họa" },
  { label: "Dịch vụ khách hàng", value: "Dịch vụ khách hàng" },
  { label: "Bưu chính - Viễn thông", value: "Bưu chính - Viễn thông" },
  { label: "Logistics", value: "Logistics" },
  {
    label: "Mỹ thuật / Nghệ thuật / Điện ảnh",
    value: "Mỹ thuật / Nghệ thuật / Điện ảnh",
  },
  { label: "Kiến trúc", value: "Kiến trúc" },
  { label: "Tài chính / Đầu tư", value: "Tài chính / Đầu tư" },
  { label: "Kế toán / Kiểm toán", value: "Kế toán / Kiểm toán" },
  { label: "Giáo dục / Đào tạo", value: "Giáo dục / Đào tạo" },
  { label: "IT Phần cứng / Mạng", value: "IT Phần cứng / Mạng" },
  { label: "Tổ chức sự kiện / Quà tặng", value: "Tổ chức sự kiện / Quà tặng" },
  { label: "Quản lý điều hành", value: "Quản lý điều hành" },
  { label: "Bán lẻ / bán sỉ", value: "Bán lẻ / bán sỉ" },
  { label: "Hành chính / Văn phòng", value: "Hành chính / Văn phòng" },
  { label: "Y tế / Dược", value: "Y tế / Dược" },
  { label: "Thiết kế nội thất", value: "Thiết kế nội thất" },
  { label: "Dệt may / Da giày", value: "Dệt may / Da giày" },
  { label: "Thời trang", value: "Thời trang" },
  { label: "Khác", value: "Khác" },
];

export const FIELDS_LIST = [
  { label: "IT - Phần mềm", value: "IT - Phần mềm" },
  { label: "Kế toán / Kiểm toán", value: "Kế toán / Kiểm toán" },
  { label: "Luật", value: "Luật" },
  { label: "Bảo hiểm", value: "Bảo hiểm" },
  { label: "Bất động sản", value: "Bất động sản" },
  { label: "Logistics - Vận tải", value: "Logistics - Vận tải" },
  {
    label: "Dược phẩm / Y tế / Công nghệ sinh học",
    value: "Dược phẩm / Y tế / Công nghệ sinh học",
  },
  { label: "Sản xuất", value: "Sản xuất" },
  {
    label: "Bán lẻ - Hàng tiêu dùng - FMCG",
    value: "Bán lẻ - Hàng tiêu dùng - FMCG",
  },
  { label: "Môi trường", value: "Môi trường" },
  { label: "Điện tử / Điện lạnh", value: "Điện tử / Điện lạnh" },
  {
    label: "Marketing / Truyền thông / Quảng cáo",
    value: "Marketing / Truyền thông / Quảng cáo",
  },
  { label: "Nông Lâm Ngư nghiệp", value: "Nông Lâm Ngư nghiệp" },
  { label: "Bảo trì / Sửa chữa", value: "Bảo trì / Sửa chữa" },
  { label: "Xây dựng", value: "Xây dựng" },
  { label: "Cơ khí", value: "Cơ khí" },
  { label: "Xuất nhập khẩu", value: "Xuất nhập khẩu" },
  { label: "Thương mại điện tử", value: "Thương mại điện tử" },
  { label: "Viễn thông", value: "Viễn thông" },
  { label: "Giáo dục / Đào tạo", value: "Giáo dục / Đào tạo" },
  { label: "Thiết kế / kiến trúc", value: "Thiết kế / kiến trúc" },
  { label: "Chứng khoán", value: "Chứng khoán" },
  { label: "Giải trí", value: "Giải trí" },
  { label: "Tử động hóa", value: "Tử động hóa" },
  { label: "Ngân hàng", value: "Ngân hàng" },
  { label: "Khác", value: "Khác" },
];

// export const LOCATION_LIST = [
//   { label: "1 - 2 triệu", value: "1 - 2 triệu" },
//   { label: "2 - 4 triệu", value: "2 - 4 triệu" },
//   { label: "3 - 5 triệu", value: "3 - 5 triệu" },
//   { label: "7 - 15 triệu", value: "7 - 15 triệu" },
//   { label: "10 - 20 triệu", value: "10 - 20 triệu" },
//   { label: "14 - 20 triệu", value: "14 - 20 triệu" },
//   { label: "12 - 25 triệu", value: "12 - 25 triệu" },
//   { label: "18 - 25 triệu", value: "18 - 25 triệu" },
//   { label: "Tới 25 triệu", value: "Tới 25 triệu" },
//   { label: "20 - 30 triệu", value: "20 - 30 triệu" },
//   { label: "22 - 30 triệu", value: "22 - 30 triệu" },
//   { label: "25 - 35 triệu", value: "25 - 35 triệu" },
//   { label: "tới 35 triệu", value: "tới 35 triệu" },
//   { label: "25 - 40 triệu", value: "25 - 40 triệu" },
//   { label: "600 - 1500 USD", value: "600 - 1500 USD" },
//   { label: "800 - 2000 USD", value: "800 - 2000 USD" },
//   { label: "1000 - 3000 USD", value: "1000 - 3000 USD" },
// ];

export const LOCATION_LIST = [
  { label: "Cần Thơ", value: "Cần Thơ" },
  { label: "Hà Nội", value: "Hà Nội" },
  { label: "Hồ Chí Minh", value: "Hồ Chí Minh" },
  { label: "Đà Nẵng", value: "Đà Nẵng" },
  { label: "Others", value: "Others" },
  { label: "Tất cả thành phố", value: "ALL" },
];

export const aboutLinks = [
  { href: "https://topcv.com.vn/", text: "Giới thiệu" },
  { href: "https://www.topcv.vn/gioi-thieu#bao-chi", text: "Góc báo chí" },
  { href: "https://www.topcv.vn/brand/topcv?id=105", text: "Tuyển dụng" },
  { href: "https://www.topcv.vn/gioi-thieu#lien-he", text: "Liên hệ" },
  { href: "https://www.topcv.vn/faqs", text: "Hỏi đáp" },
  {
    href: "https://www.topcv.vn/dieu-khoan-bao-mat",
    text: "Chính sách bảo mật",
  },
  {
    href: "https://www.topcv.vn/terms-of-service",
    text: "Điều khoản dịch vụ",
  },
  {
    href: "https://static.topcv.vn/manual/Quy_che_san_TMDT_TopCV.pdf",
    text: "Quy chế hoạt động",
  },
];

export const partnerLinks = [
  { href: "https://www.testcenter.vn/", text: "TestCenter" },
  { href: "https://tophr.vn/", text: "TopHR" },
  { href: "https://www.viecngay.vn/", text: "ViecNgay" },
  { href: "https://happytime.vn/", text: "Happy Time" },
];

export const profileAndCVLinks = [
  { href: "/", text: "Quản lý CV của bạn" },
  { href: "/", text: "TopCV Profile" },
  {
    href: "/",
    text: "Hướng dẫn viết CV",
  },
  {
    href: "/",
    text: "Thư viện CV theo ngành nghề",
  },
  { href: "/", text: "Review CV" },
];

export const discoverLinks = [
  { href: "/", text: "Ứng dụng di động TopCV" },
  { href: "/", text: "Tính lương Gross - Net" },
  { href: "/", text: "Tính lãi suất kép" },
  { href: "/", text: "Lập kế hoạch tiết kiệm" },
  { href: "/", text: "Tính bảo hiểm thất nghiệp" },
  { href: "/", text: "Tính bảo hiểm xã hội một lần" },
  { href: "/", text: "Trắc nghiệm MBTI" },
  { href: "/", text: "Trắc nghiệm MI" },
];

export const careerLinks = [
  { href: "/", text: "Việc làm tốt nhất" },
  { href: "/", text: "Việc làm lương cao" },
  { href: "/", text: "Việc làm quản lý" },
  { href: "/", text: "Việc làm IT" },
  { href: "/", text: "Việc làm Senior" },
  { href: "/", text: "Việc làm bán thời gian" },
];

export const personalDevelopmentLinks = [{ href: "/", text: "TopCV Contest" }];

export const nonAccentVietnamese = (str: string) => {
  str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/Đ/g, "D");
  str = str.replace(/đ/g, "d");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
  return str;
};

export const convertSlug = (str: string) => {
  str = nonAccentVietnamese(str);
  str = str.replace(/^\s+|\s+$/g, ""); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  const from =
    "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;";
  const to =
    "AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------";
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-"); // collapse dashes

  return str;
};

export const getLocationName = (value: string) => {
  const locationFilter = LOCATION_LIST.filter((item) => item.value === value);
  if (locationFilter.length) return locationFilter[0].label;
  return "unknown";
};

export function colorMethod(
  method: "POST" | "PATCH" | "GET" | "DELETE" | string
) {
  switch (method) {
    case "POST":
      return green[6];
    case "PATCH":
      return orange[6];
    case "GET":
      return blue[6];
    case "DELETE":
      return red[6];
    default:
      return grey[10];
  }
}
