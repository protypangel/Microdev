import { Coordinates } from "./Coordonates.js";
import { GsapMaskNodeCaller, GsapAnimationStarCaller } from "../gsap.js";
import { DXYStarsOptimizer } from "../optimizer.js";
class ActivedTextField {
  constructor(index = 0, center = new Coordinates(0, 0)) {
    this._index = index;
    this._center = center;
  }
}
export class GsapFacade {
  constructor(
    data,
    farestConfiguration,
    gsapAnimationStarConfiguration,
    orderDisplayedStars
  ) {
    this._activeMaskAnimation = true;
    this._activeTextField = new ActivedTextField();
    this._data = data;
    this._farestConfiguration = farestConfiguration;
    this._gsapAnimationStarConfiguration = gsapAnimationStarConfiguration;
    this._orderDisplayedStars = orderDisplayedStars;
  }
  set activeTextField({ event, textfieldData }) {
    const { index, center } = textfieldData;
    this._activeMaskAnimation = false;
    this._activeTextField = textfieldData;
    this._gsapMaskNode = this._GsapMaskNodeCallerProxy(
      index,
      () => (this._gsapMaskNode = undefined)
    );
    // Stars Animation
    // Follow the rule of AnimationOptimizer
    if (this._data.animationOptimizer("stop.star")) return;
    const corner = this._data.GetFarestCorner(
      event,
      center,
      index,
      this._farestConfiguration
    );
    // Prendre en compte le reverse !

    const dxyReducer = DXYStarsOptimizer(this._data.DXYStars);
    // Star animation
    this._orderDisplayedStars(...Object.values(corner.reverse)).forEach(
      (index, index2) => {
        const svgStarNode = this._data._svgStarNodes[index];
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
          this._gsapAnimationStarConfiguration
        );
      }
    );
  }
  set activeMaskAnimation({ clientY, index }) {
    if (
      this._activeMaskAnimation ||
      index === this._activeTextField.index ||
      Math.abs(this._activeTextField.center.y - clientY) <
        this._data._reactiveTextFieldMaskHeight
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
  _GsapMaskNodeCallerProxy(index, onComplete = () => {}) {
    return GsapMaskNodeCaller(
      this._data._heightRectNode,
      index,
      this._data._rectNode,
      this._data._gsapMaskNodeConfiguration,
      onComplete
    );
  }
}
