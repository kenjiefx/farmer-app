import { createEntityId } from "../../../packages/foundation/src/infrastructure/core/entity/entity-id";
import { EntityId } from "../../../packages/foundation/src/types";

export default class FarmAggregate {
  private id: EntityId;
  private name: string;
  private cropIds: Array<EntityId>;
  private location: string;
  private version: number;
  private hasBumpedVersion: boolean = false;

  private constructor(p: {
    id: EntityId;
    name: string;
    cropIds: Array<EntityId>;
    location: string;
    version: number;
    hasBumpedVersion: boolean;
  }) {
    this.id = p.id;
    this.name = p.name;
    this.cropIds = p.cropIds;
    this.location = p.location;
    this.version = p.version;
    this.hasBumpedVersion = p.hasBumpedVersion;
  }

  static rehydrate(p: {
    id: EntityId;
    name: string;
    cropIds: Array<EntityId>;
    location: string;
    version: number;
  }): FarmAggregate {
    return new FarmAggregate({
      id: p.id,
      name: p.name,
      cropIds: p.cropIds,
      location: p.location,
      version: p.version,
      hasBumpedVersion: false,
    });
  }

  static create(p: {
    name: string;
    cropIds: Array<EntityId>;
    location: string;
    version: number;
  }): FarmAggregate {
    return new FarmAggregate({
      id: createEntityId(),
      name: p.name,
      cropIds: p.cropIds,
      location: p.location,
      version: p.version,
      hasBumpedVersion: true,
    });
  }

  private bumpVersion(): void {
    if (!this.hasBumpedVersion) {
      this.version += 1;
      this.hasBumpedVersion = true;
    }
  }

  getId(): EntityId {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getCropIds(): Array<EntityId> {
    return this.cropIds;
  }

  getLocation(): string {
    return this.location;
  }

  getVersion(): number {
    return this.version;
  }

  setLocation(newLocation: string): void {
    this.location = newLocation;
    this.bumpVersion();
  }

  addCrop(newCropId: EntityId): void {
    this.cropIds.push(newCropId);
    this.bumpVersion();
  }

  removeCrop(cropId: EntityId): void {
    this.cropIds = this.cropIds.filter((id) => id !== cropId);
    this.bumpVersion();
  }

  setName(newName: string): void {
    this.name = newName;
    this.bumpVersion();
  }
}
