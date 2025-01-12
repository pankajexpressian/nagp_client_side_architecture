export const checkAuthentication = () => {
    const loggedInUserEmail = localStorage.getItem("LoggedInUserId");
    const authStatus = localStorage.getItem("isAuthenticated");
  
    if (!loggedInUserEmail || authStatus !== "true") {
      return false; 
    }
  
    return true;  
  };
  
 
  export const login = (email, setIsAuthenticated) => {
    const users = JSON.parse(localStorage.getItem("users"));
  
    if (!users || !Array.isArray(users)) {
      return "No users found in localStorage. Please ensure data is seeded correctly.";
    }
  
    const user = users.find((user) => user.email === email);
  
    if (user) {
      
      localStorage.setItem("LoggedInUserId", user.email);
      localStorage.setItem("isAuthenticated", "true");
  
      setIsAuthenticated(true); 
      return null;  
    }
  
    return "User not found. Please check your email.";  
  };
  
  
  export const logout = (setIsAuthenticated) => {
    localStorage.removeItem("LoggedInUserId");
    localStorage.removeItem("isAuthenticated");
  
    setIsAuthenticated(false); 
  };
  