import { GsapFacade } from "./classes/GsapFacade.js";
import { Data } from "./classes/Data.js";
import { GetMouseEventListener } from "./enums/mouseEvent.js";
export function Animation(
  divMaskContainer,
  svgMaskNode,
  svgStarNodes,
  OrderDisplayedStars = () => [],
  DXYStars,
  gsapAnimationStarConfiguration = function () {},
  gsapMaskNodeConfiguration = function () {},
  AnimationListener = {},
  farestConfiguration = {},
  mouseEventType = "FollowMouse", // Enum : AlwaysFollowMouse | ClickFollow | FollowMouse
  ElementSelectedListener = function (index) {
    console.log(index);
  },
  OnClickElementSelected = function (index) {
    console.log("CLICKED", index);
  }
) {
  const data = new Data(
    divMaskContainer,
    svgMaskNode,
    svgStarNodes,
    AnimationListener,
    gsapMaskNodeConfiguration,
    DXYStars
  );
  const gsapFacade = new GsapFacade(
    data,
    farestConfiguration,
    gsapAnimationStarConfiguration,
    OrderDisplayedStars,
    ElementSelectedListener
  );

  const { MaskMouseMoveListener, TextContainer } =
    GetMouseEventListener(mouseEventType);

  MaskMouseMoveListener(gsapFacade, data, divMaskContainer);

  divMaskContainer.querySelectorAll(".text").forEach((text, index) => {
    TextContainer(gsapFacade, data, text, index, OnClickElementSelected);
  });
}
