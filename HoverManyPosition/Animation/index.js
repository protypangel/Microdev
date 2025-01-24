import { OptimizationConfiguration } from "./configuration.js";
import { GetTextFieldCenter } from "./classes/Coordonates.js";
import { GsapFacade } from "./classes/GsapFacade.js";
import { Data } from "./classes/Data.js";
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
  const data = new Data(
    divMaskContainer,
    svgMaskNode,
    svgStarNodes,
    AnimationListener,
    OptimizationConfiguration,
    gsapMaskNodeConfiguration,
    DXYStars
  );
  const gsapFacade = new GsapFacade(
    data,
    farestConfiguration,
    gsapAnimationStarConfiguration,
    OrderDisplayedStars
  );
  divMaskContainer.addEventListener("mousemove", (event) => {
    gsapFacade.activeMaskAnimation
      .then((_) => {
        const newY = Math.min(
          Math.max(event.clientY - data._delta, 0),
          data._max
        );
        data._rectNode.setAttribute("y", `${newY}px`);
      })
      .catch((_) => {});
  });
  // /**
  //  * Sets up event listeners for each text field to handle animations.
  //  *
  //  * Event Details:
  //  * - **Click Listener**:
  //  *   - Stops the mask animation.
  //  *   - Triggers the falling stars animation.
  //  * - **MouseOver Listener**:
  //  *   - Reactivates the mask animation.
  //  *
  //  * @param {HTMLElement} text - The text field HTML element for which the listeners are added.
  //  * @param {number} index - The index of the textfield
  //  */
  divMaskContainer.querySelectorAll(".text").forEach((text, index) => {
    const center = GetTextFieldCenter(text);
    // Stop the animation when the mouse clicked on a text
    text.addEventListener("click", (event) => {
      gsapFacade.activeTextField = {
        textfieldData: {
          index,
          center,
        },
        event,
      };
    });
    /** Reactive the animation when (and):
     * - the mouse is over the text
     * - the dy between the middle of the textfield and the cursor is higher than the size of the textfield
     */
    text.addEventListener("mousemove", (event) => {
      gsapFacade.activeMaskAnimation = {
        clientY: event.clientY,
        reactiveTextFieldMaskHeight: data._reactiveTextFieldMaskHeight,
        index,
      };
    });
  });
}
