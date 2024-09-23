// set date
// select span
const date = (document.getElementById(
  "date"
).innerHTML = new Date().getFullYear());

//  nav toggle
// select button and links
const navBtn = document.getElementById("nav-toggle");
const links = document.getElementById("nav-links");
// add event listener
navBtn.addEventListener("click", () => {
  links.classList.toggle("show-links");
});

// ----- smooth scroll
// select links
const scrollLinks = document.querySelectorAll(".scroll-link");
scrollLinks.forEach(link => {
  link.addEventListener("click", e => {
    // prevent default
    e.preventDefault();
    links.classList.remove("show-links");

    const id = e.target.getAttribute("href").slice(1);
    const element = document.getElementById(id);
    //
    let position = element.offsetTop - 62;

    window.scrollTo({
      left: 0,
      // top: element.offsetTop,
      top: position,
      behavior: "smooth"
    });
  });
});


// read more
function addReadMoreEventListener() {
  const readMoreBtn = document.getElementById('read-more-btn');
  const hiddenText = document.querySelector('.hidden-text');

  console.log('Read More Button:', readMoreBtn);
  console.log('Hidden Text:', hiddenText);

  if (readMoreBtn && hiddenText) {
    readMoreBtn.addEventListener('click', function (e) {
      console.log('Read More button clicked');
      e.preventDefault(); // Prevent the default link behavior
      console.log('Current display:', hiddenText.style.display);

      if (hiddenText.style.display === 'none' || hiddenText.style.display === '') {
        hiddenText.style.display = 'block';
        this.textContent = 'Read Less';
      } else {
        hiddenText.style.display = 'none';
        this.textContent = 'Read More';
      }

      console.log('New display:', hiddenText.style.display);
    });
  } else {
    console.log('Read More button or Hidden Text not found');
  }
}

// Call the function to add the event listener when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM fully loaded');
  addReadMoreEventListener();
});

// Book Now Buttons
function addBookNowEventListeners() {
  const bookNowButtons = document.querySelectorAll('.book-now-btn');

  bookNowButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();

      const token = localStorage.getItem('token');

      if (token) {
        // Redirect to booking page
        window.location.href = 'booking.html';
      } else {
        // Redirect to sign-in page
        window.location.href = 'signin.html';
      }
    });
  });
}


// Function to check user login status (implement this based on your authentication system)
function checkUserLoginStatus() {
  const token = localStorage.getItem('token');
  return !!token; // Returns true if token exists, false otherwise
}

// Add click event listeners to all "Book Now" buttons
document.addEventListener('DOMContentLoaded', function() {
  const bookNowButtons = document.querySelectorAll('.book-now-btn');
  bookNowButtons.forEach(button => {
    button.addEventListener('click', handleBookNowClick);
  });
});

// Function to get CSRF token
function getCsrfToken() {
  return document.cookie.split('; ')
    .find(row => row.startsWith('XSRF-TOKEN'))
    .split('=')[1];
}

// Example of a POST request with CSRF token
async function examplePostRequest(data) {
  try {
    const response = await fetch('/api/example', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': getCsrfToken()
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
}

// Modify the existing DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM fully loaded');
  addReadMoreEventListener();
  addBookNowEventListeners();
});



// Function to fetch and display tours
async function fetchAndDisplayTours() {
  try {
    const response = await fetch('/api/tours');
    const tours = await response.json();
    const tourList = document.getElementById('tour-list');
    tourList.innerHTML = '';

    tours.forEach(tour => {
      const tourElement = document.createElement('article');
      tourElement.classList.add('tour-card');
      tourElement.innerHTML = `
        <div class="tour-img-container">
          <img src="${tour.image}" class="tour-img" alt="${tour.name}">
        </div>
        <div class="tour-info">
          <h4>${tour.name}</h4>
          <p>${tour.description}</p>
          <div class="tour-footer">
            <p><span><i class="fas fa-map"></i></span> ${tour.location}</p>
            <p>$${tour.price}</p>
            <p>${new Date(tour.date).toLocaleDateString()}</p>
          </div>
          <button class="btn btn-primary book-now" data-tour-id="${tour._id}">Book Now</button>
        </div>
      `;
      tourList.appendChild(tourElement);
    });

    // Add event listeners to the new "Book Now" buttons
//    addBookNowEventListeners();{
//      catch (error) {
//    console.error('Error fetching tours:', error);
//  }
//}

// Call fetchAndDisplayTours when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded');
  addReadMoreEventListener();
  fetchAndDisplayTours();
});

// user profile
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

// display tours
//  function displayTours(tours) {
//    tourList.innerHTML = '';
//    tours.forEach(tour => {
//      const tourElement = document.createElement('div');
//      tourElement.className = 'tour-card';
//      tourElement.innerHTML = `
//        <h3>${tour.name}</h3>
//        <p>${tour.description}</p>
//        <p>Date: ${new Date(tour.date).toLocaleDateString()}</p>
//        <p>Price: $${tour.price}</p>
//        <img src="${tour.image}" alt="${tour.name}" style="width: 100%; max-width: 300px;">
//        <button class="save-tour-btn" data-tour-id="${tour._id}">Save Tour</button>
//      `;
//      tourElement.innerHTML += `
//        <div class="review-form">
//          <h4>Add a Review</h4>
//          <select class="rating">
//            <option value="5">5 Stars</option>
//            <option value="4">4 Stars</option>
//            <option value="3">3 Stars</option>
//            <option value="2">2 Stars</option>
//            <option value="1">1 Star</option>
//          </select>
//          <textarea class="comment" placeholder="Your review"></textarea>
//          <button class="submit-review" data-tour-id="${tour._id}">Submit Review</button>
//        </div>
//      `;
//      tourList.appendChild(tourElement);
//    });

//    document.querySelectorAll('.save-tour-btn').forEach(btn => {
//      btn.addEventListener('click', (e) => {
//        const tourId = e.target.getAttribute('data-tour-id');
//        saveTour(tourId);
//      });
//    });

   // submit review
//    document.querySelectorAll('.submit-review').forEach(btn => {
//      btn.addEventListener('click', (e) => {
//        const tourId = e.target.getAttribute('data-tour-id');
//        const rating = e.target.parentNode.querySelector('.rating').value;
//        const comment = e.target.parentNode.querySelector('.comment').value;
//        submitReview(tourId, rating, comment);
//      });
//    });
//  }

  // save tour
//  function saveTour(tourId) {
//    fetch('/api/tours/save', {
//      method: 'POST',
//      headers: {
//        'Content-Type': 'application/json',
//        'CSRF-Token': csrfToken
//      },
//      body: JSON.stringify({ tourId }),
//    })
//    .then(response => response.json())
//    .then(data => {
//      alert(data.message);
//    })
//    .catch(error => {
//      console.error('Error:', error);
//      alert('Error saving tour. Please try again.');
//    });
// }

  // submit review
//  function submitReview(tourId, rating, comment) {
//    fetch(`/api/tours/${tourId}/review`, {
//      method: 'POST',
//      headers: {
//        'Content-Type': 'application/json',
//        'CSRF-Token': csrfToken
//      },
//      body: JSON.stringify({ rating, comment }),
//    })
//    .then(response => response.json())
//    .then(data => {
//      alert(data.message);
      // Optionally, refresh the tour display to show the new review
//    })
//    .catch(error => {
//      console.error('Error:', error);
//      alert('Error submitting review. Please try again.');
//    });
//  }

  // handle fetch error
//  function handleFetchError(error, customMessage) {
//    console.error('Error:', error);
//    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
//      alert(`${customMessage}: ${error.response.data.error}`);
//    } else if (error.request) {
      // The request was made but no response was received
//      alert(`${customMessage}: No response received from server`);
//    } else {
      // Something happened in setting up the request that triggered an Error
//      alert(`${customMessage}: ${error.message}`);
    //}
//}

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