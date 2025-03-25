export interface User {
    id: number;
    email: string;
    password: string; 
  }
  
  export function createNewUser(): User {
    return {
      id: 0,
      email: '',
      password: '' 
    };
  }
  