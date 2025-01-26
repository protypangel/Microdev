export function GsapMaskNodeCaller(
  heightPx,
  index,
  rect,
  gsapMaskNodeConfiguration,
  onComplete = function () {}
) {
  const { from, to } = gsapMaskNodeConfiguration(heightPx, index);
  const { x, y, ...rest } = to;
  return gsap.fromTo(rect, from, {
    ...rest,
    attr: {
      y: to.y,
    },
    duration: 1,
    onComplete: onComplete,
  });
}
export function GsapAnimationStarCaller(
  [dx, dy],
  svgStarNode,
  index,
  middle,
  corner,
  gsapAnimationStarConfiguration
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
