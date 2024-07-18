document.addEventListener('DOMContentLoaded', () => {
    let currentIndex = 0;
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let memes = [];

    // Fetch data from db.json
    fetch('db.json')
        .then(response => response.json())
        .then(data => {
            memes = data.memes;

            const memeImage = document.getElementById('meme-image');
            const memeName = document.getElementById('meme-name');
            const memeCaptions = document.getElementById('meme-captions');
            const nextMemeButton = document.getElementById('next-meme');
            const favoriteMemeButton = document.getElementById('favorite-meme');
            const favoritesList = document.getElementById('favorites-list');
            const searchInput = document.getElementById('search-input');
            const searchButton = document.getElementById('search-button');

            // Function to display meme
            function displayMeme(index) {
                const meme = memes[index];
                memeImage.src = meme.url;
                memeName.textContent = meme.name;
                memeCaptions.textContent = meme.captions;
            }

            // Function to render favorite memes
            function renderFavorites() {
                favoritesList.innerHTML = '';
                favorites.forEach(favorite => {
                    const favoriteDiv = document.createElement('div');
                    favoriteDiv.classList.add('favorite-item');
                    favoriteDiv.innerHTML = `
                        <img src="${favorite.url}" alt="${favorite.name}">
                        <p>${favorite.name}</p>
                        <button onclick="deleteFavorite('${favorite.id}')">X</button>
                    `;
                    favoritesList.appendChild(favoriteDiv);
                });
            }

            // Display the first meme initially
            displayMeme(currentIndex);
            renderFavorites();

            // Event listener for next meme button
            nextMemeButton.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % memes.length;
                displayMeme(currentIndex);
            });

            // Event listener for favorite meme button
            favoriteMemeButton.addEventListener('click', () => {
                const currentMeme = memes[currentIndex];
                if (!favorites.some(favorite => favorite.id === currentMeme.id)) {
                    favorites.push(currentMeme);
                    localStorage.setItem('favorites', JSON.stringify(favorites));
                    renderFavorites();
                }
            });

            // Event listener for search button
            searchButton.addEventListener('click', () => {
                const searchTerm = searchInput.value.toLowerCase();
                const filteredMemes = memes.filter(meme => meme.name.toLowerCase().includes(searchTerm));
                if (filteredMemes.length > 0) {
                    memes = filteredMemes;
                    currentIndex = 0;
                    displayMeme(currentIndex);
                } else {
                    alert('No memes found with that name');
                }
            });

            window.deleteFavorite = (id) => {
                favorites = favorites.filter(favorite => favorite.id !== id);
                localStorage.setItem('favorites', JSON.stringify(favorites));
                renderFavorites();
            };
        })
        .catch(error => console.error('Error fetching memes:', error));
});
