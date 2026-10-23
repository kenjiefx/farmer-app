import { useContext, useEffect, useState } from "react";
import { SettingsRepositoryContext } from "../context";
import SettingsAggregate from "../domain/settings.aggregate";

let storedSettings: SettingsAggregate | undefined;

export default function useSettings() {
  const [settings, setSettings] = useState<SettingsAggregate | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(true);
  const settingsRepository = useContext(SettingsRepositoryContext);
  if (!settingsRepository) {
    throw new Error("SettingsRepositoryContext not found");
  }

  useEffect(() => {
    settingsRepository.getSettings().then((settings) => {
      setSettings(settings);
      setIsLoading(false);
    });
  }, []);

  return {
    isSettingsLoading: isLoading,
  };
}
