import "./sprint.css";

export default class Sprint {
  constructor() {
    this.container = null;
    this.data = null;
  }


  // при иницилизации сразу создаем html и вешаем обработчики
  onInit (anchor) {
    const container = anchor.append(this.render())
    /* this.addEventListeners() */
    return container
  }
  
logc(){
    console.log('ewewewewewewewewew');
}

  // вешаем обработчики
 /*  addEventListeners  () {
    this.container.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault()

      // по классу находим нужную кнопку и отправляем запрос
      if(e.submitter.classList.contains('login-control-buttonLogIn')) {
        this.logIn();
      }

      if(e.submitter.classList.contains('login-control-buttonCreateAcc')) {
        this.createAcc();
      }
    })
  }

  // функции логин и создать акк
  createAcc  () {
    fetch('https://afternoon-falls-25894.herokuapp.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        //  а теперь благодаря ссылкам используем где надо.
        email: `${this.container.querySelector('#login').value}`,
        password: `${this.container.querySelector('#password').value}`
      })
    })
    .then(res => res.json())
    .then(data=> console.log(data))
  }

  logIn () {
    fetch('https://afternoon-falls-25894.herokuapp.com/signin', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        //  а теперь благодаря ссылкам используем где надо.
        email: `${this.container.querySelector('#login').value}`,
        password: `${this.container.querySelector('#password').value}`
      })
    })
    .then(res => res.json())
    .then(authentication => {
      this.data = authentication;
      console.log(authentication)
    })
  }
  

  // получить токен
  getData  () {
    return this.data
  } */

  render () {
    
    const container = document.createElement('div');
    container.classList.add('login-form')
    
    container.innerHTML = `
                        <div class="box">
                          gfgfgfgfgfgfgfgf
                        </div>
                        
                       `
    this.container = container;                   
    
    return container
  }
}