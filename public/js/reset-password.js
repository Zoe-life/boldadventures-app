document.addEventListener('DOMContentLoaded', () => {
  const resetPasswordForm = document.getElementById('reset-password-form');

  if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', handleResetPassword);
  }
});

async function handleResetPassword(e) {
  e.preventDefault();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  if (password !== confirmPassword) {
    displayError("Passwords don't match");
    return;
  }

  const token = window.location.pathname.split('/').pop();

  try {
    const response = await fetch(`/api/auth/reset-password/${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': getCsrfToken()
      },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Password reset successful. You can now log in with your new password.');
      window.location.href = '/signin';
    } else {
      displayError(data.msg || 'An error occurred during password reset');
    }
  } catch (error) {
    console.error('Error:', error);
    displayError('An unexpected error occurred');
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