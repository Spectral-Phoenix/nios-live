import axios from 'axios';

const API_URL = "https://q7z3gp5k-8080.inc1.devtunnels.ms/api/auth/";

const signup = (username: string, password: string, role: string = 'USER') => {
  return axios.post(API_URL + "signup", {
    username,
    password,
    role
  });
};

const signin = (username: string, password: string) => {
  return axios
    .post(API_URL + "signin", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.token) { // Spring Boot returns "token", not "accessToken"
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error("Error parsing user from localStorage", e);
      // Corrupted data, remove it
      localStorage.removeItem("user");
      return null;
    }
  }
  return null;
};

const isAdmin = () => {
  const currentUser = getCurrentUser();
  return currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'ROLE_ADMIN');
};

const AuthService = {
  signup,
  signin,
  logout,
  getCurrentUser,
  isAdmin
};

export default AuthService; 