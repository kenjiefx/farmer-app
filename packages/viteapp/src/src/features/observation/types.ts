import { EntityId, TimeStamp } from "../../packages/foundation/src/types";

export type ObservationSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type ObservationStats = {
  estimatedPestCount: number;
  createdAt: TimeStamp;
  updatedAt: TimeStamp;
};
