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
