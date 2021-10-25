export interface LoginDto {
  user_id: string;
  password: string;
  loginStrategy?: number; // To be changed to enum, currently only one login strategy
} 