import MainPage from "../mainPage"
import './settings.css';

export default function Settings() {
  const settings = {
    wordsPerDay: '20',
    newWords: '10',
    hint: {
      translation: false,
      meaning: true,
      example: false,
    },
    additional: {
      transcription: true,
      image: true,
    },
    vocabulary: true,
    showAnswer: false,
  };
  const newSettings = {
    ...settings,
  };
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
      console.log('Выберите хоть один параметр');
    }

    return check;
  };

  const makeDisabledButton = (param) => {
    saveButtonRef.disabled = param;
  };

  const validateInput = (number) => {
    if (Number.isInteger(+number) && number < 100 && number > 10) {
      return true;
    }
    return false;
  };

  const addEventListeners = () => {
    const inputWordsPerDay = containerRef.querySelector('#settingsInputWordsperday');
    const inputNewWords = containerRef.querySelector('#settingsInputNewWords');
    inputWordsPerDay.addEventListener('change', () => {
      if (!validateInput(inputWordsPerDay.value)) {
        // restore default
        inputWordsPerDay.value = settings.wordsPerDay;
      } else {
        newSettings.wordsPerDay = inputWordsPerDay.value;
      }
    });

    inputNewWords.addEventListener('change', () => {
      if (inputNewWords.value >= inputWordsPerDay.value || !validateInput(inputNewWords.value)) {
        // restore default
        inputNewWords.value = settings.newWords;
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
        console.log(newSettings, 'Новые настройки');
      }

      if (e.submitter.classList.contains('settings-cancel')) {
        console.log(settings, 'Старые настройки');
      }
    });

    document.querySelector('.link').addEventListener('click', () => {
      const mainPage = MainPage();
      document.querySelector('#app').innerHTML= "";
      mainPage.onInit(document.querySelector('#app'))
    })
  };

  const setCheckboxes = () => {
    const { translate, meaning, example } = settings.hint;
    const { transcription, image } = settings.additional;

    translateCheckboxRef.checked = translate;
    meaningCheckboxRef.checked = meaning;
    exampleCheckboxRef.checked = example;
    transcriptionCheckboxRef.checked = transcription;
    imageCheckboxRef.checked = image;
    vocabularyCheckboxRef.checked = settings.vocabulary;
    showAnswerCheckboxRef.checked = settings.showAnswer;
  };

  const render = () => {
    const container = document.createElement('div');
    containerRef = container;
    container.innerHTML = `
    <div class="settings-container">
      <a href="#" class="link">Back</a>
      <form action="#">
        <div class="settings-wordsperday">
          <label for="">Words per day</label>
          <input type="text" id="settingsInputWordsperday" class="settings-input" value="${settings.wordsPerDay}" maxlength="3" size="${settings.wordsPerDay.length}">
        </div>
        <div class="settings-newwords">
          <label for="">New words per day</label>
          <input type="text" id="settingsInputNewWords" class="settings-input" value="${settings.newWords}" maxlength="3" size="${settings.newWords.length}">
        </div>
        <div class="settings-translate">
          <h3>Hint:</h3>
          <label for="settingsTranslate">Translation of word <input type="checkbox" name="settings-translate" id="settingsTranslate"></label>
          <label for="settingsMeaning">Meaning of the word <input type="checkbox" name="settings-meaning" id="settingsMeaning" ></label>
          <label for="settingsExample">Example of usage of word <input type="checkbox" name="settings-example" id="settingsExample" ></label>
        </div>
        <div class="settings-additional">
          <h3>Additional:</h3>
          <label for="settingsTranscription">Transcription <input type="checkbox" name="settings-transcription" id="settingsTranscription" ></label>
          <label for="settingsImage">Image <input type="checkbox" name="settings-image" id="settingsImage" ></label>
        </div>
        <div class="settings-make-vocabulary">
          <label for="settingsVocabulary">Make vocabulary</label><input type="checkbox" name="settings-vocabulary" id="settingsVocabulary">
        </div>
        <div class="settings-show-answer">
          <label for="settingsAnswer">Show answer</label><input type="checkbox" name="settings-show-answer" id="settingsShowAnswer">
        </div>
        <div class="settings-control-panel">
          <button class="settings-btn settings-save" type="submit">Save</button>
          <button class="settings-btn settings-cancel" type="submit">Cancel</button>
        </div>
      </form>
    </div> 
    `;

    return container;
  };

  const onInit = (anchor) => {
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
