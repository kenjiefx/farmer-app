import { EntityId } from "../../../packages/foundation/src/types";
import UserAggregate from "../aggregate/user.aggregate";

export type GetAllUsersQuery = {
  page: number;
  pageSize: number;
  sort: string;
  sortDirection: "asc" | "desc";
  search: string;
  filters: {
    roleId: EntityId;
  };
};

export interface UserRepositoryInterface {
  create(user: UserAggregate, rawPassword: string): Promise<void>;
  update(user: UserAggregate): Promise<void>;
  delete(id: EntityId): Promise<void>;
  getById(id: EntityId): Promise<UserAggregate | null>;
  getByUsername(username: string): Promise<UserAggregate | null>;
  getByEmail(email: string): Promise<UserAggregate | null>;
  getAll(query: GetAllUsersQuery): Promise<Array<UserAggregate>>;
}
