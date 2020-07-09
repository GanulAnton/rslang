export function shuffle(arr) {
    let j; let temp;
    for (let i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;
    }
    return arr;
}

export function playAudio(cardAudio) {
    const audio = new Audio();
    audio.src = cardAudio;
    audio.load();
    audio.play();
}
