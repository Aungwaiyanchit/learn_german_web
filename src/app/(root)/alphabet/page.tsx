import { AlphabetCard } from '@/components/features/alphabet/AlphabetCard';
import AlphabetContainer from '@/components/features/alphabet/AlphabetContainer';
import React from 'react'

const BASIC_ALPHABET = [
    { "letter": "A", "pronunciation": "aa", "audio_url": "audio/alphabet/a.mp3" },
    { "letter": "B", "pronunciation": "bee", "audio_url": "audio/alphabet/b.mp3" },
    { "letter": "C", "pronunciation": "tsee", "audio_url": "audio/alphabet/c.mp3" },
    { "letter": "D", "pronunciation": "dee", "audio_url": "audio/alphabet/d.mp3" },
    { "letter": "E", "pronunciation": "ee", "audio_url": "audio/alphabet/e.mp3" },
    { "letter": "F", "pronunciation": "eff", "audio_url": "audio/alphabet/f.mp3" },
    { "letter": "G", "pronunciation": "gee", "audio_url": "audio/alphabet/g.mp3" },
    { "letter": "H", "pronunciation": "haa", "audio_url": "audio/alphabet/h.mp3" },
    { "letter": "I", "pronunciation": "ii", "audio_url": "audio/alphabet/i.mp3" },
    { "letter": "J", "pronunciation": "jott", "audio_url": "audio/alphabet/j.mp3" },
    { "letter": "K", "pronunciation": "kaa", "audio_url": "audio/alphabet/k.mp3" },
    { "letter": "L", "pronunciation": "ell" , "audio_url": "audio/alphabet/l.mp3"},
    { "letter": "M", "pronunciation": "emm", "audio_url": "audio/alphabet/m.mp3" },
    { "letter": "N", "pronunciation": "enn", "audio_url": "audio/alphabet/n.mp3" },
    { "letter": "O", "pronunciation": "oo", "audio_url": "audio/alphabet/o.mp3" },
    { "letter": "P", "pronunciation": "pee", "audio_url": "audio/alphabet/p.mp3" },
    { "letter": "Q", "pronunciation": "kuu", "audio_url": "audio/alphabet/q.mp3" },
    { "letter": "R", "pronunciation": "err", "audio_url": "audio/alphabet/r.mp3" },
    { "letter": "S", "pronunciation": "ess", "audio_url": "audio/alphabet/s.mp3" },
    { "letter": "T", "pronunciation": "tee", "audio_url": "audio/alphabet/t.mp3" },
    { "letter": "U", "pronunciation": "uu", "audio_url": "audio/alphabet/u.mp3" },
    { "letter": "V", "pronunciation": "fau", "audio_url": "audio/alphabet/v.mp3" },
    { "letter": "W", "pronunciation": "wee", "audio_url": "audio/alphabet/w.mp3" },
    { "letter": "X", "pronunciation": "iks", "audio_url": "audio/alphabet/x.mp3" },
    { "letter": "Y", "pronunciation": "üpsilon", "audio_url": "audio/alphabet/y.mp3" },
    { "letter": "Z", "pronunciation": "sett", "audio_url": "audio/alphabet/z.mp3" },


];
const Umlaut = [
    { "letter": "Ä", "pronunciation": "ae", "audio_url": "audio/alphabet/ae.mp3" },
    { "letter": "Ö", "pronunciation": "oe", "audio_url": "audio/alphabet/oe.mp3" },
    { "letter": "Ü", "pronunciation": "ue", "audio_url": "audio/alphabet/ue.mp3" },
    { "letter": "ẞ", "pronunciation": "eszet", "audio_url": "audio/alphabet/eszet.mp3" }
]


const Page: React.FC = () => {
    const firstPart = BASIC_ALPHABET.slice(0, 24);
    const lastPart = BASIC_ALPHABET.slice(24);

    return (
        <div className="">
            <section>
                <h1 className="text-2xl font-bold">Das Alphabet</h1>
                <p>
                    The alphabet consists of 26 letters, similar to the English alphabet.
                </p>
                <AlphabetContainer>
                        <div className="responsive-grid">
                            {firstPart.map((item) => (
                                <AlphabetCard key={item.letter} {...item} />
                            ))}
                        </div>
                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                            {lastPart.map((item) => (
                                <AlphabetCard key={item.letter} {...item}  />
                            ))}
                        </div>
                </AlphabetContainer>
            </section>

            <section>
                <h2 className="text-xl font-semibold mt-6">Umlauts and Special Characters</h2>
                <p>
                    In addition to the basic letters, the German alphabet includes umlauts and a special character:
                </p>
                <AlphabetContainer >
                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                            {Umlaut.map((item) => (
                                <AlphabetCard key={item.letter} {...item} />
                            ))}
                        </div>
                </AlphabetContainer>
            </section>
        </div>
    );
};




export default Page