class TokenService {
    getLocalRefreshToken() {
      const user = JSON.parse(localStorage.getItem("_f_user"));
      return user?.refreshToken;
    }
  
    getLocalAccessToken() {
      const user = JSON.parse(localStorage.getItem("_f_user"));
      return user?.accessToken;
    }
  
    updateLocalSession(user) {
      
      localStorage.setItem("_f_user", JSON.stringify(user));
    }
  
    getUser() {
      return JSON.parse(localStorage.getItem("_f_user"));
    }
  
    setUser(user) {
      localStorage.setItem("_f_user", JSON.stringify(user));
    }
  
    removeUser() {
      localStorage.removeItem("_f_user");
    }
  }
  
  export default new TokenService();