import './ownGame.css'

export const WordBubbles = () => {
  let userChoice = null

  const onInit = (anchor) => {
    const container = anchor.append(render())
    addEventListeners()
    return container
  }

  const addEventListeners = () => {
    userChoice.addEventListener('submit', (e) => {
      e.preventDefault()

      if (e.submitter.classList.contains('own-game-how-to-play')) {
        helpMe()
      }

      if (e.submitter.classList.contains('own-game-go-to-play')) {
        mainGame()
      }
    })
  }

  const helpMe = () => {
    document.querySelector('#app').innerHTML = `
      <div class="own-game-main-container">
        <div class="own-game-modal-window">
          <form id="own-game-modal-window-header">
            <h1 id="own-game-how-to-play">How to play?</h1>
            <button class="own-game-close-icon"></button>
          </form>
          <div id="own-game-tooltip-points-wrapper">
            <div class="own-game-tooltip-points-column">
              <h5 class="own-game-tooltip-points">1. In this game, you'll type as many words as you can.</h5>
              <img class="own-game-tooltip-img" id="typing-keyboard" src="https://res.cloudinary.com/meta-modern/image/upload/v1593893842/ownGame-keyboard_dqrgxf.jpg" alt="keyboard">
            </div>
            <div class="own-game-tooltip-points-column">
              <h5 class="own-game-tooltip-points">2. Each word must start with the letters in the box.</h5>
              <img class="own-game-tooltip-img" src="https://res.cloudinary.com/meta-modern/image/upload/v1593893842/ownGame-keyboard-with-letters_ggnnsg.jpg" alt="keyboard-with-letters">
            </div>
            <div class="own-game-tooltip-points-column">
              <h5 class="own-game-tooltip-points">3. Long words are worth more than short words.</h5>
              <img class="own-game-tooltip-img" src="https://res.cloudinary.com/meta-modern/image/upload/v1593975794/ownGame-score_i5cl3n.png" alt="long-words">
            </div>
          </div>
        </div>
      </div>
      `
    document.querySelector('.own-game-main-container').style.backgroundImage = 'url(\'../../assets/img/ownGame-startBackground-38.png\')'
  }

  const mainGame = () => {
    let scorePoints = 0
    let arr = []
    let res = []
    function appendTimeoutWhole() {
      const bodyTimer = document.querySelector('#own-game-timer')
      const output = document.createElement('span')
      const tikingDown = document.querySelector('#owngame-audio-tiking-down')
      const gameEndingAudio = document.querySelector('#owngame-audio-game-ending')
      output.id = 'own-game-output'
      const slider = document.createElement('div')
      slider.id = 'own-game-slider'
      bodyTimer.append(output)
      bodyTimer.append(slider)

      let time = 60,
        fps = 60

      let Timer = function (obj) {
        this.time = obj.time
        this.fps = obj.fps
        this.onEnd = obj.onEnd || null
        this.onStart = obj.onStart || null
        this.onTick = obj.onTick || null
        this.intervalID = null

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
              break
            case 'dig':
              return Math.ceil(this.time)
              break
            case 'end':
              return this.onEnd()
              break
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
        tikingDown.play()
      }

      function endTimer() {
        gameEndingResults()
      }

      timer1.start()
      requestAnimationFrame(tick)

      function tick() {
        id('own-game-output').innerHTML = timer1.get('dig')
        id('own-game-slider').style.width = timer1.get() / time * 100 + '%'
      }

      function id(id) {
        return document.getElementById(id)
      }
    }

    function mainGame() {
      const firstLetters = [
        're', 'po', 'fa', 'bo', 'st', 'mo', 'su', 'of', 'as', 'co', 'di', 'in', 'al', 'an', 'au', 'ba', 'bu',
        'un', 'ma', 'no', 'ob', 'po', 'qu', 'ra', 'ri', 'sa', 'sc', 'su', 'ta', 'ca', 'cl', 'co', 'cr', 'de',
        'dr', 'fo', 'gr', 'ha', 'he', 'il', 'mi', 'li', 'wi', 'mi', 'pr', 'ch', 'li', 'fr', 'tr', 'un', 'ea'
      ]
      const firstLettersInRender = document.querySelector('.own-game-first-letters')
      const gameScore = document.querySelector('#own-game-score-wrapper')
      const addGameScore = document.querySelector('#own-game-score')
      const gameScorePoints = document.createElement('p')
      let firstLettersGlobal = `${firstLetters[Math.floor(Math.random() * 51)]}`

      gameScorePoints.classList.add('own-game-score-points')
      firstLettersInRender.innerText = firstLettersGlobal
      

      form.addEventListener('submit', (e) => {
        e.preventDefault()

        if (e.submitter.classList.contains('own-game-game-enter')) {
          let checkMeWord = firstLettersGlobal + input.value
          let userWord = checkMeWord.replace(/ +/g, '').trim().toLowerCase();

          function checkIsCorrect() {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
              if (this.readyState == 4) {
                if (xhr.status == 200) {
                  let data = JSON.parse(xhr.responseText)
                  if (data.length) {
                    wordIsNotCorrect()
                  } else {
                    arr.push(userWord)
                    wordIsCorrect()
                  }
                } else {
                  console.log(xhr.status);
                }
              }
            }
            xhr.open("GET", "http://speller.yandex.net/services/spellservice.json/checkText?options=7&text=" + userWord);
            xhr.send();
          }
          

          function wordIsCorrect() {
            for (let i = 0; i < arr.length; i++) {
              if (!res.includes(arr[i])) {
                res.push(arr[i])
                audioRightAnswer.play()
                gameInput.value=''
                if (arr[i].length <= 4) {
                  scorePoints += 20
                  infoScorePoints(20)
                }
                else if (arr[i].length == 5 || arr[i].length == 6) {
                  scorePoints += 40
                  infoScorePoints(40)
                }
                else if (arr[i].length == 7 || arr[i].length == 8) {
                  scorePoints += 60
                  infoScorePoints(60)
                }
                else if (arr[i].length == 9 || arr[i].length == 10) {
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
    }

    function gameEndingResults() {
      document.querySelector('#app').innerHTML = `
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
      const resultIs = document.querySelector('#own-game__result-is')
      const bodyTimer = document.querySelector('.own-game-modal-window-ending')
      const gameEndingAudio = document.querySelector('#owngame-audio-game-ending')
      const amountOfTryings = document.querySelector('#own-game__result-tryings')
      const maxScoreRender = document.querySelector('#own-game__result-maxscore')
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

    document.querySelector('#app').innerHTML = `
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
    const container = document.querySelector('.own-game-main-container')
    const input = document.querySelector('input')
    const gameInput = document.querySelector('.own-game-game-input')
    const form = document.querySelector('.own-game-input-place')
    const audioRightAnswer = document.querySelector('#owngame-audio-right-answer')
    const audioWrongAnswer = document.querySelector('#owngame-audio-wrong-answer')

    container.style.backgroundImage = 'url(\'../../assets/img/ownGame-gameBackground-3.png\')'
    container.style.height = '100vh'

    mainGame()
    appendTimeoutWhole()

    input.addEventListener('keyup', function () {
      this.value = this.value.replace(/[^A-Za-z]/g, '');
    });
  }

  const render = () => {
    const container = document.createElement('div')
    const wrapper = document.createElement('div')
    const form = document.createElement('form')
    const controlPanel = document.createElement('div')
    const btnHowToPlay = document.createElement('button')
    const btnGoToPlay = document.createElement('button')
    const centeredBlock = document.createElement('div')
    const nameGame = document.createElement('h1')
    const description = document.createElement('p')

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

    container.append(wrapper)
    wrapper.append(centeredBlock)
    centeredBlock.append(nameGame)
    centeredBlock.append(description)
    wrapper.append(form)
    form.append(controlPanel)
    controlPanel.append(btnHowToPlay)
    controlPanel.append(btnGoToPlay)

    userChoice = form
    return container
  }
  return {
    onInit
  }
}