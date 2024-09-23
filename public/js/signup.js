document.addEventListener('DOMContentLoaded', () => {
    console.log('Signup page loaded');
    const form = document.getElementById('signup-form');
    console.log('Form element:', form);
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });


            const data = await response.json();

            if (response.ok) {
                console.log('Signup successful:', data);
                // Redirect to login page or show success message
                alert('Signup successful! Please log in.');
                window.location.href = '/signin';
            } else {
                console.error('Signup failed:', data);
                alert(`Signup failed: ${data.message}`);
            }
        } catch (error) {
            console.error('Error during signup:', error);
            alert('An error occurred during signup. Please try again.');
        }
    });
});