import "./sprint.css"

export const Sprint = () => {
    
    /* let loginInputRef = null;
    let passwordInputRef = null;
    let formRef = null;
    let data = null; */

    
    const onInit =  (anchor) => {
      const container = anchor.append(render())
      addEventListeners()
      return container
    }

    
    const addEventListeners = () => {
      formRef.addEventListener('submit', (e) => {
        e.preventDefault()

        // по классу находим нужную кнопку и отправляем запрос
        if(e.submitter.classList.contains('login-control-buttonLogIn')) {
          logIn();
        }

        if(e.submitter.classList.contains('login-control-buttonCreateAcc')) {
          createAccount();
        }
      })

    }
    
    
   

    const render = () => {
    const container = document.createElement('div');
    container.classList.add('box')
    
    container.innerHTML = `
                            <div class="start-btn">
                              <svg>
                                <rect x="0" y="0" fill="none" width="100%" height="100%"/>
                              </svg>
                               <p> Start game </p>
                            </siv>
                       `;                
    
    return container
      
    }

    
    return {
      onInit
    }
}