import "./sprint.css";
/* import { doc } from "prettier"; */


const delay = ms =>{
  return new Promise(r=> setTimeout(()=> r(), ms))
}

function setTimer(){

    const circle = document.querySelector('.timer__circle');
    const radius = circle.r.baseVal.value;
    const circumference = 2* Math.PI * radius; 
    circle.style.stroke = '#2ecc71';

    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;
    function setTime(p){
      const offset = circumference - (p/100)*circumference;
      circle.style.strokeDashoffset = offset;
    }

    let x =106;
    let timerID = setInterval(()=>{
      if(x>=0){
          setTime(x);
          x= x - 0.1;
          if(x<25){
            circle.style.stroke = '#d35400';
          } else if(x<50){
            circle.style.stroke = '#f1c40f';
          }
      } else {
        circle.style.stroke = 'red';
        setTime(100);
      }
      
    },60)

    setTimeout(() => {clearInterval(timerID); circle.style.stroke = 'red'; setTime(100);}, 65000);
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
  index: 0,
  score: 0, 
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
  state.isLoaded = true;
  state.items = [...result];
  if(state.isLoaded){
    delay(500).then(()=>{
     drawCard(state.items, state.index, state.score) /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! перенести вверх фунуции */
    setTimer();
    document.querySelector('.handleCorrect').addEventListener('click', ()=>{
      document.querySelector('.sprint-box-mid').classList.add('correctWord');
      
    }) 
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

function drawCard(items, index, score){
  
  let arr = items.slice();
  arr.sort(() => Math.random() - 0.5);


  document.querySelector('.box').innerHTML = `
        <div class="sprint-box">
              <svg class="timer" width='120px' height='120px'>
              <circle class="timer__circle" fill='transparent' stroke-width='4' cx='60' cy='60' r='52'/>
              </svg>
              <div class="sprint-box-top">
                Your score: ${score}
              </div >
              <div class="sprint-box-mid">

                  <h2> ${items[index].word}</h2>
                  <h2> ${items[index].wordTranslate}</h2>

              </div>
              <div class="sprint-box-bot">
                     <div class='exit-btn'> X </div>
                     <div class='play-btn handleNotCorrect'> Не верно </div>
                     <div class='play-btn handleCorrect'> Верно </div>
              </div>
      </siv>
      `;
}
