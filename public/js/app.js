document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('login-button');
  const userProfile = document.getElementById('user-profile');
  const savedToursButton = document.getElementById('saved-tours-button');
  const tourList = document.getElementById('tour-list');

  fetch('/api/user')
    .then(response => response.json())
    .then(user => {
      if (user) {
        loginButton.style.display = 'none';
        userProfile.style.display = 'block';
        userProfile.innerHTML = `
          <img src="${user.profilePicture}" alt="${user.displayName}" style="width: 30px; height: 30px; border-radius: 50%;">
          <span>${user.displayName}</span>
        `;
        savedToursButton.style.display = 'block';
      } else {
        loginButton.style.display = 'block';
        userProfile.style.display = 'none';
        savedToursButton.style.display = 'none';
      }
    });

  let csrfToken;

  fetch('/api/csrf-token')
    .then(response => response.json())
    .then(data => {
      csrfToken = data.csrfToken;
    });

  function displayTours(tours) {
    tourList.innerHTML = '';
    tours.forEach(tour => {
      const tourElement = document.createElement('div');
      tourElement.className = 'tour-card';
      tourElement.innerHTML = `
        <h3>${tour.name}</h3>
        <p>${tour.description}</p>
        <p>Date: ${new Date(tour.date).toLocaleDateString()}</p>
        <p>Price: $${tour.price}</p>
        <img src="${tour.image}" alt="${tour.name}" style="width: 100%; max-width: 300px;">
        <button class="save-tour-btn" data-tour-id="${tour._id}">Save Tour</button>
      `;
      tourElement.innerHTML += `
        <div class="review-form">
          <h4>Add a Review</h4>
          <select class="rating">
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          <textarea class="comment" placeholder="Your review"></textarea>
          <button class="submit-review" data-tour-id="${tour._id}">Submit Review</button>
        </div>
      `;
      tourList.appendChild(tourElement);
    });

    document.querySelectorAll('.save-tour-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tourId = e.target.getAttribute('data-tour-id');
        saveTour(tourId);
      });
    });

    document.querySelectorAll('.submit-review').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tourId = e.target.getAttribute('data-tour-id');
        const rating = e.target.parentNode.querySelector('.rating').value;
        const comment = e.target.parentNode.querySelector('.comment').value;
        submitReview(tourId, rating, comment);
      });
    });
  }

  function saveTour(tourId) {
    fetch('/api/tours/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': csrfToken
      },
      body: JSON.stringify({ tourId }),
    })
    .then(response => response.json())
    .then(data => {
      alert(data.message);
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error saving tour. Please try again.');
    });
  }

  function submitReview(tourId, rating, comment) {
    fetch(`/api/tours/${tourId}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': csrfToken
      },
      body: JSON.stringify({ rating, comment }),
    })
    .then(response => response.json())
    .then(data => {
      alert(data.message);
      // Optionally, refresh the tour display to show the new review
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error submitting review. Please try again.');
    });
  }

  function handleFetchError(error, customMessage) {
    console.error('Error:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      alert(`${customMessage}: ${error.response.data.error}`);
    } else if (error.request) {
      // The request was made but no response was received
      alert(`${customMessage}: No response received from server`);
    } else {
      // Something happened in setting up the request that triggered an Error
      alert(`${customMessage}: ${error.message}`);
    }
  }

  fetch('/api/tours')
    .then(response => {
      if (!response.ok) {
        throw response;
      }
      return response.json();
    })
    .then(tours => {
      displayTours(tours);
    })
    .catch(error => handleFetchError(error, 'Error fetching tours'));

  savedToursButton.addEventListener('click', () => {
    fetch('/api/user/saved-tours')
      .then(response => response.json())
      .then(savedTours => {
        displayTours(savedTours);
      });
  });
});