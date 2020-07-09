import {setWords, createArrayForApp, fillRussianWords, playAudio, createImage, createTag} from '../components/audio_challenge/wordsAPI';
import { successSound, mistakeSound, URL_TO_BACK } from '../components/audio_challenge/defenitions';

const BODY = document.getElementsByTagName('BODY')[0];
BODY.classList.add('audio_body');
let mistakesCount = 0;
let successCount = 0;

export function createPages() {
    /// ////INTRO PAGE
    const INTRO = createTag('div', BODY, 'audio_intro');
    const START_FORM = createTag('form', INTRO, 'audio_start-form');
    const TITLE = createTag('h2', START_FORM, 'audio_title');
    TITLE.textContent = 'Аудиовызов';
    const INTRO_TEXT = createTag('p', START_FORM, 'audio_intro-text');
    INTRO_TEXT.textContent = 'Тебе необходимо выбрать правильный вариант перевода из предлагаемых пяти, после произнесения слова.';
    const DIFFICULTY_LEVEL = createTag('span', START_FORM, 'audio_difficulty-level');
    const DIFFICULTY_LEVEL_SELECT = createTag('select', DIFFICULTY_LEVEL, '');
    const DIFFICULTY_LEVEL_SELECT_OPTION_TEXT = createTag('option', DIFFICULTY_LEVEL_SELECT, '');
    DIFFICULTY_LEVEL_SELECT_OPTION_TEXT.value = '';
    DIFFICULTY_LEVEL_SELECT_OPTION_TEXT.hidden = true;
    DIFFICULTY_LEVEL_SELECT_OPTION_TEXT.textContent = 'Выберите уровень сложности';
    for (let i = 1; i < 7; i++) {
        const option = createTag('option', DIFFICULTY_LEVEL_SELECT, '');
        option.value = i;
        option.textContent = i;
    }
    const ROUND_NUMBER = createTag('span', START_FORM, 'audio_round-number');
    const ROUND_NUMBER_SELECT = createTag('select', ROUND_NUMBER, '');
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
    const CONTAINER = createTag('div', BODY, 'audio_container');
    CONTAINER.classList.add('audio_hidden');
    const GAME_INTERACTION_WRAPPER = createTag('div', CONTAINER, 'audio_game_interaction__wrapper');
    const SOUND_BUTTON = createTag('div', GAME_INTERACTION_WRAPPER, 'audio_sound_button');
    const IMG_WRAPPER = createTag('div', GAME_INTERACTION_WRAPPER, 'audio_image');
    IMG_WRAPPER.classList.add('audio_hidden');
    const IMAGE_ON_MAIN_PAGE = createTag('img', IMG_WRAPPER, 'audio_image_on_main_page');
    const ENGLISH_TRANSLATE = createTag('div', GAME_INTERACTION_WRAPPER, 'audio_english_translate');
    ENGLISH_TRANSLATE.classList.add('audio_hidden');
    ENGLISH_TRANSLATE.textContent = 'engword';
    const RUSSIAN_WORDS_WRAPPER = createTag('div', CONTAINER, 'audio_russian_words__wrapper');
    for (let i = 1; i < 6; i++) {
        const rusWord = createTag('div', RUSSIAN_WORDS_WRAPPER, 'audio_russian_word_to_choose');
        rusWord.textContent = 'rusrusrusrusrusrus';
    }
    const DONT_KNOW_BUTTON_WRAPPER = createTag('div', CONTAINER, 'audio_dont_know_button__wrapper');
    const DONT_KNOW_BUTTON = createTag('button', DONT_KNOW_BUTTON_WRAPPER, 'audio_dont_know_button');
    DONT_KNOW_BUTTON.textContent = 'Не знаю';
    const NEXT_BUTTON_WRAPPER = createTag('div', CONTAINER, 'audio_next_button__wrapper');
    const NEXT_BUTTON = createTag('button', NEXT_BUTTON_WRAPPER, 'audio_next_button');
    const NEXT_BUTTON_IMG = document.createElement('img');
    NEXT_BUTTON_IMG.src = './assets/images/next.png';
    NEXT_BUTTON.appendChild(NEXT_BUTTON_IMG);
    NEXT_BUTTON.classList.add('audio_hidden');

    /// //////RESULT PAGE
    const RESULTS = createTag('div', BODY, 'audio_results');
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
    const BUTTON_RETURN = createTag('button', BTNS_RES, 'audio_return');
    BUTTON_RETURN.classList.add('btn', 'audio_btn-res');
    BUTTON_RETURN.textContent = 'К списку тренировок';
    const BUTTON_NEW_GAME = createTag('button', BTNS_RES, 'audio_new-game');
    BUTTON_NEW_GAME.classList.add('btn', 'audio_btn-res');
    BUTTON_NEW_GAME.textContent = 'Начать заново';
    const BUTTON_START = document.querySelector('.audio_intro-btn');
    let WordsArray = [];

    // Listener for button on intro page
    BUTTON_START.addEventListener('click', async (ev) => {
        ev.preventDefault();
        const LevelOfDifficulty = DIFFICULTY_LEVEL_SELECT.options[DIFFICULTY_LEVEL_SELECT.selectedIndex].text;
        const NumberOfRound = ROUND_NUMBER_SELECT.options[ROUND_NUMBER_SELECT.selectedIndex].text;
        WordsArray = await setWords(LevelOfDifficulty, NumberOfRound);
        console.log(WordsArray, '4444444444444444444444444444');
        const fiveWordsForPage = createArrayForApp(WordsArray);
        const russianWordsNode = document.querySelectorAll('.audio_russian_word_to_choose');
        const russianWordsArray = Array.from(russianWordsNode);
        // eslint-disable-next-line no-console
        console.log(russianWordsArray);
        fillRussianWords(russianWordsArray, fiveWordsForPage);
        const audioOfWord = `${URL_TO_BACK}${WordsArray[0].audio}`;
        playAudio(audioOfWord);
        INTRO.classList.toggle('audio_hidden');
        CONTAINER.classList.toggle('audio_hidden');
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
            SUCCES_NUM.textContent = successCount;
            ERRORS_NUM.textContent = mistakesCount;
            RESULTS.classList.toggle('audio_hidden');
            CONTAINER.classList.toggle('audio_hidden');
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
            RUSSIAN_WORDS_WRAPPER.classList.toggle('audio_disabledWord');
            ENGLISH_TRANSLATE.classList.toggle('audio_hidden');
            IMG_WRAPPER.classList.toggle('audio_hidden');
            SOUND_BUTTON.classList.toggle('audio_hidden');
            NEXT_BUTTON.classList.toggle('audio_hidden');
            DONT_KNOW_BTN.classList.toggle('audio_hidden');
        } else {
            SUCCES_NUM.textContent = successCount;
            ERRORS_NUM.textContent = mistakesCount;
            RESULTS.classList.toggle('audio_hidden');
            CONTAINER.classList.toggle('audio_hidden');
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
                    IMAGE_ON_MAIN_PAGE.src = createImage(imageWord);
                    ENGLISH_TRANSLATE.textContent = WordsArray[0].word;
                    playAudio(successSound);
                    ENGLISH_TRANSLATE.classList.toggle('audio_hidden');
                    IMG_WRAPPER.classList.toggle('audio_hidden');
                    NEXT_BUTTON.classList.toggle('audio_hidden');
                    DONT_KNOW_BTN.classList.toggle('audio_hidden');
                    SOUND_BUTTON.classList.toggle('audio_hidden');
                    RUSSIAN_WORDS_WRAPPER.classList.toggle('audio_disabledWord');
                } else {
                    mistakesCount += 1;
                    playAudio(mistakeSound);
                }
            } else {
                SUCCES_NUM.textContent = successCount;
                ERRORS_NUM.textContent = mistakesCount;
                RESULTS.classList.toggle('audio_hidden');
                CONTAINER.classList.toggle('audio_hidden');
            }
        });

        // listener on main page for repeat sound button
        SOUND_BUTTON.addEventListener('click', () => {
            const audioOfWord = `${URL_TO_BACK}${WordsArray[0].audio}`;
            setTimeout(() => {
                playAudio(audioOfWord);
            }, 500);
        }, false);
        ENGLISH_TRANSLATE.addEventListener('click', () => {
            const audioOfWord = `${URL_TO_BACK}${WordsArray[0].audio}`;
            setTimeout(() => {
                playAudio(audioOfWord);
            }, 500);
        }, false);
    });
    BUTTON_NEW_GAME.addEventListener('click', () => {
        INTRO.classList.toggle('audio_hidden');
        RESULTS.classList.toggle('audio_hidden');
        const mistakesCount = 0;
        const successCount = 0;
    });
}

createPages();
