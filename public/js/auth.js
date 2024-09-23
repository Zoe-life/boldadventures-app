document.addEventListener('DOMContentLoaded', () => {
  const signinForm = document.getElementById('signin-form');
  const signupForm = document.getElementById('signup-form');

  if (signinForm) {
    signinForm.addEventListener('submit', handleSignin);
  }

  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }

  const forgotPasswordLink = document.getElementById('forgot-password');
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', handleForgotPassword);
  }
});

async function handleSignin(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': getCsrfToken()
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      window.location.href = '/';
    } else {
      displayError(data.msg || 'An error occurred during sign in');
    }
  } catch (error) {
    console.error('Error:', error);
    displayError('An unexpected error occurred');
  }
}

async function handleSignup(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  if (password !== confirmPassword) {
    displayError("Passwords don't match");
    return;
  }

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': getCsrfToken()
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      window.location.href = '/';
    } else {
      displayError(data.msg || 'An error occurred during sign up');
    }
  } catch (error) {
    console.error('Error:', error);
    displayError('An unexpected error occurred');
  }
}

async function handleForgotPassword(e) {
  e.preventDefault();
  const email = prompt('Please enter your email address:');

  if (email) {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': getCsrfToken()
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Password reset email sent. Please check your inbox.');
      } else {
        displayError(data.msg || 'An error occurred while processing your request');
      }
    } catch (error) {
      console.error('Error:', error);
      displayError('An unexpected error occurred');
    }
  }
}

function displayError(message) {
  const errorElement = document.getElementById('error-message');
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  } else {
    alert(message);
  }
}

function getCsrfToken() {
  return document.cookie.split('; ')
    .find(row => row.startsWith('XSRF-TOKEN'))
    .split('=')[1];
}