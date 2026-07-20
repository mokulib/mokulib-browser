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
}