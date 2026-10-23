import { createEntityId } from "../../../packages/foundation/src/infrastructure/core/entity/entity-id";
import { getTimestampNow } from "../../../packages/foundation/src/infrastructure/core/timestamp/timestamp";
import { EntityId, TimeStamp } from "../../../packages/foundation/src/types";

export default class UserAggregate {
  private id: EntityId;
  private firstName: string;
  private lastName: string;
  private username: string;
  private email: string;
  private profilePictureUrl: string | null;
  private roleId: EntityId;
  private createdAt: TimeStamp;
  private updatedAt: TimeStamp;
  private isActive: boolean;
  private version: number;
  private hasBumpedVersion: boolean = false;

  private constructor(p: {
    id: EntityId;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    profilePictureUrl: string | null;
    roleId: EntityId;
    isActive: boolean;
    createdAt: TimeStamp;
    updatedAt: TimeStamp;
    version: number;
  }) {
    this.id = p.id;
    this.firstName = p.firstName;
    this.lastName = p.lastName;
    this.email = p.email;
    this.username = p.username;
    this.profilePictureUrl = p.profilePictureUrl;
    this.roleId = p.roleId;
    this.isActive = p.isActive;
    this.createdAt = p.createdAt;
    this.updatedAt = p.updatedAt;
    this.version = p.version;
  }

  getId(): EntityId {
    return this.id;
  }

  getFirstName(): string {
    return this.firstName;
  }

  getLastName(): string {
    return this.lastName;
  }

  getUsername(): string {
    return this.username;
  }

  getEmail(): string {
    return this.email;
  }

  getProfilePictureUrl(): string | null {
    return this.profilePictureUrl;
  }

  getRoleId(): EntityId {
    return this.roleId;
  }

  getCreatedAt(): TimeStamp {
    return this.createdAt;
  }

  getUpdatedAt(): TimeStamp {
    return this.updatedAt;
  }

  getVersion(): number {
    return this.version;
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  static create(p: {
    firstName: string;
    lastName: string;
    email: string;
    profilePictureUrl: string | null;
    username: string;
    roleId: EntityId;
  }): UserAggregate {
    return new UserAggregate({
      id: createEntityId(),
      firstName: p.firstName,
      lastName: p.lastName,
      email: p.email,
      username: p.username,
      profilePictureUrl: p.profilePictureUrl,
      roleId: p.roleId,
      isActive: true,
      createdAt: getTimestampNow(),
      updatedAt: getTimestampNow(),
      version: 1,
    });
  }

  static rehydrate(p: {
    id: EntityId;
    firstName: string;
    lastName: string;
    email: string;
    profilePictureUrl: string | null;
    username: string;
    roleId: EntityId;
    createdAt: TimeStamp;
    updatedAt: TimeStamp;
    isActive: boolean;
    version: number;
  }): UserAggregate {
    return new UserAggregate({
      id: p.id,
      firstName: p.firstName,
      lastName: p.lastName,
      email: p.email,
      username: p.username,
      profilePictureUrl: p.profilePictureUrl,
      roleId: p.roleId,
      isActive: p.isActive,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      version: p.version,
    });
  }

  private bumpVersion(): void {
    if (!this.hasBumpedVersion) {
      this.version++;
      this.hasBumpedVersion = true;
    }
  }

  setFirstName(firstName: string): void {
    this.firstName = firstName;
    this.bumpVersion();
  }

  setLastName(lastName: string): void {
    this.lastName = lastName;
    this.bumpVersion();
  }

  setEmail(email: string): void {
    this.email = email;
    this.bumpVersion();
  }

  setRoleId(roleId: EntityId): void {
    this.roleId = roleId;
    this.bumpVersion();
  }

  setCreatedAt(createdAt: TimeStamp): void {
    this.createdAt = createdAt;
    this.bumpVersion();
  }

  setUpdatedAt(updatedAt: TimeStamp): void {
    this.updatedAt = updatedAt;
    this.bumpVersion();
  }

  setProfilePictureUrl(profilePictureUrl: string | null): void {
    this.profilePictureUrl = profilePictureUrl;
    this.bumpVersion();
  }

  deactivate(): void {
    this.isActive = false;
    this.bumpVersion();
  }

  activate(): void {
    this.isActive = true;
    this.bumpVersion();
  }
}
