import "./ownGame.css"

export const OwnGame = () => {
  let userChoice = null;

  const onInit = (anchor) => {
    const container = anchor.append(render())
    addEventListeners()
    return container
  }

  // вешаем обработчки событий
  const addEventListeners = () => {
    userChoice.addEventListener('submit', (e) => {
      e.preventDefault()

      if (e.submitter.classList.contains('how-to-play')) {
        helpMe()
      }

      if (e.submitter.classList.contains('go-to-play')) {
        mainGame()
      }
    })
  }

  const helpMe = () => {
    document.querySelector('#app').innerHTML = `
      <div class="container">
        <div class="modal-window">
          <form id="modal-window-header">
            <h1 id="how-to-play">How to play?</h1>
            <button class="close-icon"></button>
          </form>
          <div id="tooltip-points-wrapper">
            <div class="tooltip-points-column">
              <h5 class="tooltip-points">1. In this game, you'll type as many words as you can.</h5>
              <img class="tooltip-img" id="typing-keyboard" src="https://sun9-62.userapi.com/B7iMjJJHs5jzNsExKHO0RHTcrhRl0OwVi2nOVQ/rUWQaG6EV50.jpg" alt="keyboard">
            </div>
            <div class="tooltip-points-column">
              <h5 class="tooltip-points">2. Each word must start with the letters in the box.</h5>
              <img class="tooltip-img" src="https://sun9-60.userapi.com/2jmHgZt018oA9TS_bOCdhk2WSe6tLLGdFpJgFw/gZxleDzBuAg.jpg" alt="keyboard-with-letters">
            </div>
            <div class="tooltip-points-column">
              <h5 class="tooltip-points">3. Long words are worth more than short words.</h5>
              <img class="tooltip-img" src="https://sun9-2.userapi.com/BWJUBHzV8Jn1_rZCPDJZjxOh7KHUtmK9-OyDpg/g36AQySaGtY.jpg" alt="long-words">
            </div>
          </div>
        </div>
      </div>
      `
      document.querySelector('.container').style.backgroundImage = "url('../../assets/img/ownGame-startBackground-38.png')"
    }

  const mainGame = () => {
    document.querySelector('#app').innerHTML = `
      <div class="container">
        <div class="game-wrapper">
          <div id="timer"></div>
          <div id="score-wrapper"></div>
          <form class="input-place">
            <input class="game-input" type="text" autofocus>
            <button class="game-enter">Enter</button>
          </form>
        </div>
      </div>
    `
    document.querySelector('.container').style.backgroundImage = "url('../../assets/img/ownGame-gameBackground-1.png')"
    document.querySelector('.container').style.height = "700px"
    
    document.querySelector('.input-place').addEventListener('submit', (e) => {
      e.preventDefault()
      
      if (e.submitter.classList.contains('game-enter')) {
        console.log(1)
      }
    })
  }

  const render = () => {
    const container = document.createElement('div');
    const wrapper = document.createElement('div')
    const form = document.createElement('form');
    const controlPanel = document.createElement('div');
    const btnHowToPlay = document.createElement('button');
    const btnGoToPlay = document.createElement('button');
    const centeredBlock = document.createElement('div')
    const nameGame = document.createElement('h1')
    const description = document.createElement('p')

    container.classList.add('container');
    centeredBlock.classList.add('centered-block')
    wrapper.classList.add('wrapper')
    controlPanel.classList.add('btn-wrapper')
    btnHowToPlay.type = 'submit';
    btnHowToPlay.classList.add('btn')
    btnHowToPlay.classList.add('how-to-play')
    btnHowToPlay.innerText = "?";
    btnGoToPlay.type = "submit";
    btnGoToPlay.classList.add('btn')
    btnGoToPlay.classList.add('go-to-play')
    btnGoToPlay.innerText = "Play"
    nameGame.classList.add('name-game')
    nameGame.innerText = 'Word Bubbles'
    description.classList.add('description')
    description.innerText = 'The ability to rapidly retrieve words from your mental vocabulary.'

    container.append(wrapper);
    wrapper.append(centeredBlock)
    centeredBlock.append(nameGame)
    centeredBlock.append(description)
    wrapper.append(form);
    form.append(controlPanel);
    controlPanel.append(btnHowToPlay);
    controlPanel.append(btnGoToPlay)

    userChoice = form;
    return container
  }
  return {
    onInit
  }
}