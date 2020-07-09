import "./modal.css"

export default function Modal () {
  let containerRef = null;

  const showModal  = (text) => {
    containerRef.classList.add('modal-show');
    containerRef.querySelector('.modal-text').innerHTML = `<span>${text}</span>`;
  }

  const hideModal = () => {
    containerRef.classList.remove('modal-show');
  }

  const addEventListeners = () => {
    containerRef.querySelector('.modal-hide-btn').addEventListener('click', () => {
      hideModal()
    })
  }

  const addCallBack = (cb) => {
    containerRef.querySelector('.modal-hide-btn').addEventListener('click', () => {
      hideModal();
      cb();
    })
  }

  const render = () => {
    const container = document.createElement("div");
    
    container.classList.add("modal");
    container.innerHTML = `<div class="modal-content">
      <button class="modal-hide-btn">✕</button>
      <div class="modal-text"></div></div>
    </div>`

    containerRef= container;

    return container
  }

  const onInit = (anchor) => {
    const container = render();

    anchor.append(container);

    addEventListeners();
  }

  return {
    onInit,
    showModal,
    hideModal,
    addCallBack
  }
}