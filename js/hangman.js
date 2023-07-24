const wordsArray = [
  "kalamarnica",
  "orzechowka",
  "jedzenie",
  "fizyka",
  "Warszawa",
  "Andrzej",
  "zasnalem",
  "dostawa",
  "darmowe",
  "gaduly",
  "zupa",
];

class MyHangman {
  word;
  wordLength;
  splittedWord;
  hangEl;
  displayEl;
  hiddenWordsEl;
  keyboardEl;
  lettersEls;
  mistakes = 7;
  constructor(array, element) {
    this.word = this.getRandomWord(array);
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
    this.displayEl = document.querySelector(".display");
    this.displayEl.textContent = this.mistakes;
  }
  createWords() {
    this.hiddenWordsEl = document.querySelector(".words");
    for (let i = 0; i < this.wordLength; i++) {
      const letters = "<div>_</div>";
      this.hiddenWordsEl.insertAdjacentHTML("beforeend", letters);
    }
    this.lettersEls = this.hiddenWordsEl.childNodes;
  }
  createKeyboard() {
    this.keyboardEl = document.querySelector(".keyboard");
    const alphEn = "abcdefghijklmnopqrstuvwxyz";
    alphEn.split("").forEach((element) => {
      this.keyboardEl.insertAdjacentHTML(
        "beforeend",
        `<button class="key">${element.toUpperCase()}</button>`
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
    result !== true
      ? window.alert("Game Over! You Lost!")
      : window.alert("Udalo Ci sie! Koniec gry.");
  }
}

const hangmanEl = document.querySelector(".myHangman");
const game = new MyHangman(wordsArray, hangmanEl);
