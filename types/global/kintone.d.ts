declare const kintone: {
  app: {
    getId(): number | null;
    getHeaderSpaceElement(): HTMLElement | null;
  };
  events: {
    on: (
      eventType: string | string[],
      callback: (event: unknown) => unknown
    ) => void;
  };
};
