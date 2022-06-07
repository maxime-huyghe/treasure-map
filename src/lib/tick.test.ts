import { parseMap, TreasureMap } from "./TreasureMap";
import { finishSimulation, tickSimulation } from "./Game";
import { EXAMPLE_MAP } from "./consts";

const MOVE_SOUTH = `
C - 2 - 2
A - Mercury - 0 - 0 - S - AA
`;

test("advance a non-blocked adventurer one turn", () => {
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
        justMoved: true,
        orientation: "S",
        nextMoves: ["A"],
        treasures: 0,
      },
    ],
  });
});

const COME_BACK_HOME = `
C - 2 - 2
A - Venus - 0 - 0 - S - AGAGAGA
`;

test("advance an adventurer until their movements are exhausted", () => {
  const map = parseMap(COME_BACK_HOME);
  const newMap = finishSimulation(map);
  expect(newMap).toEqual<TreasureMap>({
    ...map,
    adventurers: [
      {
        name: "Venus",
        x: 0,
        y: 0,
        justMoved: true,
        orientation: "O",
        nextMoves: [],
        treasures: 0,
      },
    ],
  });
});

const NOT_A_CLIMBER = `
C - 2 - 3
M - 0 - 0
A - Earth - 0 - 2 - N - AAADA
`;

test("advance an adventurer who gets blocked by a mountain", () => {
  const map = parseMap(NOT_A_CLIMBER);
  const newMap = finishSimulation(map);
  expect(newMap).toEqual<TreasureMap>({
    ...map,
    adventurers: [
      {
        name: "Earth",
        x: 1,
        y: 1,
        justMoved: true,
        orientation: "E",
        nextMoves: [],
        treasures: 0,
      },
    ],
  });
});

const DUO = `
C - 2 - 3
M - 0 - 0
A - Phobos - 0 - 0 - S - AA
A - Deimos - 1 - 2 - N - AA
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
        justMoved: true,
        orientation: "S",
        nextMoves: [],
        treasures: 0,
      },
      {
        name: "Deimos",
        x: 1,
        y: 0,
        justMoved: true,
        orientation: "N",
        nextMoves: [],
        treasures: 0,
      },
    ],
  });
});

const CONFLICT = `
C - 2 - 1
A - ABC - 0 - 0 - E - A
A - CBA - 1 - 0 - O - A
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
        justMoved: false,
        orientation: "E",
        nextMoves: [],
        treasures: 0,
      },
      {
        name: "CBA",
        x: 1,
        y: 0,
        justMoved: false,
        orientation: "O",
        nextMoves: [],
        treasures: 0,
      },
    ],
  });
});

const CONFLICT_TWO = `
C - 3 - 1
A - ABC - 0 - 0 - E - A
A - CBA - 2 - 0 - O - A
`;

test("advance two adventurers who cross paths but one can move", () => {
  const map = parseMap(CONFLICT_TWO);
  const newMap = finishSimulation(map);
  expect(newMap).toEqual<TreasureMap>({
    ...map,
    adventurers: [
      {
        name: "ABC",
        x: 1,
        y: 0,
        justMoved: true,
        orientation: "E",
        nextMoves: [],
        treasures: 0,
      },
      {
        name: "CBA",
        x: 2,
        y: 0,
        justMoved: false,
        orientation: "O",
        nextMoves: [],
        treasures: 0,
      },
    ],
  });
});

const LUCKY_SPAWN = `
C - 1 - 1
T - 0 - 0 - 1
A - Pluto - 0 - 0 - E - A
`;

test("advance an adventurer who spawns on a treasure", () => {
  const map = parseMap(LUCKY_SPAWN);
  const newMap = finishSimulation(map);
  expect(newMap).toEqual<TreasureMap>({
    ...map,
    squares: [[{ type: "treasure", amount: 1 }]],
    adventurers: [
      {
        name: "Pluto",
        x: 0,
        y: 0,
        justMoved: false,
        orientation: "E",
        nextMoves: [],
        // because the adventurer doesn't move
        treasures: 0,
      },
    ],
  });
});

const A_BIT_LESS_LUCKY = `
C - 2 - 1
T - 1 - 0 - 2
A - Pluto - 0 - 0 - E - A
`;

test("advance an adventurer who spawns next to a treasure", () => {
  const map = parseMap(A_BIT_LESS_LUCKY);
  const newMap = finishSimulation(map);
  expect(newMap).toEqual<TreasureMap>({
    ...map,
    squares: [[{ type: "empty" }, { type: "treasure", amount: 1 }]],
    adventurers: [
      {
        name: "Pluto",
        x: 1,
        y: 0,
        justMoved: true,
        orientation: "E",
        nextMoves: [],
        treasures: 1,
      },
    ],
  });
});

const TWO_TREASURES = `
C - 3 - 1
T - 1 - 0 - 1
T - 2 - 0 - 1
A - Haley - 0 - 0 - E - AA
`;

test("collect two treasures", () => {
  const map = parseMap(TWO_TREASURES);
  const newMap = finishSimulation(map);
  expect(newMap).toEqual<TreasureMap>({
    ...map,
    squares: [[{ type: "empty" }, { type: "empty" }, { type: "empty" }]],
    adventurers: [
      {
        name: "Haley",
        x: 2,
        y: 0,
        justMoved: true,
        orientation: "E",
        nextMoves: [],
        treasures: 2,
      },
    ],
  });
});

test("collect treasures as in the subject's example", () => {
  const map = parseMap(EXAMPLE_MAP);
  const newMap = finishSimulation(map);
  expect(newMap).toEqual<TreasureMap>({
    ...map,
    squares: [
      [{ type: "empty" }, { type: "mountain" }, { type: "empty" }],
      [{ type: "empty" }, { type: "empty" }, { type: "mountain" }],
      [{ type: "empty" }, { type: "empty" }, { type: "empty" }],
      [{ type: "empty" }, { type: "treasure", amount: 2 }, { type: "empty" }],
    ],
    adventurers: [
      {
        name: "Lara",
        x: 0,
        y: 3,
        justMoved: true,
        orientation: "S",
        nextMoves: [],
        treasures: 3,
      },
    ],
  });
});
