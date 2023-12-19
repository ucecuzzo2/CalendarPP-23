import { useContext, useState } from "react";
import { createContext } from "react";
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import { steps } from "./steps";

const JoyrideContext = createContext();

export const useJoyride = () => {
  return useContext(JoyrideContext);
};

const TIMEOUT = 0;

export const JoyrideProvider = ({ showTutorial, children }) => {
  const [runTour, setRunTour] = useState(showTutorial);
  const [stepIndex, setStepIndex] = useState(0);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const startTour = () => {
    setRunTour(true);
    setStepIndex(0);
  };

  const nextStep = () => {
    setStepIndex(stepIndex + 1);
  };

  const prevStep = () => {
    setStepIndex(stepIndex - 1);
  };

  const endTour = () => {
    setRunTour(false);
  };

  const joyrideCallback = (data) => {
    const { action, index, status, type } = data;
    if (ACTIONS.CLOSE === action) {
      endTour();
      setStepIndex(0);
    } else if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      if (index !== 9) {
        setStepIndex(stepIndex + 1);
      }
    } else if (ACTIONS.STOP === action) {
      if ([1, 2, 3, 4, 5, 6, 7, 8].includes(index)) {
        setTimeout(() => {
          setRunTour(true);
          setStepIndex(stepIndex + 1);
        }, TIMEOUT);
      } else {
        setStepIndex(0);
        endTour();
      }
    }
  };
  const joyrideContext = {
    runTour,
    startTour,
    nextStep,
    prevStep,
    endTour,
    setIsAddEventOpen,
    setIsButtonHovered,
    stepIndex,
  };

  return (
    <JoyrideContext.Provider value={joyrideContext}>
      <Joyride
        steps={steps}
        continuous
        showProgress
        run={runTour}
        callback={joyrideCallback}
        stepIndex={stepIndex}
      />
      {children}
    </JoyrideContext.Provider>
  );
};
