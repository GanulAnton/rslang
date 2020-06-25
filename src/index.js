import obj from './main'

// import './styles.css'
// import image from  './assets/image.jpg'

import  Settings  from "./pages/settings/settings"

const settings = Settings()
const app = document.querySelector("#app")
settings.onInit(app)

console.log(obj);
// console.log('image', image);