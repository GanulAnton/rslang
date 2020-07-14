import './settings.css';
import Modal from '../../components/modal/modal';

export default function Settings(cb) {
  const callbacks = cb;
  const modal = Modal();

  let pages = null;
  let settings = null;
  let newSettings = null;
  let containerRef = null;
  let translateCheckboxRef = null;
  let meaningCheckboxRef = null;
  let exampleCheckboxRef = null;
  let transcriptionCheckboxRef = null;
  let imageCheckboxRef = null;
  let vocabularyCheckboxRef = null;
  let showAnswerCheckboxRef = null;
  let saveButtonRef = null;

  const setRefs = () => {
    translateCheckboxRef = containerRef.querySelector('#settingsTranslate');
    meaningCheckboxRef = containerRef.querySelector('#settingsMeaning');
    exampleCheckboxRef = containerRef.querySelector('#settingsExample');
    transcriptionCheckboxRef = containerRef.querySelector('#settingsTranscription');
    imageCheckboxRef = containerRef.querySelector('#settingsImage');
    vocabularyCheckboxRef = containerRef.querySelector('#settingsVocabulary');
    showAnswerCheckboxRef = containerRef.querySelector('#settingsShowAnswer');
    saveButtonRef = containerRef.querySelector('.settings-save');
  };

  const validateHint = () => {
    const values = Object.values(newSettings.hint);
    let check = true;

    values.forEach((value) => {
      if (value) {
        check = false;
      }
    });

    if (check) {
      modal.showModal('Выберите хоть один параметр подсказок');
    }

    return check;
  };

  const makeDisabledButton = (param) => {
    saveButtonRef.disabled = param;
  };

  const validateInput = (number) => {
    if (Number.isInteger(+number) && number < 100 && number > 9) {
      return true;
    }
    return false;
  };

  const goToMainPage = () => {
    const mainContainer = callbacks.getMainContainerCallback();
    mainContainer.innerHTML = '';

    pages.mainPage.onInit(mainContainer);
  };

  const addEventListeners = () => {
    const inputWordsPerDay = containerRef.querySelector('#settingsInputWordsperday');
    const inputNewWords = containerRef.querySelector('#settingsInputNewWords');
    inputWordsPerDay.addEventListener('change', () => {
      if ((inputWordsPerDay.value <= settings.optional.linguist.newWords) || !validateInput(inputWordsPerDay.value)) {
        // restore default
        inputWordsPerDay.value = settings.optional.linguist.wordsPerDay;
      } else {
        newSettings.wordsPerDay = inputWordsPerDay.value;
      }
    });

    inputNewWords.addEventListener('change', () => {
      if (inputNewWords.value >= settings.optional.linguist.wordsPerDay || !validateInput(inputNewWords.value)) {
        // restore default
        inputNewWords.value = settings.optional.linguist.newWords;
      } else {
        newSettings.newWords = inputNewWords.value;
      }
    });

    translateCheckboxRef.addEventListener('change', () => {
      newSettings.hint.translation = !newSettings.hint.translation;

      makeDisabledButton(validateHint());
    });

    meaningCheckboxRef.addEventListener('change', () => {
      newSettings.hint.meaning = !newSettings.hint.meaning;

      makeDisabledButton(validateHint());
    });

    exampleCheckboxRef.addEventListener('change', () => {
      newSettings.hint.example = !newSettings.hint.example;

      makeDisabledButton(validateHint());
    });

    transcriptionCheckboxRef.addEventListener('change', () => {
      newSettings.additional.transcription = !newSettings.additional.transcription;
    });

    imageCheckboxRef.addEventListener('change', () => {
      newSettings.additional.image = !newSettings.additional.image;
    });

    vocabularyCheckboxRef.addEventListener('change', () => {
      newSettings.vocabulary = !newSettings.vocabulary;
    });

    showAnswerCheckboxRef.addEventListener('change', () => {
      newSettings.showAnswer = !newSettings.showAnswer;
    });

    containerRef.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();
      if (e.submitter.classList.contains('settings-save')) {
        callbacks.setSettingsCallback({ ...settings.optional, linguist: newSettings });
        goToMainPage();
      }

      if (e.submitter.classList.contains('settings-cancel')) {
        goToMainPage();
      }
    });
  };

  const setCheckboxes = () => {
    const { translation, meaning, example } = settings.optional.linguist.hint;
    const { transcription, image } = settings.optional.linguist.additional;

    translateCheckboxRef.checked = translation;
    meaningCheckboxRef.checked = meaning;
    exampleCheckboxRef.checked = example;
    transcriptionCheckboxRef.checked = transcription;
    imageCheckboxRef.checked = image;
    vocabularyCheckboxRef.checked = settings.optional.linguist.vocabulary;
    showAnswerCheckboxRef.checked = settings.optional.linguist.showAnswer;
  };

  const render = () => {
    const container = document.createElement('div');
    containerRef = container;
    container.innerHTML = `
    <div class="settings-container">
      <form action="#">
        <div class="settings-wordsperday">
          <label for="">Слова на каждый день</label>
          <input type="text" id="settingsInputWordsperday" class="settings-input" value="${settings.optional.linguist.wordsPerDay}" maxlength="3" size="${settings.optional.linguist.wordsPerDay.length}">
        </div>
        <div class="settings-newwords">
          <label for="">Новые слова</label>
          <input type="text" id="settingsInputNewWords" class="settings-input" value="${settings.optional.linguist.newWords}" maxlength="3" size="${settings.optional.linguist.newWords.length}">
        </div>
        <div class="settings-translate">
          <h3>Подсказки:</h3>
          <label for="settingsTranslate">Перевод слова <input type="checkbox" name="settings-translate" id="settingsTranslate"></label>
          <label for="settingsMeaning">Значение слова <input type="checkbox" name="settings-meaning" id="settingsMeaning" ></label>
          <label for="settingsExample">Пример слова <input type="checkbox" name="settings-example" id="settingsExample" ></label>
        </div>
        <div class="settings-additional">
          <h3>Дополнительные:</h3>
          <label for="settingsTranscription">Транскрипция слова <input type="checkbox" name="settings-transcription" id="settingsTranscription" ></label>
          <label for="settingsImage">Картинка <input type="checkbox" name="settings-image" id="settingsImage" ></label>
        </div>
        <div class="settings-make-vocabulary">
          <label for="settingsVocabulary">Добавить слова в словарь</label><input type="checkbox" name="settings-vocabulary" id="settingsVocabulary">
        </div>
        <div class="settings-show-answer">
          <label for="settingsAnswer">Показать ответ</label><input type="checkbox" name="settings-show-answer" id="settingsShowAnswer">
        </div>
        <div class="settings-control-panel">
          <button class="settings-btn settings-save" type="submit">Сохранить</button>
          <button class="settings-btn settings-cancel" type="submit">Отменить</button>
        </div>
      </form>
    </div> 
    `;

    modal.onInit(container);

    return container;
  };

  const onInit = (anchor) => {
    const settingsSaved = callbacks.getSettingsCallback();

    settings = settingsSaved;
    newSettings = {
      ...settings.optional.linguist,
    };

    pages = callbacks.getPagesCallback();

    const container = anchor.append(render());
    setRefs();
    setCheckboxes();
    addEventListeners();

    return container;
  };

  return {
    onInit,
  };
}
