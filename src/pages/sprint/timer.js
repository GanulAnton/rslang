export default function setTimer(end = 0) {
  document.querySelector('.box_sprintGame').insertAdjacentHTML('afterbegin', `<svg class="timer-sprint" width='120px' height='120px'>
    <circle class="timer__circle-sprint" fill='transparent' stroke-width='4' cx='60' cy='60' r='52'/>
    </svg>`);

  const circle = document.querySelector('.timer__circle-sprint');
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  circle.style.stroke = '#2ecc71';

  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = circumference;
  function setTime(p) {
    const offset = circumference - (p / 100) * circumference;
    circle.style.strokeDashoffset = offset;
  }

  let x = 106;
  const timerID = setInterval(() => {
    if (end === 0) {
      setTime(x);
      x -= 0.1;
      if (x < 25) {
        circle.style.stroke = '#d35400';
      } else if (x < 50) {
        circle.style.stroke = '#f1c40f';
      }
    } else {
      circle.style.stroke = 'red';
      setTime(100);
    }
  }, 60);

  /* setTimeout(() => {clearInterval(timerID); circle.style.stroke = 'red'; setTime(100);}, 65000); */
}
