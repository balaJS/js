class Vanilla {
  constructor(selector) {
    this.elems = [];
    this.selector = selector;
    return this.getElem;
  }

  getElem(selector, context) {
    var selector = selector || this.selector;
    selector = context ? context + ' ' + selector : selector;
    var temp = [];

    document.querySelectorAll(selector).forEach(function(elem) {
      temp.push(elem);
    });
    return (temp.length === 1) ? temp[0] : temp;
  }
}

class Car {
  constructor($car) {
    this.x = 20;
    this.y = 450;
    this.$car = $car;
    this.$car.style.top = this.y + 'px';
    this.$car.style.left = this.x + 'px';
    this.eventsInit();
  }

  selectMotion(evt) {
    switch (evt.key) {
      case 'w':
        this.forward();
        break;
      case 's':
        this.reverse();
        break;
      case 'a':
        this.leftTurn();
        break;
      case 'd':
          this.rightTurn();
          break;
      default:
    }
  }

  throttle() {
    this.$car.style.top = this.y + 'px';
    this.$car.style.left = this.x + 'px';
  }

  forward() {
    this.y -= 5;
    this.throttle();
  }

  reverse() {
    this.y += 5;
    this.throttle();
  }

  leftTurn() {
    this.x -= 5;
    this.throttle();
  }

  rightTurn() {
    this.x += 5;
    this.throttle();
  }

  eventsInit() {
    document.addEventListener('keypress', this.selectMotion.bind(this), false);
  }
}
// it is document.ready function
document.addEventListener('DOMContentLoaded', loaded, false);

function loaded() {
  var $ = new Vanilla();
  var $ground = $('#game_ground');
  var $car = $('.js-car', '.js-context');
  console.log($car);console.log($ground);
}
