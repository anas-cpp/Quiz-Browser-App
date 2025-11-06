var firebaseConfig = {
  apiKey: "AIzaSyDBlTMj6_maCqQyC7-2v_bb-tmi__5j9q0",
  authDomain: "quiz-app-11cee.firebaseapp.com",
  databaseURL: "https://quiz-app-11cee-default-rtdb.firebaseio.com/",
  projectId: "quiz-app-11cee",
  storageBucket: "quiz-app-11cee.firebasestorage.app",
  messagingSenderId: "934959690685",
  appId: "1:934959690685:web:5d3e76d3fa081a88b298d4",
};
firebase.initializeApp(firebaseConfig);
var db = firebase.database();

var questions = [
  {
    id: "q1",
    question: "HTML Stands for?",
    option1: "Hyper Text Markup Language",
    option2: "Hyper Tech Markup Language",
    option3: "Hyper Touch Markup Language",
    corrAnswer: "Hyper Text Markup Language",
  },
  {
    id: "q2",
    question: "CSS Stands for",
    option1: "Cascoding Style Sheets",
    option2: "Cascading Style Sheets",
    option3: "Cascating Style Sheets",
    corrAnswer: "Cascading Style Sheets",
  },
  {
    id: "q3",
    question: "Which tag is used for most large heading",
    option1: "<h6>",
    option2: "<h2>",
    option3: "<h1>",
    corrAnswer: "<h1>",
  },
  {
    id: "q4",
    question: "Which tag is used to make element unique ",
    option1: "id",
    option2: "class",
    option3: "label",
    corrAnswer: "id",
  },
  {
    id: "q5",
    question: "Any element assigned with id, can be get in css ",
    option1: "by # tag",
    option2: "by @ tag",
    option3: "by & tag",
    corrAnswer: "by # tag",
  },
  {
    id: "q6",
    question: "CSS can be used with ______ methods ",
    option1: "8",
    option2: "3",
    option3: "4",
    corrAnswer: "3",
  },
  {
    id: "q7",
    question: "In JS variable types are ____________ ",
    option1: "6",
    option2: "3",
    option3: "8",
    corrAnswer: "8",
  },
  {
    id: "q8",
    question: "In array we can use key name and value ",
    option1: "True",
    option2: "False",
    option3: "None of above",
    corrAnswer: "False",
  },
  {
    id: "q9",
    question: "toFixed() is used to define length of decimal ",
    option1: "True",
    option2: "False",
    option3: "None of above",
    corrAnswer: "True",
  },
  {
    id: "q10",
    question: "push() method is used to add element in the start of array ",
    option1: "True",
    option2: "False",
    option3: "None of above",
    corrAnswer: "False",
  },
];

var button = document.getElementById("btn");
var question = document.getElementById("ques");
var option1 = document.getElementById("opt1");
var option2 = document.getElementById("opt2");
var option3 = document.getElementById("opt3");
var index = 0;
var score = 0;
var sec = 59;
var min = 1;
var timerInterval;
var timerElement = document.getElementById("timer");

function startTimer() {
  clearInterval(timerInterval);
  min = 1;
  sec = 59;
  timerElement.innerText = min + ":" + sec;

  timerInterval = setInterval(function () {
    timerElement.innerText = min + ":" + (sec < 10 ? "0" + sec : sec);
    sec--;
    if (sec < 0) {
      min--;
      sec = 59;
    }

    if (min < 0) {
      clearInterval(timerInterval);
      nextQuestion();
    }
  }, 1000);
}

function nextQuestion() {
  var options = document.getElementsByClassName("options");

  for (var i = 0; i < options.length; i++) {
    if (options[i].checked) {
      var selectedOption = options[i].value;
      var prevQ = questions[index - 1];

      if (prevQ) {
        var selectedAnswer = prevQ["option" + selectedOption];
        var correctAnswer = prevQ.corrAnswer;

        var qRef = db.ref("quizApp/attempts/" + prevQ.id);
        qRef.set({
          question: prevQ.question,
          options: {
            option1: prevQ.option1,
            option2: prevQ.option2,
            option3: prevQ.option3,
          },
          correctAnswer: correctAnswer,
          userSelected: selectedAnswer,
          status:
            selectedAnswer === correctAnswer ? "Correct" : "Incorrect",
        });

        if (selectedAnswer === correctAnswer) {
          score++;
        }
      }
    }
    options[i].checked = false;
  }

  button.disabled = true;

  if (index < questions.length) {
    var q = questions[index];
    question.innerText = q.question;
    option1.innerText = q.option1;
    option2.innerText = q.option2;
    option3.innerText = q.option3;
    index++;
    startTimer();
  } else {
    clearInterval(timerInterval);

    db.ref("quizApp/result").set({
      score: score,
      percentage: ((score / questions.length) * 100).toFixed(2) + "%",
      totalQuestions: questions.length,
      date: new Date().toLocaleString(),
    });

    Swal.fire({
      title: "Quiz Finished!",
      text:
        "Your score is " +
        ((score / questions.length) * 100).toFixed(2) +
        "%",
      icon: "success",
    });
  }
}

function clicked() {
  button.disabled = false;
}

window.onload = function () {
  index = 0;
  var q = questions[index];
  question.innerText = q.question;
  option1.innerText = q.option1;
  option2.innerText = q.option2;
  option3.innerText = q.option3;
  index++;
  startTimer();
};
