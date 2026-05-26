// types/weekly.ts
import { Todo } from "./common";

export type WeeklyData = {
  [date: string]: Todo[];
};