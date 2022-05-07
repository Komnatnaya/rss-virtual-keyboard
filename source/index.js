import './css/style.css';
import keyboardArr from './keyboard.json';
console.log(keyboardArr);

const wrapper = document.querySelector('#wrapper');

const title = document.createElement('h1');
title.classList.add('title');
title.innerText = 'Виртуальная клавиатура';
wrapper.appendChild(title);

const textarea = document.createElement('textarea');
textarea.classList.add('textarea');
wrapper.appendChild(textarea);

const keyboard = document.createElement('div');
keyboard.classList.add('keyboard');
wrapper.appendChild(keyboard);

const description = document.createElement('p');
description.classList.add('description');
description.innerText = 'Клавиатура создана в операционной системе Windows';
wrapper.appendChild(description);

const language = document.createElement('p');
language.classList.add('language');
language.innerText = 'Для переключения языка комбинация: левыe ctrl + alt';
wrapper.appendChild(language);

// let out = '';
// for(let i = 0; i < keyboardArr.length; i++) {
//   out += `<button class="keyboard__item" data="${keyboardArr[i].code}">${keyboardArr[i].key}</button>`;
// }
// keyboard.innerHTML = out;

// let keyboardArr = [];
// [192, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 189, 187, 8]
// [9, 81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221, 220, 46]
// [20, 65, 83, 68, 70, 71, 72, 74, 75, 76, 186, 222, 13]
// [16, 90, 88, 67, 86, 66, 78, 77, 188, 190, 191, 38, 16]
// [17, 91, 18, 32, 18, 37, 40, 39, 17]
// document.onkeydown = function(event) {
//   keyboard.push(event.code);
//   console.log(keyboard);
// }


function initKeyboard() {
  let out = '';
  for(let i = 0; i < keyboardArr.length; i++) {
    out += `<button class="keyboard__item ${keyboardArr[i].code}" data="${keyboardArr[i].code}">${keyboardArr[i].key}</button>`;
  }
  keyboard.innerHTML = out;
}
initKeyboard();

let textareaContent = '';
document.addEventListener('keydown', function(event) {
  document.querySelectorAll('.keyboard__item').forEach(function(el){
    el.classList.remove('active');
  });
  console.log(event.code);
  let currentKey = document.querySelector(`.keyboard__item.${event.code}`);
  currentKey.classList.add('active');
  textareaContent += currentKey.innerHTML;
  textarea.innerText = textareaContent;
  // currentKey.classList.remove('active');
})

document.addEventListener('keyup', function() {
  document.querySelectorAll('.keyboard__item').forEach(function(el){
    el.classList.remove('active');
  });
})

document.querySelectorAll('.keyboard__item').forEach(function(el){
  el.addEventListener('click', function(event){
    // document.querySelectorAll('.keyboard__item').forEach(function(el){
    //   el.classList.remove('active');
    // });
    // this.classList.add('active');
  })
});