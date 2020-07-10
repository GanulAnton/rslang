import './header.css';

import { removeFromLocalStorage } from '../../accessories/accessories';

export default function Header(container, cb) {
  const mainContainer = container;
  const callbacks = cb;
  let headerRef = null;
  let pages = null;

  const goToPage = (marker, element) => {
    if (element.classList.contains(marker)) {
      pages.linguistPage.removeEvents();

      if (element.dataset.name === 'main') {
        mainContainer.innerHTML = '';
        pages.mainPage.onInit(mainContainer);
      }

      if (element.dataset.name === 'settings') {
        mainContainer.innerHTML = '';
        pages.settingsPage.onInit(mainContainer);
      }

        if (element.dataset.name === 'aboutUs') {
        mainContainer.innerHTML = '';
        pages.aboutUsPage.onInit(mainContainer);
      } 

      if (element.dataset.name === 'sprint') {
        mainContainer.innerHTML = '';
        pages.sprintPage.onInit(mainContainer);
      } 

      if (element.dataset.name === 'logOut') {
        removeFromLocalStorage('user');

        const appContainer = callbacks.getAppContainerCallback();

        appContainer.innerHTML = '';
        pages.loginPage.onInit(appContainer);
      }

      if (headerRef.querySelector('.header-nav')) {
        headerRef.querySelector('.header-nav').classList.remove('header-navActive');
      }
    }
  };

  const addEventListeners = () => {
    headerRef.querySelector('.header-main-nav-btn').addEventListener('click', () => {
      headerRef.querySelector('.header-nav').classList.toggle('header-navActive');
    });

    headerRef.querySelector('header .header-nav').addEventListener('click', (e) => {
      goToPage('header-link', e.target);
    });
  };

  const render = () => {
    const header = document.createElement('header');

    header.innerHTML = ` 
    <div class="header-container">
      <h1 class="header-heading">RSLang</h1>
      <div class="header-nav-container">
        <button class="header-main-nav-btn">Menu</button>
        <div class="header-nav">
          <ul class="header-main-nav">
            <Li data-name="main" class="header-link">Main</Li>
            <Li data-name="speakIt" class="header-link">SpeakIt</Li>
            <Li data-name="safari" class="header-link">Safari</Li>
            <Li data-name="sprint" class="header-link">Sprint</Li>
            <Li data-name="audioChallenge" class="header-link">Audio challenge</Li>
            <li data-name="wordBubbles" class="header-link">Word Bubbles</li>
          </ul>
          <ul class="header-profile-nav">
            <li data-name="vocabulary" class="header-link">Vocabulary</li>
            <li data-name="aboutUs" class="header-link">About Us</li>
            <li data-name="statistics" class="header-link">Statistics</li>
            <li data-name="settings" class="header-link">Settings</li>
            <li data-name="logOut" class="header-link">Log Out</li>
          </ul>
        </div>
      </div>
    </div>
    `;

    headerRef = header;

    return header;
  };

  const onInit = (anchor) => {
    const header = render();
    anchor.prepend(header);

    pages = callbacks.getPagesCallback();

    addEventListeners();

    return header;
  };

  return {
    onInit,
  };
}
