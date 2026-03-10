import React, { useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

const SYMBOLS = ['♪', '♫', '♬', '♭', '♮', '♯', '𝄞', '𝄢'];

export default function MusicCursor() {
    const { isDark } = useTheme();

    useEffect(() => {
        let lastTime = 0;

        // We bind to the document level to ensure it captures everywhere
        const handleMouseMove = (e) => {
            const now = Date.now();
            // Throttle particle creation for performance (1 spawn every 80ms max)
            if (now - lastTime < 80) return;
            lastTime = now;

            // Small chance to skip spawning to make it feel more organic
            if (Math.random() > 0.8) return;

            createNote(e.clientX, e.clientY);
        };

        const createNote = (x, y) => {
            const note = document.createElement('div');

            // Randomly select a musical symbol
            const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            note.innerText = symbol;

            // Initial styles for the note
            note.className = 'pointer-events-none fixed z-[9999] select-none font-bold transition-all';

            const size = Math.floor(Math.random() * 12) + 16; // Random size between 16px and 28px
            const color = isDark ? 'rgba(225, 194, 179, 0.7)' : 'rgba(9, 28, 42, 0.7)'; // Matches Theme

            // Apply base styles directly
            note.style.left = `${x}px`;
            note.style.top = `${y}px`;
            note.style.fontSize = `${size}px`;
            note.style.color = color;
            note.style.textShadow = isDark ? '0px 0px 8px rgba(225,194,179,0.3)' : '0px 0px 8px rgba(9,28,42,0.2)';

            // Starting transformation (centered on cursor)
            note.style.transform = 'translate(-50%, -50%) scale(0.5)';
            note.style.opacity = '1';

            // We use standard CSS transition for the smooth floating off effect
            note.style.transition = 'transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 1.2s ease-out';

            document.body.appendChild(note);

            // Force a reflow so the transition actually triggers
            void note.offsetWidth;

            // Random flight coordinates
            const floatX = (Math.random() - 0.5) * 100; // Float left or right by up to 50px
            const floatY = -(Math.random() * 80 + 40); // Float UP by 40px to 120px
            const rotation = (Math.random() - 0.5) * 90; // Rotate randomly

            // Trigger animation
            note.style.transform = `translate(calc(-50% + ${floatX}px), calc(-50% + ${floatY}px)) scale(1.5) rotate(${rotation}deg)`;
            note.style.opacity = '0';

            // Cleanup DOM node after transition finishes
            setTimeout(() => {
                if (note.parentNode) {
                    note.parentNode.removeChild(note);
                }
            }, 1200);
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isDark]);

    return null; // This component handles DOM directly, renders nothing itself
}
