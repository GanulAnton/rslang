import { shuffle } from './optionalFunction';

function getWords(group, page) {
    const url = `https://afternoon-falls-25894.herokuapp.com/words?group=${group}&page=${page}`;
    return fetch(url)
        .then((res) => res.json());
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

export async function setLearnedWords(paramFilter, user) {
    try {
        const words = await getLearnedWords(paramFilter, user);
        const wordsArray = [];
        words[0].paginatedResults.forEach((element) => {
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
