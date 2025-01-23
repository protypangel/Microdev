function animation(
  divMaskContainer,
  svgMaskNode,
  svgStarNodes,
  OrderDisplayedStars = () => [],
  DXYStars = {
    default: [0, 0],
  },
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
  // TODO: 3 Testing
  function DXYStarsOptimizer() {
    const defaultValue = [0, 0];
    if (!!!DXYStars) return () => defaultValue;
    if (!!DXYStars.values)
      return (index) =>
        DXYStars.values[index] ?? DXYStars.default ?? defaultValue;
    if (!!DXYStars.default) return () => DXYStars.default;
    return () => defaultValue;
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
  // Get the size of the star

  // For each animation, create an optimization caller
  const OptimizationConfiguration = {
    stop: {
      star: {
        value: true,
        triggered: true,
      },
    },
  };

  // TODO: Traduire par chatgpt
  // If the user ask for optimization
  // The caller will be swaped by an optmized one that return :
  // * Only a const
  // * The default one, configurated by the user
  function getOptimizedFunction(animationType, animationName, key, f) {
    // Vérification si f est une fonction, sinon transformer en fonction retournant la valeur
    f = typeof f === "function" ? f : () => f;

    // Vérification si la clé est optimisée
    if (!(AnimationListener.optimised ?? []).includes(key)) return f;

    const trigger =
      OptimizationConfiguration[animationType][animationName].triggered;

    const finalOptimized =
      (AnimationListener.default[animationType]?.[animationName] ??
        OptimizationConfiguration[animationType]?.[animationName]?.value) ||
      f;
    const finalOptimizedFunction =
      typeof finalOptimized === "function"
        ? finalOptimized
        : () => finalOptimized;
    let optimizedF = null;

    function untilF(args) {
      const value = f(args);
      if (trigger !== value) return value;
      return (optimizedF = finalOptimizedFunction)(args);
    }

    return function (args) {
      return (optimizedF ?? untilF)(args);
    };
  }
  const AnimationOptimizer = Object.entries(AnimationListener.functions).reduce(
    (acc, [animationType, object]) => {
      Object.entries(object).forEach(([animationName, f]) => {
        const key = `${animationType}.${animationName}`;
        const optimizedFunction = getOptimizedFunction(
          animationType,
          animationName,
          key,
          f
        );
        acc[key] = optimizedFunction;
      });

      return acc;
    },
    {}
  );
  function gsapMaskNodeCaller(index, onComplete = function () {}) {
    const { from, to } = gsapMaskNodeConfiguration(heightPx, index);
    gsap.fromTo(rect, from, {
      ...to,
      onComplete: onComplete,
    });
  }
  function gsapAnimationStarCaller(
    [dx, dy],
    svgStarNode,
    index,
    middle,
    corner
  ) {
    const { timeout, from, to, complete } = gsapAnimationStarConfiguration(
      corner,
      middle,
      index
    );
    setTimeout(function () {
      gsap.fromTo(
        svgStarNode,
        {
          ...from,
          x: from.x + dx,
          y: from.y + dy,
        },
        {
          ...to,
          x: to.x + dx,
          y: to.y + dy,
          onComplete: () => {
            gsap.fromTo(svgStarNode, {}, complete);
          },
        }
      );
    }, timeout);
  }
  function getFarestCorner(event, middle, index) {
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
  const corners = Object.entries({
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
  function getMiddleText(text) {
    return {
      x:
        text.getBoundingClientRect().left +
        text.getBoundingClientRect().width / 2,
      y:
        text.getBoundingClientRect().top +
        text.getBoundingClientRect().height / 2,
    };
  }
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
    const middle = getMiddleText(text);

    // Stop the animation when the mouse clicked on a text
    text.addEventListener("click", (event) => {
      activeMaskAnimation = false;
      activeTextField.index = index;
      activeTextField.middle = middle;
      gsapMaskNodeCaller(index);

      // Follow the rule of AnimationOptimizer
      if (AnimationOptimizer["stop.star"](++numberOfClickUnderTextField))
        return;
      const corner = corners[getFarestCorner(event, middle, index)];
      // Prendre en compte le reverse !

      const dxyReducer = DXYStarsOptimizer();
      // Star animation
      OrderDisplayedStars(...Object.values(corner.reverse)).forEach(
        (index, index2) => {
          const svgStarNode = svgStarNodes[index];
          if (!!!svgMaskNode) return;
          const dxy = dxyReducer(index);

          console.log(index);

          gsapAnimationStarCaller(
            [
              corner.reverse.x ? -dxy[0] : dxy[0],
              corner.reverse.y ? -dxy[1] : dxy[1],
            ],
            svgStarNode,
            index2,
            middle,
            corner
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
      gsapMaskNodeCaller(index, () => (activeMaskAnimation = true));
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
