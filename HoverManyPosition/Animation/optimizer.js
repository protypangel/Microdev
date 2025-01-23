function getOptimizedFunction(
  animationListener,
  optimizationConfiguration,
  animationType,
  animationName,
  key,
  f
) {
  // Vérification si f est une fonction, sinon transformer en fonction retournant la valeur
  f = typeof f === "function" ? f : () => f;
  // Vérification si la clé est optimisée
  if (!(animationListener.optimised ?? []).includes(key)) return f;
  const trigger =
    optimizationConfiguration[animationType][animationName].triggered;
  const finalOptimized =
    (animationListener.default[animationType]?.[animationName] ??
      optimizationConfiguration[animationType]?.[animationName]?.value) ||
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

export function AnimationOptimizer(
  animationListener,
  optimizationConfiguration
) {
  return Object.entries(animationListener.functions).reduce(
    (acc, [animationType, object]) => {
      Object.entries(object).forEach(([animationName, f]) => {
        const key = `${animationType}.${animationName}`;
        const optimizedFunction = getOptimizedFunction(
          animationListener,
          optimizationConfiguration,
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
}

export function DXYStarsOptimizer(DXYStars) {
  const defaultValue = [0, 0];
  if (!!!DXYStars) return () => defaultValue;
  if (!!DXYStars.values)
    return (index) =>
      DXYStars.values[index] ?? DXYStars.default ?? defaultValue;
  if (!!DXYStars.default) return () => DXYStars.default;
  return () => defaultValue;
}
