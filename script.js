// Simulated user data
const users = [
  { email: 'donor@example.com', password: 'donorpass', role: 'donor' },
  { email: 'recipient@example.com', password: 'recipientpass', role: 'recipient' }
];

// Handle login
document.querySelector('#login-form-content').addEventListener('submit', function(event) {
  event.preventDefault();
  const email = document.querySelector('#login-email').value;
  const password = document.querySelector('#login-password').value;

  // Validate user 
  const user = users.find(user => user.email === email && user.password === password);
  if (user) {
    // Store user data in local storage
    localStorage.setItem('user', JSON.stringify(user));

    // Show or hide sections based on user role
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('registration-form').style.display = 'none';
    document.getElementById('donation-section').style.display = user.role === 'donor' ? 'block' : 'none';
    document.getElementById('request-section').style.display = user.role === 'recipient' ? 'block' : 'none';
  // Hide pickup address section initially
    document.getElementById('logout-btn').style.display = 'block';

    // Update lists
    updateDonationList();
    updateRequestList();
  } else {
    alert('Invalid email or password.');
  }
});

// Handle logout
function logout() {
  localStorage.removeItem('user');
  document.getElementById('login-form').style.display = 'block';
  document.getElementById('registration-form').style.display = 'none';
  document.getElementById('donation-section').style.display = 'none';
  document.getElementById('request-section').style.display = 'none';
  document.getElementById('logout-btn').style.display = 'none';
}

// Show login form
function showLoginForm() {
  document.getElementById('login-form').style.display = 'block';
  document.getElementById('registration-form').style.display = 'none';
}

// Show registration form
function showRegistrationForm() {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('registration-form').style.display = 'block';
}

// Handle registration
document.querySelector('#registration-form-content').addEventListener('submit', function(event) {
  event.preventDefault();
  const name = document.querySelector('#register-name').value;
  const email = document.querySelector('#register-email').value;
  const password = document.querySelector('#register-password').value;
  const role = document.querySelector('#register-role').value;

  // Simulate saving user data
  users.push({ email, password, role });
  alert('Registration successful. You can now log in.');

  // Show login form and hide registration form
  showLoginForm();
});

// Handle donation form submission
document.querySelector('#donation-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const item = document.querySelector('#donation-item').value;
  const quantity = document.querySelector('#donation-quantity').value;
  const address = document.querySelector('#donation-address').value;

  // Save donation data
  const donations = JSON.parse(localStorage.getItem('donations')) || [];
  donations.push({ item, quantity, address });
  localStorage.setItem('donations', JSON.stringify(donations));

  // Update donation list
  updateDonationList();
  alert('Donation added successfully.');
});

// Handle request form submission
document.querySelector('#request-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const item = document.querySelector('#request-item').value;

  // Save request data
  const requests = JSON.parse(localStorage.getItem('requests')) || [];
  requests.push({ item });
  localStorage.setItem('requests', JSON.stringify(requests));

  // Update request list for recipients
  updateRequestList();
  alert('Request submitted successfully.');
});

// Handle donation pickup request
function requestPickup(donation) {
  const confirmation = confirm(`Do you want to request pickup for ${donation.item}?`);
  if (confirmation) {
    // Save pickup request data
    const requests = JSON.parse(localStorage.getItem('requests')) || [];
    requests.push({ item: donation.item, address: donation.address });
    localStorage.setItem('requests', JSON.stringify(requests));

    // Notify the donor and the recipient
    showNotification(`Pickup request for ${donation.item} has been submitted.`);

    // Update donation list and request list
    updateDonationList();
    updateRequestList();
  }
}

// Handle accepting a pickup request
function acceptPickupRequest(request) {
  // Remove the request from the list
  let requests = JSON.parse(localStorage.getItem('requests')) || [];
  requests = requests.filter(req => req.item !== request.item);
  localStorage.setItem('requests', JSON.stringify(requests));

  // Display the pickup address
  const pickupAddressElement = document.getElementById('pickup-address');
  pickupAddressElement.textContent = `Pickup address: ${request.address}`;
  document.getElementById('pickup-address-section').style.display = 'block';

  // Notify the recipient
  showNotification(`A pickup request for ${request.item} has been accepted.`);

  // Remove the donation from the list
  let donations = JSON.parse(localStorage.getItem('donations')) || [];
  donations = donations.filter(donation => donation.item !== request.item);
  localStorage.setItem('donations', JSON.stringify(donations));

  // Update the lists
  updateDonationList();
  updateRequestList();
}

// Handle declining a pickup request
function declinePickupRequest(request) {
  // Remove the request from the list
  let requests = JSON.parse(localStorage.getItem('requests')) || [];
  requests = requests.filter(req => req.item !== request.item);
  localStorage.setItem('requests', JSON.stringify(requests));

  // Notify the recipient
  showNotification(`Your pickup request for ${request.item} has been declined.`);

  // Update the request list
  updateRequestList();
}

// Update donation list in UI
function updateDonationList() {
  const donations = JSON.parse(localStorage.getItem('donations')) || [];
  const donationList = document.getElementById('donation-list-donor');
  donationList.innerHTML = '';

  donations.forEach(donation => {
    const li = document.createElement('li');
    li.className = 'donation-item';
    li.innerHTML = `
      <div class="item-info">${donation.item} - ${donation.quantity} units</div>
      <button onclick='requestPickup(${JSON.stringify(donation)})' class="request-pickup-btn">Request Pickup</button>
    `;
    donationList.appendChild(li);
  });
}

// Update request list in UI
function updateRequestList() {
  const requests = JSON.parse(localStorage.getItem('requests')) || [];
  const requestList = document.getElementById('donation-list-recipient');
  requestList.innerHTML = '';

  requests.forEach(request => {
    const li = document.createElement('li');
    li.className = 'donation-item';
    li.innerHTML = `
      <div class="item-info">${request.item}</div>
      <button onclick='acceptPickupRequest(${JSON.stringify(request)})' class="btn-primary">Accept</button>
      <button onclick='declinePickupRequest(${JSON.stringify(request)})' class="btn-secondary">Decline</button>
    `;
    requestList.appendChild(li);
  });
}

// Show notification
function showNotification(message) {
  const notificationBox = document.getElementById('notification-box');
  notificationBox.textContent = message;
  notificationBox.style.display = 'block';

  // Hide notification after 5 seconds
  setTimeout(() => {
    notificationBox.style.display = 'none';
  }, 5000);
}

// Initialize page
function initializePage() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('registration-form').style.display = 'none';
    document.getElementById('donation-section').style.display = user.role === 'donor' ? 'block' : 'none';
    document.getElementById('request-section').style.display = user.role === 'recipient' ? 'block' : 'none';
    document.getElementById('pickup-address-section').style.display = 'none';
    document.getElementById('logout-btn').style.display = 'block';
  }
  updateDonationList();
  updateRequestList();
}

initializePage();
