import { OptimizationConfiguration } from "./configuration.js";

/**
 * Remember the structure of OptimizerCaller definied by the user :
 * `animationListener: { function: { animationType : { stop: f } } }`
 *
 * @param {*} animationListener the optimizer configuration definied by the user
 * @param {*} optimizationConfiguration
 * @param {*} animationType animation's type
 * @param {*} animationName animation's name
 * @param {string} key the name of the optimizer function
 * @param {*} f the function that was defined by the user
 * @returns a function that's will be called by the user
 */
function StrategyOptimizedFunction(
  animationListener,
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
    OptimizationConfiguration[animationType][animationName].triggered;
  const finalOptimized =
    (animationListener.default[animationType]?.[animationName] ??
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
/**
 * Create a map for each functions in the animationListener.
 * The key is the fullname of the function.
 * The value is the StrategyOptimizedFunction
 */
export function AnimationOptimizer(animationListener) {
  return Object.entries(animationListener.functions).reduce(
    (acc, [animationType, object]) => {
      Object.entries(object).forEach(([animationName, f]) => {
        const key = `${animationType}.${animationName}`;
        const optimizedFunction = StrategyOptimizedFunction(
          animationListener,
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
