// worker.js
self.onmessage = (event) => {
  const interval = event.data.time; // Interval passed from main thread
  
  const fetchMessage = async () => {
    const textToDisplay = await callAPI();
    self.postMessage(textToDisplay); // Send result to main thread
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

  // Fetch message initially
  fetchMessage();
  
  // Call the API every `interval` milliseconds
  setInterval(fetchMessage, interval);
};
