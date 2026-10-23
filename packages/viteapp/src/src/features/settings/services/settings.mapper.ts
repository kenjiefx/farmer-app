import { EntityId } from "../../../packages/foundation/src/types";
import SettingsAggregate from "../../settings/domain/settings.aggregate";
import {
  PestCategoryEntity,
  PestEntity,
  UserRoleEntity,
} from "../../settings/types";

export class SettingsMapper {
  static toPersistence(settings: SettingsAggregate): SettingsRecord {
    return {
      id: settings.getId(),
      pestCategories: settings.getPestCategories(),
      pests: settings.getPests(),
      userRoles: settings.getUserRoles(),
      version: settings.getVersion(),
    };
  }

  static toDomain(settingsRecord: SettingsRecord): SettingsAggregate {
    return SettingsAggregate.rehydrate({
      id: settingsRecord.id,
      pestCategories: settingsRecord.pestCategories,
      pests: settingsRecord.pests,
      userRoles: settingsRecord.userRoles,
      version: settingsRecord.version,
    });
  }
}

export type SettingsRecord = {
  id: EntityId;
  pestCategories: Array<PestCategoryEntity>;
  pests: Array<PestEntity>;
  userRoles: Array<UserRoleEntity>;
  version: number;
};
