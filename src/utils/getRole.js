import { jwtDecode } from 'jwt-decode';
export function getUserRole() {
  try {
    const token = localStorage.getItem("token");
  
    if (!token) {
      return null;
    }
      
    const decoded = jwtDecode(token); 
    return decoded.role;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}


export function getUserId() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return jwtDecode(token).userID ?? null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}
