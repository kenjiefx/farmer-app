import { EntityId } from "../../../packages/foundation/src/types";
import SettingsAggregate from "../../settings/domain/settings.aggregate";
import {
  CropEntity,
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
      crops: settings.getCrops(),
      version: settings.getVersion(),
    };
  }

  static toDomain(settingsRecord: SettingsRecord): SettingsAggregate {
    return SettingsAggregate.rehydrate({
      id: settingsRecord.id,
      pestCategories: settingsRecord.pestCategories,
      pests: settingsRecord.pests,
      userRoles: settingsRecord.userRoles,
      crops: settingsRecord.crops,
      version: settingsRecord.version,
    });
  }
}

export type SettingsRecord = {
  id: EntityId;
  pestCategories: Array<PestCategoryEntity>;
  pests: Array<PestEntity>;
  crops: Array<CropEntity>;
  userRoles: Array<UserRoleEntity>;
  version: number;
};
