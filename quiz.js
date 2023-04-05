import startConfetti from "./confetti.js"

const options = JSON.parse(localStorage.getItem('quiz-options'))

checkLocalStorage()

const questionArray = createQuestionsArray(options)

renderPage(options)

if (options.timer) {
  setTimer(options)
}

let currentQuestionIndex = 0

showQuestion(currentQuestionIndex, options)

let correctAnswers = 0

// <<<<<<<<<<<<<<FUNCTIONS>>>>>>>>>>>>>>>

function checkLocalStorage() {
  if (!localStorage.getItem('world')) {
    getReponse()
  } else {
    return
  }
}

async function getReponse() {
  let response = await fetch('https://restcountries.com/v3.1/all')
  let countries = await response.json()
  const unMembers = []
  const europe = []
  const asia = []
  const africa = []
  const america = []
  const oceania = []
  for (let country of countries) {
    if (country.unMember) {
      unMembers.push(country)
      switch (country.region) {
        case 'Europe': europe.push(country)
          break
        case 'Asia': asia.push(country)
          break
        case 'Asia': asia.push(country)
          break
        case 'Americas': america.push(country)
          break
        case 'Africa': africa.push(country)
          break
        case 'Oceania': oceania.push(country)
          break
      }
    }
  }
  localStorage.setItem('world', JSON.stringify(unMembers))
  localStorage.setItem('europe', JSON.stringify(europe))
  localStorage.setItem('asia', JSON.stringify(asia))
  localStorage.setItem('africa', JSON.stringify(africa))
  localStorage.setItem('america', JSON.stringify(america))
  localStorage.setItem('oceania', JSON.stringify(oceania))
}

function Question(item, answer) {
  this.questionItem = item
  this.answer = answer
  this.variants = [answer]
}

function createQuestionsArray(options) {
  const continent = JSON.parse(localStorage.getItem(options.continent))
  const coutriesForQuiz = []
  while (coutriesForQuiz.length < options.numberOfQuestions) {
    let random = Math.floor(Math.random() * continent.length)
    if (!coutriesForQuiz.includes(continent[random])) {
      coutriesForQuiz.push(continent[random])
    }
  }
  // console.log(coutriesForQuiz)

  const questions = []
  for (let country of coutriesForQuiz) {
    switch (options.quizType) {
      case 'capital':
        questions.push(new Question(country.capital[0], country.name.common))
        break;
      case 'flag':
        questions.push(new Question(country.flags.svg, country.name.common))
        break;
      case 'coatOfArms':
        if (Object.keys(country.coatOfArms).length != 0) {
          questions.push(new Question(country.coatOfArms.svg, country.name.common))
        }
        break;
    }
  }

  if (options.quizDiff == 'hard') {
    return questions
  }

  for (const question of questions) {
    while (question.variants.length < 4) {
      let random = Math.floor(Math.random() * continent.length)
      if (!question.variants.includes(continent[random].name.common))
        question.variants.push(continent[random].name.common)
    }
    // Shuffle variants
    question.variants.sort(() => Math.random() - 0.5)
  }
  return questions
}

function renderPage(options) {
  document.body.innerHTML = ''
  document.body.style.background = `linear-gradient(to bottom, rgba(245, 245, 250, 0.9), rgba(245, 245, 250, 0.9)), url('./images/${options.continent}.png') no-repeat center center`
  document.body.style.backgroundSize = 'cover'

  if (options.quizDiff == 'normal') {
    if (options.quizType == 'capital') {
      document.body.insertAdjacentHTML(
        'afterbegin',
        `<div id="timer"></div>
        <div class="question-block">
        <p class="question-text"><span id="question-item"></span> is the capital of...</p>        
        <p class="variant"></p>
        <p class="variant"></p>
        <p class="variant"></p>
        <p class="variant"></p>
        </div>`
      )
    }
    if (options.quizType == 'flag') {
      document.body.insertAdjacentHTML(
        'afterbegin',
        `<div id="timer"></div>
        <div class="question-block">
        <p class="question-text">The flag you see belongs to...</p>
        <div id="question-item"><img src="" alt=""></div>
        <p class="variant"></p>
        <p class="variant"></p>
        <p class="variant"></p>
        <p class="variant"></p>
        </div>`
      )
    }
    if (options.quizType == 'coatOfArms') {
      document.body.insertAdjacentHTML(
        'afterbegin',
        `<div id="timer"></div>
        <div class="question-block">
        <p class="question-text">What country does this coat of arms belong to?</p>
        <div id="question-item"><img src="" alt=""></div>
        <p class="variant"></p>
        <p class="variant"></p>
        <p class="variant"></p>
        <p class="variant"></p>
        </div>`
      )
    }
  }

  if (options.quizDiff == 'hard') {
    if (options.quizType == 'capital') {
      document.body.insertAdjacentHTML(
        'afterbegin',
        `<div id="timer"></div>
        <div class="question-block">
        <p class="question-text"><span id="question-item"></span> is the capital of...</p>
        <input type="text" id="user-answer" autocomplete="off">
        <button id="confirm-btn">Confirm</button>
        </div>`
      )
    }
    if (options.quizType == 'flag') {
      document.body.insertAdjacentHTML(
        'afterbegin',
        `<div id="timer"></div>
        <div class="question-block">
        <p class="question-text">The flag you see belongs to...</p>
        <div id="question-item"><img src="" alt=""></div>
        <input type="text" id="user-answer" autocomplete="off">
        <button id="confirm-btn">Confirm</button>
        </div>`
      )
    }
    if (options.quizType == 'coatOfArms') {
      document.body.insertAdjacentHTML(
        'afterbegin',
        `<div id="timer" autocomplete="off"></div>
        <div class="question-block">
        <p class="question-text">What country does this coat of arms belong to?</p>
        <div id="question-item"><img src="" alt=""></div>
        <input type="text" id="user-answer">
        <button id="confirm-btn">Confirm</button>
        </div>`
      )
    }
  }
}

function setTimer(options) {
    const timer = document.getElementById('timer')
    let time = 0
    if (options.quizDiff == 'normal') {
      time = options.numberOfQuestions * 6
    }
    if (options.quizDiff == 'hard') {
      time = options.numberOfQuestions * 10
    }
    const countdown = setInterval(() => {
      time--
      let min = Math.floor(time / 60)
      let sec = time - (Math.floor(time / 60)) * 60
      timer.textContent = `${min}:${sec.toString().padStart(2, '0')}`
      if (time < 10) {
        timer.style.color = 'red'
      }
      if (currentQuestionIndex == options.numberOfQuestions) {
        clearInterval(countdown)
      }
      if (time == 0) {
        clearInterval(countdown)
        timeIsUp()
      }
    }, 1000)
  }

function showQuestion(index, options) {

  const currentQuestion = questionArray[index]
  const questionEl = document.getElementById('question-item')
  if (currentQuestionIndex > questionArray.length - 1) {
    endQuiz()
    return
  }

  if (options.quizType == 'capital') {
    questionEl.innerText = currentQuestion.questionItem
  }

  if (options.quizType == 'flag' || options.quizType == 'coatOfArms') {
    questionEl.firstElementChild.src = currentQuestion.questionItem
  }

  if (options.quizDiff == 'normal') {
    const variantEls = document.querySelectorAll('.variant')
    let correctVarEl

    variantEls.forEach((variantEl, i) => {

      let variantElClone = variantEl.cloneNode(true)
      variantEl.parentNode.replaceChild(variantElClone, variantEl)
      variantElClone.innerText = currentQuestion.variants[i]
      variantElClone.classList.remove('correct', 'wrong')
      if (variantElClone.innerText == currentQuestion.answer) {
        correctVarEl = variantElClone
      }

      function checkAnswer() {
        let selectedVar = this.innerText
        if (selectedVar === currentQuestion.answer) {
          correctAnswers++
          this.classList.add('correct')
        } else {
          this.classList.add('wrong')
        }
        currentQuestionIndex++
        setTimeout(() => correctVarEl.classList.add('correct'), 300)
        setTimeout(() => showQuestion(currentQuestionIndex, options), 1300)
      }
      variantElClone.addEventListener('click', checkAnswer)
    })
  }

  if (options.quizDiff == 'hard') {
    let answerInput = document.getElementById('user-answer')
    let confirmBtn = document.getElementById('confirm-btn')

    let answerInputClone = answerInput.cloneNode(true)
    answerInput.parentNode.replaceChild(answerInputClone, answerInput)
    answerInputClone.classList.remove('correct', 'wrong')
    answerInputClone.value = ''
    answerInputClone.focus()

    let confirmBtnClone = confirmBtn.cloneNode(true)
    confirmBtn.parentNode.replaceChild(confirmBtnClone, confirmBtn)

    function checkAnswer() {
      let selectedVar = answerInputClone.value.toLowerCase()
      if (selectedVar === currentQuestion.answer.toLowerCase()) {
        correctAnswers++
        answerInputClone.classList.add('correct')
      } else {
        answerInputClone.classList.add('wrong')
        setTimeout(() => answerInputClone.value = currentQuestion.answer, 300)
      }
      currentQuestionIndex++
      setTimeout(() => showQuestion(currentQuestionIndex, options), 1300)
    }

    confirmBtnClone.addEventListener('click', checkAnswer)
    answerInputClone.addEventListener('keydown', e => {
      if (e.key === "Enter") {
        checkAnswer()
      }
    })
  }
}

function timeIsUp() {
  document.body.innerHTML = ''
  document.body.insertAdjacentHTML(
    'afterbegin',
    `<div class="question-block">
    <p>Unfortunately time is up...</p>
    <p>Do you want to try again?</p>
    <button id="newquiz-btn">New Quiz</button>
    </div>`
  )
  document.getElementById('newquiz-btn').addEventListener('click', () => {
    window.location.href = './index.html'
  })
}

function endQuiz() {
  document.body.innerHTML = ''
  let userResult = (correctAnswers / questionArray.length) * 100
  if (userResult == 100) {
    startConfetti()
  }
  document.body.insertAdjacentHTML(
    'afterbegin',
    `<div class="question-block">
    <p>The quiz is finished</p>
    <p>You got ${userResult.toFixed(0)}% right answers</p>
    <p>Start new quiz?</p>
    <button id="newquiz-btn">New Quiz</button>
    </div>`
  )

  document.getElementById('newquiz-btn').addEventListener('click', () => {
    window.location.href = './index.html'
  })
}