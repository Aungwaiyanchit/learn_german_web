"use client";
import { Volume2Icon } from 'lucide-react'

export default function PlayButton({
    letter,
    audio_url
}: { letter: string, audio_url: string }) {
    const playSound = async () => {
        const voices = window.speechSynthesis.getVoices();
        console.log(voices);
        const audio = new Audio(`/${audio_url}`);
        try {
            await audio.play();
        } catch (error) {
            console.error("Error playing sound:", error);
        }
    };

    return (
        <button
            onClick={playSound}
            className="mt-2 p-2 rounded-full bg-primary-foreground hover:bg-primary/40 transition-colors"
            aria-label={`Play sound for ${letter}`}
        >

            <Volume2Icon className='text-gray-500' size={15}/>
        </button>
    )
}
