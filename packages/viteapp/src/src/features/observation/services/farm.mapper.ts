import { EntityId, TimeStamp } from "../../../packages/foundation/src/types";
import ObservationAggregate from "../domain/observation.aggregate";
import { ObservationSeverity } from "../types";

export type ObservationRecord = {
  observationId: EntityId;
  farmId: EntityId;
  cropId: EntityId;
  pestId: EntityId;
  severity: ObservationSeverity;
  description: string;
  estimatedPestCount: number;
  createdAt: TimeStamp;
  updatedAt: TimeStamp;
  version: number;
};

export class ObservationMapper {
  static toPersistence(observation: ObservationAggregate): ObservationRecord {
    return {
      observationId: observation.getId(),
      farmId: observation.getFarmId(),
      cropId: observation.getCropId(),
      pestId: observation.getPestId(),
      severity: observation.getSeverity(),
      description: observation.getDescription(),
      estimatedPestCount: observation.getStats().estimatedPestCount,
      createdAt: observation.getStats().createdAt,
      updatedAt: observation.getStats().updatedAt,
      version: observation.getVersion(),
    };
  }

  static toDomain(record: ObservationRecord): ObservationAggregate {
    return ObservationAggregate.rehydrate({
      id: record.observationId,
      farmId: record.farmId,
      cropId: record.cropId,
      pestId: record.pestId,
      severity: record.severity,
      description: record.description,
      stats: {
        estimatedPestCount: record.estimatedPestCount,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      },
      version: record.version,
    });
  }
}
