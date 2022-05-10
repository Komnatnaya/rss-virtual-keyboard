import './css/style.css';
import keyboardArr from './keyboard.json';

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

const languageText = document.createElement('p');
languageText.classList.add('language');
languageText.innerText = 'Для переключения языка комбинация: левыe Ctrl + Alt';
wrapper.appendChild(languageText);

let capsLock = false;
let language = '';
language = localStorage.getItem('language') ? localStorage.getItem('language') : 'En';

let keys;
let keysEn;
let keysShiftEn;
let keysCapsEn;
let keysShiftCapsEn;
let keysRu;
let keysShiftRu;
let keysCapsRu;
let keysShiftCapsRu;

let currentKey;
let textareaContent = '';
let visibleChild;
let pressed = new Set();
let codes = ['ControlLeft', 'AltLeft'];

function initKeyboard() {
  let out = '';
  for(let i = 0; i < keyboardArr.length; i++) {
    out += `<div class="keyboard__item ${keyboardArr[i].code}" data-code="${keyboardArr[i].code}"><span class="key key--normal">${keyboardArr[i].key}</span><span class="key key--shift">${keyboardArr[i].keyShift}</span><span class="key key--caps">${keyboardArr[i].keyCaps}</span><span class="key key--shift-caps">${keyboardArr[i].keyShiftCaps}</span><span class="key key--normal-ru">${keyboardArr[i].keyRu}</span><span class="key key--shift-ru">${keyboardArr[i].keyShiftRu}</span><span class="key key--caps-ru">${keyboardArr[i].keyCapsRu}</span><span class="key key--shift-caps-ru">${keyboardArr[i].keyShiftCapsRu}</span></div>`;
  }
  keyboard.innerHTML = out;

  keys = document.querySelectorAll('.key');
  keysEn = document.querySelectorAll('.key--normal');
  keysShiftEn = document.querySelectorAll('.key--shift');
  keysCapsEn = document.querySelectorAll('.key--caps');
  keysShiftCapsEn = document.querySelectorAll('.key--shift-caps');
  keysRu = document.querySelectorAll('.key--normal-ru');
  keysShiftRu = document.querySelectorAll('.key--shift-ru');
  keysCapsRu = document.querySelectorAll('.key--caps-ru');
  keysShiftCapsRu = document.querySelectorAll('.key--shift-caps-ru');
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
language === 'En' ? addVisible(keysEn) : addVisible(keysRu);

let selStart = 0;
let selEnd = 0;

textarea.addEventListener("blur", () => {
  selStart = textarea.selectionStart;
  selEnd = textarea.selectionEnd;
});

textarea.addEventListener("click", () => {
  selStart = textarea.selectionStart;
  selEnd = textarea.selectionEnd;
});

function addText(text) {
  textareaContent = textareaContent.substring(0, selStart) + text + textareaContent.substring(selEnd, textareaContent.length);
  selEnd = ++selStart;
}

function addAnswer(code) {
  switch (code) {
    case 'Tab':
      addText('\t');
      break;

    case 'Enter':
      addText('\n');
      break

    case 'CapsLock':
      if (capsLock) {
        capsLock = false;
        currentKey.classList.remove('active');
        language === 'En' ? addVisible(keysEn) : addVisible(keysRu);
      } else {
        capsLock = true;
        currentKey.classList.add('active');
        language === 'En' ? addVisible(keysCapsEn) : addVisible(keysCapsRu);
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
        language === 'En' ? addVisible(keysShiftCapsEn) : addVisible(keysShiftCapsRu);
      } else {
        language === 'En' ? addVisible(keysShiftEn) : addVisible(keysShiftRu);
      }
      break

    case 'AltLeft':
    case 'AltRight':
    case 'MetaLeft':
    case 'ControlLeft':
    case 'ControlRight':
      break

    default:
      addText(visibleChild.innerHTML);
      break
  }

  textarea.innerHTML = textareaContent;
  textarea.focus();
  textarea.selectionStart = selStart;
  textarea.selectionEnd = selEnd;
}

document.addEventListener('keydown', (event) => {
  event.preventDefault();

  currentKey = document.querySelector(`.keyboard__item.${event.code}`);
  currentKey.classList.add('active');
  visibleChild = currentKey.querySelector('.visible');
  addAnswer(event.code);

  pressed.add(event.code);
  for (let code of codes) {
    if (!pressed.has(code)) {
      return;
    }
  }
  language = language === 'En' ? 'Ru' : 'En';
  localStorage.setItem('language', language);
  if (capsLock) {
    language === 'En' ? addVisible(keysCapsEn) : addVisible(keysCapsRu);
  } else {
    language === 'En' ? addVisible(keysEn) : addVisible(keysRu);
  }
})

document.addEventListener('keyup', (event) => {
  document.querySelectorAll('.keyboard__item').forEach(function(el){
    if (!el.classList.contains('CapsLock') && !el.classList.contains('ShiftLeft') && !el.classList.contains('ShiftRight')) {
      el.classList.remove('active');
    }
    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
      if (capsLock) {
        language === 'En' ? addVisible(keysCapsEn) : addVisible(keysCapsRu);
      } else {
        language === 'En' ? addVisible(keysEn) : addVisible(keysRu);
      }
      el.classList.remove('active');
    }
    pressed.delete(event.code);
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
      language === 'En' ? addVisible(keysShiftCapsEn) : addVisible(keysShiftCapsRu);
    } else {
      language === 'En' ? addVisible(keysShiftEn) : addVisible(keysShiftRu);
    }
  })
});

document.querySelectorAll('.ShiftLeft, .ShiftRight').forEach(function(el){
  el.addEventListener('mouseup', function(){
    if (capsLock) {
      language === 'En' ? addVisible(keysCapsEn) : addVisible(keysCapsRu);
    } else {
      language === 'En' ? addVisible(keysEn) : addVisible(keysRu);
    }
  })
});
