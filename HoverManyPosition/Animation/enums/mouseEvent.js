import { GetTextFieldCenter } from "../classes/Coordonates.js";

const MouseEvent = {
  AlwaysFollowMouse: {
    MaskMouseMoveListener: function (gsapFacade, data, event) {
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
    },
    TextContainer: function (gsapFacade, data, text, index, center) {
      function conditionF(event) {
        return () =>
          Math.abs(gsapFacade._activeTextField.center.y - event.clientY) <
          data._reactiveTextFieldMaskHeight;
      }
      text.addEventListener("mousemove", (event) => {
        gsapFacade.activeMaskAnimation = {
          conditionF: conditionF(event),
          index,
        };
      });
    },
  },
  ClickFollow: {},
  FollowMouse: {
    TextContainer: function (gsapFacade, data, text, index, center) {
      text.addEventListener("mousemove", (event) => {
        gsapFacade.activeTextField = {
          textfieldData: {
            index,
            center,
          },
          event,
        };
      });
    },
  },
};

const TempalteMouseEvent = {
  MaskMouseMoveListener: function (...args) {},
  TextContainer: function (...args) {},
};
// Allow to add repeat process
const ProxyTempalteMouseEvent = {
  MaskMouseMoveListener: function (gsapFacade, data, divMaskContainer, f) {
    f(gsapFacade, data, divMaskContainer);
  },
  TextContainer: function (gsapFacade, data, text, index, f) {
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
    f(gsapFacade, data, text, index, center);
  },
};
export function GetMouseEventListener(MouseEventType) {
  let eventMouse;
  if (!!(eventMouse = MouseEvent[MouseEventType])) {
    eventMouse = Object.entries(TempalteMouseEvent).reduce(
      (acc, [key, value]) => {
        acc[key] = eventMouse[key] ?? value;
        return acc;
      },
      {}
    );
  } else eventMouse = TempalteMouseEvent;

  console.log(eventMouse);
  return Object.entries(ProxyTempalteMouseEvent).reduce(
    (acc, [key, fProxy]) => {
      const f = eventMouse[key];
      acc[key] = (...args) => {
        fProxy(...args, f);
      };
      return acc;
    },
    {}
  );
}
