import "./login.css"

export const Login = () => {
    // переменные для быстрого доступа к инпутам и дате, изначально нулл, потом зададим значение
    let loginInput = null;
    let passwordInput = null;
    let form = null;
    let data = null;

    // при иницилизации сразу создаем html и вешаем обработчики
    const onInit =  (anc) => {
      const cont = anc.append(render())
      addEventListeners()
      return cont
    }

    // вешаем обработчки событий
    const addEventListeners = () => {
      form.addEventListener('submit', (e) => {
        e.preventDefault()

        // по классу находим нужную кнопку и отправляем запрос
        if(e.submitter.classList.contains('login-control-buttonLogIn')) {
          logIn();
        }

        if(e.submitter.classList.contains('login-control-buttonCreateAcc')) {
          createAcc();
        }
      })

    }
    
    // функции логин и создать акк
    const createAcc = () => {
      fetch('https://afternoon-falls-25894.herokuapp.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          //  а теперь благодаря ссылкам используем где надо.
          email: `${loginInput.value}`,
          password: `${passwordInput.value}`
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
          email: `${loginInput.value}`,
          password: `${passwordInput.value}`
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
      const cont = document.createElement('div');
      const frm = document.createElement('form');
      const loginInpCont = document.createElement('div');
      const loginLabel = document.createElement('label');
      const lgnInput = document.createElement('input');
      const passwordInpCont = document.createElement('div');
      const passwordLabel = document.createElement('label');
      const psswrdInput = document.createElement('input');
      const controlPanel = document.createElement('div');
      const btnLogIn = document.createElement('button');
      const btnCreateAcc = document.createElement('button');

      // назначаем параметры 
      cont.classList.add('login-form');
      // form.method = "POST";
      loginInpCont.classList.add('login-input-cont');
      loginLabel.for = "login";
      loginLabel.innerText = "Login:";
      lgnInput.id = "login";
      lgnInput.classList.add('login-input')
      lgnInput.type = "text";
      passwordInpCont.classList.add('login-input-cont');
      passwordLabel.for = "password";
      passwordLabel.innerText = "Password:";
      psswrdInput.id = "password";
      psswrdInput.classList.add('login-input')
      psswrdInput.type = "password";
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
      cont.append(frm);
      frm.append(loginInpCont);
      loginInpCont.append(loginLabel);
      loginInpCont.append(lgnInput);
      frm.append(passwordInpCont);
      passwordInpCont.append(passwordLabel);
      passwordInpCont.append(psswrdInput);
      frm.append(controlPanel);
      controlPanel.append(btnLogIn);
      controlPanel.append(btnCreateAcc)

      // делаем ссылки,чтоб потом переиспользовать
      form = frm;
      loginInput = lgnInput;
      passwordInput = psswrdInput;
      // возвращаем готовый элемент для вставки 
      return cont
    }

    // отдаем обьект для управления, чтоб создать элемент или получить токен
    return {
      onInit,
      getData
    }
}

// export default class Login {
//   constructor() {
//     this.cont = null;
//     this.data = null;
//   }


//   // при иницилизации сразу создаем html и вешаем обработчики
//   onInit (anc) {
//     const cont = anc.append(this.render())
//     this.addEventListeners()
//     return cont
//   }
  

//   // вешаем обработчики
//   addEventListeners  () {
//     this.cont.querySelector('form').addEventListener('submit', (e) => {
//       e.preventDefault()

//       // по классу находим нужную кнопку и отправляем запрос
//       if(e.submitter.classList.contains('login-control-buttonLogIn')) {
//         this.logIn();
//       }

//       if(e.submitter.classList.contains('login-control-buttonCreateAcc')) {
//         this.createAcc();
//       }
//     })
//   }

//   // функции логин и создать акк
//   createAcc  () {
//     fetch('https://afternoon-falls-25894.herokuapp.com/users', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         //  а теперь благодаря ссылкам используем где надо.
//         email: `${this.cont.querySelector('#login').value}`,
//         password: `${this.cont.querySelector('#password').value}`
//       })
//     })
//     .then(res => res.json())
//     .then(data=> console.log(data))
//   }

//   logIn () {
//     fetch('https://afternoon-falls-25894.herokuapp.com/signin', {
//       method: 'POST',
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         //  а теперь благодаря ссылкам используем где надо.
//         email: `${this.cont.querySelector('#login').value}`,
//         password: `${this.cont.querySelector('#password').value}`
//       })
//     })
//     .then(res => res.json())
//     .then(authentication => {
//       this.data = authentication;
//       console.log(authentication)
//     })
//   }
  

//   // получить токен
//   getData  () {
//     return this.data
//   }

//   render () {
//     // создаем элементы
//     const cont = document.createElement('div');
//     cont.classList.add('login-form')
//     //пример с иннер и чтоб потом получить доступ через queryselector
//     cont.innerHTML = `<form>
//                         <div class="login-input-cont">
//                           <label for="login">Login:</label>
//                           <input id= 'login' class="login-input" type="text"/>
//                         </div>
//                         <div class="login-input-cont">
//                           <label for="password">Password:</label>
//                           <input id='password' class="login-input" type="password"/>
//                         </div>
//                         <div class="login-control">
//                           <button type="submit" class="login-control-btn login-control-buttonLogIn">LogIn</button>
//                           <button type="submit" class="login-control-btn login-control-buttonCreateAcc">Create Account</button>
//                         </div>
//                        </form>`
//     this.cont = cont;                   
//     // возвращаем готовый элемент для вставки 
//     return cont
//   }
// }