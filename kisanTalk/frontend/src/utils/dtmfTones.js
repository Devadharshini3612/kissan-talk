// DTMF (Dual-Tone Multi-Frequency) tone generator for button phone simulation
// This creates realistic phone keypad sounds

export const playDTMFTone = (key) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // DTMF frequency pairs for each key
    const dtmfFrequencies = {
        '1': [697, 1209],
        '2': [697, 1336],
        '3': [697, 1477],
        '4': [770, 1209],
        '5': [770, 1336],
        '6': [770, 1477],
        '7': [852, 1209],
        '8': [852, 1336],
        '9': [852, 1477],
        '*': [941, 1209],
        '0': [941, 1336],
        '#': [941, 1477]
    };

    const frequencies = dtmfFrequencies[key];
    if (!frequencies) return;

    const duration = 0.15; // 150ms tone duration
    const [freq1, freq2] = frequencies;

    // Create two oscillators for the two frequencies
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator1.frequency.value = freq1;
    oscillator2.frequency.value = freq2;

    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Set volume
    gainNode.gain.value = 0.1;

    // Play the tone
    const now = audioContext.currentTime;
    oscillator1.start(now);
    oscillator2.start(now);
    oscillator1.stop(now + duration);
    oscillator2.stop(now + duration);
};

// Play ringing tone
export const playRingingTone = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 440; // A4 note
    gainNode.gain.value = 0.1;

    const now = audioContext.currentTime;

    // Ring pattern: 2 seconds on, 4 seconds off
    oscillator.start(now);
    gainNode.gain.setValueAtTime(0.1, now);
    gainNode.gain.setValueAtTime(0, now + 2);
    oscillator.stop(now + 2);
};

// Play busy tone
export const playBusyTone = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 480; // Busy tone frequency
    gainNode.gain.value = 0.1;

    const now = audioContext.currentTime;

    // Busy pattern: 0.5s on, 0.5s off, repeat
    oscillator.start(now);
    for (let i = 0; i < 3; i++) {
        gainNode.gain.setValueAtTime(0.1, now + i);
        gainNode.gain.setValueAtTime(0, now + i + 0.5);
    }
    oscillator.stop(now + 3);
};

// Play call connected tone
export const playConnectedTone = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 1000; // 1kHz
    gainNode.gain.value = 0.1;

    const now = audioContext.currentTime;
    oscillator.start(now);
    oscillator.stop(now + 0.2); // Short beep
};

// Play call ended tone
export const playCallEndedTone = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 350; // Lower frequency for end
    gainNode.gain.value = 0.1;

    const now = audioContext.currentTime;
    oscillator.start(now);
    oscillator.stop(now + 0.5); // Longer beep
};
