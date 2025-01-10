// AWS Cognito Configuration
AWS.config.region = 'ap-south-1'; // Update with your region
const poolData = {
  UserPoolId: 'ap-south-1_6kgOmHJmx', // Replace with your User Pool ID
  ClientId: '6km5crfbijrkj81j838t6ibig1',      // Replace with your App Client ID
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// Fetch Products
fetch('products.json')
  .then(response => response.json())
  .then(products => {
    const productList = document.getElementById('productList');
    products.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.className = 'product';
      productDiv.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>Price: ${product.price}</p>
        <button>Add to Cart</button>
      `;
      productList.appendChild(productDiv);
    });
  });

// Register User
function register() {
  const username = document.getElementById('registerUsername').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  const attributeList = [];
  const dataEmail = { Name: 'email', Value: email };
  const attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
  attributeList.push(attributeEmail);

  userPool.signUp(username, password, attributeList, null, function (err, result) {
    if (err) {
      alert(err.message || JSON.stringify(err));
      return;
    }
    alert(`User ${result.user.getUsername()} registered successfully!`);
  });
}

// Login User
function login() {
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  const authDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: username,
    Password: password,
  });

  const userData = {
    Username: username,
    Pool: userPool,
  };

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.authenticateUser(authDetails, {
    onSuccess: function (result) {
      alert('Login successful!');
      document.getElementById('authSection').style.display = 'none';
      document.getElementById('welcomeMessage').innerText = `Welcome, ${username}`;
      document.getElementById('logoutButton').style.display = 'inline';
    },
    onFailure: function (err) {
      alert(err.message || JSON.stringify(err));
    },
  });
}

// Logout User
document.getElementById('logoutButton').addEventListener('click', function () {
  const user = userPool.getCurrentUser();
  if (user) {
    user.signOut();
    alert('Logged out successfully!');
    location.reload();
  }
});

// Confirm User Account
function confirmAccount() {
  const username = document.getElementById('confirmUsername').value;
  const confirmationCode = document.getElementById('confirmationCode').value;

  const userData = {
    Username: username,
    Pool: userPool,
  };

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.confirmRegistration(confirmationCode, true, function (err, result) {
    if (err) {
      alert(err.message || JSON.stringify(err));
      return;
    }
    alert('Account confirmed successfully!');
    document.getElementById('confirmationForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
  });
}

// Show Confirmation Form After Registration
function register() {
  const username = document.getElementById('registerUsername').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  const attributeList = [];
  const dataEmail = { Name: 'email', Value: email };
  const attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
  attributeList.push(attributeEmail);

  userPool.signUp(username, password, attributeList, null, function (err, result) {
    if (err) {
      alert(err.message || JSON.stringify(err));
      return;
    }
    alert(`User registered successfully! A confirmation code has been sent to ${email}.`);
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('confirmationForm').style.display = 'block';
    document.getElementById('confirmUsername').value = username; // Pre-fill username
  });
}

