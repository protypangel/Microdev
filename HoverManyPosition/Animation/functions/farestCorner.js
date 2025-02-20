/**
     * Represents a map of corner names to their positions in 2D space.
     * Each key is a corner name (string), and each value is an object
     * containing the x and y coordinates of the corner.
     *
     * The key is gived by farestCornerTopBottom and farestCornerLeftRight
     * Example :
        const corner = corners[
            farestCornerTopBottom(event, middle, index) +
              farestCornerLeftRight(event, middle)
        ];
     *
     * @type {Map<string, {x: number, y: number}>}
     */

export class Corners {
  constructor(divMaskContainer) {
    this._corners = Object.entries({
      topleft: {
        x: divMaskContainer.getBoundingClientRect().left,
        y: divMaskContainer.getBoundingClientRect().top,
        reverse: "X",
      },
      topright: {
        x: divMaskContainer.getBoundingClientRect().right,
        y: divMaskContainer.getBoundingClientRect().top,
        reverse: "",
      },
      bottomleft: {
        x: divMaskContainer.getBoundingClientRect().left,
        y: divMaskContainer.getBoundingClientRect().bottom,
        reverse: "Y",
      },
      bottomright: {
        x: divMaskContainer.getBoundingClientRect().right,
        y: divMaskContainer.getBoundingClientRect().bottom,
        reverse: "XY",
      },
    }).reduce((acc, [key, { reverse, ...other }]) => {
      const reverseString = (reverse ?? "").toLowerCase();
      acc[key] = {
        ...other,
        reverse: {
          x: reverseString.includes("x"),
          y: reverseString.includes("y"),
        },
      };
      return acc;
    }, {});
  }
  GetFarestCorner(event, middle, index, farestConfiguration) {
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

    return this._corners[farestVertical + farestHorizontal];
  }
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
