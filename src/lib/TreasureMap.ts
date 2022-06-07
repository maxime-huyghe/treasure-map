export type TreasureMap = Readonly<{
  width: number;
  height: number;
  squares: ReadonlyArray<ReadonlyArray<Square>>;
  adventurers: ReadonlyArray<Adventurer>;
}>;

export type Square = Readonly<
  | { type: "empty" }
  | {
      type: "mountain";
    }
  | {
      type: "treasure";
      amount: number;
    }
>;

export type Adventurer = Readonly<{
  name: string;
  x: number;
  y: number;
  justMoved: boolean;
  orientation: Orientation;
  nextMoves: ReadonlyArray<Move>;
  treasures: number;
}>;

export type Orientation = "N" | "E" | "S" | "O";

type Move = "A" | "G" | "D";

const METADATA_LINE_REGEX = /^C - (\d+) - (\d+)$/;
const MOUNTAIN_LINE_REGEX = /^M - (\d+) - (\d+)$/;
const TREASURE_LINE_REGEX = /^T - (\d+) - (\d+) - (\d+)$/;
const ADVENTURER_LINE_REGEX = /^A - (\w+) - (\d+) - (\d+) - ([NESO]) - ([AGD]+)$/;

/**
 * Parses a treasure map file from a string.
 * @param input a treasure map file
 * @throws Error if the input is invalid
 * @returns {TreasureMap} a treasure map object
 */
export function parseMap(input: string): TreasureMap {
  const lines = input.split("\n");
  let currentLine = 0;
  let [firstLine, ...rest] = lines;
  while (firstLine.length === 0 || firstLine.startsWith("#")) {
    [firstLine, ...rest] = rest;
    currentLine++;
  }
  const metadataLineMatches = firstLine.match(METADATA_LINE_REGEX);
  if (metadataLineMatches === null) {
    throw new Error(
      `Invalid map format: no or incorrect metadata (C) line on line ${currentLine} (got "${firstLine}"))`,
    );
  }
  const [, w, h] = metadataLineMatches;
  const width = parseInt(w, 10);
  const height = parseInt(h, 10);

  const squares: Square[][] = Array(height)
    .fill(null)
    .map(() => Array(width).fill({ type: "empty" }));
  const adventurers: Adventurer[] = [];

  for (const line of rest) {
    currentLine++;
    if (line.length === 0 || line.startsWith("#")) {
      continue;
    }

    const mountainMatches = line.match(MOUNTAIN_LINE_REGEX);
    if (mountainMatches !== null) {
      const [, x, y] = mountainMatches;
      squares[parseInt(y, 10)][parseInt(x, 10)] = { type: "mountain" };
      continue;
    }

    const treasureMatches = line.match(TREASURE_LINE_REGEX);
    if (treasureMatches !== null) {
      const [, x, y, amount] = treasureMatches;
      squares[parseInt(y, 10)][parseInt(x, 10)] = {
        type: "treasure",
        amount: parseInt(amount, 10),
      };
      continue;
    }

    const adventurerMatches = line.match(ADVENTURER_LINE_REGEX);
    if (adventurerMatches !== null) {
      const [, name, x, y, orientation, moves] = adventurerMatches;
      const adventurer: Adventurer = {
        name,
        x: parseInt(x, 10),
        y: parseInt(y, 10),
        justMoved: false,
        orientation: orientation as Orientation,
        nextMoves: moves.split("").map((move) => move as Move),
        treasures: 0,
      };
      adventurers.push(adventurer);
      continue;
    }

    throw new Error(`Invalid map format: unexpected line on line ${currentLine} (got "${line}")`);
  }

  return {
    width,
    height,
    squares,
    adventurers,
  };
}

/**
 * Writes the string representation of a finished simulation to a string.
 * @param map the map to write
 * @returns its string representation
 */
export function writeMap(map: TreasureMap): string {
  const metadata = `C - ${map.width} - ${map.height}`;
  const mountainsAndTreasures = map.squares
    .map((row, y) =>
      row.map((square, x) => {
        if (square.type === "mountain") {
          return `M - ${x} - ${y}`;
        }
        if (square.type === "treasure") {
          return `T - ${x} - ${y} - ${square.amount}`;
        }
        return "";
      }),
    )
    .flat()
    .filter((line) => line.length > 0);
  const adventurers = map.adventurers.map(
    (adventurer) =>
      `A - ${adventurer.name} - ${adventurer.x} - ${adventurer.y} - ${adventurer.orientation} - ${adventurer.treasures}`,
  );
  return [metadata, ...mountainsAndTreasures, ...adventurers].join("\n");
}
