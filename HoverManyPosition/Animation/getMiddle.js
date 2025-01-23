export function GetMiddleText(text) {
  return {
    x:
      text.getBoundingClientRect().left +
      text.getBoundingClientRect().width / 2,
    y:
      text.getBoundingClientRect().top +
      text.getBoundingClientRect().height / 2,
  };
}
