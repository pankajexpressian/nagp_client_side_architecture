self.onmessage = function (e) {
  const { age, income, gender } = e.data;
  console.log("Message received in worker:", e.data);

  // Placeholder for discounted sum assured calculation
  let baseSumAssured = 1000000; // Default base sum assured value

  // Modify sum assured based on age
  if (age < 30) {
    baseSumAssured += 500000;
  } else if (age >= 30 && age < 40) {
    baseSumAssured += 300000;
  } else {
    baseSumAssured += 100000;
  }

  // Modify sum assured based on income
  if (income > 50000) {
    baseSumAssured += 200000;
  } else if (income <= 50000 && income > 30000) {
    baseSumAssured += 100000;
  } else {
    baseSumAssured += 50000;
  }

  // Modify sum assured based on gender (arbitrary logic, can be adjusted)
  if (gender === 'female') {
    baseSumAssured += 100000; // Example: females might get a higher sum assured due to lower risk
  }

  setTimeout(() => {
    // Send the calculated sum assured back to the main thread after 5 seconds
    self.postMessage({ sumAssured: baseSumAssured });
  }, 5000);
};

self.onerror = function (e) {
  console.log("Worker error:", e);
};
