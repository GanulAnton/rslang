import './sprint.css';
import setTimer from './timer';

const svgSound = '<svg xmlns="http://www.w3.org/2000/svg" id="Capa_1" enable-background="new 0 0 512.01 512.01" fill="#fff" height="25" viewBox="0 0 512.01 512.01" width="25"><g><path d="m234.603 46.947-134.809 82.058h-84.794c-8.284 0-15 6.716-15 15v224c0 8.284 6.716 15 15 15h84.794l134.808 82.058c29.996 18.259 68.398-3.311 68.398-38.439v-341.238c0-35.116-38.394-56.703-68.397-38.439zm-204.603 112.058h59v194h-59zm243 267.619c0 11.698-12.787 18.908-22.8 12.813l-131.2-79.862v-207.14l131.2-79.861c9.995-6.084 22.8 1.091 22.8 12.813z"/><path d="m345.678 217.114c-5.858 5.858-5.858 15.355 0 21.213 9.77 9.771 9.771 25.584 0 35.355-5.858 5.858-5.858 15.355 0 21.213 5.857 5.858 15.355 5.859 21.213 0 21.444-21.444 21.444-56.337 0-77.781-5.858-5.858-15.356-5.858-21.213 0z"/><path d="m412.146 171.86c-5.857-5.858-15.355-5.858-21.213 0s-5.858 15.355 0 21.213c34.701 34.701 34.701 91.164 0 125.865-5.858 5.858-5.858 15.355 0 21.213 5.857 5.858 15.355 5.859 21.213 0 46.398-46.398 46.398-121.893 0-168.291z"/><path d="m457.4 126.605c-5.857-5.858-15.355-5.858-21.213 0s-5.858 15.355 0 21.213c60.666 60.666 60.666 155.709 0 216.375-5.858 5.858-5.858 15.355 0 21.213 5.857 5.858 15.355 5.859 21.213 0 72.774-72.774 72.851-185.95 0-258.801z"/></g></svg>';
export default function Sprint() {
  let state = {
    click: false,
    error: null,
    isLoaded: false,
    items: [],
    index: 0,
    score: 0,
    streak: 0,
    corAnswers: [],
    incorAnswers: [],
    helpOn: false,
  };
  let arr = [];
  const delay = (ms) => new Promise((r) => setTimeout(() => r(), ms));

  const onInit = (anchor) => {
    const container = anchor.append(render());
    addEventListeners();
    return container;
  };

  function addEventListeners() {
    document.querySelector('.start-btn-sprint').addEventListener('click', () => {
      StartGame();
    });
  }

  function getWords() {
    const randArr = [];

    function getRandomInt(max) {
      const x = Math.floor(Math.random() * Math.floor(max));
      randArr.push(x);
    }
    for (let i = 0; i < 6; i++) {
      getRandomInt(30);
    }
    const uniq = Array.from(new Set(randArr));
    const uniq2 = Array.from(new Set(randArr));
    for (let i = 0; i < uniq.length; i++) {
      uniq[i] = fetch(`https://afternoon-falls-25894.herokuapp.com/words?page=${uniq[i]}&group=${state.level}`).then((res) => res.json());
    }
    return Promise.all(uniq).then((res) => [].concat(...res))
      .then((result) => {
          state.items = [...result];
          return delay(500).then(() => {
            document.querySelector('.box').innerHTML = '';
          });
        },
        (error) => {
          state.error = error;
        });

  }

  function shuffleItems() {
    const mix = state.items.slice();
    mix.sort(() => Math.random() - 0.5);
    state.items.map((item, index) => {
      if (state.items[index].wordTranslate !== mix[index].wordTranslate) {
        item.false = mix[index].wordTranslate;
      } else {
        item.false = 'территориальная целостность';
      }
    });
    arr = state.items.slice();
    arr.sort(() => Math.random() - 0.5);
  }

  function getRandomTranslate(array) {
    const rand = ([array[state.index].wordTranslate, array[state.index].false])[Math.floor(Math.random() * 2)];

    return rand;
  }

  function soundClick() {
    const audio = new Audio();
    audio.src = `https://raw.githubusercontent.com/irinainina/rslang-data/master/${arr[state.index].audio}`;
    audio.autoplay = true;
  }

  function drawCard(t) {
    const wrongTrans = getRandomTranslate(arr);
    let helpPhrase = '';
    let blackStyle = '';

    if (state.helpOn === true) {
      helpPhrase = arr[state.index].textExample;
      blackStyle = 'black-btn-sprint';
    }
    const container = document.querySelector('.sprint-box');

    container.innerHTML = `
              <div class="sprint-box-top">
                Всего очков: ${state.score}
              </div>
              <div class="sprint-box-mid">
                  <h2>${arr[state.index].word}</h2>
                  <p>${helpPhrase}</p>
                  <h2 class="wrongTrans">${wrongTrans}</h2>
              </div>
              <div class="sprint-box-bot">
                     <div class='play-btn-sprint NotCorrect-btn'> Не верно </div>
                     <div class='play-btn-sprint Correct-btn'> Верно </div>
              </div>
              <div class="settings-box-sprint">
                <div class='settings-btn-sprint sound-btn'> ${svgSound} </div>
                <div class='settings-btn-sprint help-btn ${blackStyle}'> A </div>
                <div class='exit-btn-sprint'> X </div>
              </div>
      `;
    drawCardEventListeners(t, wrongTrans);
  }

  function drawCardEventListeners(t, wrongTrans) {
    document.querySelector('.sound-btn').addEventListener('click', () => {
      soundClick();
    });

    document.querySelector('.help-btn').addEventListener('click', () => {
      state.helpOn = !state.helpOn;
      if (state.helpOn === true) {
        document.querySelector('.sprint-box-mid').innerHTML = `
          <h2>${arr[state.index].word}</h2>
          <p>${arr[state.index].textExample}</p>
          <h2 class="wrongTrans">${wrongTrans}</h2>
          `;
        document.querySelector('.help-btn').classList.add('black-btn-sprint');
      } else if (state.helpOn === false) {
        document.querySelector('.sprint-box-mid').innerHTML = `
          <h2>${arr[state.index].word}</h2>
          <h2 class="wrongTrans">${wrongTrans}</h2>
          `;
        document.querySelector('.help-btn').classList.remove('black-btn-sprint');
      }
    });

    document.addEventListener('keydown', (event) => {
      if (document.querySelector('.wrongTrans') != null) {
        if (event.code === 'ArrowRight') {
          if (document.querySelector('.wrongTrans').textContent === arr[state.index].wordTranslate) {
            /* console.log('это слово правильное'); */
            handleCorrect();
          } else {
            /* console.log('это слово не правильное'); */
            handleNotCorrect();
          }
          if (state.index < arr.length) {
            state.index++;
            delay(1000).then(() => {
              drawCard();
            });
          } else {
            finishGame();
          }
        } else if (event.code === 'ArrowLeft') {
          if (document.querySelector('.wrongTrans').textContent === arr[state.index].false) {
            /* console.log('это слово не правильное'); */
            handleCorrect();
          } else {
            /* console.log('это слово правильное'); */
            handleNotCorrect();
          }

          if (state.index < arr.length) {
            state.index++;
            delay(1000).then(() => {
              drawCard();
            });
          } else {
            finishGame();
          }
        }
      }
    });

    document.querySelector('.Correct-btn').addEventListener('click', () => {
      if (document.querySelector('.wrongTrans').textContent === arr[state.index].wordTranslate) {
        /* console.log('это слово правильное'); */
        handleCorrect();
      } else {
        /* console.log('это слово не правильное'); */
        handleNotCorrect();
      }
      if (state.index < arr.length) {
        state.index++;
        delay(1000).then(() => {
          drawCard();
        });
      } else {
        finishGame();
      }
    });

    document.querySelector('.NotCorrect-btn').addEventListener('click', () => {
      if (document.querySelector('.wrongTrans').textContent === arr[state.index].false) {
        /* console.log('это слово не правильное'); */
        handleCorrect();
      } else {
        /* console.log('это слово правильное'); */
        handleNotCorrect();
      }

      if (state.index < arr.length) {
        state.index++;
        delay(1000).then(() => {
          drawCard();
        });
      } else {
        finishGame();
      }
    });

    document.querySelector('.exit-btn-sprint').addEventListener('click', () => {
      clearTimeout(t);
      finishGame();
    });
  }

  function handleCorrect() {
    (state.corAnswers).push(arr[state.index]);
    let points;
    state.streak++;
    if (state.streak >= 8) {
      points = 40;
      state.score += 40;
    } else if (state.streak >= 4) {
      state.score += 20;
      points = 20;
    } else {
      state.score += 10;
      points = 10;
    }

    document.querySelector('.sprint-box').innerHTML = `
        <div class='correctWord-sprint'>
        <h2>+${points} очков</h2>
        </div>
      `;
  }

  function handleNotCorrect() {
    (state.incorAnswers).push(arr[state.index]);
    state.streak = 0;
    document.querySelector('.sprint-box').innerHTML = `
        <div class='incorrectWord-sprint'>
        <h2>+0 очков</h2>
        </div>
      `;
  }

  function StartGame() {
    state = {
      click: false,
      error: null,
      isLoaded: false,
      items: [],
      index: 0,
      score: 0,
      streak: 0,
      level: document.querySelector('#hardness').value - 1,
      corAnswers: [],
      incorAnswers: [],
      helpOn: false,
    };
    const container = document.querySelector('.box');
    container.innerHTML = `
      <div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    `;
    getWords().then(() => {
      if (state.error) {
        container.innerHTML = '';
        container.insertAdjacentHTML('afterbegin', '<div class=\'black\'>error</div>');
      } else {
        setTimer();
        shuffleItems();
        const t = setTimeout(() => {
          finishGame();
        }, 65000);

        container.insertAdjacentHTML('afterbegin', ' <div class="sprint-box"></div>');

        drawCard(t);
      }
    });
  }

  function finishGame() {
    document.querySelector('.timer-sprint').innerHTML = '';
    setTimer(1);
    const container = document.querySelector('.sprint-box');
    container.innerHTML = `
              <div class="sprint-box-top">
                Конец игры!
              </div >
              <div class="sprint-box-mid">

                  <h2>Ваш результат: ${state.score} баллов</h2>

              </div>
              <div class="sprint-box-bot">
                     <div class='play-btn-sprint stat-btn-sprint'> Статистика </div>
                     <div class='play-btn-sprint back-btn-sprint'> Выход </div>
              </div>
      `;
    state.prevScore = state.score;
    document.querySelector('.back-btn-sprint').addEventListener('click', () => {
      startRender();
    });
    document.querySelector('.stat-btn-sprint').addEventListener('click', () => {
      showStat();
    });
    const removeEvents = () => {
      document.onkeydown = null;
    }
  }

  function showStat() {
    /* console.log(state.corAnswers);
    console.log(state.incorAnswers); */
    const AllWords = [...state.corAnswers, ...state.incorAnswers];

    let percent = 0;

    if (AllWords.length > 0) {
      percent = ((state.corAnswers.length * 100) / AllWords.length).toFixed(2);
    }

    document.querySelector('.sprint-box').innerHTML = `
      <div class="sprint-box-mid-stat">
          <h2>Всего слов: ${AllWords.length}</h2>
          <h2>Отвечено правильно: ${state.corAnswers.length}</h2>
          <h2>Отвечено не правильно: ${state.incorAnswers.length}</h2>
          <h2>Процент правильности: ${percent}%</h2>
          <h2>Очков всего: ${state.score}</h2>
      </div>
      <div class="sprint-box-bot">
         <div class='play-btn-sprint wrongWords-btn-sprint'>Неверные слова </div>
         <div class='play-btn-sprint back-btn-sprint'> Выход </div>
      </div> 
      `;
    document.querySelector('.back-btn-sprint').addEventListener('click', () => {
      startRender();
    });
    document.querySelector('.wrongWords-btn-sprint').addEventListener('click', () => {
      document.querySelector('.sprint-box').innerHTML = `
          <div class="sprint-box-mid-stat">
              ${returnList()}
          </div>
          <div class="sprint-box-bot">
            <div class='play-btn-sprint back-stat-btn-sprint'>К статистике</div>
          </div> 
        `;
      document.querySelector('.back-stat-btn-sprint').addEventListener('click', () => {
        showStat();
      });
    });
  }

  function returnList() {
    let string = '';
    if (state.incorAnswers.length > 0) {
      for (let i = 0; i < state.incorAnswers.length; i++) {
        string += `<h2>${state.incorAnswers[i].word} - ${state.incorAnswers[i].wordTranslate}</h2>`;
      }
    } else {
      string = '<h2>Неправильных слов нет!</h2>';
    }
    return string;
  }

  function startRender() {
    const container = document.querySelector('.box');
    container.innerHTML = `
                                              <h2 class='prev_score-sprint'>Предыдущий результат: ${state.prevScore}</h2>
                                              <div class="start-btn-sprint">
                                                <svg>
                                                  <rect x="0" y="0" fill="none" width="100%" height="100%"/>
                                                </svg>
                                                <p> Начать игру </p>
                                              </div>
                                              <div class="level-sprint">
                                              <label for="hardness">уровень сложности:</label>
                                              <select id="hardness">
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                                <option value="6">6</option>
                                              </select>
                                            </div>
                                              `;
    document.querySelector('.start-btn-sprint').addEventListener('click', () => {
      StartGame();
    });
  }

  const render = () => {

    const container = document.createElement('div');
    container.classList.add('box');
    container.innerHTML = `
                            <div class="start-btn-sprint">
                              <svg>
                                <rect x="0" y="0" fill="none" width="100%" height="100%"/>
                              </svg>
                               <p> Начать игру </p>
                            </div>
                            <div class="level-sprint">
                              <label for="hardness">уровень сложности:</label>
                              <select id="hardness">
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                              </select>
                            </div>
                            
                       `;
    return container;
  };

  return {
    onInit,
  };
};