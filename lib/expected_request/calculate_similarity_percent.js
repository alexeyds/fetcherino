import round from "lodash.round";
import { countEntries }  from "utils/object";

export default function calculateSimilarityPercent(matches, weights={}) {
  let totalWeight = 100 - sum(Object.values(weights));
  let baseWeight = totalWeight / (countEntries(matches) - countEntries(weights));
  let result = 0;

  Object.entries(matches).forEach(([name, isAMatch]) => {
    if (isAMatch) {
      let weight = weights[name] || baseWeight;
      result += weight;
    }
  });

  return round(result, 1);
}

function sum(array) {
  return array.reduce((a, b) => a + b, 0);
}
