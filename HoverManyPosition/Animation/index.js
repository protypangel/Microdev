import { AnimationOptimizer, DXYStarsOptimizer } from "./optimizer.js";
import { GsapMaskNodeCaller, GsapAnimationStarCaller } from "./gsap.js";
import { Corners } from "./farestCorner.js";
import { OptimizationConfiguration } from "./configuration.js";
import { GetTextFieldCenter, Coordinates } from "./classes/Coordonates.js";

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
    return GsapMaskNodeCaller(
      heightPx,
      index,
      rect,
      gsapMaskNodeConfiguration,
      onComplete
    );
  }

  class ActivedTextField {
    constructor(index = 0, center = new Coordinates(0, 0)) {
      this._index = index;
      this._center = center;
    }
  }
  const state = new (class GsapFacade {
    constructor() {
      this._activeMaskAnimation = true;
      this._activeTextField = new ActivedTextField();
    }
    set activeTextField(textfieldData) {
      const { index } = textfieldData;
      this._activeMaskAnimation = false;
      this._activeTextField = textfieldData;
      this._gsapMaskNode = GsapMaskNodeCallerProxy(
        index,
        () => (this._gsapMaskNode = undefined)
      );
    }
    set activeMaskAnimation({ clientY, reactiveTextFieldMaskHeight, index }) {
      if (
        this._activeMaskAnimation ||
        index === this._activeTextField.index ||
        Math.abs(this._activeTextField.center.y - clientY) <
          reactiveTextFieldMaskHeight
      )
        return;
      if (this._gsapMaskNode) this._gsapMaskNode.kill();
      this._activeMaskAnimation = true;
    }
    get activeMaskAnimation() {
      return new Promise((resolve, reject) => {
        if (this._activeMaskAnimation) {
          resolve();
        } else reject();
      });
    }
  })();

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
  const corners = new Corners(divMaskContainer);

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
    const center = GetTextFieldCenter(text);

    // Stop the animation when the mouse clicked on a text
    text.addEventListener("click", (event) => {
      state.activeTextField = {
        index,
        center,
      };

      // Follow the rule of AnimationOptimizer
      if (animationOptimizer["stop.star"](++numberOfClickUnderTextField))
        return;
      const corner = corners.GetFarestCorner(
        event,
        center,
        index,
        farestConfiguration
      );
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
            center,
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
      state.activeMaskAnimation = {
        clientY: event.clientY,
        reactiveTextFieldMaskHeight,
        index,
      };
    });
  });

  function GenerateRectPositionY(event) {
    const rectHeight = rect.getBoundingClientRect().height;
    const parentRect = divMaskContainer.getBoundingClientRect();

    const max = parentRect.height - rectHeight;
    const delta = rectHeight / 2 + parentRect.top;

    return Math.min(Math.max(event.clientY - delta, 0), max);
  }

  divMaskContainer.addEventListener("mousemove", async (event) => {
    state.activeMaskAnimation
      .then((_) => {
        const newY = GenerateRectPositionY(event);
        rect.setAttribute("y", `${newY}px`);
      })
      .catch((_) => {});
  });
}
