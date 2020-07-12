
import { shuffle } from './optionalFunction';

//let param = { "userWord.optional.status": "learned" };

function getWords(group, page) {
    const url = `https://afternoon-falls-25894.herokuapp.com/words?group=${group}&page=${page}`;
    return fetch(url)
        .then((res) => res.json());
}
//{"userId":"5eee5422f49dab0017302a3f","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlZWU1NDIyZjQ5ZGFiMDAxNzMwMmEzZiIsImlhdCI6MTU5NDQ5ODA4NiwiZXhwIjoxNTk0NTEyNDg2fQ.H3ycCXYWNwCDeAX0HuvD2ZyK7nnCCAgOf7A2xos_X3A"}

export async function getLearnedWords(param, user) {
    const rawResponse = await fetch(`https://afternoon-falls-25894.herokuapp.com/users/${user.userId}/aggregatedWords?filter=${JSON.stringify(param.filter)}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${user.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });

    const content = await rawResponse.json();
    console.log(content, 'sm');
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
