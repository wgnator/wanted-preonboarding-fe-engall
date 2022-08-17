import React, { useEffect } from "react";

export default function useDetectOutsideClick(targetElements: React.RefObject<HTMLElement | null>[], nextAction: () => void) {
  useEffect(() => {
    const hasClickedOutsideElement = (event: MouseEvent, targetElement: HTMLElement | null) => {
      return !!(targetElement && !targetElement.contains(<Node>event?.target));
    };
    const clickedOutsideElementListener = (event: MouseEvent) => {
      const hasClickedOutsideAllElements = targetElements.map((ref) => hasClickedOutsideElement(event, ref.current)).includes(false) ? false : true;
      if (hasClickedOutsideAllElements) nextAction();
    };
    window.addEventListener("click", clickedOutsideElementListener);
    return () => window.removeEventListener("click", clickedOutsideElementListener);
  }, []);
}
