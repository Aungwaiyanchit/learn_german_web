import PlayButton from "./PlayButton";

export type AlphabetCardProps = {
    letter: string;
    pronunciation: string;
    audio_url: string;
};

export const AlphabetCard = ({ letter, pronunciation, audio_url }: AlphabetCardProps) => {
    return (
        <div
            className="bg-white rounded-lg shadow-md p-5 flex flex-col items-center transition-transform font-sans w-[120px]  hover:scale-105"
        >
            <span className="text-4xl font-bold text-primary mb-2 tracking-wide">
                {letter}
            </span>
            <span className="text-base text-slate-700 opacity-85">
                {pronunciation}
            </span>
            <PlayButton letter={letter} audio_url={audio_url} />
        </div>
    )
}