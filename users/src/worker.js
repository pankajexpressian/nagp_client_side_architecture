self.onmessage = function (e) {
  const { age, income, gender } = e.data;
  console.log("Message received in worker:", e.data);


  let baseSumAssured = 1000000; 

 
  if (age < 30) {
    baseSumAssured += 500000;
  } else if (age >= 30 && age < 40) {
    baseSumAssured += 300000;
  } else {
    baseSumAssured += 100000;
  }


  if (income > 50000) {
    baseSumAssured += 200000;
  } else if (income <= 50000 && income > 30000) {
    baseSumAssured += 100000;
  } else {
    baseSumAssured += 50000;
  }

  
  if (gender === 'female') {
    baseSumAssured += 100000; 
  }

  setTimeout(() => {
  
    self.postMessage({ sumAssured: baseSumAssured });
  }, 5000);
};

self.onerror = function (e) {
  console.log("Worker error:", e);
};
