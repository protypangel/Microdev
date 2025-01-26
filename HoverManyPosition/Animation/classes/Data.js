import { AnimationOptimizer } from "../functions/optimizer.js";
import { Corners } from "../functions/farestCorner.js";

export class Data {
  constructor(
    divMaskContainer,
    svgMaskNode,
    svgStarNodes,
    AnimationListener,
    gsapMaskNodeConfiguration,
    DXYStars
  ) {
    this._nbTextField = divMaskContainer.children[1].children.length;
    if (this._nbTextField === 0) throw new Error("There is no children");
    this._rectNode = svgMaskNode.children[0];
    this._heightRectNode =
      divMaskContainer.getBoundingClientRect().height / this._nbTextField;
    this._reactiveTextFieldMaskHeight = (this._heightRectNode * 3) / 4;
    this._numberOfClickUnderTextField = 0;
    this._animationOptimizer = AnimationOptimizer(AnimationListener);
    this._rectNode.setAttribute("height", `${this._heightRectNode}px`);
    this._DXYStars = DXYStars;
    this._gsapMaskNodeConfiguration = gsapMaskNodeConfiguration;
    this._svgStarNodes = svgStarNodes;
    ({ max: this._max, delta: this._delta } =
      this._GetMaxDelta(divMaskContainer));
    this._corners = new Corners(divMaskContainer);
  }

  animationOptimizer(animation) {
    return this._animationOptimizer[animation](
      ++this._numberOfClickUnderTextField
    );
  }
  GetFarestCorner(event, center, index, farestConfiguration) {
    return this._corners.GetFarestCorner(
      event,
      center,
      index,
      farestConfiguration
    );
  }
  _GetMaxDelta(divMaskContainer) {
    const BoundingClientRectDivMaskContainer =
      divMaskContainer.getBoundingClientRect();
    return {
      max: BoundingClientRectDivMaskContainer.height - this._heightRectNode,
      delta: this._heightRectNode / 2 + BoundingClientRectDivMaskContainer.top,
    };
  }
}
