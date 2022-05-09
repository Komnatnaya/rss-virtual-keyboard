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

let capsLock = false;

let keys;
let keysEn;
let keysShiftEn;
let keysCapsEn;
let keysShiftCapsEn;

let currentKey;
let textareaContent = '';
let visibleChild;

function initKeyboard() {
  let out = '';
  for(let i = 0; i < keyboardArr.length; i++) {
    out += `<div class="keyboard__item ${keyboardArr[i].code}" data-code="${keyboardArr[i].code}"><span class="key key--normal">${keyboardArr[i].key}</span><span class="key key--shift">${keyboardArr[i].keyShift}</span><span class="key key--caps">${keyboardArr[i].keyCaps}</span><span class="key key--shift-caps">${keyboardArr[i].keyShiftCaps}</span></div>`;
  }
  keyboard.innerHTML = out;

  keys = document.querySelectorAll('.key');
  keysEn = document.querySelectorAll('.key--normal');
  keysShiftEn = document.querySelectorAll('.key--shift');
  keysCapsEn = document.querySelectorAll('.key--caps');
  keysShiftCapsEn = document.querySelectorAll('.key--shift-caps');
}
initKeyboard();

function addVisible(activeKey) {
  keys.forEach(function(el){
    el.classList.remove('visible');
  });
  activeKey.forEach(function(el){
    el.classList.add('visible');
  });
}
addVisible(keysEn);

let selStart = 0;
let selEnd = 0;

textarea.addEventListener("blur", function() {
  selStart = this.selectionStart;
  selEnd = this.selectionEnd;
});

function addAnswer(code) {
  switch (code) {
    case 'Tab':
      textareaContent += '\t';
      break;

    case 'Enter':
      textareaContent += '\n';
      selStart++;
      selEnd++;
      break

    case 'CapsLock':
      if (capsLock) {
        capsLock = false;
        currentKey.classList.remove('active');
        addVisible(keysEn);
      } else {
        capsLock = true;
        currentKey.classList.add('active');
        addVisible(keysCapsEn);
      }
      break

    case 'Backspace':
      selStart = textarea.selectionStart;
      selEnd = textarea.selectionEnd;
      if (selEnd) {
        textareaContent = textareaContent.substring(0, selStart - 1) + textareaContent.substring(selEnd, textareaContent.length);
        selEnd = --selStart;
      }
      break
    
    case 'Delete':
      selStart = textarea.selectionStart;
      selEnd = textarea.selectionEnd;
      if (textareaContent.length != 0 && selStart != textareaContent.length) {
        textareaContent = textareaContent.substring(0, selStart) + textareaContent.substring(selEnd + 1, textareaContent.length);
        selStart = selEnd;
      }
      break

    case 'ShiftLeft':
    case 'ShiftRight':
      if (capsLock) {
        addVisible(keysShiftCapsEn);
      } else {
        addVisible(keysShiftEn);
      }
      break

    case 'AltLeft':
    case 'AltRight':
    case 'MetaLeft':
    case 'ControlLeft':
    case 'ControlRight':
      break

    default:
      textareaContent += visibleChild.innerHTML;
      selStart++;
      selEnd++;
      break
  }

  textarea.innerHTML = textareaContent;
  textarea.focus();
  textarea.selectionStart = selStart;
  textarea.selectionEnd = selEnd;
}

document.addEventListener('keydown', function(event) {
  event.preventDefault();

  currentKey = document.querySelector(`.keyboard__item.${event.code}`);
  currentKey.classList.add('active');
  visibleChild = currentKey.querySelector('.visible');
  addAnswer(event.code);
})

document.addEventListener('keyup', function(event) {
  document.querySelectorAll('.keyboard__item').forEach(function(el){
    if (!el.classList.contains('CapsLock') && !el.classList.contains('ShiftLeft') && !el.classList.contains('ShiftRight')) {
      el.classList.remove('active');
    }
    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
      if (capsLock) {
        addVisible(keysCapsEn);
      } else {
        addVisible(keysEn);
      }
      el.classList.remove('active');
    }
  });
})

document.querySelectorAll('.keyboard__item').forEach(function(el){
  el.addEventListener('click', function(){
    document.querySelectorAll('.keyboard__item').forEach(function(el){
      if (!el.classList.contains('CapsLock')) {
        el.classList.remove('active');
      }
    });
    currentKey = this;
    visibleChild = this.querySelector('.visible');
    if (this.dataset.code !== 'ShiftLeft' && this.dataset.code !== 'ShiftRight') {
      addAnswer(this.dataset.code);
    }
  })
});

document.querySelectorAll('.ShiftLeft, .ShiftRight').forEach(function(el){
  el.addEventListener('mousedown', function(){
    if (capsLock) {
      addVisible(keysShiftCapsEn);
    } else {
      addVisible(keysShiftEn);
    }
  })
});

document.querySelectorAll('.ShiftLeft, .ShiftRight').forEach(function(el){
  el.addEventListener('mouseup', function(){
    if (capsLock) {
      addVisible(keysCapsEn);
    } else {
      addVisible(keysEn);
    }
  })
});
