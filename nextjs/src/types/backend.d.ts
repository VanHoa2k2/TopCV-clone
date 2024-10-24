export interface IBackendRes<T> {
  error?: string | string[];
  message: string;
  statusCode: number | string;
  data?: T;
}

interface AccessTokenResponse {
  access_token: string;
  accessTokenExpires: string;
  refresh_token: string;
}

export interface IUser {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
  age?: number;
  gender?: string;
  phone?: string;
  address?: string;
  urlCV?: string;
  avatar?: string | null;
  notifies?: {
    id: number;
    status?: string;
    title?: string;
    description?: string;
    isActive?: boolean;
    jobId?: number;
    nameJob?: string;
    createdAt?: string;
  }[];
  role?: {
    id: number;
    name?: string;
  };

  company?: {
    id: number;
    name?: string;
  };
  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAccount {
  access_token: string;
  accessTokenExpires: string;
  refresh_token: string;
  user: {
    id: number;
    email: string;
    name: string;
    urlCV: string;
    avatar: string;
    phone: string;
    notifies?: {
      id: number;
      status?: string;
      title?: string;
      description?: string;
      isActive?: boolean;
      jobId?: number;
      nameJob?: string;
      createdAt?: string;
    }[];
    company?: {
      id: number;
      name: string;
    };
    role: {
      id: number;
      name: string;
    };
    permissions: {
      id: number;
      name: string;
      apiPath: string;
      method: string;
      module: string;
    }[];
  };
}

export interface IRegisterForHR {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  company: {
    id: number;
  };
}

export interface IGetAccount extends Omit<IAccount, "access_token"> {}

export interface IModelPaginate<T> {
  meta: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  result: T[];
}

export interface IAllCompany {
  id?: number;
  name?: string;
  fields: {
    id: number;
    name: string;
  }[];
  address?: string;
  linkWebsite?: string | null;
  employeeSize?: string;
  coverImage?: string | null;
  logo?: string;
  description?: string;
  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}
[];

export interface ICompany {
  id?: number;
  name?: string;
  fields: {
    id: number;
    name: string;
  }[];
  address?: string;
  linkWebsite?: string | null;
  employeeSize?: string;
  coverImage?: string | null;
  logo?: string;
  description?: string;
  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IJob {
  id?: number;
  name: string;
  skills?: {
    id: number;
    name: string;
  }[];
  occupations: {
    id: number;
    name: string;
  }[];
  company?: {
    id: number;
    name: string;
    employeeSize?: string;
    address?: string;
    logo?: string;
  };
  location: string;
  salary: string;
  employmentType: string;
  genderReq: string;
  quantity: number;
  level: string;
  experience: string;
  description: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;

  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAllJob {
  id?: number;
  name: string;
  skills?: {
    id: number;
    name: string;
  }[];
  occupations: {
    id: number;
    name: string;
  }[];
  company?: {
    id: number;
    name: string;
    employeeSize?: string;
    address?: string;
    logo?: string;
  };
  location: string;
  salary: string;
  employmentType: string;
  genderReq: string;
  quantity: number;
  level: string;
  experience: string;
  description: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;

  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}
[];

export interface IParamsOccupation {
  name: string;
  jobCount: number;
  fill: string;
}

export interface IResume {
  id?: number;
  email: string;
  userId: number;
  url: string;
  status: string;
  jobId: number;
  job: {
    id: number;
    name: string;
  };
  token: string;
  createdBy?: {
    id: number;
    name: string;
  };
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface INotify {
  id?: number;
  status: string;
  title: string;
  description: string;
  isActive: boolean;
  company: {
    id: number;
    name: string;
    logo: string;
  };
  job: {
    id: number;
    name: string;
  };
  createdBy?: {
    id: number;
    name: string;
  };
  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPermission {
  id?: number;
  name?: string;
  apiPath?: string;
  method?: string;
  module?: string;

  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IRole {
  id?: number | null;
  name: string;
  description: string;
  isActive: boolean;
  permissions: IPermission[] | number[];

  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IMail {
  email: string;
  name: string;
  nameJob: string;
  title: string;
  contentMail: string;
  token: string;
}
