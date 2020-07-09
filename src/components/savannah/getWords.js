import { shuffle } from './optionalFunction';

export function getWords(group, page) {
    const url = `https://afternoon-falls-25894.herokuapp.com/words?group=${group}&page=${page}`;
    return fetch(url)
        .then((res) => res.json());
}

export async function setWords(group, page) {
    try {
        const words = await getWords(group, page);
        const wordsArray = [];
        words.forEach((element) => {
            wordsArray.push({ word: element.word, wordTranslate: element.wordTranslate });
        });
        return wordsArray;
    } catch (error) {
        console.log(error);
    }
}

export function showWords(wordsArray, currentWord, trainingsAnswers, trainingsWord) {
    let arrayTrainingsAnswer = [];
    const currentWordsArray = wordsArray.slice();
    trainingsWord.textContent = currentWordsArray[currentWord].wordTranslate;
    arrayTrainingsAnswer.push(currentWordsArray[currentWord]);
    currentWordsArray.splice(currentWord, 1);
    const wordsArrayShuffled = shuffle(currentWordsArray);
    arrayTrainingsAnswer = arrayTrainingsAnswer.concat(wordsArrayShuffled.slice(1, 4));
    shuffle(arrayTrainingsAnswer);
    trainingsAnswers.forEach((element, i) => {
        element.textContent = arrayTrainingsAnswer[i].word;
    });
}
