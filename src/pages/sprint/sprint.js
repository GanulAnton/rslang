import "./sprint.css";
/* import { doc } from "prettier"; */


const delay = ms =>{
  return new Promise(r=> setTimeout(()=> r(), ms))
}

function setTimer(){

    const circle = document.querySelector('.timer__circle');
    const radius = circle.r.baseVal.value;
    const circumference = 2* Math.PI * radius; 
    console.log(circumference);

    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;
    function setTime(p){
      const offset = circumference - (p/100)*circumference;
      circle.style.strokeDashoffset = offset;
    }

    let x =106;
    setInterval(()=>{
      if(x>=0){
          setTime(x);
          x= x - 0.1;
      } else {
        circle.style.stroke = 'red';
        setTime(100);
      }
      
    },60)

    
  }


export default class Sprint {
  constructor() {
    this.container = null;

    /* this.state = {
      click: false,
      error: null,
      isLoaded: false,
      items: [],
 } */
  }


  // при иницилизации сразу создаем html и вешаем обработчики
  onInit (anchor) {
    const container = anchor.append(this.render())
     this.addEventListeners() 
    return container
  }
  


  // вешаем обработчики
   addEventListeners  () {
    this.container.querySelector('.start-btn').addEventListener('click', () => {
      this.StartGame();

    })
  }

StartGame() {
let state = {
  click: false,
  error: null,
  isLoaded: false,
  items: [], 
}
  


 let arr =[];
function getRandomInt(max) {
    let x = Math.floor(Math.random() * Math.floor(max));
        arr.push(x);
  }
for(let i=0;i<6;i++){
getRandomInt(30);
}
let uniq = Array.from(new Set(arr));
for(let i=0;i<uniq.length;i++){
uniq[i] =  fetch(`https://afternoon-falls-25894.herokuapp.com/words?page=${uniq[i]}&group=0`)
}
Promise.all(uniq).then(res=>{
    return Promise.all(res.map(r => r.json()));
}).then(res=>[].concat(...res))
.then((result) => {
  console.log(result);
  state.isLoaded = true;
  state.items = [...result];
  if(state.isLoaded){
    delay(500).then(()=>{
    document.querySelector('.box').innerHTML = `
    <div class="sprint-box">
          <svg class="timer" width='120px' height='120px'>
          <circle class="timer__circle" fill='transparent' stroke-width='4' cx='60' cy='60' r='52'/>
        </svg>
  </siv>
  `
  setTimer();
  }); 
  }
}
)

            if(!state.isLoaded){
                  document.querySelector('.box').innerHTML = `
                  <div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                `
          }
}



  render () {
    
    const container = document.createElement('div');
    container.classList.add('box')
    
    container.innerHTML = `
                            <div class="start-btn">
                              <svg>
                                <rect x="0" y="0" fill="none" width="100%" height="100%"/>
                              </svg>
                               <p> Start game </p>
                            </siv>
                       `
    this.container = container;                   
    
    return container
  }
}