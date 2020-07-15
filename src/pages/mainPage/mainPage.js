import './mainPage.css';
import Modal from '../../components/modal/modal';

import defaultUrl from '../../accessories/defaultUrl';

export default function MainPage(cb) {
  const callbacks = cb;
  const modal = Modal();

  let settings = null;
  let user = null;
  let pages = null;
  let mainContainer = null;
  let containerRef = null;
  let appContainerRef = null;
  let gameParameter = 'default';

  const startLinguist = (userWords) => {
    pages.linguistPage.onInit(mainContainer, userWords);
  };

  const getWords = async (param) => {
    const rawResponse = await fetch(`${defaultUrl}/users/${user.userId}/aggregatedWords?filter=${JSON.stringify(param.filter)}&wordsPerPage=${param.amount}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const content = await rawResponse.json();

    const words = [...content[0].paginatedResults];

    return words
  };

  const getLearnedWords = async (param) => {
    const rawResponse = await fetch(`${defaultUrl}/users/${user.userId}/aggregatedWords?filter=${JSON.stringify(param.filter)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const content = await rawResponse.json();

    return [...content];
  };

  const makeLinguistStats = (arr) => {
    let learnedWords = 0;

    if (arr[0].totalCount.length !== 0) learnedWords = arr[0].totalCount[0].count;

    containerRef.querySelector('.linguist-stats').innerHTML = `
    <p>Статистика:</p>
    <p>Карточек на каждый день: ${settings.optional.linguist.wordsPerDay}.</p>  
    <p>Выученно слов: <span id="main-page-learned-words">${learnedWords}</span> с 3600.</p>
    <progress class="linguist-progress-bar" value="${learnedWords}" max="3600"></progress>
    `;
  };

  const getMixedWords = (param) => {
    let diff = 0;

    let words = [];

    fetch(`${defaultUrl}/users/${user.userId}/aggregatedWords?filter=${JSON.stringify(param.filter)}&wordsPerPage=${param.amount - param.newWords}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        words = [...data[0].paginatedResults];

        if (data[0].paginatedResults.length < param.amount - param.newWords) {
          diff += param.amount - param.newWords - data[0].paginatedResults.length;
        }

        const filterNew = {
          $or: [
            { userWord: null },
          ],
        };

        return fetch(`${defaultUrl}/users/${user.userId}/aggregatedWords?filter=${JSON.stringify(filterNew)}&wordsPerPage=${+param.newWords + +diff}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${user.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        })
          .then((res) => res.json());
      })
      .then((data) => {
        words = [...words, ...data[0].paginatedResults];
        startLinguist(words);
      });
  };

  const getDataForLinguist = async () => {
    const param = {
      amount: settings.optional.linguist.wordsPerDay,
      newWords: settings.optional.linguist.newWords,
      filter: {
        $or: [
          { userWord: null },
        ],
      },
    };

    if (gameParameter === 'new') {
      param.filter = { 'userWord.optional.status': null };

      const words = await getWords(param);

      mainContainer.innerHTML = '';
      startLinguist(words);
    } else if (gameParameter === 'repeat') {
      param.filter = { 'userWord.optional.status': 'inProgress' };

      const words = await getWords(param);

      if(words.length === 0) {
        modal.showModal("К сожалению нету слов для повторения.")
        return
      }

      mainContainer.innerHTML = '';
      startLinguist(words);
    } else if (gameParameter === 'hard') {
      param.filter = { 'userWord.optional.status': 'hard' };

      const words = await getWords(param);

      if(words.length === 0) {
        modal.showModal("К сожалению нету сложных слов.")
        return
      }

      mainContainer.innerHTML = '';
      startLinguist(words);
    } else {
      if (settings.optional.linguist.isNewUser) {
        const words = await getWords(param);
  
        mainContainer.innerHTML = '';
        startLinguist(words);
        return
      }

      param.filter = { 'userWord.optional.status': 'inProgress' };

      mainContainer.innerHTML = '';
      getMixedWords(param);
    }
  };

  const goToPage = (marker, element) => {
    if (element.classList.contains(marker)) {
      pages.linguistPage.removeEvents();

      if (element.dataset.name === 'linguist') {
        getDataForLinguist();
      }

      if (element.dataset.name === 'speakIt') {
        mainContainer.innerHTML = '';
        pages.speakIt.onInit(mainContainer);
      }

      if (element.dataset.name === 'audioChallenge') {
        mainContainer.innerHTML = '';
        pages.audioChallenge.onInit(mainContainer);
      }
      
       if (element.dataset.name === 'savannah') {
        mainContainer.innerHTML = '';
        pages.savannah.onInit(mainContainer);
      }

      if (element.dataset.name === 'sprint') {
        mainContainer.innerHTML = '';
        pages.sprintPage.onInit(mainContainer);
      }

      if (element.dataset.name === 'wordBubbles') {
        mainContainer.innerHTML = '';
        pages.wordBubbles.onInit(mainContainer);
      }

      appContainerRef.querySelector('.header-nav').classList.remove('header-navActive');
    }
  };

  const addEventListeners = () => {
    containerRef.querySelector('.linguist-select').addEventListener('change', (e) => {
      gameParameter = e.target.value;
    });

    containerRef.querySelector('.main-page__mini-games').addEventListener('click', (e) => {
      goToPage('main-page-btn', e.target);
    });

    containerRef.querySelector('.linguist-start-game').addEventListener('click', (e) => {
      goToPage('main-page-btn', e.target);
    });
  };

  const render = () => {
    const container = document.createElement('div');
    container.classList.add('main-page-container');
    container.innerHTML = `
    <div class="main-page__body">
          <!-- <h1 id="big-logo"><span id="rs">RS</span> Lang</h1> -->
          <h1 id="big-logo">RS Lang</h1>
          <p id="big-logo-text">The app for learning foreign words with interval repetition <br />techniques, tracking individual progress, and mini-games.</p>
    </div>
    <hr class="main-page__separator">
    <div class="main-page__father-div">
    <div class="main-page-linguist-container">
      <div class="linguist-stats">
        <p>Статистика:</p>
        <p>Карточек на каждый день: ${settings.optional.linguist.wordsPerDay}.</p>  
        <p>Выученно слов: 0 с 3600.</p>
        <progress class="progress-bar" value="52" max="3600"></progress>
      </div>
      <div class="linguist-control">
        <select class="linguist-select">
          <option value="default">Стандартный набор</option>
          <option value="new">Только новые карточки</option>
          <option value="repeat">Только карточки на повтор</option>
          <option value="hard">Только сложные карточки</option>          
        </select>
        <button data-name="linguist" class="main-page-btn linguist-start-game">Start Game</button>
      </div>
    </div>
    <div class="mini-games">
      <!-- <h1 class="main-page-father-div__h1">Mini-Games</h1> -->
      <ul class="main-page__mini-games">
      <li class="main-page__mini-game">
      <!--Card-->
        <div class="wrapper">
          <div class="card testimonial-card mt-2 mb-3">
            <!-- Background color -->
            <div class="card-up aqua-gradient"></div>
            <!-- Avatar -->
            <div class="avatar mx-auto white">
              <img src="./assets/img/wordbubbles/sprint.jpg" class="rounded-circle img-responsive" alt="woman avatar">
            </div> 
            <!-- Content -->
            <div class="card-body">
              <!-- Name -->
              <h4 class="card-title font-weight-bold">Спринт</h4>
              <hr>
              <!-- Quotation -->
              <p class="main-page-card-text">Сопоставьте перевод слова и его английский эквивалент</p>
              <button data-name="sprint"class="main-page-btn">Sprint</button>
            </div>
        </div>
      </li>
        <li class="main-page__mini-game">
        <!--Card-->
          <div class="wrapper">
            <div class="card testimonial-card mt-2 mb-3">
              <!-- Background color -->
              <div class="card-up peach-gradient"></div>
              <!-- Avatar -->
              <div class="avatar mx-auto white">
                <img src="./assets/img/wordbubbles/savannah.jpg" class="rounded-circle img-responsive" alt="woman avatar">
              </div> 
              <!-- Content -->
              <div class="card-body">
                <!-- Name -->
                <h4 class="card-title font-weight-bold">Саванна</h4>
                <hr>
                <!-- Quotation -->
                <p class="main-page-card-text">Покоряйте Саванну, изучая английский и расширяя словарный запас</p>
                <button data-name="savannah"class="main-page-btn">Savannah</button>
              </div>
          </div>
        </li>
        <li class="main-page__mini-game">
        <!--Card-->
          <div class="wrapper">
            <div class="card testimonial-card mt-2 mb-3">
              <!-- Background color -->
              <div class="card-up purple-gradient"></div>
              <!-- Avatar -->
              <div class="avatar mx-auto white">
                <img src="./assets/img/wordbubbles/audiochallange.jpg" class="rounded-circle img-responsive" alt="woman avatar">
              </div> 
              <!-- Content -->
              <div class="card-body">
                <!-- Name -->
                <h4 class="card-title font-weight-bold">Аудиовызов</h4>
                <hr>
                <!-- Quotation -->
                <p class="main-page-card-text">Тренируйте навык аудирования для наилучшего понимания речи</p>
                <button data-name="audioChallenge" class="main-page-btn">Audio Challenge</button>
              </div>
          </div>
        </li>
        <li class="main-page__mini-game">
        <!--Card-->
          <div class="wrapper">
            <div class="card testimonial-card mt-2 mb-3">
              <!-- Background color -->
              <div class="card-up green-light-color-gradient"></div>
              <!-- Avatar -->
              <div class="avatar mx-auto white">
                <img src="./assets/img/wordbubbles/speakit.jpg" class="rounded-circle img-responsive" alt="woman avatar">
              </div> 
              <!-- Content -->
              <div class="card-body">
                <!-- Name -->
                <h4 class="card-title font-weight-bold">Speak It</h4>
                <hr>
                <!-- Quotation -->
                <p class="main-page-card-text">Преобразите произношение слов на английском языке</p>
                <button data-name="speakIt" class="main-page-btn">Speak It</button>
              </div>
          </div>
        </li>
        <li class="main-page__mini-game">
        <!--Card-->
          <div class="wrapper">
            <div class="card testimonial-card mt-2 mb-3">
              <!-- Background color -->
              <div class="card-up blue-gradient"></div>
              <!-- Avatar -->
              <div class="avatar mx-auto white">
                <img src="./assets/img/wordbubbles/ownGame.png" class="rounded-circle img-responsive" alt="woman avatar">
              </div> 
              <!-- Content -->
              <div class="card-body">
                <!-- Name -->
                <h4 class="card-title font-weight-bold">Word Bubbles</h4>
                <hr>
                <!-- Quotation -->
                <p class="main-page-card-text">Развивайте способность быстро извлекать слова из вашего словарного запаса.</p>
                <button data-name="wordBubbles"class="main-page-btn">Word Bubbles</button>
              </div>
          </div>
        </li>
      </ul>
      <hr class="main-page__mini-game-separator"/>
      <footer>
        <h1 id="footer__h1">RS Lang</h1>
        <div id="first-column" class="footer__padding">
          <h3 class="footer__h3">Contact Us</h3>
          <a class="footer__text" target="_blank" href="https://docs.google.com/forms/d/e/1FAIpQLSdL4L6MDUHNjYm_ekp-1ZF4laemtGprii39lLOOes5IneV_DQ/viewform?usp=sf_link">Google Forms</a>
        </div>
        <div id="second-column" class="footer__padding">
          <h3 class="footer__h3">Information</h3>
          <a class="footer__text" target="_blank" href="https://github.com/rolling-scopes-school/tasks/blob/master/tasks/rslang/rslang.md">Technical requirement</a>
          <a class="footer__text" target="_blank" href="https://app.rs.school/course/student/cross-check-submit?course=rs-2020-q1">Cross-Check</a>
        </div>
        <h6 id="year">© 2020</h6>
      </footer>
    `;

    containerRef = container;

    modal.onInit(container);

    return container;
  };

  const onInit = async (anchor) => {
    gameParameter = 'default';

    user = callbacks.getUserCallback();
    settings = callbacks.getSettingsCallback();
    pages = callbacks.getPagesCallback();
    mainContainer = anchor;
    appContainerRef = callbacks.getAppContainerCallback();

    const container = render();

    anchor.append(container);

    const learnedWords = await getLearnedWords({ filter: { 'userWord.optional.status': 'learned' } });

    makeLinguistStats(learnedWords);

    addEventListeners();
    return container;
  };

  return {
    onInit,
  };
}
