export class AudioSystem {
    private ctx: AudioContext | null = null;
    private mainGain: GainNode | null = null;
    private musicGain: GainNode | null = null;
    private isPlayingMusic: boolean = false;

    constructor() { }

    private init() {
        if (this.ctx) return;
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.mainGain = this.ctx.createGain();
        this.mainGain.gain.value = 0.3; // Default SFX volume
        this.mainGain.connect(this.ctx.destination);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.value = 0.15; // Lower music volume
        this.musicGain.connect(this.ctx.destination);
    }

    public resume() {
        this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    // --- Sound Effects ---

    public playShoot(type: string = 'BASIC') {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type === 'SNIPER' ? 'sine' : 'square';
        osc.frequency.setValueAtTime(type === 'SNIPER' ? 880 : 440, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(type === 'SNIPER' ? 110 : 880, this.ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

        osc.connect(gain);
        gain.connect(this.mainGain!);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    }

    public playHit() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(this.mainGain!);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }

    public playExplosion() {
        if (!this.ctx) return;
        const bufferSize = this.ctx.sampleRate * 0.4;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, this.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.3);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.mainGain!);

        noise.start();
    }

    public playBuild() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(660, this.ctx.currentTime + 0.2);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

        osc.connect(gain);
        gain.connect(this.mainGain!);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.25);
    }

    public playLifeLost() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(55, this.ctx.currentTime + 0.5);

        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

        osc.connect(gain);
        gain.connect(this.mainGain!);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.5);
    }

    // --- Music ---

    public startMusic() {
        if (this.isPlayingMusic) return;
        this.resume();
        this.isPlayingMusic = true;
        this.playMusicLoop();
    }

    private playMusicLoop() {
        if (!this.isPlayingMusic || !this.ctx) return;

        const now = this.ctx.currentTime;
        const bpm = 120;
        const beatDuration = 60 / bpm;

        // Simple synth-wave bassline
        const sequence = [40, 40, 45, 40, 35, 40, 45, 30]; // Frequencies (Hz)

        sequence.forEach((freq, i) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now + i * beatDuration);

            gain.gain.setValueAtTime(0, now + i * beatDuration);
            gain.gain.linearRampToValueAtTime(0.1, now + i * beatDuration + 0.05);
            gain.gain.linearRampToValueAtTime(0, now + (i + 1) * beatDuration - 0.01);

            const filter = this.ctx!.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(400, now + i * beatDuration);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.musicGain!);

            osc.start(now + i * beatDuration);
            osc.stop(now + (i + 1) * beatDuration);
        });

        // Loop every 8 beats
        setTimeout(() => this.playMusicLoop(), (beatDuration * 8 * 1000) - 50);
    }
}

export const audioSystem = new AudioSystem();
