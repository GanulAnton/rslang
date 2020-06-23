import obj from './main'

// import './styles.css'
// import image from  './assets/image.jpg'

import { Login } from './pages/login/login';
// import Login from './pages/login/loginClass';


//вставляем наш элемент
const login =  Login();
// const login = new Login();

login.onInit(document.querySelector('#app'));

// console.log(obj);
// console.log('image', image);