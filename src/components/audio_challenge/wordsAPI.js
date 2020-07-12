// function for get words from API
export async function getWords(group, page) {
    const url = `https://afternoon-falls-25894.herokuapp.com/words?group=${group - 1}&page=${page}`;
    const res = await fetch(url);
    return res.json();
}
// function to create tags on page's
export function createTag(tag, parentElement, className) {
    const newElement = document.createElement(tag);
    if (className) newElement.classList.add(className);
    parentElement.appendChild(newElement);
    return newElement;
}
// function for create array of words that base on user choose
export async function setWords(group, page) {
    try {
        const words = await getWords(group, page);
        const wordsArray = [];
        words.forEach((element) => {
            wordsArray.push({
                word: element.word, wordTranslate: element.wordTranslate, audio: element.audio, image: element.image,
            });
        });
        return wordsArray;
    } catch (error) {
        console.log(error);
    }
}
//universal shuffle to array
function shuffle(arr) {
    const array = arr;
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

//function to get five words for main page of API array
export function createArrayForApp(array) {
    let arrayForApp = [];
    const pageArray = array.slice();
    arrayForApp = pageArray.slice(0, 5);
    shuffle(arrayForApp);
    return arrayForApp;
}
//function to push rus words from array on main page
export function fillRussianWords(element, array) {
    for (let i = 0; i < array.length; i++) {
        element[i].textContent = array[i].wordTranslate;
    }
}
//function for play audio files
export function playAudio(wordAuido) {

    const audio = new Audio();
    audio.src = wordAuido;
    audio.autoplay = true;
    
}
//function to create image
export function createImage(wordImage) {
    const image = new Image(100, 100);
    image.src = wordImage;
    return image.src;
}

export async function getLearnedWords(paramFilter, user) {
    const rawResponse = await fetch(`https://afternoon-falls-25894.herokuapp.com/users/${user.userId}/aggregatedWords?filter=${JSON.stringify(paramFilter)}&wordsPerPage=19`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${user.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });

    const content = await rawResponse.json();
    return [...content];
}

export async function setLearnedWords(paramFilter, user) {
    try {
        const words = await getLearnedWords(paramFilter, user);
        const wordsArray = [];
        words[0].paginatedResults.forEach((element) => {
            wordsArray.push({ word: element.word, wordTranslate: element.wordTranslate, audio: element.audio, image: element.image });
        });
        return wordsArray;
    } catch (error) {
        console.log(error);
    }
}