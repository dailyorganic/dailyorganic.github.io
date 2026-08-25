document.addEventListener('DOMContentLoaded', () => {
    
    // -----------------------------
    // Helper Functions: LocalStorage Stats
    // -----------------------------
    const getStats = () => {
        const defaultStats = {
            totalAttempts: 0,
            successfulAttempts: 0,
            unsuccessfulAttempts: 0,
            clicks: { easy: 0, medium: 0, hard: 0 },
            attemptsPerSuccess: [] // Stores number of tries for solved puzzles
        };
        const saved = localStorage.getItem('dailyOrganicStats');
        return saved ? JSON.parse(saved) : defaultStats;
    };

    const saveStats = (stats) => {
        localStorage.setItem('dailyOrganicStats', JSON.stringify(stats));
    };

    const calculateMedian = (arr) => {
        if (!arr || arr.length === 0) return 0;
        const sorted = [...arr].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        if (sorted.length % 2 !== 0) {
            return sorted[mid];
        }
        return ((sorted[mid - 1] + sorted[mid]) / 2).toFixed(1);
    };

    // -----------------------------
    // 1. Difficulty selection & Tracking (Homepage)
    // -----------------------------
    const levelButtons = document.querySelectorAll('.level-card');

    levelButtons.forEach(button => {
        button.addEventListener('click', () => {
            const level = button.getAttribute('data-level'); 
            if (level) {
                // Record level click count
                const stats = getStats();
                if (stats.clicks[level] !== undefined) {
                    stats.clicks[level]++;
                    saveStats(stats);
                }
                window.location.href = `Difficulties/${level}.html`;
            }
        });
    });

    // -----------------------------
    // 2. Statistics Page Display
    // -----------------------------
    if (document.body.dataset.page === "statistics") {
        const stats = getStats();
        
        document.getElementById('statTotal').textContent = stats.totalAttempts;
        document.getElementById('statSuccess').textContent = stats.successfulAttempts;
        document.getElementById('statUnsuccess').textContent = stats.unsuccessfulAttempts;
        document.getElementById('statMedian').textContent = calculateMedian(stats.attemptsPerSuccess);

        document.getElementById('clickEasy').textContent = stats.clicks.easy || 0;
        document.getElementById('clickMedium').textContent = stats.clicks.medium || 0;
        document.getElementById('clickHard').textContent = stats.clicks.hard || 0;
    }

    // -----------------------------
    // 3. Answer Checking & Attempts Counter (Quiz Pages)
    // -----------------------------
    const difficulty = document.body.dataset.difficulty;

    if (difficulty) {
        let currentAttempts = 0; // Tracks attempts for current active session
        let resultTimeout = null;

        fetch("../answers.json")
            .then(response => response.json())
            .then(data => {
                const answers = data[difficulty];
                const answerInput = document.getElementById("answerInput");
                const submitAnswer = document.getElementById("submitAnswer");
                const result = document.getElementById("result");

                const checkAnswer = () => {
                    if (answerInput.disabled) return;

                    const userAnswer = answerInput.value.trim().toLowerCase();
                    if (!userAnswer) return;

                    currentAttempts++;
                    const stats = getStats();
                    stats.totalAttempts++;

                    if (resultTimeout) {
                        clearTimeout(resultTimeout);
                    }

                    const correct = answers.some(answer =>
                        answer.toLowerCase() === userAnswer
                    );

                    if (correct) {
                        stats.successfulAttempts++;
                        stats.attemptsPerSuccess.push(currentAttempts);
                        saveStats(stats);

                        result.textContent = "✨ Correct answer! Great job!";
                        result.className = "show correct";

                        // Display "Attempts made" below correct answer badge
                        let attemptsDisplay = document.getElementById("attemptsDisplay");
                        if (!attemptsDisplay) {
                            attemptsDisplay = document.createElement("p");
                            attemptsDisplay.id = "attemptsDisplay";
                            attemptsDisplay.className = "attempts-made";
                            result.parentNode.appendChild(attemptsDisplay);
                        }
                        attemptsDisplay.textContent = `Attempts made: ${currentAttempts}`;

                        launchConfetti();

                        answerInput.disabled = true;
                        submitAnswer.disabled = true;
                    } else {
                        stats.unsuccessfulAttempts++;
                        saveStats(stats);

                        result.textContent = "❌ Incorrect answer. Try again!";
                        result.className = "show incorrect";

                        resultTimeout = setTimeout(() => {
                            result.classList.remove("show");
                        }, 3000);
                    }
                };

                submitAnswer.addEventListener("click", checkAnswer);

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
// Confetti Animation
// -----------------------------
function launchConfetti() {
    if (window.confetti) {
        window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } else {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.4/dist/confetti.browser.min.js';
        script.onload = () => {
            window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        };
        document.head.appendChild(script);
    }
}