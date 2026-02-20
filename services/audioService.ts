let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioCtx) {
    // Standard way to create an AudioContext, with a fallback for older browsers.
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

/**
 * Plays a tone with a given frequency, duration, and volume.
 * @param frequency The frequency of the tone in Hz.
 * @param duration The duration of the tone in seconds.
 * @param volume The volume of the tone (0.0 to 1.0).
 * @param type The type of waveform for the oscillator.
 */
const playTone = (frequency: number, duration: number, volume: number, type: OscillatorType = 'sine') => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    // Control the volume
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    // Fade out the sound to avoid clicking
    gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (error) {
    console.error("Failed to play audio:", error);
  }
};

/**
 * Plays a distinct alert sound based on the detected health status.
 * @param status The status string from the AI analysis.
 */
export const playAlertSound = (status: string) => {
    const lowerStatus = status.toLowerCase();

    if (lowerStatus.includes('heatstroke') || lowerStatus.includes('high fever')) {
        // High-pitched, urgent beeps for severe heat-related issues
        playTone(1200, 0.1, 0.4, 'square');
        setTimeout(() => playTone(1200, 0.1, 0.4, 'square'), 150);
        setTimeout(() => playTone(1200, 0.1, 0.4, 'square'), 300);
    } else if (lowerStatus.includes('hypothermia') || lowerStatus.includes('bradycardia')) {
        // Lower-pitched, slower beeps for cold-related issues
        playTone(400, 0.3, 0.5, 'sine');
         setTimeout(() => playTone(400, 0.3, 0.5, 'sine'), 500);
    } else if (lowerStatus.includes('tachycardia')) {
        // Very fast, high-pitched beeps for high heart rate
        playTone(1500, 0.08, 0.3, 'sawtooth');
        setTimeout(() => playTone(1500, 0.08, 0.3, 'sawtooth'), 120);
        setTimeout(() => playTone(1500, 0.08, 0.3, 'sawtooth'), 240);
        setTimeout(() => playTone(1500, 0.08, 0.3, 'sawtooth'), 360);
    }
};
