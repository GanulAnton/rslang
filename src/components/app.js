import Login from '../pages/login/login'
import MainPage from "../pages/mainPage"

export default function App () {
  const getLoginDataCallback = () => {
    const loginData = login.getData();
    console.log(loginData)
    user.userId = loginData.data.userId;
    user.token = loginData.data.token; 
    console.log(user);
    getSettings()
  }

  const state = {}
  let settings = null;
  let user = {userId: null, token: null};
  let login = Login(getLoginDataCallback);

  const getFromLocalStorage = () => {
    if(localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'));
    }
  }

  const setToLocalStorage = () => {
    localStorage.setItem("user", JSON.stringify({ userId: user.userId , token: user.token}))
  }

  const getSettings = async () => {
    console.log(user)
      const rawResponse = await fetch(`https://afternoon-falls-25894.herokuapp.com/users/${user.userId}/settings`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if(rawResponse.status === 401) {
        const app = document.querySelector('#app')
        login.onInit(app)

      } else if (rawResponse.status === 404) {
        console.log('ne rabotaet')
        const rawResponse = await fetch(`https://afternoon-falls-25894.herokuapp.com/users/${user.userId}/settings`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "wordsPerDay": 20,
            "optional": {
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
            }
          })
        });

        const content = await rawResponse.json();
  
        console.log(content);
      } else {
        console.log('rabotaet')
        const content = await rawResponse.json();
        settings = content;
        const mainPage = MainPage();
        document.querySelector('#app').innerHTML= "";
        mainPage.onInit(document.querySelector('#app'))
        console.log(settings);
      }
  } 

  const onInit = () => {
    getFromLocalStorage();
    getSettings();
  }


  const start = () => {
    onInit();
  }

  return {
    start
  }
}