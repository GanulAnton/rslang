import "./sprint.css"

export const Login = () => {
    // переменные для быстрого доступа к инпутам и дате, изначально нулл, потом зададим значение
    let loginInputRef = null;
    let passwordInputRef = null;
    let formRef = null;
    let data = null;

    // при иницилизации сразу создаем html и вешаем обработчики
    const onInit =  (anchor) => {
      const container = anchor.append(render())
      addEventListeners()
      return container
    }

    // вешаем обработчки событий
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
    
    // функции логин и создать акк
    const createAccount = () => {
      fetch('https://afternoon-falls-25894.herokuapp.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          //  а теперь благодаря ссылкам используем где надо.
          email: `${loginInputRef.value}`,
          password: `${passwordInputRef.value}`
        })
      })
      .then(res => res.json())
      .then(data=> console.log(data))
    }

    const logIn = () => {
      fetch('https://afternoon-falls-25894.herokuapp.com/signin', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          //  а теперь благодаря ссылкам используем где надо.
          email: `${loginInputRef.value}`,
          password: `${passwordInputRef.value}`
        })
      })
      .then(res => res.json())
      .then(authentication => {
        data = authentication;
        console.log(authentication)
      })
    }
    

    // получить токен
    const getData = () => ({
      data: () => data
    })

    const render = () => {
      // создаем элементы
      const container = document.createElement('div');
      const form = document.createElement('form');
      const loginInpCont = document.createElement('div');
      const loginLabel = document.createElement('label');
      const loginInput = document.createElement('input');
      const passwordInpCont = document.createElement('div');
      const passwordLabel = document.createElement('label');
      const passwordInput = document.createElement('input');
      const controlPanel = document.createElement('div');
      const btnLogIn = document.createElement('button');
      const btnCreateAcc = document.createElement('button');

      // назначаем параметры 
      container.classList.add('login-form');
      form.method = "POST";
      form.action = "#"
      loginInpCont.classList.add('login-input-cont');
      loginLabel.for = "login";
      loginLabel.innerText = "Login:";
      loginInput.id = "login";
      loginInput.classList.add('login-input')
      loginInput.type = "text";
      passwordInpCont.classList.add('login-input-cont');
      passwordLabel.for = "password";
      passwordLabel.innerText = "Password:";
      passwordInput.id = "password";
      passwordInput.classList.add('login-input')
      passwordInput.type = "password";
      controlPanel.classList.add('login-control')
      btnLogIn.type = 'submit';
      btnLogIn.classList.add('login-control-btn')
      btnLogIn.classList.add('login-control-buttonLogIn')
      btnLogIn.innerText = "LogIn";
      btnCreateAcc.type = "submit";
      btnCreateAcc.classList.add('login-control-btn')
      btnCreateAcc.classList.add('login-control-buttonCreateAcc')
      btnCreateAcc.innerText = "Create Acc"

      // вставляем в дом в нужном порядке 
      container.append(form);
      form.append(loginInpCont);
      loginInpCont.append(loginLabel);
      loginInpCont.append(loginInput);
      form.append(passwordInpCont);
      passwordInpCont.append(passwordLabel);
      passwordInpCont.append(passwordInput);
      form.append(controlPanel);
      controlPanel.append(btnLogIn);
      controlPanel.append(btnCreateAcc)

      // делаем ссылки,чтоб потом переиспользовать
      formRef = form;
      loginInputRef = loginInput;
      passwordInputRef = passwordInput;
      // возвращаем готовый элемент для вставки 
      return container
    }

    // отдаем обьект для управления, чтоб создать элемент или получить токен
    return {
      onInit,
      getData
    }
}