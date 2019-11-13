import { ReactNode } from "react";
import { EC } from "../../lib/Electronic";

export type ToolsProps = {
  children: ReactNode;
  selectedComponent: EC | null;
};

export type ToolsState = {};
