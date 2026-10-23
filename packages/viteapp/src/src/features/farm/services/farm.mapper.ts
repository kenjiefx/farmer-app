import { EntityId } from "../../../packages/foundation/src/types";
import FarmAggregate from "../domain/farm.aggregate";

export type FarmRecord = {
  id: EntityId;
  name: string;
  cropIds: Array<EntityId>;
  location: string;
  version: number;
};

export class FarmMapper {
  static toPersistence(farm: any): FarmRecord {
    return {
      id: farm.getId(),
      name: farm.getName(),
      cropIds: farm.getCropIds(),
      location: farm.getLocation(),
      version: farm.getVersion(),
    };
  }

  static toDomain(record: FarmRecord): FarmAggregate {
    return FarmAggregate.rehydrate({
      id: record.id,
      name: record.name,
      cropIds: record.cropIds,
      location: record.location,
      version: record.version,
    });
  }
}
