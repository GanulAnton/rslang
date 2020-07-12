/* eslint-disable no-console */
/* eslint-disable no-lonely-if */
/* eslint-disable linebreak-style */
import {
  setWords, createArrayForApp, fillRussianWords, playAudio, createImage, createTag, getLearnedWords, setLearnedWords
} from './wordsAPI';
import {
  successSound, mistakeSound, URL_TO_BACK,
} from './definitions';
import './AudioStyle.css';

export default function AudioChallenge(cb) {
  let user = null;
  const callbacks = cb;
  let mistakesCount = 0;
  let successCount = 0;

  const onInit = (anchor) => {
    mistakesCount = 0;
    successCount = 0;
    user = callbacks.getUserCallback();
    const container = renderAudioChallenge(anchor);
    addEventListeners();
    return container;
  };

  const renderAudioChallenge = (anchor) => {
    /// ////INTRO PAGE
    const MY_APP_CONTAINER = createTag('div', anchor, 'my-app-container');
    const INTRO = createTag('div', MY_APP_CONTAINER, 'audio_intro');
    const START_FORM = createTag('form', INTRO, 'audio_start-form');
    const TITLE = createTag('h2', START_FORM, 'audio_title');
    TITLE.textContent = 'Аудиовызов';
    const INTRO_TEXT = createTag('p', START_FORM, 'audio_intro-text');
    INTRO_TEXT.textContent = 'Тебе необходимо выбрать правильный вариант перевода из предлагаемых пяти, после произнесения слова.';
    const TEXT_FOR_CHECKBOX = createTag('p', START_FORM, 'audio-text-for-checkbox');
    TEXT_FOR_CHECKBOX.textContent = 'Играть с моими словами';
    const CHECKBOX = createTag('input', TEXT_FOR_CHECKBOX, 'audio-checkbox-my-words');
    CHECKBOX.type = 'checkbox';
    const DIFFICULTY_LEVEL = createTag('span', START_FORM, 'audio_difficulty-level');
    const DIFFICULTY_LEVEL_SELECT = createTag('select', DIFFICULTY_LEVEL, 'audio-difficulty-level-select');
    const DIFFICULTY_LEVEL_SELECT_OPTION_TEXT = createTag('option', DIFFICULTY_LEVEL_SELECT, '');
    DIFFICULTY_LEVEL_SELECT_OPTION_TEXT.value = '';
    DIFFICULTY_LEVEL_SELECT_OPTION_TEXT.hidden = true;
    DIFFICULTY_LEVEL_SELECT_OPTION_TEXT.textContent = 'Выберите уровень сложности';
    for (let i = 1; i < 7; i++) {
      const option = createTag('option', DIFFICULTY_LEVEL_SELECT, 'main_page_option');
      option.value = i;
      option.textContent = i;
    }
    const ROUND_NUMBER = createTag('span', START_FORM, 'audio_round-number');
    const ROUND_NUMBER_SELECT = createTag('select', ROUND_NUMBER, 'audio-round-number-select');
    const ROUND_NUMBER_SELECT_OPTION_TEXT = createTag('option', ROUND_NUMBER_SELECT, '');
    ROUND_NUMBER_SELECT_OPTION_TEXT.value = '';
    ROUND_NUMBER_SELECT_OPTION_TEXT.hidden = true;
    ROUND_NUMBER_SELECT_OPTION_TEXT.textContent = 'Выберите номер раунда';
    for (let i = 1; i < 7; i++) {
      const option = createTag('option', ROUND_NUMBER_SELECT, '');
      option.value = i;
      option.textContent = i;
    }
    const TAG_P_FOR_BUTTON_INTRO = createTag('p', START_FORM, 'audio_intro-button-wrapper');
    const INTRO_BUTTON = createTag('button', TAG_P_FOR_BUTTON_INTRO, 'audio_btn');
    INTRO_BUTTON.classList.add('audio_intro-btn');
    const TEXT_INTRO_BUTTON = createTag('span', INTRO_BUTTON, 'audio_text-intro-button');
    TEXT_INTRO_BUTTON.textContent = 'Начать';

    /// /////MAIN PAGE
    const CONTAINER = createTag('div', MY_APP_CONTAINER, 'audio_container');
    CONTAINER.classList.add('audio_hidden');
    const GAME_INTERACTION_WRAPPER = createTag('div', CONTAINER, 'audio_game_interaction__wrapper');
    const SOUND_BUTTON = createTag('div', GAME_INTERACTION_WRAPPER, 'audio_sound_button');
    const IMG_WRAPPER = createTag('div', GAME_INTERACTION_WRAPPER, 'audio_image');
    IMG_WRAPPER.classList.add('audio_hidden');
    const IMAGE_ON_MAIN_PAGE = createTag('img', IMG_WRAPPER, 'audio_image_on_main_page');
    const ENGLISH_TRANSLATE = createTag('div', GAME_INTERACTION_WRAPPER, 'audio_english_translate');
    ENGLISH_TRANSLATE.classList.add('audio_hidden');
    const RUSSIAN_WORDS_WRAPPER = createTag('div', CONTAINER, 'audio_russian_words__wrapper');
    for (let i = 1; i < 6; i++) {
      const rusWord = createTag('div', RUSSIAN_WORDS_WRAPPER, 'audio_russian_word_to_choose');
    }
    const DONT_KNOW_BUTTON_WRAPPER = createTag('div', CONTAINER, 'audio_dont_know_button__wrapper');
    const DONT_KNOW_BUTTON = createTag('button', DONT_KNOW_BUTTON_WRAPPER, 'audio_dont_know_button');
    DONT_KNOW_BUTTON.textContent = 'Не знаю';
    const NEXT_BUTTON_WRAPPER = createTag('div', CONTAINER, 'audio_next_button__wrapper');
    const NEXT_BUTTON = createTag('button', NEXT_BUTTON_WRAPPER, 'audio_next_button');
    const NEXT_BUTTON_IMG = document.createElement('img');
    NEXT_BUTTON_IMG.src = '../../assets/img/next.png';
    NEXT_BUTTON.appendChild(NEXT_BUTTON_IMG);
    NEXT_BUTTON.classList.add('audio_hidden');

    /// //////RESULT PAGE
    const RESULTS = createTag('div', MY_APP_CONTAINER, 'audio_results');
    RESULTS.classList.add('audio_hidden');
    const RESULTS_CONTAINER = createTag('div', RESULTS, 'audio_results-container');
    const RESULTS_TITLE = createTag('h2', RESULTS_CONTAINER, 'audio_results-title');
    RESULTS_TITLE.textContent = 'Ваш результат!';
    const SUCCES = createTag('p', RESULTS_CONTAINER, 'audio_succes');
    SUCCES.textContent = 'Правильных ответов:';
    const SUCCES_NUM = createTag('span', SUCCES, 'audio_succes-num');
    const SUCCES_ITEM = createTag('span', SUCCES, 'audio_succes-succes-item');
    const ERRORS = createTag('p', RESULTS_CONTAINER, 'audio_errors');
    ERRORS.textContent = 'Ошибок:';
    const ERRORS_NUM = createTag('span', ERRORS, 'audio_errors-num');
    const ERRORS_ITEM = createTag('div', ERRORS, 'audio_errors-item');
    const RESULT_IMG = createTag('div', RESULTS_CONTAINER, 'audio_result_img');
    const BTNS_RES = createTag('div', RESULTS_CONTAINER, 'audio_btns-res');
    BTNS_RES.classList.add('audio_btns');
    const BUTTON_NEW_GAME = createTag('button', BTNS_RES, 'audio_new-game');
    BUTTON_NEW_GAME.classList.add('audio_btn', 'audio_btn-res');
    BUTTON_NEW_GAME.textContent = 'Начать заново';
    const BUTTON_START = document.querySelector('.audio_intro-btn');
  };

  const addEventListeners = () => {
    let WordsArray = [];
    document.querySelector('.audio_intro-btn').addEventListener('click', async (ev) => {
      ev.preventDefault();
      let LevelOfDifficulty = document.querySelector('.audio-difficulty-level-select').options[document.querySelector('.audio-difficulty-level-select').selectedIndex].text;
      let NumberOfRound = document.querySelector('.audio-round-number-select').options[document.querySelector('.audio-round-number-select').selectedIndex].text;
      if (document.querySelector('.audio-checkbox-my-words').checked) {
        WordsArray = await setLearnedWords({ "userWord.optional.status": "learned" }, user);
        if(WordsArray.length < 16){
            console.log('Недостаточно слов для игры со своими словами');
            return;
        }
        const fiveWordsForPage = createArrayForApp(WordsArray);
        const russianWordsNode = document.querySelectorAll('.audio_russian_word_to_choose');
        const russianWordsArray = Array.from(russianWordsNode);
        fillRussianWords(russianWordsArray, fiveWordsForPage);
        const audioOfWord = `${URL_TO_BACK}${WordsArray[0].audio}`;
        playAudio(audioOfWord);
        document.querySelector('.audio_intro').classList.toggle('audio_hidden');
        document.querySelector('.audio_container').classList.toggle('audio_hidden');
      } else {
        if (!isNaN(LevelOfDifficulty) && !isNaN(NumberOfRound)) {
          WordsArray = await setWords(LevelOfDifficulty, NumberOfRound);
          const fiveWordsForPage = createArrayForApp(WordsArray);
          const russianWordsNode = document.querySelectorAll('.audio_russian_word_to_choose');
          const russianWordsArray = Array.from(russianWordsNode);
          fillRussianWords(russianWordsArray, fiveWordsForPage);
          const audioOfWord = `${URL_TO_BACK}${WordsArray[0].audio}`;
          playAudio(audioOfWord);
          document.querySelector('.audio_intro').classList.toggle('audio_hidden');
          document.querySelector('.audio_container').classList.toggle('audio_hidden');
        } else {
          LevelOfDifficulty = 1;
          NumberOfRound = 1;
          WordsArray = await setWords(LevelOfDifficulty, NumberOfRound);
          const fiveWordsForPage = createArrayForApp(WordsArray);
          const russianWordsNode = document.querySelectorAll('.audio_russian_word_to_choose');
          const russianWordsArray = Array.from(russianWordsNode);
          fillRussianWords(russianWordsArray, fiveWordsForPage);
          const audioOfWord = `${URL_TO_BACK}${WordsArray[0].audio}`;
          playAudio(audioOfWord);
          document.querySelector('.audio_intro').classList.toggle('audio_hidden');
          document.querySelector('.audio_container').classList.toggle('audio_hidden');
        }
      }
    });

    // listener for button "dont know" on main page
    const DONT_KNOW_BTN = document.querySelector('.audio_dont_know_button');
    DONT_KNOW_BTN.addEventListener('click', async (ev) => {
      ev.preventDefault();
      if (WordsArray.length > 5) {
        const firstIndexOfWordsArray = WordsArray[0];
        WordsArray = WordsArray.filter((item) => item !== firstIndexOfWordsArray);
        const fiveWordsForPage = createArrayForApp(WordsArray);
        const russianWordsNode = document.querySelectorAll('.audio_russian_word_to_choose');
        const russianWordsArray = Array.from(russianWordsNode);
        fillRussianWords(russianWordsArray, fiveWordsForPage);
        const audioOfWord = `${URL_TO_BACK}${WordsArray[0].audio}`;
        playAudio(audioOfWord);
        mistakesCount += 1;
      } else {
        document.querySelector('.audio_succes-num').textContent = successCount;
        document.querySelector('.audio_errors-num').textContent = mistakesCount;
        document.querySelector('.audio_results').classList.toggle('audio_hidden');
        document.querySelector('.audio_container').classList.toggle('audio_hidden');
      }
    });
    const NEXT_BTN = document.querySelector('.audio_next_button');
    NEXT_BTN.addEventListener('click', (ev) => {
      ev.preventDefault();
      if (WordsArray.length > 5) {
        const firstIndexOfWordsArray = WordsArray[0];
        WordsArray = WordsArray.filter((item) => item !== firstIndexOfWordsArray);
        const fiveWordsForPage = createArrayForApp(WordsArray);
        const russianWordsNode = document.querySelectorAll('.audio_russian_word_to_choose');
        const russianWordsArray = Array.from(russianWordsNode);
        fillRussianWords(russianWordsArray, fiveWordsForPage);
        const audioOfWord = `${URL_TO_BACK}${WordsArray[0].audio}`;
        playAudio(audioOfWord);
        document.querySelector('.audio_russian_words__wrapper').classList.toggle('audio_disabledWord');
        document.querySelector('.audio_english_translate').classList.toggle('audio_hidden');
        document.querySelector('.audio_image').classList.toggle('audio_hidden');
        document.querySelector('.audio_sound_button').classList.toggle('audio_hidden');
        document.querySelector('.audio_next_button').classList.toggle('audio_hidden');
        document.querySelector('.audio_dont_know_button').classList.toggle('audio_hidden');
      } else {
        document.querySelector('.audio_succes-num').textContent = successCount;
        document.querySelector('.audio_errors-num').textContent = mistakesCount;
        document.querySelector('.audio_results').classList.toggle('audio_hidden');
        document.querySelector('.audio_container').classList.toggle('audio_hidden');
      }
    });

    // listener to 5 rus words on main page
    const russianWordsOnPage = document.querySelectorAll('.audio_russian_word_to_choose');
    Array.from(russianWordsOnPage).forEach((el) => {
      el.addEventListener('click', () => {
        if (WordsArray.length > 5) {
          if (el.textContent === WordsArray[0].wordTranslate) {
            successCount += 1;
            createTag('span', el, 'audio_right_answer');
            const imageWord = `${URL_TO_BACK}${WordsArray[0].image}`;
            document.querySelector('.audio_image_on_main_page').src = createImage(imageWord);
            document.querySelector('.audio_english_translate').textContent = WordsArray[0].word;
            playAudio(successSound);
            document.querySelector('.audio_english_translate').classList.toggle('audio_hidden');
            document.querySelector('.audio_image').classList.toggle('audio_hidden');
            document.querySelector('.audio_next_button').classList.toggle('audio_hidden');
            document.querySelector('.audio_dont_know_button').classList.toggle('audio_hidden');
            document.querySelector('.audio_sound_button').classList.toggle('audio_hidden');
            document.querySelector('.audio_russian_words__wrapper').classList.toggle('audio_disabledWord');
          } else {
            mistakesCount += 1;
            playAudio(mistakeSound);
          }
        } else {
          document.querySelector('.audio_succes-num').textContent = successCount;
          document.querySelector('.audio_errors-num').textContent = mistakesCount;
          document.querySelector('.audio_results').classList.toggle('audio_hidden');
          document.querySelector('.audio_container').classList.toggle('audio_hidden');
        }
      });

      // listener on main page for repeat sound button
      
    });
    document.querySelector('.audio_sound_button').addEventListener('mouseup', (ev) => {
      ev.preventDefault();
      const audioOfWord = `${URL_TO_BACK}${WordsArray[0].audio}`;
      console.log('TESTTESTTEST')
      playAudio(audioOfWord);
    });
    document.querySelector('.audio_english_translate').addEventListener('mousedown', () => {
      const audioOfWord = `${URL_TO_BACK}${WordsArray[0].audio}`;
      
      playAudio(audioOfWord);
    });
    document.querySelector('.audio_new-game').addEventListener('click', () => {
      document.querySelector('.audio_intro').classList.toggle('audio_hidden');
      document.querySelector('.audio_results').classList.toggle('audio_hidden');
      successCount = 0;
      mistakesCount = 0;
    });
    document.querySelector('.audio-checkbox-my-words').addEventListener('click', () => {
      document.querySelector('.audio_difficulty-level').classList.toggle('audio_disabledWord');
      document.querySelector('.audio_round-number').classList.toggle('audio_disabledWord');
    });
  };

  return {
    onInit,
  };
}
