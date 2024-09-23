document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signin-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Sign in successful:', data);
                // Redirect to home page or dashboard
                window.location.href = '/';
            } else {
                const errorData = await response.json();
                console.error('Sign in failed:', errorData);
                // Display error message to user
            }
        } catch (error) {
            console.error('Error during sign in:', error);
            // Display error message to user
        }
    });
});