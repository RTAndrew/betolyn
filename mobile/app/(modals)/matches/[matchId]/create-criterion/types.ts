export interface ICreateCriterionScreen<T = unknown> {
  data: T;
  onDataCaptureNext: (
    type: 'market-configuration' | 'outcomes',
    data: T,
    triggerSubmit?: boolean
  ) => void;
}

export interface ICreateCriterionScreenRef {
  handleNext: () => boolean;
}
