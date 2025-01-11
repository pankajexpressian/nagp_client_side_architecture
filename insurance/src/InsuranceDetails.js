import React, { Fragment, useState, useEffect } from "react";
import Worker from "./worker";
import './styles.css';  // Ensure your CSS is linked properly

const InsuranceDetails = ({ insuranceDetails }) => {
  const messageFromWorker = Worker(5000);
  const details = insuranceDetails || {
    policyNumber: "",
    insuranceType: "",
    premium: "",
    coverageAmount: "",
    insuranceProvider: "",
  };

  // State to manage the visibility of the new card
  const [isCardVisible, setIsCardVisible] = useState(false);

  // State to manage the selected payment option
  const [selectedPaymentOption, setSelectedPaymentOption] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // State for the received message from the event
  const [receivedMessage, setReceivedMessage] = useState(null);

  // Listen to the 'sendMessageEvent' and update the message state
  useEffect(() => {
    const handleMessageEvent = (event) => {
      // Update the state with the received message
      setReceivedMessage(event.detail.message);
    };

    // Add event listener
    window.addEventListener('sendMessageEvent', handleMessageEvent);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('sendMessageEvent', handleMessageEvent);
    };
  }, []);

  const handlePayPremiumClick = () => {
    // Check if a payment option is selected when the "Make Payment" button is clicked
    if (!selectedPaymentOption) {
      // If no payment option is selected, show an error message
      setErrorMessage("Please select a payment method.");
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } else {
      // Proceed with the payment if an option is selected
      setErrorMessage('');  // Clear the error message
      alert("Proceeding with payment...");
    }
  };

  const handleHideCard = () => {
    setIsCardVisible(false);
  };

  const handlePaymentOptionChange = (event) => {
    setSelectedPaymentOption(event.target.value);
  };

  return (
    <Fragment>
      {/* Fun Fact Card at the top (in a single column) */}
      <div className="card shadow-lg mb-4">
        <div className="card-header bg-dark text-white">
          <h3>Fun Fact</h3>
        </div>
        <div className="card-body">{messageFromWorker}</div>
      </div>

      {/* Row for two columns below the fun fact */}
      <div className="row">
        {/* Left Column - Insurance Details */}
        <div className="col-md-6">
          <div className="card shadow-lg mb-4">
            <div className="card-header bg-success text-white">
              <h3>Insurance Details</h3>
            </div>
            <div className="card-body">
              <p>
                <strong>Policy Number:</strong> {details.policyNumber}
              </p>
              <p>
                <strong>Insurance Type:</strong> {details.insuranceType}
              </p>
              <p>
                <strong>Premium:</strong> ₹{details.premium}
              </p>
              <p>
                <strong>Coverage Amount:</strong> ₹{details.coverageAmount}
              </p>
              <p>
                <strong>Insurance Provider:</strong> {details.insuranceProvider}
              </p>
            </div>
            <div className="card-footer d-flex justify-content-start align-items-center">
              <button className="btn btn-primary" onClick={() => setIsCardVisible(true)}>
                Pay the Premium
              </button>
              <span className="ms-3 text-success discount-text">
                <strong>Get 10% Discount! </strong>
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - Payment Option */}
        <div className="col-md-6">
          {/* Conditionally render this card when isCardVisible is true */}
          {isCardVisible && (
            <div className="card shadow-lg mb-4">
              <div className="card-header bg-warning text-black">
                <h3>Select Payment Option</h3>
              </div>
              <div className="card-body">
                <form>
                  <div className="payment-options">
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        id="cardOption"
                        name="paymentOption"
                        value="Card"
                        checked={selectedPaymentOption === "Card"}
                        onChange={handlePaymentOptionChange}
                      />
                      <label className="form-check-label" htmlFor="cardOption">
                        Credit/Debit Card
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        id="netBankingOption"
                        name="paymentOption"
                        value="Net Banking"
                        checked={selectedPaymentOption === "Net Banking"}
                        onChange={handlePaymentOptionChange}
                      />
                      <label className="form-check-label" htmlFor="netBankingOption">
                        Net Banking
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        id="upiOption"
                        name="paymentOption"
                        value="UPI"
                        checked={selectedPaymentOption === "UPI"}
                        onChange={handlePaymentOptionChange}
                      />
                      <label className="form-check-label" htmlFor="upiOption">
                        UPI
                      </label>
                    </div>
                  </div>
                </form> <br></br>
                {/* Show error message if no payment option is selected */}
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
              </div>
              <div className="card-footer d-flex justify-content-start align-items-center">
                <button className="btn btn-primary" onClick={handlePayPremiumClick}>
                Pay ₹{details.premium}
                </button>
                <button className="btn btn-secondary ms-3" onClick={handleHideCard}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Display the received message at the bottom */}
      {receivedMessage && (
        <div className="alert alert-info mt-4">
          <strong>Message Received:</strong> {receivedMessage}
        </div>
      )}
    </Fragment>
  );
};

export default InsuranceDetails;
