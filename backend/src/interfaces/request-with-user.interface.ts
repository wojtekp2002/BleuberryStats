import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    userId: string;
    role: 'EMPLOYEE' | 'EMPLOYER';
    iat?: number;
    exp?: number;
  };
}