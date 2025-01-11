import React, { useState, useEffect } from "react";
import { createWorker } from "./CreateWorker";

const UserDetails = () => {
  const [worker, setWorker] = useState(null);
  const [user, setUser] = useState(null);
  const [sumAssured, setSumAssured] = useState(null); // For storing sum assured
  const [workerReady, setWorkerReady] = useState(false); // Track if the worker is ready
  const [loading, setLoading] = useState(false); // Loading state to show "Finding the best offers"
  const [receivedMessage, setReceivedMessage] = useState(""); // Store the received message

  useEffect(() => {
    // Create and load the worker when the component mounts
    async function loadWorker() {
      const newWorker = await createWorker(__webpack_public_path__ + "worker.js");
      console.log("Worker loaded:", newWorker);
      setWorker(newWorker);

      // Listen for messages from the worker
      newWorker.onmessage = (e) => {
        console.log("Received from worker:", e.data);
        setSumAssured(e.data.sumAssured); // Update sum assured state
        setLoading(false); // Hide loading message when worker responds
      };

      newWorker.onerror = (e) => {
        console.error("Error in worker:", e);
        setLoading(false); // Hide loading message on error
      };

      setWorkerReady(true); // Mark worker as ready after it's loaded
    }

    loadWorker(); // Load worker

    // Fetch logged-in user data
    const loggedInUserEmail = localStorage.getItem("LoggedInUserId");
    const users = JSON.parse(localStorage.getItem("users"));
    
    if (users && loggedInUserEmail) {
      const matchedUser = users.find((user) => user.email === loggedInUserEmail);
      if (matchedUser) {
        setUser(matchedUser); // Set the user data
      } else {
        console.error("User not found in localStorage");
      }
    } else {
      console.error("User not found in localStorage");
    }
  }, []); // Empty dependency array to run only once

  useEffect(() => {
    // Listen for the custom event to update the message
    const handleMessageEvent = (event) => {
      setReceivedMessage(event.detail.message); // Update state with the message from the event
    };

    // Add event listener for the custom event
    window.addEventListener("sendMessageEvent", handleMessageEvent);

    // Cleanup the event listener when the component is unmounted
    return () => {
      window.removeEventListener("sendMessageEvent", handleMessageEvent);
    };
  }, []);

  useEffect(() => {
    // Send user data to worker after it's found and worker is ready
    if (user && workerReady) {
      setLoading(true); // Show loading message before sending the message
      worker.postMessage({ message: "start", user: user });
      console.log("Message sent to worker with user data:", { message: "start", user: user });
    }
  }, [user, workerReady]); // Trigger this effect when user and workerReady are available

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
        {/* Section 1: User Details */}
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

        {/* Section 2: Sum Assured Calculation and Loading Message */}
        <div className="col-md-6">
          <div className="card shadow-lg mb-4">
            <div className="card-header bg-info text-white">
              <h3>Offers</h3>
            </div>
            <div className="card-body">
              {/* Show the loading message when calculating sum assured */}
              {loading && <p>Finding the best offers for you...</p>}

              {/* Show sum assured if available */}
              {sumAssured !== null && (
                <div className="text-success">
                  <p style={{ fontSize: "20px" }}><strong>Congratulations!</strong> 🎉</p><br />
                  Dear <strong>{loggedInUser.name}</strong>, you are eligible for a <strong>Term Insurance of <span className="font-weight-bold">₹{sumAssured}</span></strong>.<br></br>
                  We are excited to offer you this protection, ensuring peace of mind for you and your loved ones.<br />
                  <button 
                    className="btn btn-primary mt-3"
                    onClick={() => {
                      // Trigger apply action (you can redirect to another page or open a modal)
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

      {/* Display the received message at the bottom */}
      {receivedMessage && (
        <div className="alert alert-info mt-4">
          <strong>Message Received:</strong> {receivedMessage}
        </div>
      )}
    </div>
  );
};

export default UserDetails;
