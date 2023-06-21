// JavaScript code to toggle dark mode for a specific div
document.addEventListener('DOMContentLoaded', () => {
    const darkModeButton = document.getElementById('darkModeButton');
    const container = document.querySelector('.container-xxl');

    // Check if dark mode preference exists in localStorage
    const darkModeEnabled = localStorage.getItem('darkMode');

    // Set initial dark mode state based on the preference
    if (darkModeEnabled === 'true') {
        container.classList.add('dark-mode');
    }

    // Toggle dark mode when the button is clicked
    darkModeButton.addEventListener('click', () => {
        container.classList.toggle('dark-mode');

        // Update the dark mode preference in localStorage
        const isDarkModeEnabled = container.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkModeEnabled.toString());
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const searchTermInput = document.getElementById('searchTerm');

    searchForm.addEventListener('submit', (e) => {
        if (searchTermInput.value.trim() === '') {
            e.preventDefault(); // Prevent the form from being submitted
            searchTermInput.focus();
        }
    });
});
