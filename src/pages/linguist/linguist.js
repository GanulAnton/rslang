import './linguist.css';

export default function Linguist(userSettings, cb) {
  const callbacks = cb;
  let data = null;
  let currentIndex = 0;
  let error = 0;
  let answer = '';
  let isAnswered = false;
  let needTranslate = true;
  let needAudio = false;
  let counterRef = null;
  let containerRef = null;
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
    ...userSettings.optional.linguist,
  };
  const words = [];

  const render = () => {
    const container = document.createElement('div');

    container.classList.add('linguist-container');

    container.innerHTML = `
    <div class="linguist-main-cont">
        <div class="linguist-additional-control">
          <button class="linguist-btn linguist-translate-btn linguist-btn__active">T</button> 
          <button class="linguist-btn linguist-audio-btn">A</button> 
        </div>   
        <div class="linguist-card-cont">
          <div class="linguist-card-image">
          </div>
          <div class="linguist-card-hint">
            <div class="linguist-card-example"></div>
            <div class="linguist-card-example-translate"></div>
            <div class="linguist-card-meaning"></div>
            <div class="linguist-card-meaning-translate"></div>
            <div class="linguist-card-translation"></div>
          </div>
          <div class="linguist-card-additional">
          </div>
          <div class="linguist-card-vocabulary linguist__margin-bottom linguist__display-none">
            <button class="linguist-hardWord-btn linguist-btn">Add hard word</button>
            <button class="linguist-deleteWord-btn linguist-btn">Delete word</button>
          </div>
          <div class="linguist-card-question">
          </div>
          <div class="linguist-card-control">
            <button class="linguist-showAnswer-btn linguist-btn linguist__display-none">Show Answer</button>
            <button class="linguist-next-btn linguist-btn">Next</button>
          </div>
         </div>
    </div>
    <div class="linguist-additional-counter">
      <div class="linguist-additional-counter-container"></div>
    </div>`;

    containerRef = container;

    return container;
  };

  const setAnswer = () => {
    answer = data[currentIndex].word;
  };

  const makeQuestion = () => `<div class="linguist-answer-input-cont"><input type="text" class="linguist-answer-input" size=${answer.length}/></div>`;

  const makeHint = (str, marker) => {
    let result = '';

    str.split(' ').forEach((word) => {
      if (word.includes(marker)) {
        result += '<span>...</span>';
        return result;
      }
      result += `<span>${word}</span>`;
      return result;
    });
    return result;
  };

  const setInputFocus = () => {
    questionRef.querySelector('.linguist-answer-input').focus();
  };

  const renderCard = () => {
    counterRef.innerHTML = `<span>${currentIndex + 1} from ${settings.wordsPerDay}</span>`;

    nextBtnRef.classList.remove('linguist__display-none');
    setAnswer();
    questionRef.innerHTML = makeQuestion(data[currentIndex].textExample, '<b>');
    setInputFocus();
    const { example, translation, meaning } = settings.hint;

    if (settings.additional.image) {
      if (document.querySelector('.linguist-card-image')) {
        document.querySelector('.linguist-card-image').innerHTML = `<img src="https://raw.githubusercontent.com/GanulAnton/rslang-data/master/${data[currentIndex].image}" loading="lazy">`;
      }
    }

    if (example) {
      exampleRef.innerHTML = makeHint(data[currentIndex].textExample, '<b>');
      exampleRef.classList.add('linguist__margin-bottom');
    }

    if (meaning) {
      meaningRef.innerHTML = makeHint(data[currentIndex].textMeaning, '<i>');
      meaningRef.classList.add('linguist__margin-bottom');
    }

    if (translation) {
      translationContRef.innerHTML = makeHint(data[currentIndex].wordTranslate);
    }

    if (settings.additional.transcription) {
      additionalRef.innerHTML = `<span>${data[currentIndex].transcription}</span>`;
      additionalRef.classList.add('linguist__margin-bottom');
    }

    if (settings.vocabulary) {
      vocabularyRef.classList.remove('linguist__display-none');
    }

    if (settings.showAnswer) {
      showAnswerBtnRef.classList.remove('linguist__display-none');
    }
  };

  const changeCard = () => {
    // end
    if (currentIndex !== settings.wordsPerDay - 1) {
      isAnswered = false;
      currentIndex += 1;
      error = 0;
      renderCard();
    } else {
      callbacks.setWordsCallback(words);
      console.log('na segodnya vse');
    }
  };

  const setRefs = () => {
    counterRef = containerRef.querySelector('.linguist-additional-counter-container');
    questionRef = containerRef.querySelector('.linguist-card-question');
    exampleRef = containerRef.querySelector('.linguist-card-example');
    meaningRef = containerRef.querySelector('.linguist-card-meaning');
    translationContRef = containerRef.querySelector('.linguist-card-translation');
    additionalRef = containerRef.querySelector('.linguist-card-additional');
    vocabularyRef = containerRef.querySelector('.linguist-card-vocabulary');
    translationBtnRef = containerRef.querySelector('.linguist-translate-btn');
    audioBtnRef = containerRef.querySelector('.linguist-audio-btn');
    hardWordBtnRef = containerRef.querySelector('.linguist-hardWord-btn');
    deleteWordBtnRef = containerRef.querySelector('.linguist-deleteWord-btn');
    showAnswerBtnRef = containerRef.querySelector('.linguist-showAnswer-btn');
    nextBtnRef = containerRef.querySelector('.linguist-next-btn');
  };

  const showTranslation = () => {
    if (settings.hint.example) {
      containerRef.querySelector('.linguist-card-example-translate').innerHTML = `<span>${data[currentIndex].textExampleTranslate}</span>`;
      containerRef.querySelector('.linguist-card-example-translate').classList.add('linguist__margin-bottom');
    }

    if (settings.hint.meaning) {
      containerRef.querySelector('.linguist-card-meaning-translate').innerHTML = `<span>${data[currentIndex].textMeaningTranslate}</span>`;
      containerRef.querySelector('.linguist-card-meaning-translate').classList.add('linguist__margin-bottom');
    }
  };

  const clearTranslation = () => {
    if (settings.hint.example) {
      containerRef.querySelector('.linguist-card-example-translate').innerHTML = '';
      containerRef.querySelector('.linguist-card-example-translate').classList.remove('linguist__margin-top');
    }

    if (settings.hint.meaning) {
      containerRef.querySelector('.linguist-card-meaning-translate').innerHTML = '';
      containerRef.querySelector('.linguist-card-meaning-translate').classList.remove('linguist__margin-top');
    }
  };

  const showMistakes = () => {
    const inputCont = questionRef.querySelector('.linguist-answer-input-cont');
    const input = questionRef.querySelector('.linguist-answer-input');
    let result = '';
    answer.split('').forEach((el, i) => {
      if (el === input.value[i]) {
        result += `<span class="linguist-letter linguist__right">${el}</span>`;
        return result;
      }
      result += `<span class="linguist-letter linguist__wrong">${el}</span>`;
      return result;
    });

    inputCont.innerHTML = result;

    setTimeout(() => {
      const letters = questionRef.querySelectorAll('.linguist-letter');
      inputCont.classList.add('linguist__opacity');
      letters.forEach((el) => {
        const letter = el;
        return letter.classList.add('linguist__text-color');
      });
    }, 1000);

    inputCont.addEventListener('click', () => {
      inputCont.classList.remove('linguist__opacity');
      questionRef.innerHTML = makeQuestion(data[currentIndex].textExample, '<b>');
      setInputFocus();
    });
  };

  const playAudio = () => {
    const word = new Audio();
    word.preload = 'auto';
    word.src = `https://raw.githubusercontent.com/GanulAnton/rslang-data/master/${data[currentIndex].audio}`;
    word.play();

    const example = new Audio();
    example.preload = 'auto';
    example.src = `https://raw.githubusercontent.com/GanulAnton/rslang-data/master/${data[currentIndex].audioExample}`;

    let meaning = null;

    if (settings.hint.meaning) {
      meaning = new Audio();
      meaning.preload = 'auto';
      meaning.src = `https://raw.githubusercontent.com/GanulAnton/rslang-data/master/${data[currentIndex].audioMeaning}`;

      meaning.addEventListener('ended', () => {
        if (needTranslate) {
          clearTranslation();
        }
        changeCard();
      });
    }

    word.addEventListener('ended', () => {
      example.play();
    });

    example.addEventListener('ended', () => {
      if (meaning) {
        meaning.play();
      } else {
        if (needTranslate) {
          clearTranslation();
        }
        changeCard();
      }
    });
  };

  const showAnswer = () => {
    isAnswered = true;
    questionRef.querySelector('.linguist-answer-input-cont').classList.remove('linguist__opacity');
    questionRef.querySelector('.linguist-answer-input-cont').innerHTML = `<span class="linguist__right">${answer}</span>`;
    // show meaning with answer without translate
    if (settings.hint.meaning) {
      meaningRef.innerHTML = `<span>${data[currentIndex].textMeaning}</span>`;
    }

    if (settings.hint.example) {
      exampleRef.innerHTML = `<span>${data[currentIndex].textExample}</span>`;
    }
  };

  const prepareCardBeforeChange = () => {
    nextBtnRef.classList.add('linguist__display-none');

    if (needTranslate) {
      showTranslation();
    }

    if (needAudio) {
      playAudio();
      if (needTranslate) {
        clearTranslation();
      }
      return;
    }
    setTimeout(() => {
      changeCard();
      if (needTranslate) {
        clearTranslation();
      }
    }, 10000);
  };

  const checkAnswer = () => {
    const wordInfo = { id: data[currentIndex]._id, status: 'inProgress', isUpdated: false };

    if (data[currentIndex].userWord) {
      wordInfo.isUpdated = true;
    }

    if (isAnswered) {
      prepareCardBeforeChange();
      words.push(wordInfo);
      return;
    }
    const input = document.querySelector('.linguist-answer-input');
    if (input.value === answer) {
      if (error === 0) {
        wordInfo.status = 'learned';
        words.push(wordInfo);
      } else {
        words.push(wordInfo);
      }
      showAnswer();
      prepareCardBeforeChange();
    } else {
      error += 1;
      showMistakes();
    }
  };

  const keydownEnterHandler = (e) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  const addEventListeners = () => {
    nextBtnRef.addEventListener('click', () => {
      checkAnswer();
    });

    document.onkeydown = (e) => keydownEnterHandler(e);

    showAnswerBtnRef.addEventListener('click', () => {
      showAnswer();
    });

    translationBtnRef.addEventListener('click', () => {
      needTranslate = !needTranslate;
      translationBtnRef.classList.toggle('linguist-btn__active');
    });

    audioBtnRef.addEventListener('click', () => {
      needAudio = !needAudio;
      audioBtnRef.classList.toggle('linguist-btn__active');
    });
  };

  const removeEvents = () => {
    document.onkeydown = null;
  };

  const onInit = (anchor, userWords) => {
    const container = anchor.append(render());
    data = userWords;
    setRefs();
    renderCard();
    addEventListeners();

    return container;
  };

  return {
    onInit,
    removeEvents,
  };
}
