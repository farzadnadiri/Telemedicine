  export interface IResetPassResponse{
    token: string;
  }
  
  export interface IRequestResetPassData{
    username: string;
  }

  export interface IResetPassData{
    username: string;
    password: string;
    code: string;
  }
  