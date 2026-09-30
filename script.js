import { fallbackQuestions } from "./question.js";
import { fetchQuestions } from "./api.js";

let questions = [];

const questionEl = document.querySelector(".question");
const answersEl = document.querySelector(".answers");
const progressEl = document.querySelector(".progress");
const scoreEl = document.querySelector(".score");
const nextBtn = document.querySelector(".btn-next");
const restartBtn = document.querySelector(".btn-restart");
const timerEl = document.querySelector(".timer");

let currentIndex = 0;
let answered = false;
let score = 0;
let timeLeft;
let timerId;

const startTimer = function () {
  clearInterval(timerId);
  timeLeft = 10;
  timerEl.textContent = `Time: ${timeLeft}`;

  timerId = setInterval(function () {
    timeLeft--;
    timerEl.textContent = `Time: ${timeLeft}`;

    if (timeLeft === 0) {
      clearInterval(timerId);
      answered = true;

      const { correct } = questions[currentIndex];
      answersEl.children[correct].classList.add("correct");
      timerEl.textContent = "Time's up!";
    }
  }, 1000);
};

const renderQuestion = function () {
  const { question, answers } = questions[currentIndex];

  progressEl.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
  questionEl.textContent = question;

  answersEl.innerHTML = "";
  answers.forEach((answer, i) => {
    const html = `<li data-index="${i}">${answer}</li>`;
    answersEl.insertAdjacentHTML("beforeend", html);
  });

  startTimer();
};

answersEl.addEventListener("click", function (e) {
  const li = e.target.closest("li");
  if (!li) return;

  if (answered) return;
  answered = true;
  clearInterval(timerId);

  const chosen = Number(li.dataset.index);
  const { correct } = questions[currentIndex];

  if (chosen === correct) {
    li.classList.add("correct");
    score++;
  } else {
    li.classList.add("wrong");
    answersEl.children[correct].classList.add("correct");
  }
  scoreEl.textContent = `Score: ${score}`;
});

nextBtn.addEventListener("click", function () {
  if (!answered) return;

  currentIndex++;

  if (currentIndex === questions.length) {
    questionEl.textContent = `End! Your score: ${score} out of ${questions.length}`;
    answersEl.innerHTML = "";
    progressEl.textContent = "";
    scoreEl.textContent = "";
    timerEl.textContent = "";
    nextBtn.classList.add("hidden");
    restartBtn.classList.remove("hidden");
    return;
  }
  answered = false;
  renderQuestion();
});

restartBtn.addEventListener("click", function () {
  currentIndex = 0;
  score = 0;
  answered = false;
  scoreEl.textContent = "";
  nextBtn.classList.remove("hidden");
  restartBtn.classList.add("hidden");
  getQuestions();
});

const getQuestions = async function () {
  questionEl.textContent = "Loading...";

  try {
    questions = await fetchQuestions();
  } catch (err) {
    console.log(err);
    questions = fallbackQuestions;
  }

  renderQuestion();
};

getQuestions();
