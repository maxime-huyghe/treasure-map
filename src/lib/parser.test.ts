import { parseMap, TreasureMap } from "./TreasureMap";

const EMPTY_MAP = `
C - 2 - 2
`;

test("parses a map's metata", () => {
  const map = parseMap(EMPTY_MAP);
  expect(map).toEqual<TreasureMap>({
    width: 2,
    height: 2,
    squares: [
      [{ type: "empty" }, { type: "empty" }],
      [{ type: "empty" }, { type: "empty" }],
    ],
    adventurers: [],
  });
});

const MAP_WITH_MOUNTAINS = `
C - 2 - 2
M - 0 - 0
M - 1 - 1
`;

test("parses a map with some mountains", () => {
  const map = parseMap(MAP_WITH_MOUNTAINS);
  expect(map).toEqual<TreasureMap>({
    width: 2,
    height: 2,
    squares: [
      [{ type: "mountain" }, { type: "empty" }],
      [{ type: "empty" }, { type: "mountain" }],
    ],
    adventurers: [],
  });
});

const MAP_WITH_TREASURES = `
C - 2 - 2
T - 0 - 0 - 1
T - 1 - 0 - 3
T - 1 - 1 - 2
`;

test("parses a map with some treasure squares", () => {
  const map = parseMap(MAP_WITH_TREASURES);
  expect(map).toEqual<TreasureMap>({
    width: 2,
    height: 2,
    squares: [
      [
        { type: "treasure", amount: 1 },
        { type: "treasure", amount: 3 },
      ],
      [{ type: "empty" }, { type: "treasure", amount: 2 }],
    ],
    adventurers: [],
  });
});

const MAP_WITH_ADVENTURERS = `
C - 2 - 2
A - Alpha - 0 - 0 - S - ADADADADAD
A - Bravo - 1 - 1 - N - GAGAGAGAGA
`;

test("parses a map with some adventurers", () => {
  const map = parseMap(MAP_WITH_ADVENTURERS);
  expect(map).toEqual<TreasureMap>({
    width: 2,
    height: 2,
    squares: [
      [{ type: "empty" }, { type: "empty" }],
      [{ type: "empty" }, { type: "empty" }],
    ],
    adventurers: [
      {
        name: "Alpha",
        x: 0,
        y: 0,
        orientation: "S",
        nextMoves: ["A", "D", "A", "D", "A", "D", "A", "D", "A", "D"],
        treasures: 0,
      },
      {
        name: "Bravo",
        x: 1,
        y: 1,
        orientation: "N",
        nextMoves: ["G", "A", "G", "A", "G", "A", "G", "A", "G", "A"],
        treasures: 0,
      },
    ],
  });
});

const COMPLEX_MAP = `
C - 10 - 10
T - 0 - 0 - 1
T - 9 - 9 - 3
T - 9 - 8 - 2
T - 5 - 5 - 4
T - 3 - 2 - 1
T - 6 - 5 - 4
M - 0 - 3
M - 2 - 6
A - Alpha - 0 - 0 - S - ADADADADAD
A - Bravo - 1 - 1 - N - GAGAGAGAGA
A - Charlie - 2 - 4 - E - AAAAAAAA
`;

test("parses a complex map with every element type", () => {
  const map = parseMap(COMPLEX_MAP);
  expect(map).toEqual<TreasureMap>({
    width: 10,
    height: 10,
    squares: [
      [
        { type: "treasure", amount: 1 },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
      ],
      [
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
      ],
      [
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "treasure", amount: 1 },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
      ],
      [
        { type: "mountain" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
      ],
      [
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
      ],
      [
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "treasure", amount: 4 },
        { type: "treasure", amount: 4 },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
      ],
      [
        { type: "empty" },
        { type: "empty" },
        { type: "mountain" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
      ],
      [
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
      ],
      [
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "treasure", amount: 2 },
      ],
      [
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "empty" },
        { type: "treasure", amount: 3 },
      ],
    ],
    adventurers: [
      {
        name: "Alpha",
        x: 0,
        y: 0,
        orientation: "S",
        nextMoves: ["A", "D", "A", "D", "A", "D", "A", "D", "A", "D"],
        treasures: 0,
      },
      {
        name: "Bravo",
        x: 1,
        y: 1,
        orientation: "N",
        nextMoves: ["G", "A", "G", "A", "G", "A", "G", "A", "G", "A"],
        treasures: 0,
      },
      {
        name: "Charlie",
        nextMoves: ["A", "A", "A", "A", "A", "A", "A", "A"],
        orientation: "E",
        x: 2,
        y: 4,
        treasures: 0,
      },
    ],
  });
});
