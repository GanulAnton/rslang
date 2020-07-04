import "./sprint.css"
import {setTimer} from "./timer"

export const Sprint = () => {
    
  let state = {
    click: false,
    error: null,
    isLoaded: false,
    items: [],
    index: 0,
    score: 0, 
    streak: 0,
    prevScore: 0,
}

let arr = [];

const delay = ms =>{
  return new Promise(r=> setTimeout(()=> r(), ms))
}
    
    const onInit =  (anchor) => {
      const container = anchor.append(render()); 
      addEventListeners();
      return container
    }



    
    function addEventListeners() {
      document.querySelector('.start-btn').addEventListener('click', () => {
        StartGame();
      })
    }
    



    function getWords() {
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
      uniq[i] =  fetch(`https://afternoon-falls-25894.herokuapp.com/words?page=${uniq[i]}&group=${state.level}`);
      }
      return Promise.all(uniq).then(res=>{
          return Promise.all(res.map(r => r.json()));
      }).then(res=>[].concat(...res))
      
      .then((result) => {
        state.items = [...result];
         return delay(500).then(()=>{
            document.querySelector('.box').innerHTML = ``;
        }); 
  
      },
      (error)=>{
        state.error = error;
        
    }
      )
    }


    function shuffleItems(){
      let mix = state.items.slice();
      mix.sort(() => Math.random() - 0.5);
      state.items.map((item, index)=>{
        if(state.items[index].wordTranslate!=mix[index].wordTranslate){
          item.false = mix[index].wordTranslate
        } else {
          item.false = 'территориальная целостность';
        }
      });
      arr = state.items.slice();
      arr.sort(() => Math.random() - 0.5);
      
    }

    function getRatndomTranslate(arr){
      let rand = ([arr[state.index].wordTranslate, arr[state.index].false])[Math.floor(Math.random()*2)];
          
      return rand;
    }

    function drawCard(t){

      /* console.log(arr);
      console.log(state.index);
      console.log(state.score); */
      

      document.querySelector('.sprint-box').innerHTML = `
              <div class="sprint-box-top">
                Your score: ${state.score}
              </div >
              <div class="sprint-box-mid">

                  <h2>${arr[state.index].word}</h2>
                  <h2>${getRatndomTranslate(arr)}</h2>

              </div>
              <div class="sprint-box-bot">
                     <div class='play-btn NotCorrect-btn'> Не верно </div>
                     <div class='play-btn Correct-btn'> Верно </div>
              </div>
              <div class="set-box">
                <div class='set-btn'> A </div>
                <div class='set-btn'> A </div>
                <div class='exit-btn'> X </div>
              </div>
      `;
      document.querySelector('.Correct-btn').addEventListener('click', ()=>{
        if(document.querySelector("#app > div > div > div.sprint-box-mid > h2:nth-child(2)").textContent == arr[state.index].wordTranslate){
          console.log('это слово правильное');
           handleCorrect(); 
        } else {
          console.log('это слово не правильное');
           handleNotCorrect(); 
        }
        if(state.index<arr.length){
          state.index++;
          delay(1000).then(()=>{
            drawCard()
          });
        } else {
            finishGame(); 
        }
      })

      document.querySelector('.NotCorrect-btn').addEventListener('click', ()=>{
        if(document.querySelector("#app > div > div > div.sprint-box-mid > h2:nth-child(2)").textContent == arr[state.index].false){
          console.log('это слово не правильное');
           handleCorrect(); 
        } else {
          console.log('это слово правильное');
           handleNotCorrect(); 
        }

        if(state.index<arr.length){
          state.index++;
          delay(1000).then(()=>{
            drawCard()
          });
        } else {
            finishGame();
        }

      })

      document.querySelector('.exit-btn').addEventListener('click', ()=>{
        clearTimeout(t);
        finishGame();
      })

    }


    function  handleCorrect(){
      let points;
      state.streak++;
      if(state.streak>=8){
        points = 40;
        state.score = state.score+40;
      } else if(state.streak>=4){
          state.score = state.score+20;
          points = 20;
      } else {
        state.score = state.score+10;
        points = 10;
      }
      
      document.querySelector('.sprint-box').innerHTML = `
        <div class='correctWord'>
        <h2>+${points} points</h2>
        </div>
      `
    }
   
    function  handleNotCorrect(){
      state.streak = 0;
      document.querySelector('.sprint-box').innerHTML = `
        <div class='incorrectWord'>
        <h2>+0 points</h2>
        </div>
      `
    }

    function StartGame() {
      
      state = {
        click: false,
        error: null,
        isLoaded: false,
        items: [],
        index: 0,
        score: 0,
        streak: 0,
        level: document.querySelector('#hardness').value - 1,
    }
      document.querySelector('.box').innerHTML = `
      <div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    `;
     
      getWords().then(()=>{
         if(state.error){
          document.querySelector('.box').innerHTML = ``;
          document.querySelector(".box").insertAdjacentHTML('afterbegin', `<div class='black'>error</div>`);
        } else {
          
          setTimer();
          shuffleItems(); 
         let t = setTimeout(() => {
             finishGame(); 
           }, 65000);

          document.querySelector(".box").insertAdjacentHTML('afterbegin', ` <div class="sprint-box"></div>`);

          drawCard(t);
         } 
        
      })
      .catch(e => console.error(e));
        
    }


    function finishGame(){
      document.querySelector('.timer').innerHTML = ``;
      setTimer(1);
      document.querySelector('.sprint-box').innerHTML = `
              <div class="sprint-box-top">
                Game is over!
              </div >
              <div class="sprint-box-mid">

                  <h2>Your score: ${state.score}</h2>

              </div>
              <div class="sprint-box-bot">
                     <div class='play-btn back-btn'> Назад </div>
              </div>
      `;
      state.prevScore = state.score;
      document.querySelector('.back-btn').addEventListener('click', ()=>{
        startRender();
      })
    }









function startRender() {
  
  document.querySelector('.box').innerHTML = `
                                              <h2 class='prev_score'>Previous score: ${state.prevScore}</h2>
                                              <div class="start-btn">
                                                <svg>
                                                  <rect x="0" y="0" fill="none" width="100%" height="100%"/>
                                                </svg>
                                                <p> Start game </p>
                                              </div>
                                              <div class="level">
                                              <label for="hardness">уровень сложности:</label>
                                              <select id="hardness">
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                                <option value="6">6</option>
                                              </select>
                                            </div>
                                              `;
    document.querySelector('.start-btn').addEventListener('click', () => {
      StartGame();
    })                                   
}

   

    const render = () => {
      const container = document.createElement('div');
      container.classList.add('box')
      container.innerHTML = `
                            <div class="start-btn">
                              <svg>
                                <rect x="0" y="0" fill="none" width="100%" height="100%"/>
                              </svg>
                               <p> Start game </p>
                            </div>
                            <div class="level">
                              <label for="hardness">уровень сложности:</label>
                              <select id="hardness">
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                              </select>
                            </div>
                            
                       `;           
    return container 
    }

    
    return {
      onInit
    }
}