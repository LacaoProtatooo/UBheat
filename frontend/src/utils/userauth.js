
import axios from 'axios';

export const checkAuthStatus = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

export const handleLogout = async (setIsAuthenticated, setUser, setIsAdmin) => {
 
  try {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    await axios.post(`${apiUrl}/api/auth/logout`, {}, { withCredentials: true });
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('isAdmin');
    
    setIsAuthenticated(false);
    setUser(null);
    setIsAdmin(false);
  } catch (error) {
    console.error('Logout error:', error);
  }
};