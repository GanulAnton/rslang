import './wordBubbles.css'

export default function WordBubbles() {
  let containerRef = null
  let state = {
    level: 0
  }

  const onInit = (anchor) => {
    const container = anchor.append(render())
    addEventListeners()
    return container
  }

  const addEventListeners = () => {
    containerRef.querySelector('.own-game-go-to-play').addEventListener('click', function() {
      mainGame()
    })
  }

  const mainGame = () => {
    let scorePoints = 0
    let allEnteredWords = []
    let res = []
    state = {
      level: containerRef.querySelector('.own-game-hardness').value - 1
    }

    function appendTimeout() {
      const bodyTimer = containerRef.querySelector('#own-game-timer')
      const output = document.createElement('span')
      const tickingDown = containerRef.querySelector('#owngame-audio-tiking-down')
      output.id = 'own-game-output'
      const slider = document.createElement('div')
      slider.id = 'own-game-slider'
      bodyTimer.append(output)
      bodyTimer.append(slider)

      let time = 60,
        fps = 60

      let Timer = function(obj) {
        this.time = obj.time
        this.fps = obj.fps
        this.onEnd = obj.onEnd || null
        this.onStart = obj.onStart || null
        this.onTick = obj.onTick || null

        this.start = () => {
          this.interval = setInterval(this.update, 1000 / this.fps)
          this.onStart ? this.onStart() : void 0
          return this
        }
        this.stop = () => {
          clearInterval(this.interval)
          this.onEnd ? this.onEnd() : void 0
        }
        this.update = () => {
          this.time > 0 ? this.time -= 1 / this.fps : this.stop()
          this.onTick ? this.onTick() : void 0
          return this.get()
        }
        this.get = (par) => {
          switch (par) {
            case undefined:
              return this.time
            case 'dig':
              return Math.ceil(this.time)
            case 'end':
              return this.onEnd()
          }
        }
      }

      let timer1 = new Timer({
        time: time,
        fps: fps,
        onTick: tick,
        onEnd: endTimer,
        onStart: onTimerStart
      })

      function onTimerStart() {
        tickingDown.play()
      }

      function endTimer() {
        gameResults()
      }

      timer1.start()
      requestAnimationFrame(tick)

      function tick() {
        output.innerHTML = timer1.get('dig')
        slider.style.width = timer1.get() / time * 100 + '%'
      }
    }


    function mainGame() {
      const firstLettersInRender = containerRef.querySelector('.own-game-first-letters')
      const getWords = async () => {
        const url = `https://afternoon-falls-25894.herokuapp.com/words?page=${Math.floor(Math.random() * 29)}&group=${state.level}`
        const res = await fetch(url)
        const json = await res.json()
        let randomIndex = Math.floor(Math.random() * 19)
        firstLettersInRender.innerText = `${json[randomIndex].word.substring(0,2)}`
        state = {
          firstLetters: `${json[randomIndex].word.substring(0, 2)}`
        }
      }
      const gameScore = containerRef.querySelector('#own-game-score-wrapper')
      const addGameScore = containerRef.querySelector('#own-game-score')
      const gameScorePoints = document.createElement('p')

      gameScorePoints.classList.add('own-game-score-points')

      form.addEventListener('submit', (e) => {
        e.preventDefault()

        if (e.submitter.classList.contains('own-game-game-enter')) {
          let checkMeWord = state.firstLetters + input.value
          let userWord = checkMeWord.replace(/ +/g, '').trim().toLowerCase()

          function checkIsCorrect() {
            const xhr = new XMLHttpRequest()
            xhr.onreadystatechange = function() {
              if (this.readyState === 4) {
                if (xhr.status === 200) {
                  let data = JSON.parse(xhr.responseText)
                  if (data.length) {
                    wordIsNotCorrect()
                  } else {
                    allEnteredWords.push(userWord)
                    wordIsCorrect()
                  }
                } else {
                  console.log(xhr.status)
                }
              }
            }
            xhr.open('GET', 'http://speller.yandex.net/services/spellservice.json/checkText?options=7&text=' + userWord)
            xhr.send()
          }


          function wordIsCorrect() {
            for (let i = 0; i < allEnteredWords.length; i++) {
              if (!res.includes(allEnteredWords[i])) {
                res.push(allEnteredWords[i])
                audioRightAnswer.play()
                gameInput.value = ''
                if (allEnteredWords[i].length <= 4) {
                  scorePoints += 20
                  infoScorePoints(20)
                } else if (allEnteredWords[i].length === 5 || allEnteredWords[i].length === 6) {
                  scorePoints += 40
                  infoScorePoints(40)
                } else if (allEnteredWords[i].length === 7 || allEnteredWords[i].length === 8) {
                  scorePoints += 60
                  infoScorePoints(60)
                } else if (allEnteredWords[i].length === 9 || allEnteredWords[i].length === 10) {
                  scorePoints += 80
                  infoScorePoints(80)
                } else {
                  scorePoints += 100
                  infoScorePoints(100)
                }
                gameScore.innerHTML = `${scorePoints}`
              }
            }
          }

          function wordIsNotCorrect() {
            audioWrongAnswer.play()
          }

          function infoScorePoints(number) {
            gameScorePoints.innerText = `+${number}`
            addGameScore.append(gameScorePoints)
          }

          checkIsCorrect()
        }
      })
      getWords().then(() => {
        if (state.error) {
          console.log("Произошла ошибка, связанная с Backend'ом таска RS Lang.")
        }
      })
    }

    function gameResults() {
      containerRef.innerHTML = `
          <div class="own-game-ending-container">
            <div class="own-game-modal-window-ending">
              <h1 id="own-game__result-h1">Results</h1>
              <h2 id="own-game__result-is"></h2>
              <section id="own-game__previous-results">
                <h3 id="own-game__result-tryings"></h3>
                <h3 id="own-game__result-maxscore"></h3>
              </section>
              <audio id="owngame-audio-game-ending" src="https://res.cloudinary.com/meta-modern/video/upload/v1593942147/kessidi-dzyn_mp3cut.net_1_1_a3bme0.mp3"></audio>
            </div>
          </div>
      `

      const resultIs = containerRef.querySelector('#own-game__result-is')
      const bodyTimer = containerRef.querySelector('.own-game-modal-window-ending')
      const gameEndingAudio = containerRef.querySelector('#owngame-audio-game-ending')
      const amountOfTryings = containerRef.querySelector('#own-game__result-tryings')
      const maxScoreRender = containerRef.querySelector('#own-game__result-maxscore')
      const output = document.createElement('span')
      const slider = document.createElement('div')

      output.id = 'own-game-output'
      slider.id = 'own-game-slider'

      bodyTimer.append(output)
      bodyTimer.append(slider)
      gameEndingAudio.play()

      resultIs.innerHTML = `Ваш результат: ${scorePoints} баллов`
      output.style.display = 'none'
      slider.style.display = 'none'

      let amount = localStorage.getItem('Word Bubbles Score')

      if (scorePoints > amount) {
        localStorage.setItem('Word Bubbles Score', scorePoints)
        maxScoreRender.innerHTML = `Наилучший результат: ${scorePoints}`
      } else {
        maxScoreRender.innerHTML = `Наилучший результат: ${amount}`
      }

      let amountOfTrying = localStorage.getItem('Word Bubbles Tryings')
      amountOfTrying++
      localStorage.setItem('Word Bubbles Tryings', amountOfTrying)
      amountOfTryings.innerHTML = `Количество попыток: ${amountOfTrying}`
    }

    containerRef.innerHTML = `
        <div class="own-game-main-container">
          <div class="own-game-game-wrapper">
            <div id="own-game-timer"></div>
            <div id="own-game-score">
              <h4 id="own-game-score-wrapper"></h4>
            </div>
            <form class="own-game-input-place">
              <h4 class="own-game-first-letters"></h4>
              <input class="own-game-game-input" type="text" autofocus spellcheck="false">
              <button class="own-game-game-enter">Enter</button>
            </form>
            <audio id="owngame-audio-tiking-down" src="https://res.cloudinary.com/meta-modern/video/upload/v1593935234/55_smy6vv.mp3"></audio>
            <audio id="owngame-audio-right-answer" src="https://res.cloudinary.com/meta-modern/video/upload/v1593953407/rightAnswerBubble_du1wub.mp3"></audio>
            <audio id="owngame-audio-wrong-answer" src="https://res.cloudinary.com/meta-modern/video/upload/v1593953406/wrongAnswerBubble_zmnjrn.mp3"></audio>
          </div>
        </div>
    `
    const container = containerRef.querySelector('.own-game-main-container')
    const input = containerRef.querySelector('input')
    const gameInput = containerRef.querySelector('.own-game-game-input')
    const form = containerRef.querySelector('.own-game-input-place')
    const audioRightAnswer = containerRef.querySelector('#owngame-audio-right-answer')
    const audioWrongAnswer = containerRef.querySelector('#owngame-audio-wrong-answer')

    container.style.backgroundImage = 'url(\'../../assets/img/wordbubbles/ownGame-gameBackground-3.png\')'
    // container.style.height = '100vh'

    mainGame()
    appendTimeout()

    input.addEventListener('keyup', function() {
      this.value = this.value.replace(/[^A-Za-z]/g, '')
    })
  }

  const render = () => {
    const mainWb = document.createElement('main')
    const container = document.createElement('div')
    const wrapper = document.createElement('div')
    const form = document.createElement('form')
    const controlPanel = document.createElement('div')
    const btnHowToPlay = document.createElement('button')
    const btnGoToPlay = document.createElement('button')
    const centeredBlock = document.createElement('div')
    const nameGame = document.createElement('h1')
    const description = document.createElement('p')
    const levelOfHardness = document.createElement('section')
    const labelForLevel = document.createElement('label')
    const selectForLevel = document.createElement('select')
    const sectionHowToPlay = document.createElement('section')
    const tooltipHowToPlayFirst = document.createElement('h5')
    const tooltipHowToPlaySecond = document.createElement('h5')
    const tooltipHowToPlayThird = document.createElement('h5')

    container.classList.add('own-game-main-container')
    centeredBlock.classList.add('own-game-centered-block')
    wrapper.classList.add('own-game-main-wrapper')
    controlPanel.classList.add('own-game-btn-wrapper')
    btnHowToPlay.type = 'submit'
    btnHowToPlay.classList.add('own-game-btn')
    btnHowToPlay.classList.add('own-game-how-to-play')
    btnHowToPlay.innerText = '?'
    btnGoToPlay.type = 'submit'
    btnGoToPlay.classList.add('own-game-btn')
    btnGoToPlay.classList.add('own-game-go-to-play')
    btnGoToPlay.innerText = 'Play'
    nameGame.classList.add('own-game-name-game')
    nameGame.innerText = 'Word Bubbles'
    description.classList.add('own-game-description')
    description.innerText = 'The ability to rapidly retrieve words from your mental vocabulary.'
    levelOfHardness.classList.add('own-game-level-hard')
    labelForLevel.setAttribute('for', 'own-game-hardness')
    labelForLevel.innerText = 'Select the difficulty level: '
    labelForLevel.classList.add('own-game-label-hardness')
    selectForLevel.classList.add('own-game-hardness')
    selectForLevel.innerHTML = `
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
    <option value="4">4</option>
    <option value="5">5</option>
    <option value="6">6</option>
    `
    sectionHowToPlay.classList.add('own-game-tooltip-points-wrapper')
    tooltipHowToPlayFirst.classList.add('own-game-tooltip-points')
    tooltipHowToPlaySecond.classList.add('own-game-tooltip-points')
    tooltipHowToPlayThird.classList.add('own-game-tooltip-points')
    tooltipHowToPlayFirst.innerText = '1. In this game, you will type as many words as you can.'
    tooltipHowToPlaySecond.innerText = '2. Each word must start with the letters in the box.'
    tooltipHowToPlayThird.innerText = '3. Long words are worth more than short words.'

    mainWb.append(container)
    container.append(wrapper)
    wrapper.append(centeredBlock)
    centeredBlock.append(nameGame)
    centeredBlock.append(description)
    wrapper.append(form)
    form.append(controlPanel)
    controlPanel.append(btnGoToPlay)
    wrapper.append(levelOfHardness)
    levelOfHardness.append(labelForLevel)
    levelOfHardness.append(selectForLevel)
    wrapper.append(sectionHowToPlay)
    sectionHowToPlay.append(tooltipHowToPlayFirst)
    sectionHowToPlay.append(tooltipHowToPlaySecond)
    sectionHowToPlay.append(tooltipHowToPlayThird)

    containerRef = mainWb

    return mainWb
  }
  return {
    onInit
  }
}