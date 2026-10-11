/**
 * Mock audio processing logic based on amplitude and zero crossing rate
 */
export const analyzeAudio = (audioData: Float32Array): {
  pitchStability: number;
  toneConsistency: number;
  breathControl: number;
  overall: number;
  tip: string;
} => {
  // In a real app, we'd do FFT and more complex analysis.
  // Here we simulate based on the provided metrics.
  
  // 1. Amplitude Variance (related to breath control and tone consistency)
  let sum = 0;
  let sumSq = 0;
  for (let i = 0; i < audioData.length; i++) {
    const val = Math.abs(audioData[i]);
    sum += val;
    sumSq += val * val;
  }
  const mean = sum / audioData.length;
  const variance = (sumSq / audioData.length) - (mean * mean);
  
  // 2. Zero Crossing Rate (related to pitch stability/noise)
  let zeroCrossings = 0;
  for (let i = 1; i < audioData.length; i++) {
    if ((audioData[i] >= 0 && audioData[i - 1] < 0) || (audioData[i] < 0 && audioData[i - 1] >= 0)) {
      zeroCrossings++;
    }
  }
  const zcr = zeroCrossings / audioData.length;

  // Normalize metrics to 0-100 scores
  // These are heuristic mappings for the "mock" analysis
  const breathControl = Math.max(30, Math.min(95, 100 - (variance * 1000)));
  const toneConsistency = Math.max(40, Math.min(98, 100 - (mean * 50)));
  const pitchStability = Math.max(35, Math.min(92, 100 - (zcr * 500)));
  
  const overall = Math.round((pitchStability + toneConsistency + breathControl) / 3);

  const tips = {
    pitchStability: "Focus on matching your pitch to a reference note and maintaining it without vibrato initially.",
    toneConsistency: "Try to keep your vowel shapes consistent throughout your phrases for a more even tone.",
    breathControl: "Work on breath support from your diaphragm to sustain longer phrases more steadily."
  };

  let lowestCategory: 'pitchStability' | 'toneConsistency' | 'breathControl' = 'pitchStability';
  let minScore = pitchStability;

  if (toneConsistency < minScore) {
    minScore = toneConsistency;
    lowestCategory = 'toneConsistency';
  }
  if (breathControl < minScore) {
    minScore = breathControl;
    lowestCategory = 'breathControl';
  }

  return {
    pitchStability: Math.round(pitchStability),
    toneConsistency: Math.round(toneConsistency),
    breathControl: Math.round(breathControl),
    overall,
    tip: tips[lowestCategory]
  };
};
