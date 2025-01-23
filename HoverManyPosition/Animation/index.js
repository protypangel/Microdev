import { AnimationOptimizer, DXYStarsOptimizer } from "./optimizer.js";
import { GsapMaskNodeCaller, GsapAnimationStarCaller } from "./gsap.js";
import { GetCorners, GetFarestCorner } from "./farestCorner.js";
import { OptimizationConfiguration } from "./configuration.js";
import { GetMiddleText } from "./getMiddle.js";

export function Animation(
  divMaskContainer,
  svgMaskNode,
  svgStarNodes,
  OrderDisplayedStars = () => [],
  DXYStars,
  gsapAnimationStarConfiguration = function () {},
  gsapMaskNodeConfiguration = function () {},
  AnimationListener = {},
  farestConfiguration = {}
) {
  // Div Container that's containes all textfield's childrens
  const parentTextNodes = divMaskContainer.children[1];
  // Rect Container which's the mask
  const rect = svgMaskNode.children[0];
  // Number of textfield
  const nbTextField = parentTextNodes.children.length;
  // PX of each textfield
  // Remember that's each textfield has the same heigh
  const heightPx =
    divMaskContainer.getBoundingClientRect().height / nbTextField;
  // The distance beetween the center that's permit to reactive the mask mouvement
  const reactiveTextFieldMaskHeight = (heightPx * 3) / 4;
  let numberOfClickUnderTextField = 0;
  // Sizing the rect's height dynamically
  // The mask's height has the same each textfield's height
  // Remember that's each textfield has the same height
  rect.setAttribute("height", `${100 / nbTextField}%`);

  const animationOptimizer = AnimationOptimizer(
    AnimationListener,
    OptimizationConfiguration
  );

  function GsapMaskNodeCallerProxy(index, onComplete = () => {}) {
    GsapMaskNodeCaller(
      heightPx,
      index,
      rect,
      gsapMaskNodeConfiguration,
      onComplete
    );
  }

  // Give the current clicked textfield index with his center [ middle ] position
  let activeTextField = {
    index: 0,
    middle: {
      x: 0,
      y: 0,
    },
  };
  // Know if the animation scrolling mask is active or not
  let activeMaskAnimation = true;
  // Get all texts containers
  const texts = divMaskContainer.querySelectorAll(".text");
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
  const corners = GetCorners(divMaskContainer);

  /**
   * Sets up event listeners for each text field to handle animations.
   *
   * Event Details:
   * - **Click Listener**:
   *   - Stops the mask animation.
   *   - Triggers the falling stars animation.
   * - **MouseOver Listener**:
   *   - Reactivates the mask animation.
   *
   * @param {HTMLElement} text - The text field HTML element for which the listeners are added.
   * @param {number} index - The index of the textfield
   */
  texts.forEach((text, index) => {
    const middle = GetMiddleText(text);

    // Stop the animation when the mouse clicked on a text
    text.addEventListener("click", (event) => {
      activeMaskAnimation = false;
      activeTextField.index = index;
      activeTextField.middle = middle;
      GsapMaskNodeCallerProxy(index);

      // Follow the rule of AnimationOptimizer
      if (animationOptimizer["stop.star"](++numberOfClickUnderTextField))
        return;
      const corner =
        corners[GetFarestCorner(event, middle, index, farestConfiguration)];
      // Prendre en compte le reverse !

      const dxyReducer = DXYStarsOptimizer(DXYStars);
      // Star animation
      OrderDisplayedStars(...Object.values(corner.reverse)).forEach(
        (index, index2) => {
          const svgStarNode = svgStarNodes[index];
          if (!!!svgMaskNode) return;
          const dxy = dxyReducer(index);

          GsapAnimationStarCaller(
            [
              corner.reverse.x ? -dxy[0] : dxy[0],
              corner.reverse.y ? -dxy[1] : dxy[1],
            ],
            svgStarNode,
            index2,
            middle,
            corner,
            gsapAnimationStarConfiguration
          );
        }
      );
    });
    /** Reactive the animation when (and):
     * - the mouse is over the text
     * - the dy between the middle of the textfield and the cursor is higher than the size of the textfield
     */
    text.addEventListener("mousemove", (event) => {
      if (
        activeMaskAnimation ||
        index === activeTextField.index ||
        Math.abs(activeTextField.middle.y - event.clientY) <=
          reactiveTextFieldMaskHeight
      )
        return;
      GsapMaskNodeCallerProxy(index, () => (activeMaskAnimation = true));
    });
  });
  // When the mouse is over the parent we change the mask position
  divMaskContainer.addEventListener("mousemove", (event) => {
    if (!activeMaskAnimation) return;
    const rectHeight = rect.getBoundingClientRect().height;
    const parentRect = divMaskContainer.getBoundingClientRect();
    const mouseY = event.clientY - parentRect.top;
    const newY = Math.min(
      Math.max(mouseY - rectHeight / 2, 0),
      parentRect.height - rectHeight
    );
    rect.setAttribute("y", `${newY}px`);
  });
}
