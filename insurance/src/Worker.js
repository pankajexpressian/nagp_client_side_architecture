import { useState, useEffect } from "react";

const Worker = (interval = 1000) => {
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
      return "Error calling the fun fact api";
    }
  };

  useEffect(() => {
    fetchMessage();

    const intervalId = setInterval(() => {
      fetchMessage();
    }, interval);

    return () => clearInterval(intervalId);
  }, [interval]);

  return message;
};

export default Worker;
