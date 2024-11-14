let questionsData = [];
let currentQuestionIndex = 0;
let userAnswers = []; // Array to store the user's answers
const questionsPerSession = 10; // Define how many questions per session
let sessionQuestions = [];
let selectedOption = null; // Initialize selectedOption variable
const questionNO = document.getElementById("QuestionNo");
const mobile_questionNO = document.getElementById("mobile-QuestionNo");
const totalquestion = document.getElementById("totalQuestions");
const mobile_totalquestion = document.getElementById("mobile-totalQuestions");
const course_name = document.getElementById("course_name");

const selectedText = localStorage.getItem("selectedText");

if (selectedText) {
  let url = "";
  if (selectedText == "Tally Prime") {
    course_name.innerText = selectedText;
    url = "../001_tally_prime/tally_questions.json";
  } else if (selectedText == "C programming") {
    course_name.innerText = selectedText;
    url = "../004_c_prog/c_questions.json";
  } else if (selectedText == "Photoshop") {
    course_name.innerText = selectedText;
    url = "../006_photoshop/photoshop_questions.json";
  } else if (selectedText == "Graphics Design") {
    course_name.innerText = selectedText;
    url = "../003_graphic_design/Graphics_questions.json";
  } else {
    alert("Course not recognized. Please select a valid course.");
  }

  // Fetch the JSON file
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      questionsData = data;
      fetchSessionsAndRender(); // Fetch sessions after questions are loaded
    })
    .catch((error) => {
      console.error("Error loading JSON:", error);
    });
} else {
  alert("No course selected. Please go back and select a course.");
}

// Fetch sessions and render dropdown
function fetchSessionsAndRender() {
  fetch("../001_tally_prime/tally_sessions.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const sessionsData = data;
      const sessionsList = document.getElementById("sessions-list");

      const secoundlastindex = sessionsData.length - 2;

      sessionsData.forEach((session, index) => {
        const listItem = document.createElement("li");

        // Create unique IDs for button and dropdown for accessibility
        const buttonId = `dropdown-button-${index}`;
        const dropdownId = `dropdown-pages-${index}`;

        listItem.innerHTML = `
        <button id="${buttonId}" type="button" class="group flex w-full items-center rounded-md bg-white px-2 py-4  text-base font-normal text-gray-900 shadow-2xl transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
          aria-controls="${dropdownId}" aria-expanded="false">
          <span class="ml-3 flex-1 text-xl whitespace-nowrap text-wrap text-left">${session.aggregationName}</span>
        </button>
        <!-- Dropdown initially hidden -->
        <ul id="${dropdownId}" class="hidden space-y-2 rounded-b-md bg-gray-200">
          <li>
            <a href="#" class="group flex w-full items-center rounded-lg px-2 py-4 pl-10 text-lg font-normal text-green-600 transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Take-A-Challenge</a>
          </li>
        </ul>
      `;

        sessionsList.appendChild(listItem);

        // Add event listener for toggling the dropdown
        const dropdownButton = document.getElementById(buttonId);
        const dropdownMenu = document.getElementById(dropdownId);

        dropdownButton.addEventListener("click", function () {
          // Close all open dropdowns
          document
            .querySelectorAll('ul[id^="dropdown-pages"]')
            .forEach((ul) => {
              ul.classList.add("hidden"); // Hide all dropdowns
            });

          // Toggle current dropdown
          const isExpanded = dropdownMenu.classList.contains("hidden");
          dropdownMenu.classList.toggle("hidden", !isExpanded);
          dropdownButton.setAttribute("aria-expanded", isExpanded);
        });

        // Automatically open the first session
        if (index === 0) {
          dropdownMenu.classList.remove("hidden"); // Open first dropdown
          dropdownButton.setAttribute("aria-expanded", true);
          loadQuestionsForSession(index, secoundlastindex);
          closeSidebar();
        }

        listItem.querySelector("a").addEventListener("click", function () {
          loadQuestionsForSession(index, secoundlastindex);
          closeSidebar();
        });
      });
    })
    .catch((error) => console.error("Error loading JSON:", error));
}

// Load questions based on the session range
function loadQuestionsForSession(sessionIndex, secoundlastindex) {
  if (sessionIndex == secoundlastindex) {
    sessionQuestions = questionsData;
  } else {
    const start = sessionIndex * questionsPerSession;
    const end = start + questionsPerSession;
    sessionQuestions = questionsData.slice(start, end);
  }

  totalquestion.textContent = sessionQuestions.length;
  mobile_totalquestion.textContent = sessionQuestions.length;

  console.log(totalquestion.textContent);

  if (sessionQuestions.length > 0) {
    currentQuestionIndex = 0; // Reset to the first question of the session
    renderQuestion(sessionQuestions);
  } else {
    alert("No questions available for this session!");
    document.getElementById("question-text").innerText = "";
    document.getElementById("options-list").innerHTML = "";
    document.getElementById("QuestionNo").value = "";
    document.getElementById("mobile_questionNO").value = "";
    document.getElementById("next-button").disabled = true;
    document.getElementById("mobile-next-button").disabled = true;
    document.getElementById("prev-button").disabled = true;
    document.getElementById("mobile-prev-button").disabled = true;
  }
}

// Render the questions from a specific session
function renderQuestion(sessionQuestions) {
  if (sessionQuestions.length === 0) return;

  const questionText = document.getElementById("question-text");
  const optionsList = document.getElementById("options-list");

  optionsList.innerHTML = "";

  const questionData = sessionQuestions[currentQuestionIndex];
  questionText.innerText = questionData.questionDisplayText;

  questionData.options.forEach((option) => {
    const optionItem = document.createElement("li");
    optionItem.classList.add(
      "flex",
      "items-center",
      "rounded-md",
      "border",
      "border-gray-200",
      "ps-4",
      "hover:shadow-xl"
    );

    const radioInput = document.createElement("input");
    radioInput.type = "radio";
    radioInput.name = "bordered-radio";
    radioInput.value = option.optionId;
    radioInput.id = `option-${option.optionId}`;
    radioInput.classList.add(
      "sm:h-6",
      "sm:w-6",
      "h-3",
      "w-3",
      "border-gray-300",
      "bg-gray-100"
    );

    const label = document.createElement("label");
    label.setAttribute("for", `option-${option.optionId}`);
    label.classList.add(
      "ms-2",
      "w-full",
      "py-3",
      "lg:py-4",
      "sm:text-xl",
      "text-base",
      "font-medium",
      "text-gray-900"
    );
    label.innerText = option.optionText;

    optionItem.appendChild(radioInput);
    optionItem.appendChild(label);

    optionsList.appendChild(optionItem);

    radioInput.addEventListener("change", function () {
      selectedOption = {
        optionId: radioInput.value,
        optionText: label.innerText,
      };
    });
  });

  // Update the question number display
  questionNO.value = currentQuestionIndex + 1;
  mobile_questionNO.value = currentQuestionIndex + 1;

  // Update button states
  handleButtons();
}

document.getElementById("prev-button").addEventListener("click", function () {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderQuestion(sessionQuestions);
  }
});

document
  .getElementById("mobile-prev-button")
  .addEventListener("click", function () {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      renderQuestion(sessionQuestions);
    }
  });

document.getElementById("next-button").addEventListener("click", function () {
  const totalQuestionsInSession = sessionQuestions.length;

  // Check if there are more questions in the session
  if (currentQuestionIndex < totalQuestionsInSession - 1) {
    currentQuestionIndex++;
    renderQuestion(sessionQuestions);
  } else {
    alert("No more questions in this session!");
    document.getElementById("next-button").disabled = true;
  }
});

document
  .getElementById("mobile-next-button")
  .addEventListener("click", function () {
    const totalQuestionsInSession = sessionQuestions.length;

    // Check if there are more questions in the session
    if (currentQuestionIndex < totalQuestionsInSession - 1) {
      currentQuestionIndex++;
      renderQuestion(sessionQuestions);
    } else {
      alert("No more questions in this session!");
      document.getElementById("-mobile-next-button").disabled = true;
    }
  });

// Event listener for the desktop input (already present)
questionNO.addEventListener("input", handleInputChange);

// Add an event listener for the mobile input field
const mobileQuestionNO = document.getElementById("mobile-QuestionNo");
mobileQuestionNO.addEventListener("input", handleMobileInputChange);

// Function to handle the desktop input change
function handleInputChange() {
  const totalQuestionsInSession = sessionQuestions.length;
  const questionNumber = parseInt(questionNO.value, 10);

  if (
    isNaN(questionNumber) ||
    questionNumber < 1 ||
    questionNumber > totalQuestionsInSession
  ) {
    alert(
      `Enter a valid question number between 1 and ${totalQuestionsInSession}`
    );
    return;
  }

  currentQuestionIndex = questionNumber - 1;
  renderQuestion(sessionQuestions);
}

// Function to handle the mobile input change (newly added)
function handleMobileInputChange() {
  const totalQuestionsInSession = sessionQuestions.length;
  const questionNumber = parseInt(mobileQuestionNO.value, 10);

  if (
    isNaN(questionNumber) ||
    questionNumber < 1 ||
    questionNumber > totalQuestionsInSession
  ) {
    alert(
      `Enter a valid question number between 1 and ${totalQuestionsInSession}`
    );
    return;
  }

  currentQuestionIndex = questionNumber - 1;
  renderQuestion(sessionQuestions);
}

// Check if there's a next question and disable the next button accordingly
function handleButtons() {
  const totalQuestionsInSession = sessionQuestions.length;

  // Disable "Next" button if it's the last question in the current session
  if (currentQuestionIndex >= totalQuestionsInSession - 1) {
    document.getElementById("next-button").disabled = true;
    document.getElementById("mobile-next-button").disabled = true;
  } else {
    document.getElementById("next-button").disabled = false;
    document.getElementById("mobile-next-button").disabled = false;
  }

  // Disable "Previous" button if it's the first question
  if (currentQuestionIndex <= 0) {
    document.getElementById("prev-button").disabled = true;
    document.getElementById("mobile-prev-button").disabled = true;
  } else {
    document.getElementById("prev-button").disabled = false;
    document.getElementById("mobile-prev-button").disabled = false;
  }
}

document.getElementById("submit-btn").addEventListener("click", submitAnswer);
document
  .getElementById("mobile-submit-btn")
  .addEventListener("click", submitAnswer);

function submitAnswer() {
  if (selectedOption) {
    checkAnswer(sessionQuestions[currentQuestionIndex], selectedOption);
    selectedOption = null;
  } else {
    alert("Please select an option before submitting!");
  }
}

function checkAnswer(questionData, selectedOption) {
  const optionsList = document.getElementById("options-list");
  const allOptions = optionsList.querySelectorAll("li");

  allOptions.forEach((optionItem) => {
    const radioInput = optionItem.querySelector("input");
    const label = optionItem.querySelector("label");

    optionItem.classList.remove("bg-green-500", "bg-red-500", "text-white");

    if (radioInput.value === selectedOption.optionId) {
      if (radioInput.value === questionData.answer) {
        optionItem.classList.add("bg-green-500", "text-white");
        Swal.fire("Correct answer", "", "success");
        confetti({
          particleCount: 200,
          spread: 180,
          origin: { y: -0.1 },
          startVelocity: -35,
          gravity: 0.5,
          drift: 0,
          colors: ["#ff5733", "#33ff57", "#3357ff", "#f1c40f"], // Customize colors
        });
      } else {
        optionItem.classList.add("bg-red-500", "text-white");
      }
    }
    if (
      radioInput.value === questionData.answer &&
      radioInput.value !== selectedOption.optionId
    ) {
      optionItem.classList.add("bg-green-500", "text-white");
    }
  });
}

// Corrected event listener
document.getElementById("toggleButton").addEventListener("click", function () {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("hidden"); // Toggle visibility of the sidebar
  sidebar.classList.toggle("flex");
});

// Close sidebar when an option is clicked
function closeSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.add("hidden"); // Hide the sidebar
  sidebar.classList.remove("flex");
}
