import './login.css';

import Modal from '../../components/modal/modal';

export default function Login(cb) {
  const modal = Modal();

  let loginInputRef = null;
  let passwordInputRef = null;
  let formRef = null;
  let data = null;

  const createAccount = () => {
    fetch('https://afternoon-falls-25894.herokuapp.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: `${loginInputRef.value}`,
        password: `${passwordInputRef.value}`,
      }),
    })
      .then((res) => {
        if (res.status === 422) {
          modal.showModal('Недопустимая почта или пароль. Пароль должен содержать не менее 8 символов, как минимум одну прописную букву, одну заглавную букву, одну цифру и один спецсимвол из +-_@$!%*?&#.,;:[]{}.');
        } else {
          return res.json();
        }
      })
      .then((createData) => {
        console.log(createData)
        if(createData) {
          modal.showModal('Пользователь успешно зарегистрирован.')
        }
      })
      .catch((error) => console.error(error));
  };

  const logIn = () => {
    fetch('https://afternoon-falls-25894.herokuapp.com/signin', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: `${loginInputRef.value}`,
        password: `${passwordInputRef.value}`,
      }),
    })
      .then((res) => {
        if (res.status === 403) {
          modal.showModal('Вы ввели неверный пароль!');
        } else if(res.status === 404) {
          modal.showModal('Пользователь с такой почтой не найден!');
        } else {
          return res.json();
        }
      })
      .then((authentication) => {
        if (authentication) {
          data = authentication;
          cb();
        }
      })
      .catch((error) => console.error(error));
  };

  const getData = () => ({
    data,
  });

  const render = () => {
    const container = document.createElement('div');
    const wrapper = document.createElement('div');
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
    const backgroundImg = document.getElementById('app');
    const loginImage = document.createElement('i');
    const passwordImage = document.createElement('i');
    const headerLogin = document.createElement('div');
    const headerText = document.createElement('h3');

    wrapper.classList.add('login-rgba-stylish-strong');
    headerLogin.classList.add('login-form-header', 'login-purple-gradient');
    container.classList.add('login-form');
    backgroundImg.classList.add('login-view');
    form.method = 'POST';
    form.action = '#';
    loginInpCont.classList.add('login-input-cont');
    loginLabel.for = 'login';
    headerText.innerText = 'RS Lang Authorization';
    headerText.classList.add('login-white-text');
    loginInput.id = 'login';
    loginInput.classList.add('login-input');
    loginInput.type = 'text';
    passwordInpCont.classList.add('login-input-cont');
    passwordLabel.for = 'password';
    passwordInput.id = 'password';
    passwordInput.classList.add('login-input');
    loginInput.placeholder = 'Login';
    passwordInput.placeholder = 'Password';
    passwordInput.type = 'password';
    controlPanel.classList.add('login-control');
    btnLogIn.type = 'submit';
    btnLogIn.classList.add('login-btn', 'login-btn-lg', 'login-control-buttonLogIn');
    btnLogIn.innerText = 'LogIn';
    btnCreateAcc.type = 'submit';
    btnCreateAcc.classList.add('login-btn', 'login-btn-lg', 'login-control-buttonCreateAcc');
    btnCreateAcc.innerText = 'Create Acc';
    passwordImage.classList.add('fas');
    loginImage.classList.add('fas');
    loginImage.classList.add('fa-user');
    loginImage.classList.add('prefix');
    loginImage.classList.add('login-pink-text');
    passwordImage.classList.add('fa-lock');
    passwordImage.classList.add('login-pink-text');
    passwordImage.classList.add('mt-2');
    passwordImage.classList.add('mb-2');

    wrapper.append(container);
    container.append(headerLogin);
    headerLogin.append(headerText);
    container.append(form);
    form.append(loginInpCont);
    loginInpCont.append(loginImage);
    loginInpCont.append(loginInput);
    form.append(passwordInpCont);
    passwordInpCont.append(passwordImage);
    passwordInpCont.append(passwordInput);
    form.append(controlPanel);
    controlPanel.append(btnLogIn);
    controlPanel.append(btnCreateAcc);

    formRef = form;
    loginInputRef = loginInput;
    passwordInputRef = passwordInput;

    modal.onInit(wrapper);

    return wrapper;
  };

  const addEventListeners = () => {
    formRef.addEventListener('submit', (e) => {
      e.preventDefault();

      if (e.submitter.classList.contains('login-control-buttonLogIn')) {
        logIn();
      }

      if (e.submitter.classList.contains('login-control-buttonCreateAcc')) {
        createAccount();
      }
    });
  };

  const onInit = (anchor) => {
    const container = anchor.append(render());
    addEventListeners();
    return container;
  };

  return {
    onInit,
    getData,
  };
}
