"use client"
import React , { useEffect , useState } from 'react';
import Image from 'next/image';
import { useTransition, animated } from 'react-spring';
interface Feedback {
  id: number;
  username: string;
  text: string;
  rate: number;
  course: string;
}

// Dummy feedback data
const feedBacks: Feedback[] = [
  { id: 1, username: "Samandar Jumanov", text: "It is better to use this app rather than not using it.", rate: 4, course: "Dropshipping" },
  { id: 2, username: "John Doe", text: "This app has been incredibly useful for my daily tasks.", rate: 5, course: "Sales" },
  { id: 3, username: "Jane Smith", text: "I found the app to be useful, but it needs some improvements.", rate: 3, course: "Online" },
];

const Stars = ({ rate }: { rate: number }) => {
  return (
    <div className="flex text-yellow-400">
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index}>{index < rate ? '★' : '☆'}</span>
      ))}
    </div>
  );
};

export const HeadContent = () => {
  const [index, setIndex] = useState(0);

 useEffect(() => {
    const interval = setInterval(() => {
      setIndex((state) => (state + 1) % feedBacks.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const transitions = useTransition(index, {
    from: { opacity: 0, transform: 'translate3d(100%,0,0)' },
    enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
    keys: index,
  });

  return (
    <div className="w-screen  bg-slate-700 text-white flex justify-center items-center gap-8 p-4 ">
      {transitions((style, i) => (
        <animated.div style={style} className="flex flex-col md:flex-row items-center gap-4 p-4 w-auto h-auto">
          <div className="w-48 h-48 md:w-64 md:h-64 relative rounded-full overflow-hidden border-4 border-white">
            <Image src="/user.jpeg" layout="fill" objectFit="cover" alt='User image' />
          </div>
          <div className="space-y-4 w-80 h-89">
            <h2 className="text-xl md:text-2xl font-semibold">{feedBacks[i].username}</h2>
            <p className="text-sm md:text-base">{feedBacks[i].text}</p>
            <Stars rate={feedBacks[i].rate} />
            <button className="mt-2 px-4 py-2 bg-blue-500 rounded hover:bg-blue-700 transition-colors">{feedBacks[i].course}</button>
          </div>
        </animated.div>
      ))}


    </div>
  );
};
