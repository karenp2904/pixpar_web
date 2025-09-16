export default interface TransformValues {
  brightness: number;
  contrast: number;
  saturation: number;
  rotation: number;
  format: string;
  grayscale: boolean;
  flipH: boolean;
  flipV: boolean;
  blur: number;
  sharpen: number;
  resizeWidth?: number;
  resizeHeight?: number;
  crop?: { x: number; y: number; width: number; height: number };
  watermarkText?: string;
}