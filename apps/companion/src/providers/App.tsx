"use client";

import { useContext } from "react";
import {
  prayer_strict_group_by_date,
  type IPrayers_Strict_Group_By_Date,
} from "@/constants/mock_prayers_strict";

import { createContext } from "react";

export const AppContext = createContext<{
  prayers: IPrayers_Strict_Group_By_Date | null;
}>({
  prayers: null,
});

export const AppProvider: React.FC<{
  children: React.ReactNode;
  prayers: IPrayers_Strict_Group_By_Date;
  mock?: boolean;
}> = ({ children, prayers, mock }) => {
  return (
    <AppContext.Provider
      value={{
        prayers: mock
          ? (prayer_strict_group_by_date as IPrayers_Strict_Group_By_Date)
          : prayers,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const { prayers } = useContext(AppContext);
  return { prayers };
};
