export const mockLogin = (username: string, password: string): boolean => {
    // Mock credentials
    const validCredentials = {
      username: 'admin',
      password: 'password123',
    };
  
    return username === validCredentials.username && password === validCredentials.password;
  };
  
  export const isAuthenticated = (): boolean => {
    if(localStorage.getItem('authToken')) {
      return true;
    }
    return false
  };
  
  export const logout = () => {
    localStorage.removeItem('authToken');
  };
  