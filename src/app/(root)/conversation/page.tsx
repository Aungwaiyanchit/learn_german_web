'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, User, UserCheck, ChevronDown } from 'lucide-react';

const GermanConversationPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSpeaker, setCurrentSpeaker] = useState(null);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [voices, setVoices] = useState([]);
    const [selectedVoices, setSelectedVoices] = useState({
        speaker1: null,
        speaker2: null
    });
    const [autoScroll, setAutoScroll] = useState(true);

    const synthRef = useRef(null);
    const utteranceRef = useRef(null);
    const messagesEndRef = useRef(null);
    const messageRefs = useRef([]);

    const conversation = [
        {
            "speaker": "speaker1",
            "gender": "male",
            "text": "Herr Müller kauft ein Buch, und dann kauft er noch ein Buch. Jetzt hat er zwei Bücher.",
            "translation": "Mr. Müller buys a book, and then he buys another book. Now he has two books."
        },
        {
            "speaker": "speaker1",
            "gender": "male",
            "text": "Der Verkäufer schreibt eine Rechnung.",
            "translation": "The salesman writes a bill."
        },
        {
            "speaker": "speaker1",
            "gender": "male",
            "text": "Herr Müller bezahlt die Bücher.",
            "translation": "Mr. Müller pays for the books."
        },
        {
            "speaker": "speaker1",
            "gender": "female",
            "text": "Rita kauft auch ein Buch und dann noch einen Füller und eine Karte. Was bezahlt sie?",
            "translation": "Rita also buys a book and then a pen and a card. What does she pay?"
        },
        {
            "speaker": "speaker1",
            "gender": "male",
            "text": "Richard braucht Briefpapier. Aber das hier ist zu teuer. Es kostet 26 Euro 80. Richard schreibt nicht so viel.",
            "translation": "Richard needs writing paper. But this one here is too expensive. It costs 26 euros 80. Richard does not write so much."
        },
        {
            "speaker": "speaker1",
            "gender": "male",
            "text": "Die Karten sind billig. Sechs Karten kosten nur einen Euro.",
            "translation": "The cards are cheap. Six cards cost only one euro."
        },
        {
            "speaker": "speaker1",
            "gender": "male",
            "text": "Peter schreibt keine Briefe, er schreibt nur Karten.",
            "translation": "Peter does not write letters, he only writes cards."
        },
        {
            "speaker": "speaker1",
            "gender": "male",
            "text": "Richard kauft das Briefpapier hier. Es ist nicht so teuer.",
            "translation": "Richard buys this writing paper here. It is not so expensive."
        },
        {
            "speaker": "speaker1",
            "gender": "male",
            "text": "Peter möchte sechs Karten. Er bezahlt die Karten und das Briefpapier.",
            "translation": "Peter would like six cards. He pays for the cards and the writing paper."
        }
    ]


    // // Sample German conversation
    // const conversation = [
    //     {
    //         speaker: 'speaker1',
    //         text: 'Hallo! Wie geht es dir heute?',
    //         translation: 'Hello! How are you today?'
    //     },
    //     {
    //         speaker: 'speaker2',
    //         text: 'Mir geht es gut, danke! Und dir?',
    //         translation: 'I\'m doing well, thank you! And you?'
    //     },
    //     {
    //         speaker: 'speaker1',
    //         text: 'Auch gut! Was hast du am Wochenende gemacht?',
    //         translation: 'Also good! What did you do on the weekend?'
    //     },
    //     {
    //         speaker: 'speaker2',
    //         text: 'Ich war im Kino und habe einen Film gesehen.',
    //         translation: 'I went to the cinema and saw a movie.'
    //     },
    //     {
    //         speaker: 'speaker1',
    //         text: 'Das klingt toll! Welchen Film hast du gesehen?',
    //         translation: 'That sounds great! Which movie did you see?'
    //     },
    //     {
    //         speaker: 'speaker2',
    //         text: 'Ich habe den neuen Actionfilm gesehen. Er war sehr spannend!',
    //         translation: 'I saw the new action movie. It was very exciting!'
    //     },
    //     {
    //         speaker: 'speaker1',
    //         text: 'Das freut mich zu hören. Vielleicht gehe ich auch bald ins Kino.',
    //         translation: 'I\'m glad to hear that. Maybe I\'ll go to the cinema soon too.'
    //     },
    //     {
    //         speaker: 'speaker2',
    //         text: 'Das solltest du tun! Der Film ist wirklich empfehlenswert.',
    //         translation: 'You should do that! The movie is really recommendable.'
    //     }
    // ];

    // Initialize refs for each message
    useEffect(() => {
        messageRefs.current = messageRefs.current.slice(0, conversation.length);
    }, [conversation.length]);

    // Auto-scroll to current message
    useEffect(() => {
        if (autoScroll && currentMessageIndex >= 0) {
            const currentMessageRef = messageRefs.current[currentMessageIndex];
            if (currentMessageRef) {
                currentMessageRef.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                });
            }
        }
    }, [currentMessageIndex, autoScroll]);

    // Scroll to bottom when conversation starts
    useEffect(() => {
        if (isPlaying && autoScroll) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isPlaying, autoScroll]);

    // Load available voices
    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            const germanVoices = availableVoices.filter(voice =>
                voice.lang.includes('de') || voice.lang.includes('DE')
            );

            setVoices(germanVoices);

            // Auto-select German voices if available
            if (germanVoices.length > 0) {
                const maleVoice = germanVoices.find(voice =>
                    voice.name.toLowerCase().includes('male') ||
                    voice.name.toLowerCase().includes('mann') ||
                    voice.name.toLowerCase().includes('google m')
                );
                const femaleVoice = germanVoices.find(voice =>
                    voice.name.toLowerCase().includes('female') ||
                    voice.name.toLowerCase().includes('frau') ||
                    voice.name.toLowerCase().includes('google f')
                );

                setSelectedVoices({
                    speaker1: femaleVoice || germanVoices[0],
                    speaker2: maleVoice || (germanVoices[1] || germanVoices[0])
                });
            }
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            if (utteranceRef.current) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const speakText = (text, voice) => {
        if (utteranceRef.current) {
            window.speechSynthesis.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voice;
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => {
            setIsPlaying(false);
            setCurrentSpeaker(null);
        };
        utterance.onerror = () => {
            setIsPlaying(false);
            setCurrentSpeaker(null);
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    };

    const playConversation = async () => {
        if (isPlaying) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            setCurrentSpeaker(null);
            return;
        }

        setIsPlaying(true);

        for (let i = 0; i < conversation.length; i++) {
            setCurrentMessageIndex(i);
            const message = conversation[i];
            const voice = selectedVoices[message.speaker];

            if (!voice) {
                alert(`Please select a voice for ${message.speaker}`);
                setIsPlaying(false);
                return;
            }

            setCurrentSpeaker(message.speaker);

            await new Promise((resolve) => {
                const utterance = new SpeechSynthesisUtterance(message.text);
                utterance.voice = voice;
                utterance.rate = 0.9;
                utterance.onend = resolve;
                utterance.onerror = resolve;
                window.speechSynthesis.speak(utterance);
            });

            // Add a small pause between messages
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        setIsPlaying(false);
        setCurrentSpeaker(null);
        setCurrentMessageIndex(0);
    };

    const playSingleMessage = (messageIndex) => {
        const message = conversation[messageIndex];
        const voice = selectedVoices[message.speaker];

        if (voice) {
            speakText(message.text, voice);
            setCurrentMessageIndex(messageIndex);
            setCurrentSpeaker(message.speaker);
        }
    };

    const handleVoiceChange = (speaker, voiceName) => {
        const voice = voices.find(v => v.name === voiceName);
        setSelectedVoices(prev => ({
            ...prev,
            [speaker]: voice
        }));
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg h-screen flex flex-col">
            <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">
                German Conversation Player
            </h1>

            {/* Voice Selection */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h2 className="text-lg font-semibold mb-3">Voice Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium">
                            <UserCheck className="w-4 h-4 mr-2 text-blue-500" />
                            Speaker 1 (Female)
                        </label>
                        <select
                            className="w-full p-2 border rounded-md"
                            value={selectedVoices.speaker1?.name || ''}
                            onChange={(e) => handleVoiceChange('speaker1', e.target.value)}
                        >
                            <option value="">Select voice...</option>
                            {voices.map(voice => (
                                <option key={voice.name} value={voice.name}>
                                    {voice.name} ({voice.lang})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium">
                            <User className="w-4 h-4 mr-2 text-green-500" />
                            Speaker 2 (Male)
                        </label>
                        <select
                            className="w-full p-2 border rounded-md"
                            value={selectedVoices.speaker2?.name || ''}
                            onChange={(e) => handleVoiceChange('speaker2', e.target.value)}
                        >
                            <option value="">Select voice...</option>
                            {voices.map(voice => (
                                <option key={voice.name} value={voice.name}>
                                    {voice.name} ({voice.lang})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Auto-scroll toggle */}
                <div className="flex items-center mt-3">
                    <input
                        type="checkbox"
                        id="autoScroll"
                        checked={autoScroll}
                        onChange={(e) => setAutoScroll(e.target.checked)}
                        className="mr-2"
                    />
                    <label htmlFor="autoScroll" className="text-sm font-medium">
                        Auto-scroll to current message
                    </label>
                </div>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={playConversation}
                    className={`flex items-center px-6 py-3 rounded-full font-semibold ${isPlaying
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-blue-500 hover:bg-blue-600'
                        } text-white transition-colors`}
                >
                    {isPlaying ? (
                        <>
                            <Pause className="w-5 h-5 mr-2" />
                            Stop Conversation
                        </>
                    ) : (
                        <>
                            <Play className="w-5 h-5 mr-2" />
                            Play Full Conversation
                        </>
                    )}
                </button>

                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                        {currentMessageIndex + 1} / {conversation.length}
                    </span>
                    <button
                        onClick={scrollToBottom}
                        className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
                        title="Scroll to bottom"
                    >
                        <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Conversation Container */}
            <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="space-y-4">
                    {conversation.map((message, index) => (
                        <div
                            key={index}
                            ref={el => messageRefs.current[index] = el}
                            className={`flex ${message.speaker === 'speaker1' ? 'justify-start' : 'justify-end'
                                } transition-all duration-300`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl p-4 relative border-2 transition-all duration-300 ${currentMessageIndex === index && isPlaying
                                        ? message.speaker === 'speaker1'
                                            ? 'bg-blue-200 border-blue-400 shadow-lg scale-105'
                                            : 'bg-green-200 border-green-400 shadow-lg scale-105'
                                        : message.speaker === 'speaker1'
                                            ? 'bg-blue-100 border-blue-200'
                                            : 'bg-green-100 border-green-200'
                                    } ${message.speaker === 'speaker1'
                                        ? 'rounded-bl-none'
                                        : 'rounded-br-none'
                                    }`}
                            >
                                {/* Speaker Indicator */}
                                <div className={`flex items-center mb-2 ${message.speaker === 'speaker1' ? 'text-blue-600' : 'text-green-600'
                                    }`}>
                                    {message.speaker === 'speaker1' ? (
                                        <UserCheck className="w-4 h-4 mr-2" />
                                    ) : (
                                        <User className="w-4 h-4 mr-2" />
                                    )}
                                    <span className="font-semibold">
                                        {message.speaker === 'speaker1' ? 'Speaker 1' : 'Speaker 2'}
                                        {currentMessageIndex === index && isPlaying && (
                                            <span className="ml-2 text-xs bg-yellow-500 text-white px-2 py-1 rounded-full animate-pulse">
                                                Speaking...
                                            </span>
                                        )}
                                    </span>
                                </div>

                                {/* Message Text */}
                                <p className="text-gray-800 text-lg mb-2 font-medium">
                                    {message.text}
                                </p>

                                {/* Translation */}
                                <p className="text-gray-600 text-sm italic border-t pt-2">
                                    {message.translation}
                                </p>

                                {/* Play Button for Individual Message */}
                                <button
                                    onClick={() => playSingleMessage(index)}
                                    disabled={isPlaying && currentMessageIndex === index}
                                    className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${message.speaker === 'speaker1'
                                            ? 'bg-blue-200 hover:bg-blue-300 text-blue-700'
                                            : 'bg-green-200 hover:bg-green-300 text-green-700'
                                        } ${isPlaying && currentMessageIndex === index ? 'opacity-50' : ''}`}
                                    title="Play this message"
                                >
                                    <Volume2 className="w-4 h-4" />
                                </button>

                                {/* Message Index */}
                                <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${message.speaker === 'speaker1'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-green-500 text-white'
                                    }`}>
                                    {index + 1}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Invisible element for scrolling to bottom */}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Progress Indicator */}
            <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-medium">
                        {Math.round(((currentMessageIndex + 1) / conversation.length) * 100)}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentMessageIndex + 1) / conversation.length) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Instructions */}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-1 text-sm">How to use:</h3>
                <ul className="text-yellow-700 text-xs space-y-1">
                    <li>• Select German voices for both speakers</li>
                    <li>• Click Play Full Conversation for auto-scrolling dialogue</li>
                    <li>• Click individual message icons to play specific lines</li>
                    <li>• Current message is highlighted with scale effect</li>
                </ul>
            </div>
        </div>
    );
};

export default GermanConversationPlayer;