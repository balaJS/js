class quotesGenerator {
  constructor() {
    this.setupDoms();
    this.setupQuotes();
    this.setupQuote();
  }

  getRandomNum() {
    let lengthOfQuotes = this.quotes ? this.quotes.length : 0;

    if (lengthOfQuotes) {
      lengthOfQuotes--;
    }

    return Math.floor((Math.random() * lengthOfQuotes) + 1);
  }

  pickupQuote() {
    let randomNum = this.getRandomNum();
    return randomNum + ') ' + this.quotes[randomNum];
  }

  setupQuote() {
    let nextQuote = this.pickupQuote();

    if (!nextQuote) {
      console.log('Quotes are not exists. Please add some quotes');
      return;
    }

    this.$quote.innerHTML = nextQuote;
  }

  setupDoms() {
    this.$container = document.getElementsByClassName('js-main-container');
    this.$quotesPanel = document.getElementsByClassName('js-quotes-panel');
    this.$quote = document.getElementsByClassName('js-quote')[0];
  }

  setupQuotes() {
    this.quotes = [
      'SOMETIMES LIFE IS LIKE THIS DARK TUNNEL.',
      'FAILURE IS ONLY THE OPPORTUNITY TO BEGIN AGAIN.',
      'IT IS IMPORTANT TO DRAW WISDOM FROM MANY DIFFERENT PLACES.',
      'LIFE HAPPENS WHEREVER YOU ARE, WHETHER YOU MAKE IT OR NOT.',
      'GOOD TIMES BECOME GOOD MEMORIES, BUT BAD TIMES MAKE GOOD LESSONS.',
      'SHARING TEA WITH A FASCINATING STRANGER IS ONE OF LIFE’S TRUE DELIGHTS.',
      'DESTINY IS A FUNNY THING. YOU NEVER KNOW HOW THINGS ARE GOING TO WORK OUT.',
      'SOMETIMES, THE BEST WAY TO SOLVE YOUR OWN PROBLEMS IS TO HELP SOMEONE ELSE.',
      'HOPE IS SOMETHING YOU GIVE YOURSELF. THAT IS THE MEANING OF INNER STRENGTH.',
      'BE CAREFUL WHAT YOU WISH FOR, ADMIRAL. HISTORY IS NOT ALWAYS KIND TO ITS SUBJECTS.',
      'IT IS USUALLY BEST TO ADMIT MISTAKES WHEN THEY OCCUR, AND TO SEEK TO RESTORE HONOR.',
      'PRIDE IS NOT THE OPPOSITE OF SHAME, BUT ITS SOURCE. TRUE HUMILITY IS THE ONLY ANTIDOTE TO SHAME.',
      'WHILE IT IS ALWAYS BEST TO BELIEVE IN ONESELF, A LITTLE HELP FROM OTHERS CAN BE A GREAT BLESSING.',
      'IT\'S TIME FOR YOU TO LOOK INWARD AND START ASKING YOURSELF THE BIG QUESTION: WHO ARE YOU AND WHAT DO YOU WANT?',
      'THERE IS NOTHING WRONG WITH A LIFE OF PEACE AND PROSPERITY. I SUGGEST YOU THINK ABOUT WHAT IT IS YOU WANT FROM YOUR LIFE.',
    ];
  }
}

document.addEventListener('DOMContentLoaded', function() {
  var irohQuotes = new quotesGenerator();

  function checkKey(e) {
    e = e || window.event;

    if (e.keyCode >= 37 && e.keyCode <= 40) {
      irohQuotes.setupQuote();
    }
  }
  document.onkeydown = checkKey;
});
