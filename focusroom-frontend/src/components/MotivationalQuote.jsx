import { useState, useEffect } from 'react';

const quotes = [
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
    { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
    { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
    { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
    { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
    { text: "Great things never come from comfort zones.", author: "Unknown" },
    { text: "Dream it. Wish it. Do it.", author: "Unknown" },
    { text: "Study hard what interests you the most in the most undisciplined, irreverent and original manner possible.", author: "Richard Feynman" },
    { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
    { text: "Let your joy be in your journey, not in the destination.", author: "Albert Einstein" },
];

const MotivationalQuote = () => {
    const [quote, setQuote] = useState(null);

    useEffect(() => {
        const idx = Math.floor(Math.random() * quotes.length);
        setQuote(quotes[idx]);
    }, []);

    if (!quote) return null;

    return (
        <div className="bg-white border border-gray-200 rounded-xl px-6 py-4 flex items-center space-x-4 shadow-[0_2px_8px_rgb(0,0,0,0.04)]">
            <div className="text-red-500 text-3xl shrink-0 font-serif leading-none mt-2">"</div>
            <div className="flex-1">
                <p className="text-sm font-medium text-black leading-relaxed italic">{quote.text}</p>
                <p className="text-xs font-semibold text-gray-500 mt-1">— {quote.author}</p>
            </div>
        </div>
    );
};

export default MotivationalQuote;
