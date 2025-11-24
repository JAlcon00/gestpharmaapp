export interface User {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  rolId: number;
  activo: boolean;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  role?: Role;
}

export interface Role {
  id: number;
  nombre: string;
  descripcion?: string;
  nivel?: number;
  activo?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: User;
  expiresIn?: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
