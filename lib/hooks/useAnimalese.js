import { useState, useEffect, useRef, useCallback } from 'react';

const LETTER_MAP = "abcdefghijklmnopqrstuvwxyz0123456789.,!?";
const LETTER_SECS = 0.15;

export const useAnimalese = (audioPath = '/animalese.wav') => {
    const libraryBufferRef = useRef(null);
    const audioContextRef = useRef(null);
    const currentSourceRef = useRef(null); // Track the currently playing sound

    const [isLoaded, setIsLoaded] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // 1. Load Audio
    useEffect(() => {
        const initAudio = async () => {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            audioContextRef.current = new AudioCtx();
            try {
                const response = await fetch(audioPath);
                const arrayBuffer = await response.arrayBuffer();
                const decodedAudio = await audioContextRef.current.decodeAudioData(arrayBuffer);
                libraryBufferRef.current = decodedAudio;
                setIsLoaded(true);
            } catch (error) {
                console.error("Error loading animalese.wav:", error);
            }
        };
        initAudio();
        return () => {
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
            }
        };
    }, [audioPath]);

    // 2. Speak Function
    const speak = useCallback((text, { pitch = 1.5, speed = 2.0, volume = 0.5, onEnd } = {}) => {
        if (!isLoaded || !libraryBufferRef.current || !audioContextRef.current) return;

        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        // STOP previous sound if it's still playing
        if (currentSourceRef.current) {
            currentSourceRef.current.stop();
            currentSourceRef.current = null;
        }

        // Clean Text
        const cleanText = text
            .replace(/[\p{Extended_Pictographic}]/gu, '')
            .toLowerCase()
            .split('')
            .filter(c => LETTER_MAP.includes(c));

        if (cleanText.length === 0) {
            if (onEnd) onEnd(); // If no text, finish immediately
            return;
        }

        // Processing Logic
        const sourceSamplesPerLetter = Math.floor(LETTER_SECS * libraryBufferRef.current.sampleRate);
        const outputSamplesPerLetter = Math.floor(sourceSamplesPerLetter / speed);
        const totalLength = cleanText.length * outputSamplesPerLetter;

        const outputBuffer = ctx.createBuffer(1, totalLength, libraryBufferRef.current.sampleRate);
        const outputData = outputBuffer.getChannelData(0);
        const libraryData = libraryBufferRef.current.getChannelData(0);

        for (let i = 0; i < cleanText.length; i++) {
            const char = cleanText[i];
            const libraryIndex = LETTER_MAP.indexOf(char);
            const startSample = libraryIndex * sourceSamplesPerLetter;
            for (let j = 0; j < outputSamplesPerLetter; j++) {
                if (startSample + j < libraryData.length) {
                    outputData[i * outputSamplesPerLetter + j] = libraryData[startSample + j];
                }
            }
        }

        // Playback
        const source = ctx.createBufferSource();
        source.buffer = outputBuffer;
        source.playbackRate.value = pitch;

        const gainNode = ctx.createGain();
        gainNode.gain.value = volume;

        source.connect(gainNode);
        gainNode.connect(ctx.destination);

        // --- HANDLING THE END ---
        setIsSpeaking(true);
        currentSourceRef.current = source;

        source.onended = () => {
            setIsSpeaking(false);
            currentSourceRef.current = null;
            if (onEnd) onEnd();
        };

        source.start();

    }, [isLoaded]);

    return { speak, isLoaded, isSpeaking };
};