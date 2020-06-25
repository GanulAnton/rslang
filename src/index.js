import obj from './main'

import './styles.css'
import image from  './assets/image.jpg'

console.log(obj);
console.log('image', image);

import { Sprint } from './pages/sprint/sprint';
// import Login from './pages/login/loginClass';


//вставляем наш элемент
const Sprint =  Sprint();
// const login = new Login();

Sprint.onInit(document.querySelector('#app'));

