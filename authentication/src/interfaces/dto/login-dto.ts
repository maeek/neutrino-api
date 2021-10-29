export interface LoginDto {
  username: string;
  password: string;
  device: {
    name: string,
    meta: string;
  };
  loginStrategy?: number; // To be changed to enum, currently only one login strategy
} 