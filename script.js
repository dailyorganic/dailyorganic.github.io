document.addEventListener('DOMContentLoaded', () => {
    
    // -----------------------------
    // Difficulty selection (Homepage)
    // -----------------------------
    const levelButtons = document.querySelectorAll('.level-card');

    levelButtons.forEach(button => {
        button.addEventListener('click', () => {
            const level = button.getAttribute('data-level'); 
            if (level) {
                window.location.href = `Difficulties/${level}.html`;
            }
        });
    });

    // -----------------------------
    // Answer checking (Quiz Pages)
    // -----------------------------
    const difficulty = document.body.dataset.difficulty;

    if (difficulty) {
        let resultTimeout = null; // Stores timer to auto-hide incorrect alerts

        fetch("../answers.json")
            .then(response => response.json())
            .then(data => {
                const answers = data[difficulty];
                const answerInput = document.getElementById("answerInput");
                const submitAnswer = document.getElementById("submitAnswer");
                const result = document.getElementById("result");

                const checkAnswer = () => {
                    // Do nothing if the quiz is already completed
                    if (answerInput.disabled) return;

                    const userAnswer = answerInput.value.trim().toLowerCase();
                    if (!userAnswer) return;

                    // Clear any active fade-out timer if the user submits again quickly
                    if (resultTimeout) {
                        clearTimeout(resultTimeout);
                    }

                    const correct = answers.some(answer =>
                        answer.toLowerCase() === userAnswer
                    );

                    if (correct) {
                        result.textContent = "✨ Correct answer! Great job!";
                        result.className = "show correct";
                        launchConfetti();

                        // Lock the input field and submit button
                        answerInput.disabled = true;
                        submitAnswer.disabled = true;
                    } else {
                        result.textContent = "❌ Incorrect answer. Try again!";
                        result.className = "show incorrect";

                        // Hide the incorrect message after 3 seconds
                        resultTimeout = setTimeout(() => {
                            result.classList.remove("show");
                        }, 3000);
                    }
                };

                submitAnswer.addEventListener("click", checkAnswer);

                // Allow submitting with the 'Enter' key
                answerInput.addEventListener("keypress", (e) => {
                    if (e.key === "Enter") {
                        checkAnswer();
                    }
                });

            })
            .catch(error => {
                console.error("Error loading answers.json:", error);
            });
    }
});

// -----------------------------
// Dynamic Confetti Animation
// -----------------------------
function launchConfetti() {
    if (window.confetti) {
        window.confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    } else {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.4/dist/confetti.browser.min.js';
        script.onload = () => {
            window.confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        };
        document.head.appendChild(script);
    }
}