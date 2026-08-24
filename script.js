document.addEventListener('DOMContentLoaded', () => {
    
    // -----------------------------
    // Difficulty selection
    // -----------------------------


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

    
    // -----------------------------
    // Answer checking
    // -----------------------------


const difficulty = document.body.dataset.difficulty;

    // Only run the quiz code if we're on a difficulty page
if (difficulty) {

    fetch("../answers.json")
        .then(response => response.json())
        .then(data => {

            const answers = data[difficulty];

            const answerInput = document.getElementById("answerInput");
                const submitAnswer = document.getElementById("submitAnswer");

                const result = document.getElementById("result");

                submitAnswer.addEventListener("click", () => {

                    const userAnswer = answerInput.value
                        .trim()
                        .toLowerCase();

                    const correct = answers.some(answer =>
                        answer.toLowerCase() === userAnswer
                    );

                    if (correct) {
                    result.textContent = "Correct answer!";
                    result.style.color = "green";
                } else {
                    result.textContent = "Incorrect answer!";
                    result.style.color = "red";
                }

            });

            })
        .catch(error => {
        console.error("Error loading answers.json:", error);
         });

}

});