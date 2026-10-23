import { createContext } from "react";
import { UserRepositoryInterface } from "./repository/user-repository.interface";

export const UserRepositoryContext = createContext<
  UserRepositoryInterface | undefined
>(undefined);
