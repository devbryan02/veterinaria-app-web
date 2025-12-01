"use client";

import React, { createContext, useContext } from "react";
import useVet from "../hooks/useVet";

const VetContext = createContext<ReturnType<typeof useVet> | undefined>(undefined);

export const VetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const vet = useVet();
    return React.createElement(VetContext.Provider, { value: vet }, children);
};

export const useVetContext = () => {
    const context = useContext(VetContext);
    if (!context) {
        throw new Error("useVetContext must be used within a VetProvider");
    }
    return context;
};