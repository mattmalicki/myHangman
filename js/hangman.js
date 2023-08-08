const wordsArray = {
  pl: [
    "Kałamarnica",
    "Orzechówka",
    "Jedzenie",
    "Fizyka",
    "Warszawa",
    "Andrzej",
    "Zasnąłem",
    "Dostawa",
    "Darmowe",
    "Gaduły",
    "Zupa",
  ],
  en: [
    "Squid",
    "Nutcracker",
    "Food",
    "Physics",
    "London",
    "Andrew",
    "Asleep",
    "Delivery",
    "Free",
    "Chatterers",
    "Soup",
  ],
  no: [
    "Akkar",
    "Nøtteknekker",
    "Matt",
    "Fysikk",
    "Oslo",
    "Anders",
    "Sove",
    "Levering",
    "Gratis",
    "Chattere",
    "Suppe",
  ],
};

const alphabet = {
  en: "abcdefghijklmnopqrstuvwxyz",
  pl: "aąbcćdeęfghijklłmnńoóprsśtuwyzźż",
  no: "abcdefghijklmnopqrstuvwxyzæøå",
};

class MyHangman {
  language;
  word;
  wordLength;
  splittedWord;
  hangEl;
  displayEl;
  hiddenWordsEl;
  keyboardEl;
  lettersEls;
  mistakes = 7;
  constructor(element, language, word) {
    this.language = language;
    const random =
      language === "en"
        ? wordsArray.en
        : language === "pl"
        ? wordsArray.pl
        : wordsArray.no;
    this.word = typeof word === "string" ? word : this.getRandomWord(random);
    this.wordLength = this.word.length;
    this.splittedWord = this.word.split("");
    this.hangEl = element;
    this.createDisplay();
    this.createWords();
    this.createKeyboard();
  }
  getRandomWord(array) {
    return array[Math.floor(Math.random() * (array.length - 1))];
  }
  createDisplay() {
    this.displayEl = document.querySelector(".myHangman__display");
    this.displayEl.textContent = this.mistakes;
  }
  createWords() {
    this.hiddenWordsEl = document.querySelector(".myHangman__words");
    for (let i = 0; i < this.wordLength; i++) {
      const letters = `<div>_</div>`;
      this.hiddenWordsEl.insertAdjacentHTML("beforeend", letters);
    }
    this.lettersEls = this.hiddenWordsEl.childNodes;
  }
  createKeyboard() {
    this.keyboardEl = document.querySelector(".myHangman__keyboard");
    const alph =
      language === "en"
        ? alphabet.en
        : language === "pl"
        ? alphabet.pl
        : alphabet.no;
    alph.split("").forEach((element) => {
      this.keyboardEl.insertAdjacentHTML(
        "beforeend",
        `<button class="myHangman__keyboard-key">${element.toUpperCase()}</button>`
      );
    });
    this.keyboardEl.addEventListener("click", this.buttonClicked);
  }
  buttonClicked = (event) => {
    event.preventDefault();
    if (event.target.nodeName !== "BUTTON") {
      return;
    }
    const pressedLetter = event.target.textContent.toLowerCase();

    if (
      this.splittedWord.includes(pressedLetter) ||
      this.splittedWord.includes(pressedLetter.toUpperCase())
    ) {
      const indexes = [];
      this.splittedWord.forEach((letter, index) => {
        if (
          letter === pressedLetter ||
          letter === pressedLetter.toUpperCase()
        ) {
          indexes.push(index);
        }
      });
      this.showLetter(indexes);
      event.target.classList.add("correct");

      event.target.disabled = true;
    } else {
      this.mistakes =
        this.mistakes === 0 ? this.endGame(false) : this.mistakes - 1;
      this.displayEl.textContent = this.mistakes;
      event.target.classList.add("wrong");
      event.target.disabled = true;
    }
    this.isAnyLeft() ? "" : this.endGame(true);
  };
  showLetter(indexes) {
    indexes.forEach((index) => {
      const element = this.lettersEls[index];
      element.textContent = this.splittedWord[index];
    });
  }
  isAnyLeft() {
    const blanks = [];
    this.lettersEls.forEach((letter) => {
      blanks.push(letter.textContent);
    });
    return blanks.includes("_");
  }
  endGame(result) {
    result !== true ? this.endBad() : this.endGood();
    this.buttonsDisable();
  }
  endGood() {
    this.hiddenWordsEl.classList.add("letter-correct");
  }
  endBad() {
    const elements = this.hiddenWordsEl.childNodes;
    elements.forEach((element, index) => {
      if (element.textContent === "_") {
        element.textContent = this.splittedWord[index];
        element.classList.add("letter-wrong");
      } else {
        element.classList.add("letter-correct");
      }
    });
  }
  buttonsDisable() {
    const buttons = this.keyboardEl.querySelectorAll("button");
    buttons.forEach((button) => {
      button.disabled ? "" : (button.disabled = true);
    });
  }
}

const welcomeEl = document.querySelector(".welcome");

const lastMessage = document.querySelector(".message").childNodes;
lastMessage[lastMessage.length - 2].addEventListener("animationend", () => {
  setTimeout(() => {
    welcomeEl.style.transform = "translateX(-100vw)";
  }, 1000);
});

let language = "";
const languageEl = document.querySelector(".language");
languageEl.addEventListener("click", afterLanguage);

function afterLanguage(event) {
  event.preventDefault();
  if (event.target.nodeName !== "BUTTON") {
    return;
  }
  language = event.target.dataset.language;
  welcomeEl.style.transform = "translateX(-200vw)";
}

const typeButton = document.querySelector(".typeOrDraw__word-button");
typeButton.addEventListener("click", afterType);

function afterType(event) {
  event.preventDefault();
  const word = document.querySelector("input").value;
  const hangmanEl = document.querySelector(".myHangman");
  const game = new MyHangman(hangmanEl, language, word);
  document.querySelector("body").style.transform = "translateY(-100vh)";
  welcomeEl.style.transitionDelay = "1000ms";
  welcomeEl.style.transform = "translateX(0)";
}

const drawButton = document.querySelector(".typeOrDraw__random-button");
drawButton.addEventListener("click", afterDraw);

function afterDraw(event) {
  event.preventDefault();
  const hangmanEl = document.querySelector(".myHangman");
  const game = new MyHangman(hangmanEl, language, true);
  document.querySelector("body").style.transform = "translateY(-100vh)";
  welcomeEl.style.transitionDelay = "1000ms";
  welcomeEl.style.transform = "translateX(0)";
}
