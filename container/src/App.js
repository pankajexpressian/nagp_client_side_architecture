import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import LandingPage from './LandingPage';
import { checkAuthentication } from './Auth';  

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
   
    const isUserAuthenticated = checkAuthentication();

    if (isUserAuthenticated) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (

      <Routes>
        <Route
          path=""
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/landingpage"
          element={<LandingPage setIsAuthenticated={setIsAuthenticated} />}
        />
      
      </Routes>
  );
};

export default App;
