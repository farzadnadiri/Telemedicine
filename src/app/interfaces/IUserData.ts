export enum userRole {
  Admin = 0,
  Patient = 1,
  Doctor = 2,
  Pharmacy = 3,
  Laboratory = 4,
}

export interface IUser {
  _id: string;
  username: string;
  name: string;
  image: string;
  role: userRole;
}
