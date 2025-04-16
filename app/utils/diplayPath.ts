import { CellType } from "../types/CellType";
import { Point } from "../types/Point";

type DisplayPathArgs = {
  foundPath: Point[];
  grid: CellType[][];
  startPoint: Point | null;
  endPoint: Point | null;
  setPath: (arg0: Point[]) => void;
  setGrid: (arg0: CellType[][]) => void;
};
export default function displayPath({
  foundPath,
  grid,
  startPoint,
  endPoint,
  setPath,
  setGrid,
}: DisplayPathArgs) {
  const newGrid = [...grid];

  // Mark path cells
  foundPath.forEach((point) => {
    if (
      !(
        startPoint &&
        point.row === startPoint.row &&
        point.col === startPoint.col
      ) &&
      !(endPoint && point.row === endPoint.row && point.col === endPoint.col)
    ) {
      newGrid[point.row][point.col] = "path";
    }
  });

  setPath(foundPath);
  setGrid(newGrid);
}
