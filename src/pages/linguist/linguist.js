import MainPage from "../mainPage"
import './linguist.css'
// todo is answered obnulit` show answer render next sdelat`
export default function Linguist () {
  let data = null;
  let currentIndex = 0;
  let answer = '';
  let isAnswered = false;
  let needTranslate = true;
  let needAudio = false;
  let questionRef = null;
  let exampleRef = null;
  let meaningRef = null;
  let translationContRef = null;
  let additionalRef = null;
  let vocabularyRef = null;
  let translationBtnRef = null;
  let audioBtnRef = null;
  let hardWordBtnRef = null;
  let deleteWordBtnRef = null;
  let showAnswerBtnRef = null;
  let nextBtnRef = null;
  const settings = {
    wordsPerDay: '20',
    newWords: '10',
    hint: {
      translation: true,
      meaning: true,
      example: true,
    },
    additional: {
      transcription: true,
      image: true,
    },
    vocabulary: true,
    showAnswer: true,
  };

  const getData = () => {
    // fetch(`https://afternoon-falls-25894.herokuapp.com/words?page=1&group=0`)
    fetch(`http://pacific-castle-12388.herokuapp.com/words?page=1&group=0`)
    .then(response => response.json())
    .then(json => {
      console.log(json)
      data = json;
    
      renderCard();
    })  
  }

  const setAnswer = () => {
    answer = data[currentIndex].word;
  }

  const makeQuestion = (str, marker) => {
    let result = "";

    str.split(" ").forEach((word) => {
      if(word.includes(marker)) {
        return  result +=`<div class="linguist-answer-input-cont"><input type="text" class="linguist-answer-input" size=${answer.length}/></div>`;
      }
      return  result += `<span>${word}</span>`;
    })
    return result;
  }

  const makeHint = (str, marker) => {
    let result = "";

    str.split(" ").forEach((word) => {
      if(word.includes(marker)) {
        return  result +=`<span>...</span>`;
      }
      return  result += `<span>${word}</span>`;
    })
    return result;
  }

  const setRefs = () => {
    questionRef = document.querySelector(".linguist-card-question");
    exampleRef = document.querySelector(".linguist-card-example");
    meaningRef = document.querySelector('.linguist-card-meaning')
    translationContRef = document.querySelector(".linguist-card-translation");
    additionalRef = document.querySelector(".linguist-card-additional");
    vocabularyRef = document.querySelector(".linguist-card-vocabulary");
    translationBtnRef = document.querySelector(".linguist-translate-btn");
    audioBtnRef = document.querySelector(".linguist-audio-btn");
    hardWordBtnRef = document.querySelector(".linguist-hardWord-btn");
    deleteWordBtnRef = document.querySelector(".linguist-deleteWord-btn");
    showAnswerBtnRef = document.querySelector(".linguist-showAnswer-btn");
    nextBtnRef = document.querySelector(".linguist-next-btn");
  }

  const setInputFocus = () => {
    questionRef.querySelector(".linguist-answer-input").focus();
  }

  const renderCard = () => {
    setAnswer();
    questionRef.innerHTML = makeQuestion(data[currentIndex].textExample, "<b>");
    setInputFocus();
    const { translation, meaning } = settings.hint 
    exampleRef.innerHTML = makeHint(data[currentIndex].textExampleTranslate, "<b>");

    if(meaning) {
      meaningRef.innerHTML = makeHint(data[currentIndex].textMeaning, "<i>");
      exampleRef.classList.add('linguist__margin-bottom');
    }

    if(translation) {    
      translationContRef.innerHTML = makeHint(data[currentIndex].wordTranslate);
      meaningRef.classList.add('linguist__margin-bottom');
    }

    if(settings.additional.transcription) {
      additionalRef.innerHTML = `<span>${data[currentIndex].transcription}</span>`;
      additionalRef.classList.add('linguist__margin-bottom');
    }

    if(settings.vocabulary) {
      vocabularyRef.classList.remove('linguist-display-none');
    }

    if(settings.showAnswer) {
      showAnswerBtnRef.classList.remove('linguist-display-none')
    }
  }

  const render = () => {
    const container = document.createElement('div');

    container.classList.add('linguist-container');

    container.innerHTML = `<h2>Linguist</h2>
    <a href="#" class="link">Back</a>
    <div class="linguist-main-cont">
        <div class="linguist-additional-control">
          <button class="linguist-btn linguist-translate-btn linguist-btn__active">T</button> 
          <button class="linguist-btn linguist-audio-btn">A</button> 
        </div>
        <div class="linguist-card-cont">
          <div class="linguist-card-question">
          </div>
          <div class="linguist-card-hint">
            <div class="linguist-card-example"></div>
            <div class="linguist-card-meaning"></div>
            <div class="linguist-card-translation"></div>
          </div>
          <div class="linguist-card-additional">
          </div>
          <div class="linguist-card-vocabulary linguist__margin-bottom linguist-display-none">
            <button class="linguist-hardWord-btn linguist-btn">Add hard word</button>
            <button class="linguist-deleteWord-btn linguist-btn">Delete word</button>
          </div>
          <div class="linguist-card-control">
            <button class="linguist-showAnswer-btn linguist-btn linguist-display-none">Show Answer</button>
            <button class="linguist-next-btn linguist-btn">Next</button>
          </div>
         </div>
    </div>
    <div class="linguist-after-game"></div>`;

    return container
  }

  const showMistakes = () => {
    const inputCont = questionRef.querySelector('.linguist-answer-input-cont');
    const input = questionRef.querySelector('.linguist-answer-input');
    let result = '';
    answer.split("").forEach((el, i) => {
      if(el === input.value[i]) {
        return result += `<span class="linguist-letter linguist__right">${el}</span>`
      } else {
        return result += `<span class="linguist-letter linguist__wrong">${el}</span>`
      }
    })

    inputCont.innerHTML = result;

    setTimeout(() => {
      const letters = questionRef.querySelectorAll('.linguist-letter');
      inputCont.classList.add('linguist__opacity')
      letters.forEach( el => {
        const letter = el;
        return letter.classList.add('linguist__text-color');
      })
    }, 2000)

    inputCont.addEventListener('click', () => {
      inputCont.classList.remove('linguist__opacity');
      questionRef.innerHTML = makeQuestion(data[currentIndex].textExample, "<b>");
      setInputFocus();
    })
  }

  const playAudio = () => {
    const word = new Audio();
    word.preload = 'auto';
    word.src = `https://raw.githubusercontent.com/irinainina/rslang-data/master/${data[currentIndex].audio}`;
    word.play();

    const example = new Audio();
    example.preload = 'auto';
    example.src = `https://raw.githubusercontent.com/irinainina/rslang-data/master/${data[currentIndex].audioExample}`;

    let meaning = null;

    if(settings.hint.meaning) {
      meaning = new Audio();
      meaning.preload = 'auto';
      meaning.src = `https://raw.githubusercontent.com/irinainina/rslang-data/master/${data[currentIndex].audioMeaning}`;

      meaning.addEventListener('ended', () => {
        changeCard();
        console.log('end meaning')
      })
    }
   
    word.addEventListener('ended', () => {
      example.play();
      console.log('end')
    })
    
    example.addEventListener('ended', () => {
      if(meaning) {
        meaning.play();
      } else {
        console.log('end example')
        changeCard()
      }
    })

  }

  const showTranslation = () => {
    if(settings.hint.meaning) {
      meaningRef.innerHTML = `<span>${data[currentIndex].textMeaning} - ${data[currentIndex].textMeaningTranslate}</span>`
    }

    if(settings.hint.translation) {
      translationContRef.innerHTML = `<span>${data[currentIndex].word} - ${data[currentIndex].wordTranslate}.</span>`
    }
  }

  const showAnswer = () => {
    isAnswered = true;
    questionRef.querySelector(".linguist-answer-input-cont").classList.remove('linguist__opacity')
    questionRef.querySelector(".linguist-answer-input-cont").innerHTML = `<span class="linguist__right">${answer}</span>`;
     // show meaning with answer without translate
    if(settings.hint.meaning) {
      meaningRef.innerHTML = `<span>${data[currentIndex].textMeaning}</span>`
    }
  }

  const changeCard = () => { 
    // end 
    if(currentIndex !== settings.wordsPerDay -1) {
      isAnswered = false;
      currentIndex += 1;
      renderCard();
    } else {
      console.log("na segodnya vse")
      return
    }
  }

  const addEventListeners = () => {
    nextBtnRef.addEventListener('click', () => {
      if(isAnswered) {
        console.log('go next')

        if(needTranslate) {
          showTranslation()
        } 

        if(needAudio) {
          playAudio();
          return
        }
        setTimeout(() => {
          changeCard();
        }, 10000)
        return
      }

      const input = document.querySelector('.linguist-answer-input');

      if(input.value === answer) {
        showAnswer();
        
        // show meaning with answer without translate
        if(settings.hint.meaning) {
          meaningRef.innerHTML = `<span>${data[currentIndex].textMeaning}</span>`
        }

        if(needTranslate) {
          showTranslation()
        } 

        if(needAudio) {
          playAudio();
          return;
        }

        setTimeout(() => {
          changeCard();
        }, 10000)
      } else {
        showMistakes()
      }
    })

    showAnswerBtnRef.addEventListener('click', () => {
      showAnswer()
    })

    translationBtnRef.addEventListener('click',() => {
      needTranslate = !needTranslate;
      translationBtnRef.classList.toggle('linguist-btn__active')
    })

    audioBtnRef.addEventListener('click',() => {
      needAudio = !needAudio;
      audioBtnRef.classList.toggle('linguist-btn__active')
    })

    document.querySelector('.link').addEventListener('click', () => {
      const mainPage = MainPage();
      document.querySelector('#app').innerHTML= "";
      mainPage.onInit(document.querySelector('#app'))
    })
  }

  const onInit = (anchor) => {
    const container = anchor.append(render());
    setRefs();
    getData();
    addEventListeners();

    return container;
  }

  return {
    onInit
  }
}