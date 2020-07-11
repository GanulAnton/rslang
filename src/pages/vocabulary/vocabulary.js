import defaultUrl from '../../accessories/defaultUrl';

import "./vocabulary.css"

export default function Vocabulary (cb) {
  const callbacks = cb;
  let containerRef = null;
  let user = null;
  let hardWordsArr = [];
  let deleteWordsArr = [];
  
  const render = () => {
    const container = document.createElement('div');

    container.classList.add("vocabulary-container")

    container.innerHTML = `
      <div class="vocabulary-tabs">
        <div class="vocabulary-tab">
          <input type="radio" id="vocabulary-tab-hard" name="tab-group" checked>
          <label for="vocabulary-tab-hard" class="vocabulary-tab-title">Сложные слова</label> 
          <section class="vocabulary-tab-content">      
            <div class="vocabulary-hard-words-container">
              <ul class="vocabulary-hard-words-list"></ul>  
            </div>
          </section>
        </div> 
        <div class="vocabulary-tab">
          <input type="radio" id="vocabulary-tab-deleted" name="tab-group">
          <label for="vocabulary-tab-deleted" class="vocabulary-tab-title">Удаленные слова</label> 
          <section class="vocabulary-tab-content">
            <div class="vocabulary-delete-words-container">
              <ul class="vocabulary-delete-words-list"></ul>  
            </div>
          </section>
        </div>
      </div>
    `

    containerRef = container;

    return container
  } 

  const addEventListeners = () => {
    containerRef.querySelector('.vocabulary-hard-words-list').addEventListener('click', (e) => {
      removeWord(e); 
    })

    containerRef.querySelector('.vocabulary-delete-words-list').addEventListener('click', (e) => {
      removeWord(e); 
    })
  }

  const getWords = async (param) => {
    const rawResponse = await fetch(`${defaultUrl}/users/${user.userId}/aggregatedWords?filter=${JSON.stringify(param.filter)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const content = await rawResponse.json();
    console.log(content, 'sm');
    return content
  };

  const makeHardWords = async (arr) => {
    let hardWordsHtml = ""

    hardWordsArr = arr;

    hardWordsArr.forEach( (hardWord, index) => {
      hardWordsHtml += `<li class="vocabulary-word-item"><span>${index + 1}</span><span>${hardWord.word} - ${hardWord.wordTranslate}</span><button data-index=${index} data-id=${hardWord._id} class="vocabulary-page-btn">✕</button></li>`
    })

    containerRef.querySelector('.vocabulary-hard-words-list').innerHTML = hardWordsHtml;
  }

  const makeDeleteWords = async (arr) => {
    let deleteWordsHtml = ""
    
    deleteWordsArr = arr;

    deleteWordsArr.forEach( (deleteWord, index) => {
      deleteWordsHtml += `<li class="vocabulary-word-item"><span>${index + 1}</span><span>${deleteWord.word} - ${deleteWord.wordTranslate}</span><button data-index=${index} data-id=${deleteWord._id} class="vocabulary-page-btn">✕</button></li>`
    })

    containerRef.querySelector('.vocabulary-delete-words-list').innerHTML = deleteWordsHtml;
  }

  const  getData = async () => {
    const hardWords = await getWords({filter:{ "userWord.optional.status": "hard" },});
    makeHardWords(hardWords[0].paginatedResults);
    const deleteWords = await await getWords({filter:{ "userWord.optional.status": "delete" },});
    makeDeleteWords(deleteWords[0].paginatedResults)
  }

  const removeWord = (e) => {
    if(e.target.classList.contains('vocabulary-page-btn')) {
      const wordInfo = {id: e.target.dataset.id, status: "inProgress", isUpdated: true }
      hardWordsArr.splice(e.target.dataset.index, 1)
      makeHardWords(hardWordsArr)
      callbacks.setWordCallback(wordInfo);
    }  
  }

  const onInit = (anchor) => {
    const container = render()
    anchor.append(container)
    user = callbacks.getUserCallback();
    getData()
    addEventListeners()

    return container
  }

  return {
    onInit
  }
}