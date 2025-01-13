import React, { Fragment, useState, useEffect } from "react";
import { createWorker } from "./CreateWorker";
import "./styles.css";

const InsuranceDetails = ({ insuranceDetails }) => {
  const details = insuranceDetails || {
    policyNumber: "",
    insuranceType: "",
    premium: "",
    coverageAmount: "",
    insuranceProvider: "",
  };

  const [worker, setWorker] = useState(null);
  const [sumAssured, setSumAssured] = useState(null);
  const [workerReady, setWorkerReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isCardVisible, setIsCardVisible] = useState(false);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [receivedMessage, setReceivedMessage] = useState(null);

  useEffect(() => {
    try {
      async function loadWorker() {
        const newWorker = await createWorker(
          __webpack_public_path__ + "worker.js"
        );
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
    } catch (error) {}

    const handleMessageEvent = (event) => {
      setReceivedMessage(event.detail.message);
    };

    window.addEventListener("sendMessageEvent", handleMessageEvent);

    return () => {
      window.removeEventListener("sendMessageEvent", handleMessageEvent);
    };
  }, []);

  useEffect(() => {
    if (workerReady) {
      setLoading(true);
      worker.postMessage({
        message: "start",
        insuranceDetails: insuranceDetails,
      });
      console.log("Message sent to worker with user data:", {
        message: "start",
        insuranceDetails: insuranceDetails,
      });
    }
  }, [workerReady]);

  const handlePayPremiumClick = () => {
    if (!selectedPaymentOption) {
      setErrorMessage("Please select a payment method.");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    } else {
      setErrorMessage("");
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
      {/* <div className="card shadow-lg mb-4">
        <div className="card-header bg-dark text-white">
          <h3>Fun Fact</h3>
        </div>
        <div className="card-body">{messageFromWorker}</div>
      </div> */}

      <div className="row">
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
              <button
                className="btn btn-primary"
                onClick={() => setIsCardVisible(true)}
              >
                Pay the Premium
              </button>
              <span className="ms-3 text-success discount-text">
                <strong>Get 10% Discount! </strong>
              </span>
            </div>
          </div>
        </div>

        <div className="col-md-6">
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
                      <label
                        className="form-check-label"
                        htmlFor="netBankingOption"
                      >
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
                </form>{" "}
                <br></br>
                {errorMessage && (
                  <div className="alert alert-danger">{errorMessage}</div>
                )}
              </div>
              <div className="card-footer d-flex justify-content-start align-items-center">
                <button
                  className="btn btn-primary"
                  onClick={handlePayPremiumClick}
                >
                  Pay ₹{details.premium}
                </button>
                <button
                  className="btn btn-secondary ms-3"
                  onClick={handleHideCard}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {receivedMessage && (
        <div className="alert alert-info mt-4">
          <strong>Message Received:</strong> {receivedMessage}
        </div>
      )}

      {sumAssured !== null && (
        <div className="text-success">
          <p style={{ fontSize: "20px" }}>
            <strong>Congratulations!</strong> 🎉
          </p>
          <br />
          Dear <strong>Pankaj</strong>, you are eligible for a{" "}
          <strong>
            Term Insurance of{" "}
            <span className="font-weight-bold">₹{sumAssured}</span>
          </strong>
          .<br></br>
          We are excited to offer you this protection, ensuring peace of mind
          for you and your loved ones.
          <br />
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
    </Fragment>
  );
};

export default InsuranceDetails;
