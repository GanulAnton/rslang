import { setWords, showWords } from './getWords';
import { playAudio } from './optionalFunction';
import { createDOMElement } from './createDomElement';

let wordsArray = [];
let currentWordPosition = 0;
let countHearts = 0;
let clickInterval = 0;
let clicked = false;
let trueAnswerCounter = 0;
let answerCounter = 0;

const BODY = document.querySelector('#app');

export function onInit() {
    const START_CONTAINER = createDOMElement('section', BODY, ['savannah__start-container']);
    createDOMElement('h2', START_CONTAINER, ['savannah__h2'], 'Саванна', '');
    createDOMElement('p', START_CONTAINER, ['savannah__p'], 'Тренировка Саванна развивает словарный запас. Чем больше слов ты знаешь, тем больше очков опыта получишь.', '');
    const START_FORM = createDOMElement('form', START_CONTAINER, ['savannah__start__form']);
    const FOR_CHECKBOX = createDOMElement('p', START_FORM, ['savannah__p'], 'Играть с моими словами');
    const CHECKBOX = createDOMElement('input', FOR_CHECKBOX, ['savannah__checkbox'], '', 1, 'checkbox');
    const LVL_LIST = createDOMElement('p', START_FORM, ['savannah__lvl-list', 'savannah__p']);
    const LVL_LIST_SELECT = createDOMElement('select', LVL_LIST, ['savannah__lvl-list_select']);
    const FIRST_ELEMENT_LVL_LIST = createDOMElement('option', LVL_LIST_SELECT, '', 'Выберите уровень сложности', '');
    FIRST_ELEMENT_LVL_LIST.hidden = true;
    for (let i = 1; i < 7; i++) {
        createDOMElement('option', LVL_LIST_SELECT, '', i, i);
    }
    const ROUND_LIST = createDOMElement('p', START_FORM, ['round-list', 'savannah__p']);
    const ROUND_LIST_SELECT = createDOMElement('select', ROUND_LIST, ['savannah__round-list_select']);
    const FIRST_ELEMENT_ROUND_LIST = createDOMElement('option', ROUND_LIST_SELECT, '', 'Выберите раунд', '');
    FIRST_ELEMENT_ROUND_LIST.hidden = true;
    for (let i = 1; i < 20; i++) {
        createDOMElement('option', ROUND_LIST_SELECT, '', i, i);
    }
    const BUTTON_CONTAINER = createDOMElement('p', START_FORM, ['savannah__p']);
    const START_BUTTON = createDOMElement('button', BUTTON_CONTAINER, ['savannah__start-button', 'savannah__button'], 'Начать', '', 'submit');
    const LOADER = createDOMElement('section', BODY, ['savannah__loader-container', 'savannah__inactive']);
    const TRAININGS_CONTAINER = createDOMElement('section', BODY, ['savannah__trainings-container', 'savannah__inactive']);
    const TRAININGS_WORD_CONTAINER = createDOMElement('div', TRAININGS_CONTAINER, ['savannah__trainings__word_container']);
    const TRAININGS_HEADER = createDOMElement('div', TRAININGS_CONTAINER, ['savannah__trainings__header']);
    const SOUND_BUTTON = createDOMElement('div', TRAININGS_HEADER, ['savannah__sound-button']);
    const TRAININGS_HEARTS = createDOMElement('div', TRAININGS_HEADER, ['savannah__hearts']);
    for (let i = 0; i < 5; i++) {
        createDOMElement('div', TRAININGS_HEARTS, ['savannah__heart']);
    }
    const CLOSE_BUTTON = createDOMElement('div', TRAININGS_HEADER, ['savannah__close']);
    const TRAININGS_WORD = createDOMElement('div', TRAININGS_WORD_CONTAINER, ['savannah__trainings__word']);
    const TRAININGS_ANSWERS = createDOMElement('div', TRAININGS_CONTAINER, ['savannah__trainings_answers']);
    for (let i = 0; i < 4; i++) {
        createDOMElement('span', TRAININGS_ANSWERS, [''], `${i + 1}.`);
        createDOMElement('div', TRAININGS_ANSWERS, ['savannah__trainings_answer']);
    }
    const STATISTIC_CONTAINER = createDOMElement('section', BODY, ['savannah__statistic-container', 'savannah__inactive']);
    const TRUE_ANSWER_COUNT = createDOMElement('p', STATISTIC_CONTAINER, ['savannah__p']);
    const ANSWER_COUNT = createDOMElement('p', STATISTIC_CONTAINER, ['savannah__p']);
    const RESTART_BUTTON_CONTAINER = createDOMElement('p', STATISTIC_CONTAINER, ['savannah__p']);
    const RESTART_BUTTON = createDOMElement('button', RESTART_BUTTON_CONTAINER, ['savannah__start-button', 'savannah__button'], 'Продолжить играть', '', 'submit');

    CHECKBOX.addEventListener('change', () => {
        if (CHECKBOX.checked) {
            LVL_LIST_SELECT.disabled = true;
            ROUND_LIST_SELECT.disabled = true;
        } else {
            LVL_LIST_SELECT.disabled = false;
            ROUND_LIST_SELECT.disabled = false;
        }
    });

    RESTART_BUTTON.addEventListener('click', async () => {
        START_CONTAINER.classList.toggle('savannah__inactive');
        STATISTIC_CONTAINER.classList.toggle('savannah__inactive');
    });

    START_BUTTON.addEventListener('click', async (event) => {
        event.preventDefault();
        trueAnswerCounter = 0;
        answerCounter = 0;
        currentWordPosition = 0;
        countHearts = 0;
        LOADER.classList.toggle('savannah__inactive');
        setTimeout(() => {
            LOADER.classList.toggle('savannah__inactive');
        }, 5200);
        TRAININGS_HEARTS.querySelectorAll('div').forEach((element) => {
            element.classList.remove('savannah__empty-heart');
        });
        START_CONTAINER.classList.toggle('savannah__inactive');
        TRAININGS_CONTAINER.classList.toggle('savannah__inactive');
        if (CHECKBOX.checked) {
            console.log('мои слова');
        } else {
            const selectedRound = isNaN(ROUND_LIST_SELECT.options[ROUND_LIST_SELECT.selectedIndex].value)? 1: ROUND_LIST_SELECT.options[ROUND_LIST_SELECT.selectedIndex].value;
            const selectedLvl = isNaN(LVL_LIST_SELECT.options[LVL_LIST_SELECT.selectedIndex].value)? 1: LVL_LIST_SELECT.options[LVL_LIST_SELECT.selectedIndex].value;
            wordsArray = await setWords(selectedLvl - 1, selectedRound - 1);
            clickInterval = setInterval(circlePlay, 5000);
        }
    });

    TRAININGS_ANSWERS.querySelectorAll('div').forEach((element, i) => {
        element.addEventListener('click', () => {
            TRAININGS_ANSWERS.classList.add('savannah__disabled_trainings_answer');
            clearInterval(clickInterval);
            buttonPlay(element);
            clicked = true;
        });
        document.addEventListener('keydown', (evt) => {
            if (evt.code === `Digit${i + 1}` && clicked === false) {
                TRAININGS_ANSWERS.classList.add('savannah__disabled_trainings_answer');
                clearInterval(clickInterval);
                buttonPlay(element);
                clicked = true;
            }
        });
    });

    CLOSE_BUTTON.addEventListener('click', () => {
        endGame();
    });

    SOUND_BUTTON.addEventListener('click', () => {
        SOUND_BUTTON.classList.toggle('savannah__sound-button-m-muted');
    });

    function circlePlay() {
        TRAININGS_ANSWERS.classList.remove('savannah__disabled_trainings_answer');
        clicked = false;
        answerCounter++;
        if (countHearts === 5 || currentWordPosition === 19) {
            endGame();
        } else {
            TRAININGS_WORD_CONTAINER.classList.remove('savannah__trainings__word_start-fall');
            currentWordPosition++;
            showWords(wordsArray, currentWordPosition, TRAININGS_ANSWERS.querySelectorAll('div'), TRAININGS_WORD);
            TRAININGS_WORD_CONTAINER.classList.add('savannah__trainings__word_fall');
            setTimeout(() => {
                TRAININGS_WORD_CONTAINER.classList.remove('savannah__trainings__word_fall');
                if (clicked === false) {
                    falseAnswer();
                    setTimeout(() => {
                        TRAININGS_ANSWERS.querySelectorAll('div').forEach((el) => {
                            el.classList.remove('savannah__trueAnswer');
                        });
                        TRAININGS_ANSWERS.classList.add('savannah__disabled_trainings_answer');
                    }, 400);
                }
            }, 4000);
        }
    }
    function buttonPlay(element) {
        if (element.textContent === wordsArray[currentWordPosition].word) {
            trueAnswer(element);
        } else {
            falseAnswer(element);
        }
        TRAININGS_WORD_CONTAINER.classList.add('savannah__trainings__word_start-fall');
        setTimeout(() => {
            if (countHearts === 5 || currentWordPosition === 19) {
                endGame();
            } else {
                clickInterval = setInterval(circlePlay, 5000);
            }
            TRAININGS_ANSWERS.querySelectorAll('div').forEach((el) => {
                el.classList.remove('savannah__trueAnswer');
            });
            element.classList.remove('savannah__falseAnswer');
        }, 400);
    }

    function trueAnswer(selectedItem) {
        selectedItem.classList.add('savannah__trueAnswer');
        trueAnswerCounter++;
        if (!SOUND_BUTTON.classList.contains('savannah__sound-button-m-muted')) {
            playAudio('../assets/savannah/audio/trueAnswer.mp3');
        }
    }

    function falseAnswer(selectedItem) {
        setTimeout(() => {
            TRAININGS_ANSWERS.querySelectorAll('div').forEach((el) => {
                if (el.textContent === wordsArray[currentWordPosition].word) {
                    el.classList.add('savannah__trueAnswer');
                }
            });
        }, 200);
        if (selectedItem !== undefined) {
            selectedItem.classList.add('savannah__falseAnswer');
        }
        if (!SOUND_BUTTON.classList.contains('savannah__sound-button-m-muted')) {
            playAudio('../assets/savannah/audio/falseAnswer.mp3');
        }
        countHearts++;
        LifeTaker(countHearts);
        TRAININGS_WORD.classList.add('savannah__trainings__word_finish-fall');
        TRAININGS_WORD_CONTAINER.classList.add('savannah__trainings__word_start-fall');
        setTimeout(() => {
            TRAININGS_WORD.classList.remove('savannah__trainings__word_finish-fall');
        }, 1000);
    }

    function endGame() {
        clearInterval(clickInterval);
        STATISTIC_CONTAINER.classList.toggle('savannah__inactive');
        TRAININGS_CONTAINER.classList.toggle('savannah__inactive');
        TRUE_ANSWER_COUNT.textContent = `Количество правильных ответов: ${trueAnswerCounter}`;
        ANSWER_COUNT.textContent = `Количество пройденных слов: ${answerCounter}`;
    }
    function LifeTaker(countHearts) {
        TRAININGS_HEARTS.querySelectorAll('div').forEach((heartElement, i) => {
            if (i + 1 <= countHearts) {
                heartElement.classList.add('savannah__empty-heart');
            }
        });
    }
}
