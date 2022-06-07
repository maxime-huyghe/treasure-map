import { parseMap, TreasureMap } from "./TreasureMap";
import { finishSimulation, tickSimulation } from "./Game";

const MOVE_SOUTH = `
C - 2 - 2
A - Mercury - 0 - 0 - S - AA
`;

test("advance one non-blocked adventurer one turn", () => {
  // This type assertion is ok because this is a test, not real code
  // interfacing with the real world.
  const map = parseMap(MOVE_SOUTH);
  const newMap = tickSimulation(map);
  expect(newMap).toEqual<TreasureMap>({
    ...map,
    adventurers: [
      {
        name: "Mercury",
        x: 0,
        y: 1,
        orientation: "S",
        nextMoves: ["A"],
      },
    ],
  });
});

const COME_BACK_HOME = `
C - 2 - 2
A - Venus - 0 - 0 - S - AGAGAGAG
`;

test("advance one adventurer until their movements are exhausted", () => {
  const map = parseMap(COME_BACK_HOME);
  const newMap = finishSimulation(map);
  expect(newMap).toEqual<TreasureMap>({
    ...map,
    adventurers: [
      {
        name: "Venus",
        x: 0,
        y: 0,
        orientation: "O",
        nextMoves: [],
      },
    ],
  });
});

const NOT_A_CLIMBER = `
C - 2 - 3
M - 0 - 0
A - Earth - 0 - 2 - N - AAADA
`;

test("advance one adventurer who gets blocked by a mountain", () => {
  const map = parseMap(NOT_A_CLIMBER);
  const newMap = finishSimulation(map);
  expect(newMap).toEqual<TreasureMap>({
    ...map,
    adventurers: [
      {
        name: "Earth",
        x: 1,
        y: 1,
        orientation: "E",
        nextMoves: [],
      },
    ],
  });
});

const DUO = `
C - 2 - 3
M - 0 - 0
A - Phobos - 0 - 0 - S - AAA
A - Deimos - 1 - 2 - N - AAA
`;

test("advance two adventurers who don't cross paths", () => {
  const map = parseMap(DUO);
  const newMap = finishSimulation(map);
  expect(newMap).toEqual<TreasureMap>({
    ...map,
    adventurers: [
      {
        name: "Phobos",
        x: 0,
        y: 2,
        orientation: "S",
        nextMoves: [],
      },
      {
        name: "Deimos",
        x: 1,
        y: 0,
        orientation: "N",
        nextMoves: [],
      },
    ],
  });
});

const CONFLICT = `
C - 2 - 1
A - ABC - 0 - 0 - E - A
A - CBA - 1 - 0 - W - A
`;

test("advance two adventurers who cross paths", () => {
  const map = parseMap(CONFLICT);
  const newMap = finishSimulation(map);
  expect(newMap).toEqual<TreasureMap>({
    ...map,
    adventurers: [
      {
        name: "ABC",
        x: 0,
        y: 0,
        orientation: "O",
        nextMoves: [],
      },
      {
        name: "CBA",
        x: 1,
        y: 0,
        orientation: "E",
        nextMoves: [],
      },
    ],
  });
});
