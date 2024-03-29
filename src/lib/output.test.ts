import { EXAMPLE_MAP } from "./consts";
import { finishSimulation } from "./Game";
import { parseMap, writeMap } from "./TreasureMap";

const EXAMPLE_RESULT = `C - 3 - 4
M - 1 - 0
M - 2 - 1
T - 1 - 3 - 2
A - Lara - 0 - 3 - S - 3`;

test("output the example map to a string", () => {
  const map = finishSimulation(parseMap(EXAMPLE_MAP));
  const result = writeMap(map);
  expect(result).toEqual(EXAMPLE_RESULT);
});
