import obj from './main'

import './styles.css'
import image from  './assets/image.jpg'

import  {Sprint}  from './pages/sprint/sprintTest';



//вставляем наш элемент
 const sprint =  Sprint();
// const sprint = new Sprint();

 sprint.onInit(document.querySelector('#app')); 

