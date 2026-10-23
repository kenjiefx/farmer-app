import SettingsAggregate from "../domain/settings.aggregate";

export interface SettingsRepositoryInterface {
  getSettings(): Promise<SettingsAggregate>;
  updateSettings(settings: SettingsAggregate): Promise<void>;
}
