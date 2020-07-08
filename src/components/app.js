import Header from './header/header';
import Login from '../pages/login/login';
import MainPage from '../pages/mainPage/mainPage';

export default function App() {
  const defaultSettings = {
    linguist: {
      isNewUser: true,
      lastWord: {},
      wordsPerDay: '20',
      newWords: '10',
      hint: {
        translation: false,
        meaning: true,
        example: false,
      },
      additional: {
        transcription: true,
        image: true,
      },
      vocabulary: true,
      showAnswer: false,
    },
    savannah: {},
    audioChallenge: {},
    sprint: {},
    speakIt: {},
    wordBubble: {},
  };

  let settings = null;
  let loginRef = null;
  let user = { userId: null, token: null };

  const setToLocalStorage = () => {
    localStorage.setItem('user', JSON.stringify({ userId: user.userId, token: user.token }));
  };

  const setWord = (word) => fetch(`https://afternoon-falls-25894.herokuapp.com/users/${user.userId}/words/${word.id}`, {
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

  const setSettings = async (options) => {
    const rawResponse = await fetch(`https://afternoon-falls-25894.herokuapp.com/users/${user.userId}/settings`, {
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

  const setSettingsCallback = (options) => {
    setSettings(options);
    settings.optional = options;
    console.log(settings, 'app');
  };

  const setWordsCallback = (words) => {
    const wordsFetch = words.map((el) => setWord(el));

    Promise.all(wordsFetch).then((data) => console.log(data));

    if (settings.optional.linguist.isNewUser) {
      settings.optional.linguist.isNewUser = false;

      setSettings({ ...settings.optional });
    }
  };

  const getLoginDataCallback = () => {
    const loginData = loginRef.getData();
    user.userId = loginData.data.userId;
    user.token = loginData.data.token;
    console.log(user);
    setToLocalStorage();
    haveToLogin();
  };

  const getUserCallback = () => user;

  const startMainPage = async (userSettings) => {
    const mainPage = MainPage({
      setSettingsCallback, setStatistics, getSettingsCallback, setWordsCallback, getUserCallback,
    });
    const header = Header();
    const appContainer = document.createElement('div');
    settings = userSettings;

    document.querySelector('#app').innerHTML = '';
    appContainer.classList.add('app-container');

    header.onInit(document.querySelector('#app'));
    document.querySelector('#app').append(appContainer);
    mainPage.onInit(appContainer);
    console.log(settings);
  };

  const haveToLogin = async () => {
    const rawResponse = await fetch(`https://afternoon-falls-25894.herokuapp.com/users/${user.userId}/settings`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (rawResponse.status === 401) {
      const login = Login(getLoginDataCallback);
      loginRef = login;
      const app = document.querySelector('#app');
      login.onInit(app);
    } else if (rawResponse.status === 404) {
      setSettings(defaultSettings);
    } else {
      const userSettings = await rawResponse.json();
      startMainPage(userSettings);
    }
  };

  const getFromLocalStorage = () => {
    if (localStorage.getItem('user')) {
      const storageData = JSON.parse(localStorage.getItem('user'));
      user = storageData;
    }
  };

  const onInit = () => {
    getFromLocalStorage();
    haveToLogin();
  };

  const start = () => {
    onInit();
  };

  return {
    start,
  };
}
