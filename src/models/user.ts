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

export interface RegisterRequest extends AuthRequest {
  email: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}
