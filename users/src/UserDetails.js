import React, { useState, useEffect } from "react";
import { createWorker } from "./CreateWorker";

const UserDetails = () => {
  const [worker, setWorker] = useState(null);
  const [user, setUser] = useState(null);
  const [sumAssured, setSumAssured] = useState(null); 
  const [workerReady, setWorkerReady] = useState(false); 
  const [loading, setLoading] = useState(false); 
  const [receivedMessage, setReceivedMessage] = useState(""); 

  useEffect(() => {
    
    async function loadWorker() {
      const newWorker = await createWorker(__webpack_public_path__ + "worker.js");
      console.log("Worker loaded:", newWorker);
      setWorker(newWorker);

     
      newWorker.onmessage = (e) => {
        console.log("Received from worker:", e.data);
        setSumAssured(e.data.sumAssured); 
        setLoading(false); 
      };

      newWorker.onerror = (e) => {
        console.error("Error in worker:", e);
        setLoading(false); 
      };

      setWorkerReady(true); 
    }

    loadWorker(); 

    
    const loggedInUserEmail = localStorage.getItem("LoggedInUserId");
    const users = JSON.parse(localStorage.getItem("users"));
    
    if (users && loggedInUserEmail) {
      const matchedUser = users.find((user) => user.email === loggedInUserEmail);
      if (matchedUser) {
        setUser(matchedUser); 
      } else {
        console.error("User not found in localStorage");
      }
    } else {
      console.error("User not found in localStorage");
    }
  }, []); 

  useEffect(() => {
    
    const handleMessageEvent = (event) => {
      setReceivedMessage(event.detail.message); 
    };

    
    window.addEventListener("sendMessageEvent", handleMessageEvent);

    
    return () => {
      window.removeEventListener("sendMessageEvent", handleMessageEvent);
    };
  }, []);

  useEffect(() => {
    
    if (user && workerReady) {
      setLoading(true); 
      worker.postMessage({ message: "start", user: user });
      console.log("Message sent to worker with user data:", { message: "start", user: user });
    }
  }, [user, workerReady]); 

  const loggedInUser = user || {
    policyNumber: "",
    insuranceType: "",
    premium: "",
    coverageAmount: "",
    insuranceProvider: "",
  };

  return (
    <div className="container">
      <div className="row">
       
        <div className="col-md-6">
          <div className="card shadow-lg mb-4">
            <div className="card-header bg-success text-white">
              <h3>User Details</h3>
            </div>
            <div className="card-body">
              <p><strong>Name:</strong> {loggedInUser.name}</p>
              <p><strong>Age:</strong> {loggedInUser.age}</p>
              <p><strong>Email:</strong> {loggedInUser.email}</p>
              <p><strong>Aadhaar Number:</strong> {loggedInUser.aadhaarNumber}</p>
              <p><strong>Address:</strong> {loggedInUser.address}</p>
            </div>
          </div>
        </div>

       
        <div className="col-md-6">
          <div className="card shadow-lg mb-4">
            <div className="card-header bg-info text-white">
              <h3>Offers</h3>
            </div>
            <div className="card-body">
              
              {loading && <p>Finding the best offers for you...</p>}

              
              {sumAssured !== null && (
                <div className="text-success">
                  <p style={{ fontSize: "20px" }}><strong>Congratulations!</strong> 🎉</p><br />
                  Dear <strong>{loggedInUser.name}</strong>, you are eligible for a <strong>Term Insurance of <span className="font-weight-bold">₹{sumAssured}</span></strong>.<br></br>
                  We are excited to offer you this protection, ensuring peace of mind for you and your loved ones.<br />
                  <button 
                    className="btn btn-primary mt-3"
                    onClick={() => {
                      
                      alert("Redirecting to the application page...");
                    }}
                  >
                    Apply Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      
      {receivedMessage && (
        <div className="alert alert-info mt-4">
          <strong>Message Received:</strong> {receivedMessage}
        </div>
      )}
    </div>
  );
};

export default UserDetails;
