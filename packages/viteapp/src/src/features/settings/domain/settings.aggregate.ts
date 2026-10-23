import { createEntityId } from "../../../packages/foundation/src/infrastructure/core/entity/entity-id";
import { getTimestampNow } from "../../../packages/foundation/src/infrastructure/core/timestamp/timestamp";
import { deepClone } from "../../../packages/foundation/src/infrastructure/core/utilities/helpers";
import { EntityId } from "../../../packages/foundation/src/types";
import { USER_PERMISSIONS } from "../const";
import {
  CropEntity,
  PestCategoryEntity,
  PestEntity,
  UserRoleEntity,
} from "../types";

export default class SettingsAggregate {
  private id: EntityId;
  private pestCategories: Array<PestCategoryEntity>;
  private pests: Array<PestEntity>;
  private crops: Array<CropEntity>;
  private userRoles: Array<UserRoleEntity>;
  private version: number;
  private hasBumpedVersion: boolean = false;

  private constructor(p: {
    id: EntityId;
    pestCategories: Array<PestCategoryEntity>;
    pests: Array<PestEntity>;
    crops: Array<CropEntity>;
    userRoles: Array<UserRoleEntity>;
    version: number;
    hasBumpedVersion: boolean;
  }) {
    this.id = p.id;
    this.pestCategories = p.pestCategories;
    this.pests = p.pests;
    this.crops = p.crops;
    this.userRoles = p.userRoles;
    this.version = p.version;
    this.hasBumpedVersion = p.hasBumpedVersion;
  }

  getId(): EntityId {
    return this.id;
  }

  getPestCategories(): Array<PestCategoryEntity> {
    return deepClone(this.pestCategories);
  }

  getPests(): Array<PestEntity> {
    return deepClone(this.pests);
  }

  addPestCategory(pestCategory: PestCategoryEntity): void {
    this.pestCategories.push(pestCategory);
  }

  addPest(pest: PestEntity): void {
    this.pests.push(pest);
  }

  addCrop(crop: CropEntity): void {
    this.crops.push(crop);
    this.bumpVersion();
  }

  getUserRoles(): Array<UserRoleEntity> {
    return deepClone(this.userRoles);
  }

  getCrops(): Array<CropEntity> {
    return deepClone(this.crops);
  }

  getVersion(): number {
    return this.version;
  }

  static create(p: {
    pestCategories: Array<PestCategoryEntity>;
    pests: Array<PestEntity>;
    crops: Array<CropEntity>;
  }): SettingsAggregate {
    const settingsId = createEntityId();
    const basicUserRole: UserRoleEntity = {
      id: createEntityId(),
      name: "User",
      permissions: [
        "user:read",
        "observation:create",
        "observation:read",
        "observation:update",
        "observation:delete",
      ],
      createdAt: getTimestampNow(),
      updatedAt: getTimestampNow(),
    };
    const adminUserRole: UserRoleEntity = {
      id: createEntityId(),
      name: "Admin",
      permissions: USER_PERMISSIONS.map((p) => p.value),
      createdAt: getTimestampNow(),
      updatedAt: getTimestampNow(),
    };
    return new SettingsAggregate({
      id: settingsId,
      pestCategories: p.pestCategories,
      pests: p.pests,
      crops: p.crops,
      userRoles: [basicUserRole, adminUserRole],
      version: 1,
      hasBumpedVersion: false,
    });
  }

  static rehydrate(p: {
    id: EntityId;
    pestCategories: Array<PestCategoryEntity>;
    pests: Array<PestEntity>;
    userRoles: Array<UserRoleEntity>;
    crops: Array<CropEntity>;
    version: number;
  }): SettingsAggregate {
    return new SettingsAggregate({
      id: p.id,
      pestCategories: p.pestCategories,
      pests: p.pests,
      crops: p.crops,
      userRoles: p.userRoles,
      version: p.version,
      hasBumpedVersion: false,
    });
  }

  private bumpVersion(): void {
    if (!this.hasBumpedVersion) {
      this.version++;
      this.hasBumpedVersion = true;
    }
  }

  addUserRole(userRole: UserRoleEntity): void {
    this.userRoles.push(userRole);
    this.bumpVersion();
  }

  removeUserRole(userRole: UserRoleEntity): void {
    this.userRoles = this.userRoles.filter((ur) => ur.id !== userRole.id);
    this.bumpVersion();
  }

  updateUserRole(userRole: UserRoleEntity): void {
    const index = this.userRoles.findIndex((ur) => ur.id === userRole.id);
    if (index !== -1) {
      this.userRoles[index] = userRole;
    }
    this.bumpVersion();
  }

  createPestCategory(pestCategory: PestCategoryEntity): void {
    this.pestCategories.push(pestCategory);
    this.bumpVersion();
  }

  removePestCategory(pestCategory: PestCategoryEntity): void {
    this.pestCategories = this.pestCategories.filter(
      (pc) => pc.id !== pestCategory.id,
    );
    this.bumpVersion();
  }

  createPest(pest: PestEntity): void {
    this.pests.push(pest);
    this.bumpVersion();
  }

  createCrop(crop: CropEntity): void {
    this.crops.push(crop);
    this.bumpVersion();
  }

  removeCrop(crop: CropEntity): void {
    this.crops = this.crops.filter((c) => c.id !== crop.id);
    this.bumpVersion();
  }

  updateCrop(crop: CropEntity): void {
    const index = this.crops.findIndex((c) => c.id === crop.id);
    if (index !== -1) {
      this.crops[index] = crop;
    }
    this.bumpVersion();
  }

  removePest(pest: PestEntity): void {
    this.pests = this.pests.filter((t) => t.id !== pest.id);
    this.bumpVersion();
  }

  updatePestCategory(pestCategory: PestCategoryEntity): void {
    const index = this.pestCategories.findIndex(
      (pc) => pc.id === pestCategory.id,
    );
    if (index !== -1) {
      this.pestCategories[index] = pestCategory;
    }
    this.bumpVersion();
  }

  updatePest(pest: PestEntity): void {
    const index = this.pests.findIndex((t) => t.id === pest.id);
    if (index !== -1) {
      this.pests[index] = pest;
    }
    this.bumpVersion();
  }
}
