import './wordBubbles.css'

export default function WordBubbles() {
  let containerRef = null
  let state = {
    level: 0,
    isError: null,
    firstLetters: null,
    userWord: null
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
    containerRef.innerHTML = `
    <div class="own-game-container">
      <div class="own-game-wrong-guesses">Wrong Guesses: <span id='mistakes'>0</span> of <span id='maxWrong'></span></div>
        <div class="text-center">
        <img id='hangmanPic' src="./assets/img/hangman/0.jpg" alt="hangman">
        <p>Guess the Programming Language:</p>
        <p id="wordSpotlight">The word to be guessed goes here</p>
        <div id="keyboard"></div>
      </div>
    </div>
    `
    
    const programming_languages = [
      "python",
      "javascript",
      "mongodb",
      "json",
      "java",
      "html",
      "css",
      "c",
      "csharp",
      "golang",
      "kotlin",
      "php",
      "sql",
      "ruby"
    ]
    
    let answer = '';
    let maxWrong = 6;
    let mistakes = 0;
    let guessed = [];
    let wordStatus = null;
    
    function randomWord() {
      answer = programming_languages[Math.floor(Math.random() * programming_languages.length)];
    }
    
    function generateButtons() {
      let buttonsHTML = 'qwertyuiopasdfghjklzxcvbnm'.split('').map(letter =>
        `
          <button
            class="own-game-btn btn-lg btn-primary m-2"
            id='` + letter + `'
            value="` + letter +`"
          >
            ` + letter + `
          </button>
        `).join('');
    
      document.getElementById('keyboard').innerHTML = buttonsHTML;
    }
    
    function handleGuess(chosenLetter) {
      guessed.indexOf(chosenLetter) === -1 ? guessed.push(chosenLetter) : null;
      document.getElementById(chosenLetter).setAttribute('disabled', true);
    
      if (answer.indexOf(chosenLetter) >= 0) {
        guessedWord();
        checkIfGameWon();
      } else if (answer.indexOf(chosenLetter) === -1) {
        mistakes++;
        updateMistakes();
        checkIfGameLost();
        updateHangmanPicture();
      }
    }

    function updateHangmanPicture() {
      document.getElementById('hangmanPic').src = './assets/img/hangman/' + mistakes + '.jpg';
    }
    
    function checkIfGameWon() {
      if (wordStatus === answer) {
        document.getElementById('keyboard').innerHTML = 'You Won!!!';
      }
    }
    
    function checkIfGameLost() {
      if (mistakes === maxWrong) {
        document.getElementById('wordSpotlight').innerHTML = 'The answer was: ' + answer;
        document.getElementById('keyboard').innerHTML = 'You Lost!!!';
      }
    }
    
    function guessedWord() {
      wordStatus = answer.split('').map(letter => (guessed.indexOf(letter) >= 0 ? letter : " _ ")).join('');
    
      document.getElementById('wordSpotlight').innerHTML = wordStatus;
    }
    
    function updateMistakes() {
      document.getElementById('mistakes').innerHTML = mistakes;
    }
    
    document.getElementById('maxWrong').innerHTML = maxWrong;
    
    randomWord();
    generateButtons();
    guessedWord();
    const buttonItems = document.querySelectorAll('.own-game-btn');

    buttonItems.forEach((buttonItem) => buttonItem.addEventListener('click', () => {
      handleGuess(buttonItem.value)
    }))
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
    const howToPlay = document.createElement('section')
    const howToPlayFirst = document.createElement('h5')
    const howToPlaySecond = document.createElement('h5')
    const howToPlayThird = document.createElement('h5')

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
    howToPlay.classList.add('own-game-tooltip-points-wrapper')
    howToPlayFirst.classList.add('own-game-tooltip-points')
    howToPlayFirst.innerText = '1. In this game, you will type as many words as you can.'
    howToPlaySecond.classList.add('own-game-tooltip-points')
    howToPlaySecond.innerText = '2. Each word must start with the letters in the box.'
    howToPlayThird.classList.add('own-game-tooltip-points')
    howToPlayThird.innerText = '3. Long words are worth more than short words.'

    mainWb.append(container)
    container.append(wrapper)
    wrapper.append(centeredBlock)
    centeredBlock.append(nameGame)
    centeredBlock.append(description)
    wrapper.append(form)
    form.append(controlPanel)
    controlPanel.append(btnHowToPlay)
    controlPanel.append(btnGoToPlay)
    wrapper.append(levelOfHardness)
    levelOfHardness.append(labelForLevel)
    levelOfHardness.append(selectForLevel)
    wrapper.append(howToPlay)
    howToPlay.append(howToPlayFirst)
    howToPlay.append(howToPlaySecond)
    howToPlay.append(howToPlayThird)

    containerRef = mainWb

    return mainWb
  }
  return {
    onInit
  }
}