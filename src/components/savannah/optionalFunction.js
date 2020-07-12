export function createDOMElement(tag, parentElement, className, textContent, value, type) {
    const newElement = document.createElement(tag);
    if (className != '') {
        className.forEach((element) => {
            newElement.classList.add(element);
        });
    }
    if (textContent != '') newElement.textContent = textContent;
    if (value != '' && type != undefined) newElement.value = value;
    if (type != '' && type != undefined) newElement.setAttribute("type", type);
    parentElement.appendChild(newElement);
    return newElement;
}

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
