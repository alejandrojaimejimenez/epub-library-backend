export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserPayload {
  id: number;
  username: string;
  email: string;
}

export interface AuthRequest {
  username: string;
  password: string;
}
