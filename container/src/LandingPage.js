import React, { useState, useEffect, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuthentication, logout } from "./Auth";  

const UserDetails = React.lazy(() => import("userdetails/UserDetails"));
const InsuranceDetails = React.lazy(() =>
  import("insurancedetails/InsuranceDetails")
);

const LandingPage = ({ setIsAuthenticated }) => {
  const [user, setUser] = useState(null);
  const [insuranceDetails, setInsuranceDetails] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkAuthentication()) {
      
      navigate("/login");
      return;
    }

    const loggedInUserEmail = localStorage.getItem("LoggedInUserId");

    const users = JSON.parse(localStorage.getItem("users"));
    const matchedUser = users.find((user) => user.email === loggedInUserEmail);

    if (matchedUser) {
      setUser(matchedUser);
      console.log("matched user", matchedUser);

     
      const matchedInsuranceDetails = matchedUser.insurance;
      setInsuranceDetails(matchedInsuranceDetails);
    } else {
      navigate("/login");  
    }
  }, [navigate]);

  const handleShowUserDetails = () => setShowUserDetails(true);
  const handleShowInsuranceDetails = () => setShowUserDetails(false);

  const handleLogout = () => {
    logout(setIsAuthenticated);  
    navigate("/login");
  };

  const handleSendMessage = () => {
    if (user) {
      const message = "This is a test message from LandingPage";  
    const userId = user ? user.email : "Unknown User";  
    
    
    const timestamp = new Date().toLocaleString();

    
    const event = new CustomEvent("sendMessageEvent", {
      detail: {
        userId: userId,
        message: `${message} - Sent at: ${timestamp}`,
      },
    });

    
    window.dispatchEvent(event)
      console.log('event dispacthed', event);
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        <div className="col-md-3 bg-dark text-white p-4 d-flex flex-column h-100">
          <h4 className="text-center mb-4">Menu</h4>
          <div className="d-flex flex-column flex-grow-1">
            <button
              className="btn btn-primary mb-3"
              onClick={handleShowUserDetails}
            >
              View Profile Details
            </button>
            <button
              className="btn btn-primary mb-3"
              onClick={handleShowInsuranceDetails}
            >
              View Insurance Details
            </button>

            <button
              className="btn btn-info mb-3"
              onClick={handleSendMessage}
            >
              Send Message
            </button>

            <button
              className="btn btn-danger mt-3"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

    
        <div className="col-md-9 p-4">
          <h1>Welcome{user && `, ${user.name}`}</h1>
          <br />
          <Suspense fallback={<div>Loading...</div>}>
            {showUserDetails && user && <UserDetails user={user} />}
            {!showUserDetails && insuranceDetails && (
              <InsuranceDetails insuranceDetails={insuranceDetails} />
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
