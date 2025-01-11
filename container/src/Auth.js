// Auth.js

// Check if the user is authenticated and if the user's data exists
export const checkAuthentication = () => {
    const loggedInUserEmail = localStorage.getItem("LoggedInUserId");
    const authStatus = localStorage.getItem("isAuthenticated");
  
    if (!loggedInUserEmail || authStatus !== "true") {
      return false;  // User is not authenticated
    }
  
    return true;  // User is authenticated
  };
  
  // Login logic: Verify user existence, authenticate, and set the current user
  export const login = (email, setIsAuthenticated) => {
    const users = JSON.parse(localStorage.getItem("users"));
  
    if (!users || !Array.isArray(users)) {
      return "No users found in localStorage. Please ensure data is seeded correctly.";
    }
  
    const user = users.find((user) => user.email === email);
  
    if (user) {
      // Store the user data in localStorage to keep them logged in
      localStorage.setItem("LoggedInUserId", user.email);
      localStorage.setItem("isAuthenticated", "true");
  
      setIsAuthenticated(true);  // Mark the user as authenticated
      return null;  // No error, login successful
    }
  
    return "User not found. Please check your email.";  // Error message
  };
  
  // Logout logic: Clear the authentication and user data
  export const logout = (setIsAuthenticated) => {
    localStorage.removeItem("LoggedInUserId");
    localStorage.removeItem("isAuthenticated");
  
    setIsAuthenticated(false);  // Mark the user as logged out
  };
  