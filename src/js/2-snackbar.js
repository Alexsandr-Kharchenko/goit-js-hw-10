import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
/*
  Форма → слухаємо submit
====================================*/
const form = document.querySelector('.form');

form.addEventListener('submit', onFormSubmit);

function onFormSubmit(evt) {
  evt.preventDefault();

  // зчитуємо значення
  const delay = Number(form.elements.delay.value);
  const state = form.elements.state.value; // 'fulfilled' або 'rejected'

  // створюємо проміс
  createPromise(delay, state).then(handleSuccess).catch(handleError);

  // опційно: скинути форму
  form.reset();
}

/*
  Функція‑генератор промісу
------------------------------------*/
function createPromise(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      state === 'fulfilled' ? resolve(delay) : reject(delay);
    }, delay);
  });
}

/*
  Обробники результату
------------------------------------*/
function handleSuccess(delay) {
  iziToast.success({
    message: `ОК Fulfilled promise in ${delay}ms`,
    backgroundColor: '#59a10d',
    iconUrl: './img/icons/svg ok.svg',
    messageColor: '#fff',
    position: 'topRight',
  });
}

function handleError(delay) {
  iziToast.error({
    message: `Error Rejected promise in ${delay}ms`,
    backgroundColor: '#ef4040',
    iconUrl: './img/icons/svg icons.svg',
    messageColor: '#fff',
    position: 'topRight',
  });
}
