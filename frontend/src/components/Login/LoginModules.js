import axios from "axios";
import { loginstore } from "../../store/LoginStore/LoginStore";
import { useEffect } from "react"; 
import { jwtDecode } from 'jwt-decode';



export const handleLogin = async () => {
  const { formFields } = loginstore;

  const data = {
    username: formFields.username,
    password: formFields.password,
  };

  try {
    const response = await axios.post("http://localhost:8080/api/login", data);

    if (response.data.success) {
      const bearerToken = `Bearer ${response.data.token}`;
      localStorage.setItem("bearer token", bearerToken); // Store the bearer token in localStorage
      localStorage.setItem("user", response.data.username);
      localStorage.setItem("email", response.data.email);

      const decodedToken = jwtDecode(response.data.token);
      const tokenExpiration = decodedToken.exp; // Expiration time in seconds

      localStorage.setItem("tokenExpiration", tokenExpiration);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    return false; // An error occurred
  }
};
