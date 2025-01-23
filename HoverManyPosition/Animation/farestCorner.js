export function GetFarestCorner(event, middle, index, farestConfiguration) {
  const farestVertical = ["top", "bottom"].includes(
    (farestConfiguration.farestCornerTopBottom ?? "").toLowerCase()
  )
    ? farestConfiguration.farestCornerTopBottom
    : farestCornerTopBottom(event, middle, index);
  const farestHorizontal = ["left", "right"].includes(
    (farestConfiguration.farestCornerLeftRight ?? "").toLowerCase()
  )
    ? farestConfiguration.farestCornerLeftRight
    : farestCornerLeftRight(event, middle, index);

  return farestVertical + farestHorizontal;
}
/**
 * Retrieves the farthest vertical corner from the given event's position.
 * @param {event} {x: number, y: number} The position of the mouse
 * @param {middle} {x: number, y: number} The middle of the text
 * @param {index} number The index of the text
 * @return {string} "top" or "bottom"
 */
function farestCornerTopBottom(event, middle, index) {
  if (index < texts.length / 2) {
    return "bottom";
  } else if (index > texts.length / 2) {
    return "top";
  } else {
    return middle.y < event.y ? "top" : "bottom";
  }
}
/**
 * Retrieves the farthest horizontal corner from the given event's position.
 * @param {event} {x: number, y: number} The position of the mouse
 * @param {middle} {x: number, y: number} The middle of the text
 * @return {string} "Left" or "Right"
 */
function farestCornerLeftRight(event, middle) {
  return event.x < middle.x ? "right" : "left";
}
