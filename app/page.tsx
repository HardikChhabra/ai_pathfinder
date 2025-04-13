"use client";
import { useState, useEffect } from "react";

type CellType = "empty" | "start" | "end" | "obstacle" | "path";
type ModeType = "start" | "end" | "obstacles" | "ready";

interface Point {
  row: number;
  col: number;
}

interface QueueItem {
  row: number;
  col: number;
  path: Point[];
}

export default function PathfindingGrid() {
  const [grid, setGrid] = useState<CellType[][]>([]);
  const [mode, setMode] = useState<ModeType>("start");
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [endPoint, setEndPoint] = useState<Point | null>(null);
  const [obstacles, setObstacles] = useState<Point[]>([]);
  const [path, setPath] = useState<Point[]>([]);
  const [message, setMessage] = useState<string>("Select a starting point");

  // Initialize the grid
  useEffect(() => {
    const initialGrid: CellType[][] = [];
    for (let i = 0; i < 10; i++) {
      initialGrid.push(Array(10).fill("empty"));
    }
    setGrid(initialGrid);
  }, []);

  const handleCellClick = (row: number, col: number): void => {
    if (mode === "start") {
      // Clear previous start point if any
      if (startPoint) {
        const newGrid = [...grid];
        newGrid[startPoint.row][startPoint.col] = "empty";
        setGrid(newGrid);
      }

      // Set new start point
      const newGrid = [...grid];
      newGrid[row][col] = "start";
      setGrid(newGrid);
      setStartPoint({ row, col });
      setMode("end");
      setMessage("Now select an ending point");
    } else if (mode === "end") {
      // Don't allow setting end point on start point
      if (startPoint && startPoint.row === row && startPoint.col === col) {
        return;
      }

      // Clear previous end point if any
      if (endPoint) {
        const newGrid = [...grid];
        newGrid[endPoint.row][endPoint.col] = "empty";
        setGrid(newGrid);
      }

      // Set new end point
      const newGrid = [...grid];
      newGrid[row][col] = "end";
      setGrid(newGrid);
      setEndPoint({ row, col });
      setMode("obstacles");
      setMessage("Mark obstacles (optional), then click Find Path");
    } else if (mode === "obstacles") {
      // Don't allow setting obstacles on start or end points
      if (
        (startPoint && startPoint.row === row && startPoint.col === col) ||
        (endPoint && endPoint.row === row && endPoint.col === col)
      ) {
        return;
      }

      const newGrid = [...grid];
      // Toggle obstacle
      if (newGrid[row][col] === "obstacle") {
        newGrid[row][col] = "empty";
        setObstacles(
          obstacles.filter((obs) => !(obs.row === row && obs.col === col))
        );
      } else {
        newGrid[row][col] = "obstacle";
        setObstacles([...obstacles, { row, col }]);
      }
      setGrid(newGrid);
    }
  };

  const findPath = (): void => {
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
        displayPath(path);
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
  };

  const displayPath = (foundPath: Point[]): void => {
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
  };

  const resetGrid = (): void => {
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
  };

  const getCellStyle = (cellType: CellType): string => {
    switch (cellType) {
      case "start":
        return "bg-green-500";
      case "end":
        return "bg-red-500";
      case "obstacle":
        return "bg-gray-800";
      case "path":
        return "bg-blue-400";
      default:
        return "bg-white hover:bg-gray-100";
    }
  };

  return (
    <div className="flex flex-col items-center p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Path Finding Visualizer</h1>

      <div className="mb-4 text-lg font-semibold text-center">{message}</div>

      <div className="grid grid-cols-10 gap-1 mb-6">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-12 h-12 border border-gray-300 cursor-pointer flex items-center justify-center ${getCellStyle(
                cell
              )}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            />
          ))
        )}
      </div>

      <div className="flex space-x-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={findPath}
        >
          Find Path
        </button>
        <button
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          onClick={resetGrid}
        >
          Reset Grid
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-green-500 mr-2"></div>
          <span>Start</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-red-500 mr-2"></div>
          <span>End</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-gray-800 mr-2"></div>
          <span>Obstacle</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-blue-400 mr-2"></div>
          <span>Path</span>
        </div>
      </div>
    </div>
  );
}
