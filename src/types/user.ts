export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: number;
  email: string;
  role: Role;
  username: string;
  bio: string;
  create_time: string;
}

export interface JwtUser {
  id: number;
  email: string;
  role: Role;
  username: string;
  bio: string;
  create_time: string;
}