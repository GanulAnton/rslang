export const SpeakIt = () => {
    let difficulty = 1;
    let round = 0;
    let wordsArray;
    let succesWords = [];
    let failWords = [];
    let succesCounter = 0;
    let failCounter = 0; 
    let speakItSuccesContainer;
    let speakItFailContainer;
    let recognizer = new webkitSpeechRecognition();
    recognizer.interimResults = true;
    recognizer.lang = 'en-EN';
    recognizer.continuous = true;
    recognizer.maxAlternatives = 20;
    let synth = window.speechSynthesis;
    let message = new SpeechSynthesisUtterance();
    message.lang = 'en-EN';
    message.volume = 0.5;

    const onInit =  (anchor) => {
      const container = anchor.append(renderSpeakIt())
      addEventListeners()
      return container
    }

    function createElement (tag, parentElement, className){
      const newElement = document.createElement(tag);
      if(!!className) newElement.classList.add(className);
      parentElement.appendChild(newElement);
      return newElement;
    }
  
    const renderSpeakIt = () => {
      const container = document.createElement('div');
      const intro = document.createElement('div');
      const startForm = document.createElement('form');
      const difficultyLevel = document.createElement('span');
      const roundNumber = document.createElement('span');
      const selectDifficultyLevel = document.createElement('select');
      const selectRoundNumber = document.createElement('select');
      const optionDifficultyText = document.createElement('option');
      const optionRoundNumberText = document.createElement('option');
      const pIntroButton = document.createElement('p');
      const introButton = document.createElement('button');
      const title = document.createElement('h2');
      const introText = document.createElement('p');
      const gameContainer = document.createElement('div');
      const score = document.createElement('div');
      const images = document.createElement('div');
      const img = document.createElement('img');
      const imgTranslation = document.createElement('p');
      const input = document.createElement('input');
      const speakItItems = document.createElement('div');
      const item = document.createElement('div');
      const icon = document.createElement('span');
      const iconImg = document.createElement('img');
      const speakItWord = document.createElement('p');
      const speakItTranscription = document.createElement('p');
      const speakItTranslation = document.createElement('p');
      const gameContainerButtons = document.createElement('div');
      const nextRoundButton = document.createElement('button');
      const speakButton = document.createElement('button');
      const resultButton = document.createElement('button');
      const speakItResults = document.createElement('div');
      const speakItResultsContainer = document.createElement('div');
      const speakItErrors = document.createElement('p');
      const speakItErrorsNumber = document.createElement('span');
      const speakItErrorsItems = document.createElement('div');
      const speakItSucces = document.createElement('p');
      const speakItSuccesNumber = document.createElement('span');
      const speakItSuccesItems = document.createElement('div');
      const resultButtons = document.createElement('div');
      const returnButton = document.createElement('button');
      const newGameButton = document.createElement('button');

      container.classList.add('speakIt-main');
      intro.classList.add('speakIt-intro');
      startForm.classList.add('speakIt-start-form');
      selectDifficultyLevel.classList.add('selected-dif');
      selectRoundNumber.classList.add('selected-round');
      difficultyLevel.classList.add('speakIt-difficulty-level');
      roundNumber.classList.add('speakIt-round-number');
      introButton.classList.add('speakIt-btn', 'speakIt-intro-btn');
      title.classList.add('speakIt-title');
      introText.classList.add('speakIt-intro-text');
      gameContainer.classList.add('speakIt-container', 'none');
      score.classList.add('speakIt-score');
      images.classList.add('speakIt-images');
      img.classList.add('speakIt-img');
      imgTranslation.classList.add('speakIt-img-translation');
      input.classList.add('speakIt-input', 'none');
      speakItItems.classList.add('speakIt-items');
      item.classList.add('speakIt-item');
      icon.classList.add('speakIt-audio-icon');
      speakItWord.classList.add('speakIt-word');
      speakItTranscription.classList.add('speakIt-transcription');
      speakItTranslation.classList.add('speakIt-translation');
      gameContainerButtons.classList.add('speakIt-btns');
      nextRoundButton.classList.add('speakIt-btn', 'speakIt-next-round');
      speakButton.classList.add('speakIt-btn', 'speakIt-voice', 'speakIt-user-speach');
      resultButton.classList.add('speakIt-btn', 'speakIt-result');
      speakItResults.classList.add('speakIt-results', 'none');
      speakItResultsContainer.classList.add('speakIt-results-container');
      speakItErrors.classList.add('speakIt-errors');
      speakItErrorsNumber.classList.add('speakIt-errors-num');
      speakItErrorsItems.classList.add('speakIt-errors-items');
      speakItSucces.classList.add('speakIt-succes');
      speakItSuccesNumber.classList.add('speakIt-succes-num');
      speakItSuccesItems.classList.add('speakIt-succes-items');
      resultButtons.classList.add('speakIt-btns', 'speakIt-btns-res');
      returnButton.classList.add('speakIt-btn', 'speakIt-btn-res', 'speakIt-return');
      newGameButton.classList.add('speakIt-btn', 'speakIt-btn-res', 'speakIt-new-game');

      container.append(intro);
      container.append(gameContainer);
      container.append(speakItResults);
      intro.append(title);
      title.textContent = 'SpeakIt';
      intro.append(introText);
      introText.textContent = 'Нажмите на слово, чтобы услышать его произношение, нажмите на кнопку Speak please и начните говорить.';
      intro.append(startForm);
      startForm.append(difficultyLevel);
      difficultyLevel.append(selectDifficultyLevel);
      selectDifficultyLevel.append(optionDifficultyText);
      optionDifficultyText.value = '';
      optionDifficultyText.hidden = true;
      optionDifficultyText.textContent = 'Выберите уровень сложности';
      for (let i = 1; i < 7; i++){
        let option = createElement ('option', selectDifficultyLevel, '');
        option.value = i;
        option.textContent = i;
      }
      startForm.append(roundNumber);
      roundNumber.append(selectRoundNumber);
      selectRoundNumber.append(optionRoundNumberText);
      optionRoundNumberText.value = '';
      optionRoundNumberText.hidden = true;
      optionRoundNumberText.textContent = 'Выберите номер раунда';
      for (let i = 1; i < 7; i++){
        let option = createElement ('option', selectRoundNumber, '');
        option.value = i;
        option.textContent = i;
      }
      startForm.append(pIntroButton);
      pIntroButton.append(introButton);
      introButton.textContent = 'Начать';
      gameContainer.append(score);
      gameContainer.append(images);
      images.append(img);
      img.src = '../assets/img/speakItBlank.jpg';
      images.append(imgTranslation);
      images.append(input);
      gameContainer.append(speakItItems);
      for (let i = 1; i < 11; i++){
        let item = createElement ('div', speakItItems, 'speakIt-item');
        let icon = createElement ('span', item, 'speakIt-audio-icon');
        let iconImg = createElement ('img', icon, '');
        iconImg.src = '../assets/img/speakItSound.jpg';
        let speakItWord = createElement ('p', item, 'speakIt-word');
        let speakItTranscription = createElement ('p', item, 'speakIt-transcription');
        let speakItTranslation = createElement ('p', item, 'speakIt-translation');
      }
      gameContainer.append(gameContainerButtons);
      gameContainerButtons.append(nextRoundButton);
      nextRoundButton.textContent = 'Next Round';
      gameContainerButtons.append(speakButton);
      speakButton.textContent = 'Speak Please';
      gameContainerButtons.append(resultButton);
      resultButton.textContent = 'Results';
      speakItResults.append(speakItResultsContainer);
      speakItResultsContainer.append(speakItErrors);
      speakItErrors.textContent = 'Ошибок ';
      speakItErrors.append(speakItErrorsNumber);
      speakItResultsContainer.append(speakItErrorsItems);
      speakItResultsContainer.append(speakItSucces);
      speakItSucces.textContent = 'Знаю ';
      speakItSucces.append(speakItSuccesNumber);
      speakItResultsContainer.append(speakItSuccesItems);
      speakItResultsContainer.append(resultButtons);
      resultButtons.append(returnButton);
      returnButton.textContent = 'Return';
      resultButtons.append(newGameButton);
      newGameButton.textContent = 'New Game';

      speakItSuccesContainer = speakItSuccesItems;
      speakItFailContainer= speakItErrorsItems;
        
      return container
    }

    const renderSuccesSpeakIt = () => {
      let item = createElement ('div', speakItSuccesContainer, 'speakIt-succes-item');
      let icon = createElement ('span', item, 'speakIt-audio-icon');
      let iconImg = createElement ('img', icon, '');
      iconImg.src = '../assets/img/speakItSound.jpg';
      let speakItWord = createElement ('p', item, 'speakIt-succes-word');
      let speakItTranscription = createElement ('p', item, 'speakIt-succes-transcription');
      let speakItTranslation = createElement ('p', item, 'speakIt-succes-translation');
    }

    const renderFailSpeakIt = () => {
      let item = createElement ('div', speakItFailContainer, 'speakIt-fail-item');
      let icon = createElement ('span', item, 'speakIt-audio-icon');
      let iconImg = createElement ('img', icon, '');
      iconImg.src = '../assets/img/speakItSound.jpg';
      let speakItWord = createElement ('p', item, 'speakIt-fail-word');
      let speakItTranscription = createElement ('p', item, 'speakIt-fail-transcription');
      let speakItTranslation = createElement ('p', item, 'speakIt-fail-translation');
    }

    async function getWords(group, page) {
      const url = `https://afternoon-falls-25894.herokuapp.com/words?group=${group - 1}&page=${page}`;
      const res = await fetch(url);
      return await res.json();
    }

    async function setWords(group, page){
      try {
          let words = await getWords(group, page);
          console.log(words);
          wordsArray = [];
          words.forEach(element => {
              wordsArray.push({word:element.word, wordTranslate: element.wordTranslate, transcription: element.transcription, image: element.image})
          });
          console.log(wordsArray);

          document.querySelectorAll('.speakIt-word').forEach((element, i) => {
            element.textContent = wordsArray[i].word;
          });

          document.querySelectorAll('.speakIt-transcription').forEach((element, i) => {
            element.textContent = wordsArray[i].transcription;
          });

          document.querySelectorAll('.speakIt-translation').forEach((element, i) => {
            element.textContent = wordsArray[i].wordTranslate;
          });

          return wordsArray;

      } catch (error) {
          console.log(error);
      }
    }

    function randomPage(min, max) {
      let rand = min + Math.random() * (max - min);
      return Math.round(rand);
    }

    // function setSuccesWords(){

    // }

    // function setFailWords(){
      
    // }

    const addEventListeners = () => {

      document.querySelector('.speakIt-intro-btn').addEventListener('click', (e) => {
          e.preventDefault();
          document.querySelector('.speakIt-intro').classList.add('none');
          document.querySelector('.speakIt-container').classList.remove('none');
      })

      document.querySelector('.speakIt-result').addEventListener('click', (e) => {
          e.preventDefault();
          document.querySelector('.speakIt-container').classList.add('none');
          document.querySelector('.speakIt-results').classList.remove('none');
      })

      document.querySelector('.speakIt-return').addEventListener('click', (e) => {
          e.preventDefault();
          document.querySelector('.speakIt-results').classList.add('none');
          document.querySelector('.speakIt-container').classList.remove('none');
      })

      document.querySelector('.speakIt-intro-btn').addEventListener('click', (e) => {
        e.preventDefault();
        round =  randomPage(1, 22); 
        difficulty = document.querySelector('.selected-dif').options.selectedIndex;
        setWords(difficulty, round);
      })

      document.querySelectorAll('.speakIt-item').forEach((element, i) => {
        element.addEventListener('click', () =>{
          message.lang = 'en-EN';
          message.text = `${wordsArray[i].word}`;
          synth.speak(message);
          document.querySelector('.speakIt-img-translation').textContent = `${wordsArray[i].wordTranslate}`;
          document.querySelector('.speakIt-img').src = `https://raw.githubusercontent.com/ixionBY/rslang-data/master/${wordsArray[i].image}`;
        })
      });

      document.querySelector('.speakIt-next-round').addEventListener('click', (e) => {
        // succesWords = [];
        // failWords = [];
        const allItems = document.querySelectorAll('.speakIt-item');
        const allWords = document.querySelectorAll('.speakIt-word');
        const allTranscriptions = document.querySelectorAll('.speakIt-transcription');
        const allTranslations = document.querySelectorAll('.speakIt-translation');
        for (let i = 0; i < allItems.length; i++){
          if (allItems[i].classList.contains('succes')){
            succesWords.push({word:allWords[i].textContent, wordTranslate: allTranslations[i].textContent, transcription: allTranscriptions[i].textContent})
          } else {
            failWords.push({word:allWords[i].textContent, wordTranslate: allTranslations[i].textContent, transcription: allTranscriptions[i].textContent})
          }
        }

        for (let i = 0; i < succesWords.length; i++){
          renderSuccesSpeakIt();
          document.querySelectorAll('.speakIt-succes-word').forEach((element, i) => {
            element.textContent = succesWords[i].word;
          });

          document.querySelectorAll('.speakIt-succes-transcription').forEach((element, i) => {
            element.textContent = succesWords[i].transcription;
          });

          document.querySelectorAll('.speakIt-succes-translation').forEach((element, i) => {
            element.textContent = succesWords[i].wordTranslate;
          });
        }

        for (let i = 0; i < failWords.length; i++){
          renderFailSpeakIt();
          document.querySelectorAll('.speakIt-fail-word').forEach((element, i) => {
            element.textContent = failWords[i].word;
          });

          document.querySelectorAll('.speakIt-fail-transcription').forEach((element, i) => {
            element.textContent = failWords[i].transcription;
          });

          document.querySelectorAll('.speakIt-fail-translation').forEach((element, i) => {
            element.textContent = failWords[i].wordTranslate;
          });
        }

        if (round < 29){
          round = round + 1;
          setWords(difficulty, round);
          document.querySelectorAll('.speakIt-item').forEach((element) => element.classList.remove('succes'));
        } else {
          round = 1;
          setWords(difficulty, round);
          document.querySelectorAll('.speakIt-item').forEach((element) => element.classList.remove('succes'));
        }
      });

      document.querySelector('.speakIt-user-speach').addEventListener('click', (e) => {
        e.preventDefault();
        if (document.querySelector('.speakIt-user-speach').classList.contains('game')){
          document.querySelectorAll('.speakIt-item').forEach((element) => element.classList.remove('innactive'));
          document.querySelector('.speakIt-user-speach').classList.remove('game');
          document.querySelector('.speakIt-img-translation').classList.remove('none');
          document.querySelector('.speakIt-input').classList.add('none');
          recognizer.abort();
        } else {
          document.querySelectorAll('.speakIt-item').forEach((element) => element.classList.add('innactive'));
          document.querySelector('.speakIt-user-speach').classList.add('game');
          recognizer.lang = 'en-EN';
          recognizer.start();
        }
      })

      recognizer.onresult = function (event) {
        let result = event.results[event.resultIndex];
        if (result.isFinal) {
          const allItems = document.querySelectorAll('.speakIt-item');
          const allWords = document.querySelectorAll('.speakIt-word');
          document.querySelector('.speakIt-img-translation').classList.add('none');
          document.querySelector('.speakIt-input').classList.remove('none');
          document.querySelector('.speakIt-input').value = result[0].transcript.trim().toLowerCase();
          for (let i = 0; i < allWords.length; i++){
            console.log(allWords[i].textContent == result[0].transcript.trim().toLowerCase());
            if (allWords[i].textContent == result[0].transcript.trim().toLowerCase()){
              console.log('right');
              allItems[i].classList.add('succes');
              console.log(succesWords);
              document.querySelector('.speakIt-img').src = `https://raw.githubusercontent.com/ixionBY/rslang-data/master/${wordsArray[i].image}`;
            }
          } 
        } else {
          console.log('Промежуточный результат: ', result[0].transcript);
        }
      }
    }

    return {
        onInit
    }
}

// const allItems = document.querySelectorAll('.speakIt-item');
// const allWords = document.querySelectorAll('.speakIt-word');
// const allTranscriptions = document.querySelectorAll('.speakIt-transcription');
// const allTranslations = document.querySelectorAll('.speakIt-translation');
// // renderSuccesSpeakIt();
// succesWords.push({word:allWords[i].textContent, wordTranslate: allTranslations[i].textContent, transcription: allTranscriptions[i].textContent})