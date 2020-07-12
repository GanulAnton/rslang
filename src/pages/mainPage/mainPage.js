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
    <p>Выученно слов: ${learnedWords} с 3600.</p>
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
                <p>Покоряйте Саванну, изучая английский и расширяя словарный запас</p>
                <button data-name="savannah"class="main-page-btn">Savannah</button>
              </div>
          </div>
        </li>
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
                <p>Сопоставьте перевод слова и его английский эквивалент</p>
                <button data-name="sprint"class="main-page-btn">Sprint</button>
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
                <p>Тренируйте навык аудирования для наилучшего понимания речи</p>
                <button data-name="audioChallenge" class="main-page-btn">Audio Challenge</button>
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
                <img src="./assets/img/wordbubbles/speakit.jpg" class="rounded-circle img-responsive" alt="woman avatar">
              </div> 
              <!-- Content -->
              <div class="card-body">
                <!-- Name -->
                <h4 class="card-title font-weight-bold">Speak It</h4>
                <hr>
                <!-- Quotation -->
                <p>Преобразите произношение слов на английском языке</p>
                <button data-name="speakIt" class="main-page-btn">Speak It</button>
              </div>
          </div>
        </li>
        <li class="main-page__mini-game">
        <!--Card-->
          <div class="wrapper">
            <div class="card testimonial-card mt-2 mb-3">
              <!-- Background color -->
              <div class="card-up pink-gradient-2"></div>
              <!-- Avatar -->
              <div class="avatar mx-auto white">
                <img src="./assets/img/wordbubbles/ownGame.jpg" class="rounded-circle img-responsive" alt="woman avatar">
              </div> 
              <!-- Content -->
              <div class="card-body">
                <!-- Name -->
                <h4 class="card-title font-weight-bold">Word Bubbles</h4>
                <hr>
                <!-- Quotation -->
                <p>Развивайте способность быстро извлекать слова из вашего словарного запаса.</p>
                <button data-name="wordBubbles"class="main-page-btn">Word Bubbles</button>
              </div>
          </div>
        </li>
      </ul>
      <hr class="main-page__mini-game-separator"/>
      <div class="filling-element-wrapper">
        <div id="filling-element-wrapper-padding">
          <ul class="main-page__additions">
            <li class="main-page__addition">
              <div class="card-additions" id="card-additions-1">
                <!-- <img class="card-additions-img" src="../../assets/img/dictionary.png" alt="Dictionary"> -->
                <svg class="card-additions-img" width="151" height="151" viewBox="0 0 151 151" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M29.9838 117.969H136.844V4.71875H29.6889C24.9483 4.73399 20.4063 6.62393 17.0542 9.97604C13.7021 13.3281 11.8121 17.8702 11.7969 22.6108V126.89H11.8001C11.8001 126.935 11.7969 126.979 11.7969 127.024C11.7969 137.464 19.9904 146.282 29.6889 146.282H136.844V136.844H29.6889C25.2642 136.844 21.2344 132.163 21.2344 127.023C21.2344 122.115 25.2409 117.969 29.9838 117.969ZM106.172 14.2545V65.2217L91.8977 52.6904L77.8594 65.1482V14.2545H106.172ZM68.4219 14.1562V77.8594H77.7535L91.9319 65.2783L106.262 77.8594H115.609V14.1562H127.406V108.531H40.133L40.1094 14.1562H68.4219ZM29.6889 14.1562H30.6719L30.6943 108.531H29.9826C26.9139 108.532 23.8985 109.333 21.2344 110.856V22.6845C21.2272 20.4332 22.1132 18.271 23.6982 16.6722C25.2832 15.0734 27.4376 14.1686 29.6889 14.1562Z" fill="#2E2E2E"/>
</svg>
                <h1 class="card-additions__h1">Словарь</h1>
                <h5 class="card-additions__h5">Dictionary</h5>
              </div>
            </li>
            <li class="main-page__addition">
              <div class="card-additions" id="card-additions-2">
              <svg class="card-additions-img" width="150" height="146" viewBox="0 0 150 146" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M120.537 103.208C116.846 99.514 112.534 96.499 107.797 94.3013C114.477 88.8894 118.738 80.6316 118.738 71.3711C118.738 55.0324 105.113 41.6282 88.7742 41.8789C72.6862 42.1296 59.7244 55.2389 59.7244 71.3711C59.7244 80.6316 64.0008 88.8894 70.666 94.3013C65.9282 96.4974 61.6152 99.5125 57.9254 103.208C49.874 111.274 45.3027 121.921 45.0078 133.275C45.0039 133.433 45.0315 133.589 45.089 133.736C45.1465 133.882 45.2328 134.016 45.3427 134.128C45.4527 134.241 45.584 134.331 45.7291 134.392C45.8742 134.453 46.0301 134.484 46.1875 134.484H54.4453C55.0794 134.484 55.6102 133.983 55.625 133.349C55.9052 124.796 59.3705 116.789 65.4606 110.714C68.5771 107.581 72.284 105.097 76.3667 103.406C80.4495 101.715 84.8271 100.851 89.2461 100.863C98.2265 100.863 106.676 104.358 113.032 110.714C119.107 116.789 122.572 124.796 122.867 133.349C122.882 133.983 123.413 134.484 124.047 134.484H132.305C132.462 134.484 132.618 134.453 132.763 134.392C132.908 134.331 133.04 134.241 133.149 134.128C133.259 134.016 133.346 133.882 133.403 133.736C133.461 133.589 133.488 133.433 133.484 133.275C133.189 121.921 128.618 111.274 120.537 103.208ZM89.2461 90.2461C84.2029 90.2461 79.4547 88.2849 75.9009 84.7163C74.1174 82.9469 72.7086 80.8363 71.7585 78.5105C70.8084 76.1848 70.3366 73.6915 70.3711 71.1794C70.4153 66.3427 72.3471 61.6682 75.7239 58.2028C79.263 54.5753 83.9965 52.5551 89.0544 52.4961C94.0533 52.4518 98.9048 54.3983 102.473 57.8932C106.13 61.4765 108.136 66.2689 108.136 71.3711C108.136 76.4142 106.175 81.1477 102.606 84.7163C100.855 86.4754 98.7731 87.8699 96.4798 88.8191C94.1866 89.7683 91.728 90.2533 89.2461 90.2461ZM52.3071 75.2641C52.1744 73.9811 52.1007 72.6835 52.1007 71.3711C52.1007 69.0265 52.3219 66.7408 52.7348 64.5142C52.838 63.9833 52.5578 63.4377 52.0712 63.2165C50.0657 62.317 48.2225 61.0783 46.6299 59.5152C44.7533 57.6957 43.2766 55.5049 42.294 53.0827C41.3114 50.6606 40.8445 48.0602 40.9231 45.4475C41.0559 40.714 42.9581 36.2164 46.276 32.8248C49.9183 29.094 54.814 27.0591 60.0193 27.1181C64.7233 27.1623 69.2651 28.9761 72.701 32.1907C73.8659 33.2819 74.8686 34.4911 75.7092 35.7888C76.0041 36.2459 76.5792 36.4376 77.0806 36.2606C79.6759 35.3611 82.4186 34.727 85.2351 34.4321C86.0609 34.3436 86.5328 33.4589 86.1642 32.7216C81.3717 23.2398 71.5803 16.6926 60.2553 16.5156C43.9018 16.2649 30.2765 29.6691 30.2765 45.9931C30.2765 55.2536 34.5381 63.5114 41.2181 68.9232C36.5288 71.0909 32.2082 74.0844 28.4627 77.8299C20.3818 85.896 15.8105 96.5427 15.5156 107.912C15.5117 108.069 15.5393 108.226 15.5968 108.372C15.6543 108.519 15.7406 108.653 15.8505 108.765C15.9605 108.878 16.0919 108.967 16.2369 109.029C16.382 109.09 16.5379 109.121 16.6953 109.121H24.9679C25.6019 109.121 26.1328 108.62 26.1476 107.986C26.4277 99.4329 29.8931 91.4258 35.9832 85.3504C40.3186 81.015 45.6271 78.0068 51.4224 76.547C51.9975 76.3995 52.3809 75.8539 52.3071 75.2641V75.2641Z" fill="#2E2E2E"/>
              </svg>              
                <h1 class="card-additions__h1">О нас</h1>
                <h5 class="card-additions__h5">About Us</h5>
            </li>
            <li class="main-page__addition">
              <div class="card-additions" id="card-additions-3">
              <svg class="card-additions-img" width="151" height="151" viewBox="0 0 151 151" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M132.125 151H18.875C13.6647 151 9.21631 149.157 5.52979 145.47C1.84326 141.784 0 137.335 0 132.125V18.875C0 13.6647 1.84326 9.21631 5.52979 5.52979C9.21631 1.84326 13.6647 0 18.875 0H132.125C137.335 0 141.784 1.84326 145.47 5.52979C149.157 9.21631 151 13.6647 151 18.875V132.125C151 137.335 149.157 141.784 145.47 145.47C141.784 149.157 137.335 151 132.125 151ZM47.1875 108.531C47.1875 107.253 46.7205 106.147 45.7866 105.213C44.8527 104.279 43.7467 103.812 42.4688 103.812H33.0312C31.7533 103.812 30.6473 104.279 29.7134 105.213C28.7795 106.147 28.3125 107.253 28.3125 108.531V127.406C28.3125 128.684 28.7795 129.79 29.7134 130.724C30.6473 131.658 31.7533 132.125 33.0312 132.125H42.4688C43.7467 132.125 44.8527 131.658 45.7866 130.724C46.7205 129.79 47.1875 128.684 47.1875 127.406V108.531ZM84.9375 70.7812C84.9375 69.5033 84.4705 68.3973 83.5366 67.4634C82.6027 66.5295 81.4967 66.0625 80.2188 66.0625H70.7812C69.5033 66.0625 68.3973 66.5295 67.4634 67.4634C66.5295 68.3973 66.0625 69.5033 66.0625 70.7812V127.406C66.0625 128.684 66.5295 129.79 67.4634 130.724C68.3973 131.658 69.5033 132.125 70.7812 132.125H80.2188C81.4967 132.125 82.6027 131.658 83.5366 130.724C84.4705 129.79 84.9375 128.684 84.9375 127.406V70.7812ZM122.688 23.5938C122.688 22.3158 122.221 21.2098 121.287 20.2759C120.353 19.342 119.247 18.875 117.969 18.875H108.531C107.253 18.875 106.147 19.342 105.213 20.2759C104.279 21.2098 103.812 22.3158 103.812 23.5938V127.406C103.812 128.684 104.279 129.79 105.213 130.724C106.147 131.658 107.253 132.125 108.531 132.125H117.969C119.247 132.125 120.353 131.658 121.287 130.724C122.221 129.79 122.688 128.684 122.688 127.406V23.5938Z" fill="#2E2E2E"/>
              </svg>
                <h1 class="card-additions__h1">Стат.</h1>
                <h5 class="card-additions__h5">Stats</h5>
              </div>
            </li>
            <li class="main-page__addition">
              <div class="card-additions" id="card-additions-4">
              <svg class="card-additions-img" width="147" height="151" viewBox="0 0 147 151" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M27.7041 105.639V131.516L53.5811 125.123L73.065 144.607L92.5489 125.123L118.426 131.516V105.639L144.607 98.9415L131.517 73.0645L144.607 47.1875L118.426 40.4899V14.6129L92.5489 21.0061L73.065 1.52219L53.5811 21.0061L27.7041 14.6129V40.4899L1.52267 47.1875L14.6134 73.0645L1.52267 98.9415L27.7041 105.639ZM26.1819 67.2803L20.3977 55.4073L30.7485 52.9718C33.7928 52.3629 36.1776 50.8915 37.9027 48.5575C39.6279 46.2235 40.4904 43.5343 40.4904 40.4899V31.3569L50.2324 34.0968H53.5811C57.0314 34.0968 60.0758 32.7776 62.7142 30.1391L73.065 19.7883L83.4158 30.1391C86.0543 32.7776 89.0986 34.0968 92.5489 34.0968C93.7666 34.0968 94.8829 33.8938 95.8977 33.4879L105.64 31.3569V40.4899C105.64 43.5343 106.502 46.2235 108.227 48.5575C109.952 50.8915 112.337 52.3629 115.382 52.9718L125.732 55.4073L119.948 67.2803C117.919 71.1364 117.919 74.9926 119.948 78.8488L125.732 90.7218L115.382 93.1573C112.337 93.7661 109.952 95.2376 108.227 97.5716C106.502 99.9056 105.64 102.595 105.64 105.639V114.772L95.8977 112.032H92.5489C89.0986 112.032 86.0543 113.351 83.4158 115.99L73.065 126.341L62.7142 115.99C60.0758 113.351 57.0314 112.032 53.5811 112.032C52.3634 112.032 51.2471 112.235 50.2324 112.641L40.4904 114.772V105.639C40.4904 102.595 39.6279 99.9056 37.9027 97.5716C36.1776 95.2376 33.7928 93.7661 30.7485 93.1573L20.3977 90.7218L26.1819 78.8488C28.2115 74.9926 28.2115 71.1364 26.1819 67.2803ZM66.6719 95.2883L97.1154 64.5403C99.9568 61.6989 99.9568 58.6546 97.1154 55.4073C94.0711 52.7688 91.0267 52.7688 87.9824 55.4073L66.6719 77.0222L58.1477 68.498C55.1033 65.8596 52.059 65.8596 49.0146 68.498C46.3762 71.5423 46.3762 74.5867 49.0146 77.6311L66.6719 95.2883Z" fill="#2E2E2E"/>
              </svg>
              <h1 class="card-additions__h1">Промо</h1>
                <h5 class="card-additions__h5">Promo</h5>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <footer>
        <h1 id="footer__h1">RS Lang</h1>
        <!-- <svg id="footer__figure" width="531" height="583" viewBox="0 0 531 583" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M225.428 2.32245C288.724 12.0819 315.2 83.1323 363.788 124.855C420.49 173.546 518.483 189.255 529.244 263.215C540.221 338.66 463.492 393.491 410.904 448.69C356.292 506.014 304.431 576.913 225.428 582.118C143.387 587.523 56.361 545.193 13.7896 474.854C-24.33 411.87 28.2279 336.716 32.4193 263.215C36.1449 197.88 -2.29619 127.02 36.6243 74.4106C78.2749 18.1111 156.215 -8.34946 225.428 2.32245Z" fill="#FB2058"/>
        </svg> -->
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
