export function GetTextFieldCenter(text) {
  return new Coordinates(
    text.getBoundingClientRect().left + text.getBoundingClientRect().width / 2,
    text.getBoundingClientRect().top + text.getBoundingClientRect().height / 2
  );
}
export class Coordinates {
  constructor(x, y) {
    this._x = x;
    this._y = y;
  }
  set x(value) {
    this._x = value;
  }
  set y(value) {
    this._y = value;
  }
  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }
}
