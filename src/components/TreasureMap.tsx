import { Adventurer, parseMap, TreasureMap } from "../lib/TreasureMap";
import { useState } from "react";
import { EXAMPLE_MAP } from "../lib/consts";
import { adventurersCanStillMove, tickSimulation } from "../lib/Game";

const Map = () => {
  const [treasureMaps, setTreasureMaps] = useState([parseMap(EXAMPLE_MAP)]);
  const lastMap = treasureMaps.at(-1);
  if (!lastMap) {
    return null;
  }
  const onNext = () => {
    setTreasureMaps([...treasureMaps, tickSimulation(lastMap)]);
  };
  const onPrev = () => {
    setTreasureMaps(treasureMaps.slice(0, -1));
  };
  const onFinish = () => {
    setTreasureMaps((treasureMaps) => {
      const newMapList = [...treasureMaps];
      while (adventurersCanStillMove((newMapList.at(-1) as TreasureMap).adventurers)) {
        newMapList.push(tickSimulation(newMapList.at(-1) as TreasureMap));
      }
      return newMapList;
    });
  };
  return (
    <>
      <Grid treasureMap={lastMap} />
      <div>

        <button onClick={onPrev} disabled={treasureMaps.length === 1}>Previous</button>
        <button onClick={onNext} disabled={!adventurersCanStillMove(lastMap.adventurers)}>Next</button>
        <button onClick={onFinish} disabled={!adventurersCanStillMove(lastMap.adventurers)}>Run to the end</button>
      </div>
    </>
  );
};

const Grid = ({ treasureMap }: { treasureMap: TreasureMap; }) => {
  return <div className="grid" style={{ gridTemplateColumns: `repeat(${ treasureMap.width }, 100px)` }}>
    {treasureMap.squares.map((row, y) =>
      row.map((square, x) => {
        const adventurerOnThisSquare = treasureMap.adventurers.find(a => a.x === x && a.y === y);
        if (adventurerOnThisSquare) {
          return <AdventurerSquare adventurer={adventurerOnThisSquare} />;
        }
        switch (square.type) {
          case "empty":
            return <EmptySquare />;
          case "treasure":
            return <TreasureSquare amount={square.amount} />;
          case "mountain":
            return <MountainSquare />;
        }
        return null; // won't ever be reached, is there to shut up the warning
      })
    )}
  </div>;
};

const AdventurerSquare = ({ adventurer }: { adventurer: Adventurer; }) => {
  return <span>A({adventurer.name})</span>;
};

const EmptySquare = () => {
  return <span>.</span>;
};

const TreasureSquare = ({ amount }: { amount: number; }) => {
  return <span>T({amount})</span>;
};

const MountainSquare = () => {
  return <span>M</span>;
};

export default Map;
