import {
  ancientsData
} from "./data/ancients.js";
import { difficulties } from "./data/difficulties.js";

const ancients = document.querySelectorAll('.ancient');
const difficultiesWrap = document.querySelector('.difficulties-wrap');
const difficultiesBut = document.querySelectorAll('.difficulty');
const mixWrap = document.querySelector('.mix-wrap');
let currentAncient;
let currentDifficulty;

ancients.forEach((el, i) => {
  el.addEventListener('click', () => {
    difficultiesWrap.style.visibility = 'visible';
    currentAncient = ancientsData[i];
    ancients.forEach((e, j) => {
      if (j === i) {
        e.classList.add('ancient-active');
      } else {
        e.classList.remove('ancient-active');
      }
    })
  })
})

difficultiesBut.forEach((el, i) => {
  el.addEventListener('click', () => {
    mixWrap.classList.add('mix-active');
    currentDifficulty = difficulties[i].id;
    difficultiesBut.forEach((e, j) => {
      if (j === i) {
        e.classList.add('difficulty-active');
      } else {
        e.classList.remove('difficulty-active');
      }
    })
  })
})