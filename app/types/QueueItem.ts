import { Point } from "./Point";

export interface QueueItem {
  row: number;
  col: number;
  path: Point[];
}
