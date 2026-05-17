import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

interface DiscreetModeContextValue {
  isActive: boolean;
  enabled: boolean;
  activate: () => void;
  deactivate: () => void;
  setEnabled: (v: boolean) => Promise<void>;
}

const STORAGE_KEY = 'alxia_discreet_enabled';

const Ctx = createContext<DiscreetModeContextValue>({
  isActive: false,
  enabled: false,
  activate: () => {},
  deactivate: () => {},
  setEnabled: async () => {},
});

export function DiscreetModeProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabledState] = useState(false);
  const [isActive, setActive] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync(STORAGE_KEY).then(v => setEnabledState(v === '1'));
  }, []);

  const setEnabled = async (v: boolean) => {
    setEnabledState(v);
    await SecureStore.setItemAsync(STORAGE_KEY, v ? '1' : '0');
    if (!v) setActive(false);
  };

  return (
    <Ctx.Provider value={{
      isActive,
      enabled,
      activate: () => { if (enabled) setActive(true); },
      deactivate: () => setActive(false),
      setEnabled,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useDiscreetMode() {
  return useContext(Ctx);
}
