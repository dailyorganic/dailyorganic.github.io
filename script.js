document.addEventListener('DOMContentLoaded', () => {
    
    // -----------------------------
    // Difficulty selection
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
    // Answer checking
    // -----------------------------
    const difficulty = document.body.dataset.difficulty;

    if (difficulty) {
        fetch("../answers.json")
            .then(response => response.json())
            .then(data => {
                const answers = data[difficulty];
                const answerInput = document.getElementById("answerInput");
                const submitAnswer = document.getElementById("submitAnswer");
                const result = document.getElementById("result");

                const checkAnswer = () => {
                    const userAnswer = answerInput.value.trim().toLowerCase();
                    if (!userAnswer) return;

                    const correct = answers.some(answer =>
                        answer.toLowerCase() === userAnswer
                    );

                    if (correct) {
                        result.textContent = "✨ Correct answer! Great job!";
                        result.className = "show correct";
                        launchConfetti();
                    } else {
                        result.textContent = "❌ Incorrect answer. Try again!";
                        result.className = "show incorrect";
                    }
                };

                submitAnswer.addEventListener("click", checkAnswer);

                // Allow pressing 'Enter' inside the text box to submit
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

// Automatically loads confetti script from CDN on demand
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