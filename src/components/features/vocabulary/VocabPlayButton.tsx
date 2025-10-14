import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';
import React from 'react'

function VocabPlayButton({ word }: { word: string }) {
    const speakWord = async () => {
        if ("speechSynthesis" in window) {
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = "de-DE";
            window.speechSynthesis.speak(utterance);
        } else {
            alert("Sorry, your browser does not support speech synthesis.");
        }
    };
    return (
        <Button
            size="icon"
            variant="ghost"
            onClick={speakWord}
        >
            <Volume2 className="w-5 h-5" />
        </Button>
    )
}

export default VocabPlayButton