if (localStorage.getItem('world') == null) {
  getReponse()
}

const options = {}

localStorage.setItem('quiz-options', '')

document.getElementById('confirm-btn').onclick = prepareQuiztypeSelect

function prepareQuiztypeSelect() {
  document.body.innerHTML = ''

  document.body.insertAdjacentHTML(
    'afterbegin',
    `<div class="form-box">
        <label for="quiz-type">Select type of quiz</label>
        <select id="quiz-type">
          <option value="capital">Country by capital</option>
          <option value="flag">Country by flag</option>
          <option value="coatOfArms">Country by coat of arms</option>
        </select>
        <button id="confirm-btn">OK</button>
      </div>`
  )

  document.getElementById('confirm-btn').addEventListener('click', () => {
    options.quizType = document.getElementById('quiz-type').value
    prepareContinentSelect()
  })
}

function prepareContinentSelect() {
  document.body.innerHTML = ''

  document.body.insertAdjacentHTML(
    'afterbegin',
    `<div class="form-box">
      <label for="continent">Select continent</label>
      <select id="continent">
        <option value="world">Whole world</option>
        <option value="europe">Europe</option>
        <option value="asia">Asia</option>
        <option value="africa">Africa</option>
        <option value="america">America</option>
        <option value="oceania">Oceania</option>
      </select>
      <button id="confirm-btn">OK</button>
    </div>`
  )

  document.getElementById('confirm-btn').addEventListener('click', () => {
    options.continent = document.getElementById('continent').value
    prepareNumberOfQuestionsSelect(options.continent)
  })
}

function prepareNumberOfQuestionsSelect(continent) {
  const maxCountries = {
    world: 193,
    europe: 45,
    asia: 46,
    africa: 53,
    america: 35,
    oceania: 14
  }

  document.body.innerHTML = ''

  document.body.insertAdjacentHTML(
    'afterbegin',
    `<div class="form-box">
    <label for="question-number">Select number of questions</label>
    <p id="slider-value"></p>    
    <input type="range" id="slider" min="5" max="${maxCountries[continent]}">
    <button id="confirm-btn">OK</button>
  </div>`
  )
  const slider = document.getElementById('slider')
  const sliderValue = document.getElementById('slider-value')
  sliderValue.textContent = slider.value
  slider.addEventListener('input', () => {
    sliderValue.textContent = slider.value
  })

  document.getElementById('confirm-btn').addEventListener('click', () => {
    options.numberOfQuestions = document.getElementById('slider').value
    prepareQuizDifficultySelect()
  })
}

function prepareQuizDifficultySelect() {
  document.body.innerHTML = ''

  document.body.insertAdjacentHTML(
    'afterbegin',
    `<div class="form-box">
        <label for="quiz-diff">Select quiz difficulty</label>
        <select id="quiz-diff">
          <option value="normal ">Normal (No timer)</option>
          <option value="normal true">Normal (With timer)</option>

          <option value="hard ">Hard (No timer)</option>
          <option value="hard ture">Hard (With timer)</option>
        </select>
        <button id="confirm-btn">OK</button>
      </div>`
  )

  document.getElementById('confirm-btn').addEventListener('click', () => {
    options.quizDiff = document.getElementById('quiz-diff').value.split(' ')[0]
    options.timer = Boolean(document.getElementById('quiz-diff').value.split(' ')[1])
    localStorage.setItem('quiz-options', JSON.stringify(options))
    window.location.href = './quiz.html'
    // console.log(options)
  })
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