  
import obj from './main'

// import './styles.css'
// import image from  './assets/image.jpg'

// import  Settings  from "./pages/settings/settings"
// import  Login from './pages/login/login';
// import Linguist from './pages/linguist/linguist';
import App from './components/app'

// const login =  Login();
// const settings = Settings()
// const linguist = Linguist();
// const anchor = document.querySelector("#app")
// settings.onInit(app);
// login.onInit(app);
// linguist.onInit(anchor);

const app = App();
app.start();

console.log(obj);
// console.log('image', image);


