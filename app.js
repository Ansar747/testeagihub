const tasks = {
  math: {
    name: "Математика",
    question: "Сколько будет 12 × 3?",
    answers: ["36"],
    explanation: "Верно: 12 × 3 = 36."
  },
  history: {
    name: "История",
    question: "В каком веке началась Вторая мировая война?",
    answers: ["20", "xx", "20 век", "xx век"],
    explanation: "Верно: Вторая мировая война началась в 1939 году, в XX веке."
  },
  english: {
    name: "Английский язык",
    question: "Как по-английски будет «книга»?",
    answers: ["book"],
    explanation: "Верно: «книга» по-английски — book."
  }
};

const startScreen = document.querySelector("#start-screen");
const quizScreen = document.querySelector("#quiz-screen");
const topicSelect = document.querySelector("#topic");
const question = document.querySelector("#question");
const topicName = document.querySelector("#topic-name");
const answer = document.querySelector("#answer");
const result = document.querySelector("#result");
let currentTask;

document.querySelector("#start-button").addEventListener("click", () => {
  currentTask = tasks[topicSelect.value];
  topicName.textContent = currentTask.name;
  question.textContent = currentTask.question;
  answer.value = "";
  result.textContent = "";
  result.className = "result";
  startScreen.hidden = true;
  quizScreen.hidden = false;
  answer.focus();
});

document.querySelector("#check-button").addEventListener("click", () => {
  const userAnswer = answer.value.trim().toLowerCase();
  const correct = currentTask.answers.includes(userAnswer);
  result.textContent = correct ? currentTask.explanation : "Пока неверно. Попробуйте ещё раз.";
  result.className = correct ? "result correct" : "result wrong";
});

document.querySelector("#again-button").addEventListener("click", () => {
  quizScreen.hidden = true;
  startScreen.hidden = false;
});
