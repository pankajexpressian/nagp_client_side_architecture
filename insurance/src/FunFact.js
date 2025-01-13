import React, {useState, useEffect } from "react";

const FunFact = () => {
  const [message, setMessage] = useState("Loading...");

  const fetchMessage = async () => {
    const textToDisplay = await callAPI();
    setMessage(textToDisplay);
  };

  const callAPI = async () => {
    try {
      const response = await fetch(
        "https://uselessfacts.jsph.pl/random.json?language=en"
      );
      const data = await response.json();
      return "Did you know, " + data.text;
    } catch (error) {
      return "Error calling the fun fact API";
    }
  };

  useEffect(() => {
    // Fetch the initial fun fact immediately
    fetchMessage();

    // Set up an interval to fetch a new message every 5 seconds
    const intervalId = setInterval(fetchMessage, 5000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);  // Empty dependency array means this effect runs once when the component mounts

  return (
    <div>
      <p>{message}</p>
    </div>
  );
};

export default FunFact;
