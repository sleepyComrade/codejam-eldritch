import { ancientsData } from "./data/ancients.js";
import { difficulties } from "./data/difficulties.js";
import { cardsData as blueCardsData } from "./data/mythicCards/blue/index.js";
import { cardsData as brownCardsData } from "./data/mythicCards/brown/index.js";
import { cardsData as greenCardsData } from "./data/mythicCards/green/index.js";

const ancients = document.querySelectorAll('.ancient');
const difficultiesWrap = document.querySelector('.difficulties-wrap');
const difficultiesBut = document.querySelectorAll('.difficulty');
const mixWrap = document.querySelector('.mix-wrap');
const stagesWrap = document.querySelector('.stages-wrap');
const cardDeckBg = document.querySelector('.card-deck');
const tableCurrCard = document.querySelector('.current-card');
let currentAncient;
let currentDifficulty;
const trackers = document.querySelectorAll('.tracker-text');
const stageNum = ['firstStage', 'secondStage', 'thirdStage'];
const cardColors = ['greenCards', 'brownCards', 'blueCards'];
let currentTracks;

//choose an ancient and show 
ancients.forEach((el, i) => {
  el.addEventListener('click', () => {
    difficultiesWrap.style.visibility = 'visible';
    stagesWrap.style.visibility = 'hidden';
    cardDeckBg.style.visibility = 'hidden';
    tableCurrCard.style.backgroundImage = 'none';

    if (currentDifficulty) {
      mixWrap.classList.add('mix-active');
    }

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

//choose difficulty and show shuffle button
difficultiesBut.forEach((el, i) => {
  el.addEventListener('click', () => {
    if (!el.classList.contains('difficulty-active')) {
      stagesWrap.style.visibility = 'hidden';
      cardDeckBg.style.visibility = 'hidden';
      mixWrap.classList.add('mix-active');
      tableCurrCard.style.backgroundImage = 'none';
    }
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

//define tracker initial numbers
const setTrackers = () => {
  currentTracks = [];
  stageNum.forEach(el => {
    cardColors.forEach(e => {
      currentTracks.push(currentAncient[el][e])
    })
  })
  
  trackers.forEach((el, i) => {
    el.textContent = currentTracks[i];
  })
}

//shuffle any deck
const shuffleCards = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i);
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
}

//get game deck
const getMythDeck = (green, brown, blue, ancient, stage, color) => {
  const cards = [green, brown, blue];
  const mainDecks = [[], [], []];
  const mythDecks = [[], [], []];
  const stageDecks = [[], [], []];

  let greenQty = ancient.firstStage.greenCards + ancient.secondStage.greenCards + ancient.thirdStage.greenCards;
  let brownQty = ancient.firstStage.brownCards + ancient.secondStage.brownCards + ancient.thirdStage.brownCards;
  let blueQty = ancient.firstStage.blueCards + ancient.secondStage.blueCards + ancient.thirdStage.blueCards;
  const quantities = [greenQty, brownQty, blueQty];

  if (currentDifficulty === 'very easy') {
    cards.forEach((el, i) => {
      el.forEach(e => {
        if (e.difficulty !== 'hard') {
          mainDecks[i].push(e);
        }
      })
    })

    mainDecks.forEach(el => {
      shuffleCards(el);
    })

    for (let i = 0; i < 2; i++) {
      mainDecks.forEach((el, i) => {
        el.forEach((e, j) => {
          if (e.difficulty === 'easy' && mythDecks[i].length < quantities[i]) {
            mythDecks[i].push(e);
            mainDecks[i].splice(j, 1);
          }
        })
      })
    }

    mainDecks.forEach((el, i) => {
      while (mythDecks[i].length < quantities[i]) {
        mythDecks[i].push(el.pop());
      }
    })
  }

  mythDecks.forEach(el => {
    shuffleCards(el);
  })

  mythDecks.forEach((el, i) => {
    stageDecks.forEach((e, k) => {
      for (let j = 0; j < ancient[stage[k]][color[i]]; j++) {
        e.push(el.pop());
      }
    })
  })

  stageDecks.forEach(el => {
    shuffleCards(el);
  })

  setTrackers();
  
  console.log(mainDecks);
  console.log(mythDecks);
  console.log(stageDecks);

  return [...stageDecks[2], ...stageDecks[1], ...stageDecks[0]];
}

//show the table and get game deck
let gameDeck;
mixWrap.addEventListener('click', () => {
  mixWrap.classList.remove('mix-active');
  stagesWrap.style.visibility = 'visible';
  cardDeckBg.style.visibility = 'visible';
  gameDeck = getMythDeck(greenCardsData, brownCardsData, blueCardsData, currentAncient, stageNum, cardColors);
  console.log(gameDeck);
})

//show current card
cardDeckBg.addEventListener('click', () => {
  if (gameDeck.length > 0) {
    const currentCard = gameDeck.pop();
    tableCurrCard.style.backgroundImage = `url(${currentCard.cardFace})`;
    //set trackers depending on current card
    let colorTracks = currentCard.color === 'green' ? [0, 3, 6] : currentCard.color === 'brown' ? [1, 4, 7] : [2, 5, 8];
    let curTrack = currentTracks[colorTracks[0]] > 0 ? colorTracks[0] : currentTracks[colorTracks[1]] > 0 ? colorTracks[1] : colorTracks[2];
    currentTracks[curTrack]--;
    trackers[curTrack].textContent = currentTracks[curTrack];

    if (gameDeck.length === 0) {
      cardDeckBg.style.visibility = 'hidden';
    }
  }
})