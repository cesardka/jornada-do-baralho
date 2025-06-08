import { createContext, useContext, useState, ReactNode } from "react";

// Define the context type
interface AnimationContextType {
  animationEnded: boolean;
  setAnimationEnded: (value: boolean) => void;
}

// Create context with default values
const AnimationContext = createContext<AnimationContextType | undefined>(
  undefined
);

// Provider component
export const AnimationProvider = ({ children }: { children: ReactNode }) => {
  const [animationEnded, setAnimationEnded] = useState(false);

  return (
    <AnimationContext.Provider value={{ animationEnded, setAnimationEnded }}>
      {children}
    </AnimationContext.Provider>
  );
};

// Custom hook for consuming context
export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error("useAnimation must be used within an AnimationProvider");
  }
  return context;
};
