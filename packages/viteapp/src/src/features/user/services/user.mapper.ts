import { EntityId, TimeStamp } from "../../../packages/foundation/src/types";
import UserAggregate from "../aggregate/user.aggregate";

export type UserRecord = {
  id: EntityId;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  profilePictureUrl: string | null;
  roleId: EntityId;
  createdAt: TimeStamp;
  updatedAt: TimeStamp;
  isActive: boolean;
  version: number;
};

export class UserMapper {
  static toPersistence(user: UserAggregate): UserRecord {
    return {
      id: user.getId(),
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      username: user.getUsername(),
      email: user.getEmail(),
      profilePictureUrl: user.getProfilePictureUrl(),
      roleId: user.getRoleId(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
      isActive: user.getIsActive(),
      version: user.getVersion(),
    };
  }

  static toAggregate(record: UserRecord): UserAggregate {
    return UserAggregate.rehydrate({
      id: record.id,
      email: record.email,
      profilePictureUrl: record.profilePictureUrl,
      roleId: record.roleId,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      isActive: record.isActive,
      firstName: record.firstName,
      lastName: record.lastName,
      username: record.username,
      version: record.version,
    });
  }
}
