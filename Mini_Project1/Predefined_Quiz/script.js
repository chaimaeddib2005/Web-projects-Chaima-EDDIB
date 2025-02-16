const quizData = {
    "response_code": 0,
    "results": [
        {
            "type": "multiple",
            "difficulty": "hard",
            "category": "Entertainment: Music",
            "question": "What was the name of the cold-war singer who has a song in Grand Theft Auto IV, and a wall landmark in Moscow for his memorial?",
            "correct_answer": "Viktor Tsoi",
            "incorrect_answers": ["Jimi Hendrix", "Brian Jones", "Vladimir Vysotsky"]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "Entertainment: Japanese Anime & Manga",
            "question": "What name is the main character Chihiro given in the 2001 movie 'Spirited Away'?",
            "correct_answer": "Sen (Thousand)",
            "incorrect_answers": ["Hyaku (Hundred)", "Ichiman (Ten thousand)", "Juu (Ten)"]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "Entertainment: Film",
            "question": "What is the birth name of Michael Caine?",
            "correct_answer": "Maurice Micklewhite",
            "incorrect_answers": ["Morris Coleman", "Carl Myers", "Martin Michaels"]
        },
        {
            "type": "boolean",
            "difficulty": "hard",
            "category": "Entertainment: Music",
            "question": "The singer Billie Holiday was also known as 'Lady Day'.",
            "correct_answer": "True",
            "incorrect_answers": ["False"]
        },
        {
            "type": "multiple",
            "difficulty": "hard",
            "category": "General Knowledge",
            "question": "Which of the following is an existing family in 'The Sims'?",
            "correct_answer": "The Goth Family",
            "incorrect_answers": ["The Family", "The Simoleon Family", "The Proud Family"]
        },
        {
            "type": "boolean",
            "difficulty": "medium",
            "category": "Entertainment: Music",
            "question": "The cover of The Beatles album 'Abbey Road' featured a Volkswagen Beetle in the background.",
            "correct_answer": "True",
            "incorrect_answers": ["False"]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "Science & Nature",
            "question": "What is the hottest planet in the Solar System?",
            "correct_answer": "Venus",
            "incorrect_answers": ["Mars", "Mercury", "Jupiter"]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "Entertainment: Video Games",
            "question": "What is the title of the song on the main menu in Halo?",
            "correct_answer": "Halo",
            "incorrect_answers": ["Opening Suite", "Shadows", "Suite Autumn"]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "Entertainment: Comics",
            "question": "What is the name of the main character in the webcomic Gunnerkrigg Court by Tom Siddell?",
            "correct_answer": "Antimony",
            "incorrect_answers": ["Bismuth", "Mercury", "Cobalt"]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "Entertainment: Video Games",
            "question": "Gordon Freeman is said to have burnt and destroyed what food in the break room microwave?",
            "correct_answer": "Casserole",
            "incorrect_answers": ["Sub Sandwich", "Chicken Soup", "Pepperoni Pizza"]
        }
    ]
}
let currentQuestionIndex = 0;
let score = 0;
let timer;
const timeLimit = 30; // Time per question in seconds

// Stores user-selected answers but does not change colors
let userAnswers = new Array(quizData.results.length).fill(null);

// Function to start the quiz
function startQuiz() {
    document.getElementById("Header").classList.add("hidden"); // Hide header
    document.getElementById("quiz-container").innerHTML = `<div id="score-container" class="final-score">Score: 0 / ${quizData.results.length}</div>`; // Score at top
    loadQuestion(currentQuestionIndex);
}
function loadQuestion(n) {
    if (n == quizData.results.length) {
        submitQuiz();
        return;
    }

    let questionData = quizData.results[n];
    let options = [...questionData.incorrect_answers, questionData.correct_answer].sort(() => Math.random() - 0.5);

    let optionsText = options.map((option, index) => `
        <label>
            <input type="radio" name="answer${n}" value="${option}" onchange="saveAnswer(${n}, this.value)" />
            <span id="choice${n}${index}">${option}</span>
        </label><br>
    `).join("");

    let questionHTML = `
        <div class="question-container" id="question-${n}">
            <p class="question">${questionData.question} 
                <span class="timer-text" id="timer-${n}">⏳ Time Left: 30s</span>
            </p>
            <div class="answers">
                ${optionsText}
                <button class="next-btn" onclick="nextQuestion(${n})">${n === quizData.results.length - 1 ? "Submit" : "Next"}</button>
            </div>
        </div>`;

    document.getElementById("quiz-container").innerHTML += questionHTML;
    document.getElementById(`question-${n}`).scrollIntoView({ behavior: "smooth" });
    startTimer(n);
}
function startTimer(n) {
    let timeLeft = timeLimit;
    document.getElementById(`timer-${n}`).innerHTML = `⏳ Time Left: ${timeLeft}s`;

    timer = setInterval(() => {
        if (timeLeft <= 0) {  
            clearInterval(timer); // ✅ Stop the timer at 0
            document.getElementById(`timer-${n}`).innerHTML = `⏳ Time Left: 0s`; // Ensure it displays exactly 0
            disableOptions(n);
            nextQuestion(n, true); // Automatically move to next question
        } else {
            document.getElementById(`timer-${n}`).innerHTML = `⏳ Time Left: ${timeLeft}s`;
            timeLeft--; // Only decrease when timeLeft > 0
        }
    }, 1000);
}
function saveAnswer(n, selectedValue) {
    userAnswers[n] = selectedValue; // Store the answer but don't change color
}

// Function to disable options when time runs out
function disableOptions(n) {
    let options = document.querySelectorAll(`input[name="answer${n}"]`);
    options.forEach(option => option.disabled = true);
}

// Function to move to the next question
function nextQuestion(n, timeExpired = false) {
    if (timeExpired) {
        disableOptions(n); // Disable options if time runs out
    }

    currentQuestionIndex++;
    setTimeout(() => loadQuestion(currentQuestionIndex), 1500); // Delay to show correct answer
}

// Function to update score at the top
function updateScore() {
    document.getElementById("score-container").innerHTML = `Score: ${score} / ${quizData.results.length}`;
}

// Function to submit the quiz and show results
function submitQuiz() {
    // Calculate the final score
    score = 0;
    quizData.results.forEach((questionData, index) => {
        if (userAnswers[index] === questionData.correct_answer) {
            score++;
        }
    });

    // Update the score at the top
    updateScore();

    // Highlight correct and incorrect answers
    quizData.results.forEach((questionData, index) => {
        let correctAnswer = questionData.correct_answer;
        let selectedAnswer = userAnswers[index];

        let options = document.querySelectorAll(`input[name="answer${index}"]`);
        options.forEach(option => {
            let label = option.nextElementSibling;
            if (option.value === correctAnswer) {
                label.classList.add("correct"); // Highlight correct answer in green
            } else if (option.value === selectedAnswer) {
                label.classList.add("incorrect"); // Highlight incorrect selected answer in red
            }
        });
    });

    // Scroll to the top immediately after submission
    document.getElementById("quiz-container").scrollIntoView({ behavior: "smooth" });
}

// Add event listener to start button
document.getElementById("start-btn").addEventListener("click", startQuiz);