// api.js
const apiUrl = 'https://www.freetogame.com/api/games';

// For pagination and displaying games
let allGames = [];
const gamesPerPage = 28; // Number of games to display per page
let currentPage = 1;

// Function to fetch games data for pagination
async function fetchGamesForPagination() {
    try {
        const response = await fetch(apiUrl);
        allGames = await response.json();
        updateGamesDisplay();
        setupPagination();
    } catch (error) {
        console.error('Error fetching games for pagination:', error);
    }
}

// Update the displayGames function
function displayGames(games) {
    const gamesContainer = document.getElementById('gamesContainer');
    gamesContainer.innerHTML = ''; // Clear existing content
    games.forEach(game => {
      const gameCard = document.createElement('div');
      gameCard.classList.add('col', 'mb-3');
      gameCard.innerHTML = `
        <img src="${game.thumbnail}" class="card-img-top rounded" alt="${game.title}">
        <div class="mt-1 ml-2">
          <h5>${game.title}</h5>
          <p>${game.price ? game.price : 'Free'}</p>
        </div>
      `;
  
      // Add click event to redirect to Game.html with game title as a query parameter
      gameCard.addEventListener('click', () => {
        window.location.href = `Game.html?title=${encodeURIComponent(game.title)}`;
      });
  
      gamesContainer.appendChild(gameCard);
    });
}
  
// Function to setup pagination
function setupPagination() {
    const paginationContainer = document.getElementById('paginationContainer');
    paginationContainer.innerHTML = ''; // Clear existing pagination
    const pageCount = Math.ceil(allGames.length / gamesPerPage);
    
    const createPageItem = (pageNumber) => {
        const pageItem = document.createElement('li');
        pageItem.classList.add('page-item');
        pageItem.innerHTML = `
            <a class="page-link" href="#" data-page="${pageNumber}">${pageNumber}</a>
        `;
        pageItem.querySelector('.page-link').addEventListener('click', (event) => {
            event.preventDefault();
            currentPage = pageNumber;
            updateGamesDisplay();
        });
        return pageItem;
    };

    // Previous button
    if (currentPage > 1) {
        const prevItem = document.createElement('li');
        prevItem.classList.add('page-item');
        prevItem.innerHTML = `<a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>`;
        prevItem.querySelector('.page-link').addEventListener('click', (event) => {
            event.preventDefault();
            currentPage -= 1;
            updateGamesDisplay();
        });
        paginationContainer.appendChild(prevItem);
    }

    // Page numbers
    const maxPagesToShow = 5; // Number of page numbers to show
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(startPage + maxPagesToShow - 1, pageCount);

    if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - (maxPagesToShow - 1));
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationContainer.appendChild(createPageItem(i));
    }

    // Ellipsis if needed
    if (startPage > 1) {
        const ellipsis = document.createElement('li');
        ellipsis.classList.add('page-item', 'disabled');
        ellipsis.innerHTML = `<span class="page-link">...</span>`;
        paginationContainer.appendChild(ellipsis);
    }

    // Next button
    if (currentPage < pageCount) {
        const nextItem = document.createElement('li');
        nextItem.classList.add('page-item');
        nextItem.innerHTML = `<a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>`;
        nextItem.querySelector('.page-link').addEventListener('click', (event) => {
            event.preventDefault();
            currentPage += 1;
            updateGamesDisplay();
        });
        paginationContainer.appendChild(nextItem);
    }
}

// Update games display based on current page
function updateGamesDisplay() {
    const start = (currentPage - 1) * gamesPerPage;
    const end = start + gamesPerPage;
    displayGames(allGames.slice(start, end));
    setupPagination(); // Refresh pagination
}

// Call the function to fetch and display games
fetchGamesForPagination();

// For populating games in sections
async function fetchGamesForSections() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        populateGames(data.slice(0, 12)); // Limiting to the first 12 games
    } catch (error) {
        console.error("Error fetching game data:", error);
    }
}

function populateGames(games) {
    const gameSections = document.querySelectorAll(".row");

    gameSections.forEach((section, index) => {
        const gameCards = section.querySelectorAll('.col-6');

        gameCards.forEach((card, cardIndex) => {
            const game = games[index * gameCards.length + cardIndex];

            if (game) {
                const gameTitle = card.querySelector('.game-title');
                const gameDesc = card.querySelector('p:nth-of-type(2)');
                const gameCardDiv = card.querySelector('.game-card');

                gameTitle.textContent = game.title;
                gameDesc.textContent = game.short_description.length > 100 ? 
                    game.short_description.substring(0, 100) + '...' : 
                    game.short_description;

                gameCardDiv.style.backgroundImage = `url(${game.thumbnail})`;
                gameCardDiv.style.backgroundSize = 'cover';
                gameCardDiv.style.backgroundPosition = 'center';
                gameCardDiv.style.height = '300px'; // Height increased for better appearance
                gameCardDiv.style.borderRadius = '10px'; // Smoother borders

                // Wrap the card with a link to the Game.html page
                card.addEventListener('click', () => {
                    // Redirect to Game.html with the game title as a query parameter
                    window.location.href = `Game.html?title=${encodeURIComponent(game.title)}`;
                });
            }
        });
    });
}


// Call the function to fetch and populate games for sections
document.addEventListener("DOMContentLoaded", fetchGamesForSections);
