let quizData = { results: [] }; // Ensure it starts with an empty array

const Form = document.querySelector(".formContainer");

async function fetchQuestions(numQuestions, category, difficulty, Type, encoding) {
    const apiUrl = `https://opentdb.com/api.php?amount=${numQuestions}&category=${category}&difficulty=${difficulty}&type=${Type}&encoding=${encoding}`;
    console.log("Generated API URL:", apiUrl); // Check the URL in the console

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.response_code === 0 && data.results) {
            quizData = data; // Store questions
        } else {
            alert("Error fetching questions. Try again.");
            quizData = { results: [] }; // Ensure it doesn't break later
        }
    } catch (error) {
        console.error("Error fetching quiz data:", error);
        quizData = { results: [] };
    }
}

async function generateQuiz() {
    const numQuestions = document.getElementById("number").value;
    const category = document.getElementById("category").value;
    const difficulty = document.getElementById("difficulty").value;
    const Type = document.getElementById("type").value;
    const encoding = document.getElementById("encoding").value;

    await fetchQuestions(numQuestions, category, difficulty, Type, encoding);

    if (quizData.results.length === 0) {
        alert("No questions received. Please try again.");
        return;
    }

    console.log(quizData);
    Form.classList.add("hidden");
    const quizContainerP = document.getElementById("StartQuizPage");
    quizContainerP.classList.remove("hidden");
}

let currentQuestionIndex = 0;
let score = 0;
let timer;
const timeLimit = 30; // Time per question in seconds

// Ensure userAnswers does not break when quizData is empty
let userAnswers = [];

function startQuiz() {
    if (quizData.results.length === 0) {
        alert("Quiz data is empty! Please regenerate the quiz.");
        return;
    }

    document.getElementById("Header").classList.add("hidden");
    document.getElementById("quiz-container").innerHTML = `<div id="score-container" class="final-score">Score: 0 / ${quizData.results.length}</div>`;
    userAnswers = new Array(quizData.results.length).fill(null); // Initialize with correct length
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
    userAnswers[n] = selectedValue;
}

function disableOptions(n) {
    document.querySelectorAll(`input[name="answer${n}"]`).forEach(option => option.disabled = true);
}

function nextQuestion(n, timeExpired = false) {
    if (timeExpired) disableOptions(n);
    currentQuestionIndex++;
    setTimeout(() => loadQuestion(currentQuestionIndex), 1500);
}

function updateScore() {
    document.getElementById("score-container").innerHTML = `Score: ${score} / ${quizData.results.length}`;
}

function submitQuiz() {
    score = userAnswers.reduce((acc, answer, index) => acc + (answer === quizData.results[index].correct_answer ? 1 : 0), 0);
    updateScore();

    quizData.results.forEach((questionData, index) => {
        let correctAnswer = questionData.correct_answer;
        let selectedAnswer = userAnswers[index];

        document.querySelectorAll(`input[name="answer${index}"]`).forEach(option => {
            let label = option.nextElementSibling;
            label.classList.toggle("correct", option.value === correctAnswer);
            label.classList.toggle("incorrect", option.value === selectedAnswer && option.value !== correctAnswer);
            option.disabled = true; // Disable selection after submission
        });
    });

    // Scroll the quiz container to the top smoothly
    document.getElementById("quiz-container").scrollIntoView({ behavior: "smooth" });
}



document.getElementById("start-btn").addEventListener("click", startQuiz);
document.getElementById("generateQuiz").addEventListener("click", function(event) {
    event.preventDefault();
    generateQuiz();
});
