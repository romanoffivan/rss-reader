export default class Example {
  element;

  constructor(element) {
    this.element = element;
  }
  init() {
    this.element.textContent = 'hello, Ivan!';
    console.log('ehu!');
  }
}
