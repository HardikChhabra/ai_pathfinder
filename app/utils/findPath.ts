import { CellType } from "../types/CellType";
import { Point } from "../types/Point";
import { QueueItem } from "../types/QueueItem";
import displayPath from "./diplayPath";
type FindPathArgs = {
  startPoint: Point | null;
  endPoint: Point | null;
  setMessage: (arg0: string) => void;
  grid: CellType[][];
  setGrid: (arg0: CellType[][]) => void;
  setPath: (arg0: Point[]) => void;
};

export default function findPath({
  startPoint,
  endPoint,
  setMessage,
  grid,
  setGrid,
  setPath,
}: FindPathArgs) {
  if (!startPoint || !endPoint) {
    setMessage("Please select both start and end points");
    return;
  }

  // Clear previous path
  const newGrid = [...grid];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (newGrid[i][j] === "path") {
        newGrid[i][j] = "empty";
      }
    }
  }
  setGrid(newGrid);

  // Implement BFS to find path
  const queue: QueueItem[] = [
    {
      row: startPoint.row,
      col: startPoint.col,
      path: [],
    },
  ];

  const visited = new Set<string>();
  visited.add(`${startPoint.row},${startPoint.col}`);

  const directions: [number, number][] = [
    [-1, 0], // up
    [1, 0], // down
    [0, -1], // left
    [0, 1], // right
    [-1, -1], //upper-left
    [1, 1], //down-right
    [-1, 1], //upper-right
    [1, -1], //down-left
  ];

  while (queue.length > 0) {
    const { row, col, path } = queue.shift()!;

    // Check if reached end point
    if (row === endPoint.row && col === endPoint.col) {
      const args = {
        foundPath: path,
        startPoint,
        endPoint,
        grid,
        setGrid,
        setPath,
      };
      displayPath(args);
      setMessage("Path found!");
      return;
    }

    // Explore all four directions
    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;
      const key = `${newRow},${newCol}`;

      // Check if valid position
      if (
        newRow >= 0 &&
        newRow < 10 &&
        newCol >= 0 &&
        newCol < 10 &&
        !visited.has(key) &&
        !(grid[newRow][newCol] === "obstacle")
      ) {
        visited.add(key);
        queue.push({
          row: newRow,
          col: newCol,
          path: [...path, { row: newRow, col: newCol }],
        });
      }
    }
  }

  setMessage("No path found!");
}
