import { EntityId, TimeStamp } from "../../packages/foundation/src/types";
import { USER_PERMISSIONS } from "./const";

export type PestCategoryEntity = {
  id: EntityId;
  name: string;
  createdAt: TimeStamp;
  updatedAt: TimeStamp;
};

export type PestEntity = {
  id: EntityId;
  name: string;
  createdAt: TimeStamp;
  updatedAt: TimeStamp;
};

export type UserPermissionValue = (typeof USER_PERMISSIONS)[number]["value"];

export type UserRoleEntity = {
  id: EntityId;
  name: string;
  permissions: Array<UserPermissionValue>;
  createdAt: TimeStamp;
  updatedAt: TimeStamp;
};
