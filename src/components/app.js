import Header from './header/header';
import Login from '../pages/login/login';
import MainPage from '../pages/mainPage/mainPage';
import Settings from '../pages/settings/settings';
import Linguist from '../pages/linguist/linguist';
import Sprint from '../pages/sprint/sprintTest';
import AboutUs from '../pages/aboutUs/aboutUs';

import defaultUrl from '../accessories/defaultUrl';
import defaultSettings from '../accessories/defaultSettings';
import { getFromLocalStorage, setToLocalStorage } from '../accessories/accessories';

export default function App() {
  const mainContainer = document.createElement('div');
  const appRef = document.querySelector('#app');

  let cb = {};
  let pages = {};
  let settings = null;
  let user = { userId: null, token: null };

  const setWord = (word) => fetch(`${defaultUrl}/users/${user.userId}/words/${word.id}`, {
    method: word.isUpdated ? 'PUT' : 'POST',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${user.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ optional: { status: word.status } }),
  })
    .then((res) => res.json());

  const getSettings = async () => {
    const rawResponse = await fetch(`${defaultUrl}/users/${user.userId}/settings`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const userSettings = await rawResponse.json();

    return userSettings;
  };

  const setSettings = async (options) => {
    const rawResponse = await fetch(`${defaultUrl}/users/${user.userId}/settings`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${user.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        optional: options,
      }),
    });

    const content = await rawResponse.json();
    return content;
  };

  const setStatistics = () => {

  };

  const getSettingsCallback = () => settings;

  const getUserCallback = () => user;

  const getPagesCallback = () => pages;

  const getMainContainerCallback = () => mainContainer;

  const getAppContainerCallback = () => appRef;

  const setSettingsCallback = (options) => {
    setSettings(options);
    settings.optional = options;
  };

  const setWordsCallback = (words) => {
    const wordsFetch = words.map((el) => setWord(el));

    Promise.all(wordsFetch).then((data) => console.log(data));

    if (settings.optional.linguist.isNewUser) {
      settings.optional.linguist.isNewUser = false;

      setSettings({ ...settings.optional });
    }
  };

  const getLoginDataCallback = async () => {
    const loginData = pages.loginPage.getData();
    user.userId = loginData.data.userId;
    user.token = loginData.data.token;
    console.log(user);
    setToLocalStorage('user', { userId: user.userId, token: user.token });
    const userSettings = await getSettings();
    settings = userSettings;

    const header = Header(mainContainer, cb);

    document.querySelector('#app').innerHTML = '';
    mainContainer.classList.add('app-container');

    header.onInit(document.querySelector('#app'));
    document.querySelector('#app').append(mainContainer);
    pages.mainPage.onInit(mainContainer);
  };

  const setCallbacks = () => {
    cb = {
      setSettingsCallback,
      setStatistics,
      getSettingsCallback,
      setWordsCallback,
      getUserCallback,
      getPagesCallback,
      getMainContainerCallback,
      getLoginDataCallback,
      getAppContainerCallback,
    };

    return cb;
  };

  const setPages = () => {
    const mainPage = MainPage(cb);
    const linguistPage = Linguist(cb);
    const settingsPage = Settings(cb);
    const sprintPage = Sprint(cb);
    const aboutUsPage = AboutUs();
    const loginPage = Login(getLoginDataCallback);
    pages = {
      mainPage, linguistPage, settingsPage, loginPage, sprintPage, aboutUsPage,
    };
  };

  const startMainPage = (userSettings) => {
    settings = userSettings;

    setCallbacks();
    setPages();

    const header = Header(mainContainer, cb);

    document.querySelector('#app').innerHTML = '';
    mainContainer.classList.add('app-container');

    header.onInit(document.querySelector('#app'));
    document.querySelector('#app').append(mainContainer);
    pages.mainPage.onInit(mainContainer);
    console.log(settings);
  };

  const haveToLogin = async () => {
    console.log(defaultSettings);

    const rawResponse = await fetch(`${defaultUrl}/users/${user.userId}/settings`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (rawResponse.status === 401) {
      pages.loginPage.onInit(appRef);
    } else if (rawResponse.status === 404) {
      setSettings(defaultSettings);
    } else {
      const userSettings = await rawResponse.json();
      startMainPage(userSettings);
    }
  };

  const onInit = () => {
    user = getFromLocalStorage('user');
    if (!user) {
      user = { userId: null, token: null };
    }

    setCallbacks();
    setPages();

    haveToLogin();
  };

  const start = () => {
    onInit();
  };

  return {
    start,
  };
}
