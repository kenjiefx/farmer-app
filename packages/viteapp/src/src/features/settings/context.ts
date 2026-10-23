import { createContext } from "react";
import { SettingsRepositoryInterface } from "./repository/settings-repository.interface";

export const SettingsRepositoryContext = createContext<
  SettingsRepositoryInterface | undefined
>(undefined);
