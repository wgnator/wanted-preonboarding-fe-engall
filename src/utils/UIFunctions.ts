export const hasClickedOutsideElement = (event: MouseEvent, targetElement: HTMLElement | null) => {
  return !!(targetElement && !targetElement.contains(<Node>event?.target));
};
