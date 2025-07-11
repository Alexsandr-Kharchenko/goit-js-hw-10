import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import errorIcon from '../img/icons/svg icons.svg';

const refs = {
  input: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

let userSelectedDate = null;
let timerId = null;

const fp = flatpickr(refs.input, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const picked = selectedDates[0];
    handleDateSelection(picked);
  },
});

function handleDateSelection(date) {
  const isPast = date <= Date.now();

  if (isPast) {
    refs.startBtn.disabled = true;

    iziToast.error({
      message: 'Please choose a date in the future',
      position: 'topRight',
      timeout: 5000,
      backgroundColor: '#ef4040',
      messageColor: '#fff',
      iconColor: '#fff',
      iconUrl: errorIcon,
    });

    return;
  }

  userSelectedDate = date;
  refs.startBtn.disabled = false;
}

refs.startBtn.addEventListener('click', onStart);

function onStart() {
  if (!userSelectedDate) return;

  refs.startBtn.disabled = true;
  refs.input.disabled = true;

  tick();
  timerId = setInterval(tick, 1000);
}

refs.input.blur();

refs.input.classList.remove('has-value');

function tick() {
  const diff = userSelectedDate - Date.now();

  if (diff <= 0) {
    clearInterval(timerId);
    updateInterface({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    refs.input.disabled = false;
    return;
  }

  updateInterface(convertMs(diff));
}

function updateInterface({ days, hours, minutes, seconds }) {
  refs.days.textContent = days;
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

const input = document.querySelector('#datetime-picker');

input.addEventListener('input', () => {
  if (input.value) {
    input.classList.add('has-value');
  } else {
    input.classList.remove('has-value');
  }
});
