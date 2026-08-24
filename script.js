document.addEventListener('DOMContentLoaded', () => {
    
    // Find all buttons with the class 'level-card'
    const levelButtons = document.querySelectorAll('.level-card');

    // Loop through each button and add a click event
    levelButtons.forEach(button => {
        button.addEventListener('click', () => {
            
            // Get the difficulty level from the data-level attribute in your HTML
            const level = button.getAttribute('data-level'); 
            
            // Direct the user into the Difficulties folder to the correct page
            if (level) {
                window.location.href = `Difficulties/${level}.html`;
            }
        });
    });

});