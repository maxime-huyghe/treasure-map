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
      [{ empty: true }, { empty: true }],
      [{ empty: true }, { empty: true }],
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
      [{ mountain: true }, { empty: true }],
      [{ empty: true }, { mountain: true }],
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
      [{ treasure: 1 }, { treasure: 3 }],
      [{ empty: true }, { treasure: 2 }],
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
      [{ empty: true }, { empty: true }],
      [{ empty: true }, { empty: true }],
    ],
    adventurers: [
      {
        name: "Alpha",
        xPos: 0,
        yPos: 0,
        orientation: "S",
        nextMoves: ["A", "D", "A", "D", "A", "D", "A", "D", "A", "D"],
      },
      {
        name: "Bravo",
        xPos: 1,
        yPos: 1,
        orientation: "N",
        nextMoves: ["G", "A", "G", "A", "G", "A", "G", "A", "G", "A"],
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
        { treasure: 1 },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
      ],
      [
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
      ],
      [
        { empty: true },
        { empty: true },
        { empty: true },
        { treasure: 1 },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
      ],
      [
        { mountain: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
      ],
      [
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
      ],
      [
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { treasure: 4 },
        { treasure: 4 },
        { empty: true },
        { empty: true },
        { empty: true },
      ],
      [
        { empty: true },
        { empty: true },
        { mountain: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
      ],
      [
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
      ],
      [
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { treasure: 2 },
      ],
      [
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { empty: true },
        { treasure: 3 },
      ],
    ],
    adventurers: [
      {
        name: "Alpha",
        xPos: 0,
        yPos: 0,
        orientation: "S",
        nextMoves: ["A", "D", "A", "D", "A", "D", "A", "D", "A", "D"],
      },
      {
        name: "Bravo",
        xPos: 1,
        yPos: 1,
        orientation: "N",
        nextMoves: ["G", "A", "G", "A", "G", "A", "G", "A", "G", "A"],
      },
      {
        name: "Charlie",
        nextMoves: ["A", "A", "A", "A", "A", "A", "A", "A"],
        orientation: "E",
        xPos: 2,
        yPos: 4,
      },
    ],
  });
});
