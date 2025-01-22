// V1.0.0
function _CustomStrategy(items) {
  const lines = items.map((item) => []);
  let currentLine = 0;
  let currentLineWidth = 0;
  const sorted = items.sort((a, b) => b.width - a.width);
  const sortedReverse = sorted.reverse();
  function addLine(item) {
    item.placed = true;
    currentLineWidth += item.width;
    lines[currentLine].push(item);
  }
  for (let item of sorted) {
    if (item.placed) continue;
    if (currentLineWidth + item.width > 200) {
      currentLine++;
      currentLineWidth = 0;
      continue;
    }
    for (let item2 of sortedReverse) {
      if (item2.placed) continue;
      if (currentLineWidth + item2.width <= 200) {
        addLine(item2);
        console.log(item2.width, [...lines[currentLine]]);
      }
    }
    addLine(item);
  }
  return lines;
}
// V1.0.1
function _CustomStrategy(items) {
  function buildDP(items) {
    const n = items.length;
    const S = items.reduce((acc, it) => acc + it.width, 0);
    const dp = Array.from({ length: n + 1 }, () => Array(S + 1).fill(false));
    dp[0][0] = true;

    for (let i = 1; i <= n; i++) {
      const w = items[i - 1].width;
      for (let s = 0; s <= S; s++) {
        if (dp[i - 1][s]) dp[i][s] = true;
        if (s >= w && dp[i - 1][s - w]) dp[i][s] = true;
      }
    }
    return dp;
  }

  function backtrack(items, dp, i, s) {
    if (!s) return [[]];
    if (!i) return [];
    const w = items[i - 1].width;
    let result = [];
    // Cas 1: on n'utilise pas l'item i-1
    if (dp[i - 1][s]) {
      for (const sub of backtrack(items, dp, i - 1, s)) {
        result.push(sub);
      }
    }
    // Cas 2: on utilise l'item i-1 (si faisable)
    if (s >= w && dp[i - 1][s - w]) {
      for (const sub of backtrack(items, dp, i - 1, s - w)) {
        result.push([...sub, items[i - 1]]);
      }
    }
    return result;
  }

  /**
   * Renvoie { bestSum, solutions }
   *  - bestSum: somme la plus proche de target
   *  - solutions: tous les sous-ensembles ayant cette somme
   */
  function closestSubsetsWidths(items, target) {
    const dp = buildDP(items);
    const n = items.length;
    const S = items.reduce((acc, it) => acc + it.width, 0);

    // Cherche la somme bestSum la plus proche de target
    let bestSum = 0,
      minDiff = Infinity;
    for (let s = 0; s <= S; s++) {
      if (dp[n][s]) {
        const diff = Math.abs(s - target);
        if (diff < minDiff) {
          minDiff = diff;
          bestSum = s;
        }
      }
    }

    // Tous les sous-ensembles dont la somme = bestSum
    const solutions = backtrack(items, dp, n, bestSum);
    return { bestSum, solutions };
  }
  // On copie pour ne pas modifier directement "items"
  let remaining = items.slice();
  let lines = [];

  while (remaining.length > 0) {
    // 1) On trouve un sous-ensemble de "remaining" au plus proche de "capacity"
    let { bestSum, solutions } = closestSubsetsWidths(remaining, 200);
    if (bestSum === 0 && solutions.length === 0) {
      // On ne peut plus former de somme > 0 => on arrête
      break;
    }

    // solutions[] peut en contenir plusieurs.
    // Par exemple, on prend solutions[0] (ou n'importe laquelle).
    let chosenSolution = solutions[0];

    // 2) On ajoute ce sous-ensemble comme "ligne"
    lines.push(chosenSolution);

    // 3) On retire ces items de "remaining"
    // Pour éviter qu'ils ne soient jamais répétés
    let usedSet = new Set(chosenSolution.map((it) => it.element));
    remaining = remaining.filter((it) => !usedSet.has(it.element));
  }

  return lines;
}
