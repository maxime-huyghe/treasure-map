import type { Adventurer, TreasureMap } from "../lib/TreasureMap";
import React, { useCallback, useState } from "react";
import { adventurersCanStillMove, tickSimulation } from "../lib/Game";
import FilePicker from "./FilePicker";
import Button from "./Button";

const Map = () => {
  const [treasureMaps, setTreasureMaps] = useState([] as TreasureMap[]);
  const lastMap = treasureMaps.at(-1);

  const onReset = () => {
    setTreasureMaps(treasureMaps.slice(0, 1));
  };
  const onPrev = () => {
    setTreasureMaps(treasureMaps.slice(0, -1));
  };
  const onNext = () => {
    if (lastMap) {
      setTreasureMaps([...treasureMaps, tickSimulation(lastMap)]);
    }
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
    <div className="px-4">
      <FilePicker onUpload={onUpload} currentMap={lastMap} />
      {
        lastMap && (<>
          <Grid treasureMap={lastMap} />
          <div>
            <Button onClick={onReset} disabled={treasureMaps.length === 1}>Reset</Button>
            <Button onClick={onPrev} disabled={treasureMaps.length === 1}>Previous</Button>
            <Button onClick={onNext} disabled={!adventurersCanStillMove(lastMap.adventurers)}>Next</Button>
            <Button onClick={onFinish} disabled={!adventurersCanStillMove(lastMap.adventurers)}>Run to the end</Button>
          </div>
        </>)}
    </div>
  );
};

const Grid = ({ treasureMap }: { treasureMap: TreasureMap; }) => {
  return <div className={`grid gap-3 w-fit p-4`} style={{
    gridTemplateColumns: `repeat(${ treasureMap.width }, minmax(0, 1fr))`,
  }}>
    {treasureMap.squares.map((row, y) => (
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
    ))}
  </div>;
};

const AdventurerSquare = ({ adventurer }: { adventurer: Adventurer; }) => {
  return <Square>A({adventurer.name})</Square>;
};

const EmptySquare = () => {
  return <Square>.</Square>;
};

const TreasureSquare = ({ amount }: { amount: number; }) => {
  return <Square>T({amount})</Square>;
};

const MountainSquare = () => {
  return <Square>M</Square>;
};

const Square = ({ children }: { children: React.ReactNode; }) => {
  return <span>{children}</span>;
};

export default Map;
