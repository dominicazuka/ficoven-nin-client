import axios from 'axios';
import TokenService from '../libs/token'

export const isLocalHost = Boolean(window.location.hostname === "localhost" || window.location.hostname === "[::1]" || window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/))
const SERVER_URL = isLocalHost ? 'http://localhost:5000' : 'https://api.ficoven.com';  
export const verifyVoguePayUrl = `${SERVER_URL}/api/verify-voguepay`;

export const APP_URL = isLocalHost ? 'http://localhost:3000' : 'https://portal.ficoven.com';

const Axios = axios.create({
    baseURL:  `${SERVER_URL}/api`,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  Axios.interceptors.request.use(
    (config) => {
      const token = TokenService.getLocalAccessToken();
      if (token) {
        // config.headers["Authorization"] = 'Bearer ' + token;  // for Spring Boot back-end
        config.headers["x-access-token"] = token; // for Node.js Express back-end
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  Axios.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      const originalConfig = err.config;
  
      if (originalConfig.url !== "/users/login" && err.response) {
        // Access Token was expired
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;
  
          try {
            const rs = await Axios.post("/users/refreshtoken", {
              refreshToken: TokenService.getLocalRefreshToken(),
            });
            TokenService.updateLocalSession(rs.data);
            return Axios(originalConfig);
          } catch (_error) {
            return Promise.reject(_error);
          }
        }
      }
  
      return Promise.reject(err);
    }
  );
  export default Axios

