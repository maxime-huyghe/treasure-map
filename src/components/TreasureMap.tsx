import type { Adventurer, TreasureMap } from "../lib/TreasureMap";
import { useCallback, useState } from "react";
import { adventurersCanStillMove, tickSimulation } from "../lib/Game";
import FilePicker from "./FilePicker";

const Map = () => {
  const [treasureMaps, setTreasureMaps] = useState([] as TreasureMap[]);
  const lastMap = treasureMaps.at(-1);
  const onNext = () => {
    if (lastMap) {
      setTreasureMaps([...treasureMaps, tickSimulation(lastMap)]);
    }
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
  const onUpload = useCallback((tm: TreasureMap) => {
    setTreasureMaps([tm]);
  }, []);

  return (
    <>
      <FilePicker onUpload={onUpload} currentMap={lastMap} />
      {
        lastMap && (<>
          <Grid treasureMap={lastMap} />
          <div>
            <button onClick={onPrev} disabled={treasureMaps.length === 1}>Previous</button>
            <button onClick={onNext} disabled={!adventurersCanStillMove(lastMap.adventurers)}>Next</button>
            <button onClick={onFinish} disabled={!adventurersCanStillMove(lastMap.adventurers)}>Run to the end</button>
          </div>
        </>)}
    </>
  );
};

const Grid = ({ treasureMap }: { treasureMap: TreasureMap; }) => {
  return <div className="grid" style={{ gridTemplateColumns: `repeat(${ treasureMap.width }, 100px)` }}>
    {treasureMap.squares.map((row, y) =>
      row.map((square, x) => {
        const key = `${ x }${ y }`;
        const adventurerOnThisSquare = treasureMap.adventurers.find(a => a.x === x && a.y === y);
        if (adventurerOnThisSquare) {
          return <AdventurerSquare key={key} adventurer={adventurerOnThisSquare} />;
        }
        switch (square.type) {
          case "empty":
            return <EmptySquare key={key} />;
          case "treasure":
            return <TreasureSquare key={key} amount={square.amount} />;
          case "mountain":
            return <MountainSquare key={key} />;
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
