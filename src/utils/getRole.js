import { jwtDecode } from 'jwt-decode';
export function getUserRole() {
  try {
    const token = localStorage.getItem("token");
  
    if (!token) {
      return null;
    }
      
    const decoded = jwtDecode(token);
    console.log(decoded);
    return decoded.role;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

