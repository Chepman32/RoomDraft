/**
 * Capture Store - Zustand
 */

import {create} from 'zustand';
import {ARCaptureData, Point3D} from '@types/index';

interface CaptureState {
  isCapturing: boolean;
  captureMode: 'ar' | 'lidar' | 'manual';
  points: Point3D[];
  confidence: number;
  currentFrame: ARCaptureData | null;
  setCapturing: (capturing: boolean) => void;
  setCaptureMode: (mode: 'ar' | 'lidar' | 'manual') => void;
  addPoints: (points: Point3D[]) => void;
  clearPoints: () => void;
  setCurrentFrame: (frame: ARCaptureData | null) => void;
}

export const useCaptureStore = create<CaptureState>(set => ({
  isCapturing: false,
  captureMode: 'ar',
  points: [],
  confidence: 0,
  currentFrame: null,

  setCapturing: capturing => set({isCapturing: capturing}),

  setCaptureMode: mode => set({captureMode: mode}),

  addPoints: points =>
    set(state => ({
      points: [...state.points, ...points],
    })),

  clearPoints: () => set({points: [], confidence: 0}),

  setCurrentFrame: frame => set({currentFrame: frame}),
}));
