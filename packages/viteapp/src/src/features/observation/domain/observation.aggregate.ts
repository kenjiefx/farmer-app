import { createEntityId } from "../../../packages/foundation/src/infrastructure/core/entity/entity-id";
import { getTimestampNow } from "../../../packages/foundation/src/infrastructure/core/timestamp/timestamp";
import { deepClone } from "../../../packages/foundation/src/infrastructure/core/utilities/helpers";
import { EntityId } from "../../../packages/foundation/src/types";
import { ObservationSeverity, ObservationStats } from "../types";

export default class ObservationAggregate {
  private id: EntityId;
  private farmId: EntityId;
  private cropId: EntityId;
  private pestId: EntityId;
  private severity: ObservationSeverity;
  private description: string;
  private stats: ObservationStats;
  private version: number;
  private hasBumpedVersion: boolean = false;

  private constructor(p: {
    id: EntityId;
    farmId: EntityId;
    cropId: EntityId;
    pestId: EntityId;
    severity: ObservationSeverity;
    description: string;
    stats: ObservationStats;
    version: number;
    hasBumpedVersion: boolean;
  }) {
    this.id = p.id;
    this.farmId = p.farmId;
    this.cropId = p.cropId;
    this.pestId = p.pestId;
    this.severity = p.severity;
    this.description = p.description;
    this.stats = p.stats;
    this.version = p.version;
    this.hasBumpedVersion = p.hasBumpedVersion;
  }

  public static create(p: {
    farmId: EntityId;
    cropId: EntityId;
    pestId: EntityId;
    severity: ObservationSeverity;
    description: string;
    estimatedPestCount: number;
  }) {
    const id = createEntityId();
    return new ObservationAggregate({
      id,
      farmId: p.farmId,
      cropId: p.cropId,
      pestId: p.pestId,
      severity: p.severity,
      description: p.description,
      stats: {
        estimatedPestCount: p.estimatedPestCount,
        createdAt: getTimestampNow(),
        updatedAt: getTimestampNow(),
      },
      version: 1,
      hasBumpedVersion: false,
    });
  }

  public static rehydrate(p: {
    id: EntityId;
    farmId: EntityId;
    cropId: EntityId;
    pestId: EntityId;
    severity: ObservationSeverity;
    description: string;
    stats: ObservationStats;
    version: number;
  }) {
    return new ObservationAggregate({
      id: p.id,
      farmId: p.farmId,
      cropId: p.cropId,
      pestId: p.pestId,
      severity: p.severity,
      description: p.description,
      stats: p.stats,
      version: p.version,
      hasBumpedVersion: false,
    });
  }

  private bumpVersion() {
    if (!this.hasBumpedVersion) {
      this.version += 1;
      this.hasBumpedVersion = true;
    }
  }

  getId() {
    return this.id;
  }

  getFarmId() {
    return this.farmId;
  }

  getCropId() {
    return this.cropId;
  }

  getPestId() {
    return this.pestId;
  }

  getSeverity() {
    return this.severity;
  }

  getDescription() {
    return this.description;
  }

  getStats() {
    return deepClone(this.stats);
  }

  getVersion() {
    return this.version;
  }

  setDescription(description: string) {
    this.description = description;
    this.bumpVersion();
    this.stats.updatedAt = getTimestampNow();
  }

  setSeverity(severity: ObservationSeverity) {
    this.severity = severity;
    this.bumpVersion();
    this.stats.updatedAt = getTimestampNow();
  }

  setEstimatedPestCount(estimatedPestCount: number) {
    this.stats.estimatedPestCount = estimatedPestCount;
    this.bumpVersion();
    this.stats.updatedAt = getTimestampNow();
  }

  correctCropId(cropId: EntityId) {
    this.cropId = cropId;
    this.bumpVersion();
    this.stats.updatedAt = getTimestampNow();
  }
}
