import React from "react";
import { create } from "zustand";

const useStepStore = create((set) => ({
  step: 0,
  completedSteps: 0,
  setStep: (step) => set({ step }),

  nextStep: () => set((state) => ({ step: state.step + 1 })),
  previousStep: () => set((state) => ({ step: state.step - 1 })),

  setCompletedSteps: (completedSteps) => set({ completedSteps }),
}));

function Step({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

function StepContent({ children, stepNumber, ...props }) {
  const { step } = useStepStore();

  if (step !== stepNumber) {
    return null;
  }

  return <div {...props}>{children}</div>;
}

export { useStepStore, Step, StepContent };
