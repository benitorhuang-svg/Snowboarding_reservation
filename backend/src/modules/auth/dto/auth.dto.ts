export class OtpDto {
  phone: string;
  code?: string;
}

export class SyncDto {
  uid: string;
  email: string;
  profile?: {
    name?: string;
    mobilePhone?: string;
    language?: string;
    skillLevel?: string;
  };
}

export class LineDto {
  token: string;
  email: string;
}
