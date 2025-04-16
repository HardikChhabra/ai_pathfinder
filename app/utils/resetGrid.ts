import { CellType } from "../types/CellType";
import { ModeType } from "../types/ModeType";
import { Point } from "../types/Point";

type ResetGridArgs = {
  setGrid: (arg0: CellType[][]) => void;
  setStartPoint: (arg0: Point | null) => void;
  setEndPoint: (arg0: Point | null) => void;
  setObstacles: (arg0: Point[]) => void;
  setPath: (arg0: Point[]) => void;
  setMode: (arg0: ModeType) => void;
  setMessage: (arg0: string) => void;
};
export default function resetGrid({
  setGrid,
  setEndPoint,
  setObstacles,
  setStartPoint,
  setMessage,
  setMode,
  setPath,
}: ResetGridArgs) {
  const newGrid: CellType[][] = [];
  for (let i = 0; i < 10; i++) {
    newGrid.push(Array(10).fill("empty"));
  }
  setGrid(newGrid);
  setStartPoint(null);
  setEndPoint(null);
  setObstacles([]);
  setPath([]);
  setMode("start");
  setMessage("Select a starting point");
}
