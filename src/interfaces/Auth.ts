export interface LoginModelRequest {
  email: string;
  password: string;
}
export interface RegisterModelRequest {
  userName: string;
  fullName: string;
  password: string;
}
export interface UserResponse {
  id: string;
  userName: string;
  fullName: string;
  avatar: string;
}
export interface LoginResponse {
  userDto: UserResponse;
  token: string;
}
