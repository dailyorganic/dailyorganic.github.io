// Wait for the HTML to fully load before running the script
document.addEventListener('DOMContentLoaded', () => {
    
    // Find the Easy button on the page
    const easyButton = document.querySelector('.level-easy');

    // Make sure the button actually exists on this page before adding the click action
    if (easyButton) {
        easyButton.addEventListener('click', () => {
            // Send the user to the easy page
            window.location.href = 'easy.html';
        });
    }

});