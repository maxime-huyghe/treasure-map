import type { Adventurer, Orientation, Square, TreasureMap } from "./TreasureMap";

/**
 * Ticks the simulation one turn forward.
 * @param map the map to tick
 * @returns the new map
 */
export function tickSimulation(map: TreasureMap): TreasureMap {
  let newAdventurers = [...map.adventurers];
  // This is implemented like this so that the adventurers earlier in the list have
  // priority over those later in the list.
  for (const i in map.adventurers) {
    newAdventurers[i] = tickIndividualAdventurer(
      { ...map, adventurers: newAdventurers },
      map.adventurers[i],
    );
  }

  // Collect treasures
  const newSquares: Square[][] = map.squares.map((row, y) =>
    row.map((square, x) => {
      if (!(square.type === "treasure")) {
        return square;
      }
      // Find an adventurer in the same position as the treasure.
      for (const adv in newAdventurers) {
        if (!newAdventurers[adv].justMoved) {
          // Adventurers need to move to dig up a treasure.
          continue;
        }
        if (newAdventurers[adv].x === x && newAdventurers[adv].y === y) {
          newAdventurers[adv] = {
            ...newAdventurers[adv],
            treasures: newAdventurers[adv].treasures + 1,
          };
          // We can return directly because no two adventurers can be on the same square.
          if (square.amount === 1) {
            return { type: "empty" };
          }
          return { ...square, amount: square.amount - 1 };
        }
      }
      return square;
    }),
  );

  return {
    ...map,
    squares: newSquares,
    adventurers: newAdventurers,
  };
}

function tickIndividualAdventurer(map: TreasureMap, adventurer: Adventurer): Adventurer {
  if (adventurer.nextMoves.length === 0) {
    return adventurer;
  }
  const [nextMove, ...restOfNextMoves] = adventurer.nextMoves;
  switch (nextMove) {
    case "A":
      const { newX, newY } = moveAdventurerForward(
        map,
        adventurer.orientation,
        adventurer.x,
        adventurer.y,
      );
      return {
        name: adventurer.name,
        x: newX,
        y: newY,
        justMoved: adventurer.x !== newX || adventurer.y !== newY,
        orientation: adventurer.orientation,
        nextMoves: restOfNextMoves,
        treasures: adventurer.treasures,
      };
    case "G":
      return {
        name: adventurer.name,
        x: adventurer.x,
        y: adventurer.y,
        justMoved: false,
        orientation: rotateAdventurerCounterClockwise(adventurer.orientation),
        nextMoves: restOfNextMoves,
        treasures: adventurer.treasures,
      };
    case "D":
      return {
        name: adventurer.name,
        x: adventurer.x,
        y: adventurer.y,
        justMoved: false,
        orientation: rotateAdventurerClockwise(adventurer.orientation),
        nextMoves: restOfNextMoves,
        treasures: adventurer.treasures,
      };
  }
}

/**
 * Moves the adventurer forward one square, unless there is an obstacle.
 */
function moveAdventurerForward(
  map: TreasureMap,
  orientation: Orientation,
  x: number,
  y: number,
): { newX: number; newY: number } {
  let newX: number, newY: number;
  switch (orientation) {
    case "E":
      newX = x + 1;
      newY = y;
      break;
    case "S":
      newX = x;
      newY = y + 1;
      break;
    case "O":
      newX = x - 1;
      newY = y;
      break;
    case "N":
      newX = x;
      newY = y - 1;
      break;
  }
  if (newX < 0 || newX >= map.width || newY < 0 || newY >= map.height) {
    return { newX: x, newY: y };
  }
  const newSquare = map.squares[newY][newX];
  const aMountainIsThere = newSquare.type === "mountain";
  if (aMountainIsThere) {
    return { newX: x, newY: y };
  }
  const anAdventurerIsThere = map.adventurers.some(
    (adventurer) => adventurer.x === newX && adventurer.y === newY,
  );
  if (anAdventurerIsThere) {
    return { newX: x, newY: y };
  }
  return { newX, newY };
}

function rotateAdventurerCounterClockwise(orientation: Orientation): Orientation {
  switch (orientation) {
    case "E":
      return "N";
    case "S":
      return "E";
    case "O":
      return "S";
    case "N":
      return "O";
  }
}

function rotateAdventurerClockwise(orientation: Orientation): Orientation {
  switch (orientation) {
    case "E":
      return "S";
    case "S":
      return "O";
    case "O":
      return "N";
    case "N":
      return "E";
  }
}

/**
 * Determines whether the simulation is finished.
 * @param adventurers the adventurers
 * @returns whether the adventurers can still move
 */
export function adventurersCanStillMove(adventurers: ReadonlyArray<Adventurer>): boolean {
  return adventurers.some((a) => a.nextMoves.length > 0);
}

/**
 * Runs the simulation until all adventurers have exhausted their moves.
 * @param map the map to simulate
 * @returns the final map
 */
export function finishSimulation(map: TreasureMap): TreasureMap {
  while (adventurersCanStillMove(map.adventurers)) {
    map = tickSimulation(map);
  }
  return map;
}
