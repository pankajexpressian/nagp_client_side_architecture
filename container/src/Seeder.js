const users = [
  {
    id: 1,
    name: 'Arjun Patel',
    age: 35,
    gender:'male',
    income:1000000,
    email: 'arjun.patel@example.com',
    aadhaarNumber: '1234 5678 9012',
    address: 'A-101, Pristine Residency, Mumbai, Maharashtra, 400001',
    insurance: {
      policyNumber: 'HP123456789',
      insuranceType: 'Health Insurance',
      premium: 12000,
      coverageAmount: 500000,
      insuranceProvider: 'Religare Health Insurance'
    }
  },
  {
    id: 2,
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    age: 28,
    gender:'female',
    income:1800000,
    aadhaarNumber: '2234 5678 9012',
    address: 'B-202, Royal Heights, Delhi, 110001',
    insurance: {
      policyNumber: 'MP987654321',
      insuranceType: 'Motor Insurance',
      premium: 18000,
      coverageAmount: 3000000,
      insuranceProvider: 'ICICI Lombard'
    }
  },
  {
    id: 3,
    name: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    age: 42,
    gender:'male',
    income:1100000,
    aadhaarNumber: '3234 5678 9012',
    address: 'C-303, Green Meadows, Bangalore, Karnataka, 560001',
    insurance: {
      policyNumber: 'LP112233445',
      insuranceType: 'Life Insurance',
      premium: 25000,
      coverageAmount: 10000000,
      insuranceProvider: 'SBI Life Insurance'
    }
  },
  {
    id: 4,
    name: 'Pankaj Jangid',
    email: 'pj@abc.com',
    age: 31,
    gender:'male',
    income:1600000,
    aadhaarNumber: '3234 5678 9012',
    address: 'C-303, Green Meadows, Bangalore, Karnataka, 560001',
    insurance: {
      policyNumber: 'LP112233445',
      insuranceType: 'Life Insurance',
      premium: 25000,
      coverageAmount: 10000000,
      insuranceProvider: 'MAX Life Insurance'
    }
  }
];


function initializeLocalStorage() {

  if (!localStorage.getItem('users')) {

    localStorage.setItem('users', JSON.stringify(users));  
  }
}

// Function to get user by ID from localStorage
function getUserById(userId) {
  const users = JSON.parse(localStorage.getItem('users'));  
  return users.find(user => user.id === userId) || null; 
}


function getInsuranceDetails(userId) {
  const user = getUserById(userId);  
  if (user) {
    return user.insurance; 
  }
  return null;  
}


initializeLocalStorage();


export default {
  initializeLocalStorage,
  getUserById,
  getInsuranceDetails
};
