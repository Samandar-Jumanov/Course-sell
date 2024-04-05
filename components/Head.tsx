"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTransition, animated } from 'react-spring';
import { feedBacks } from './feedbacksData';

const Stars = ({ rate }: { rate: number }) => (
  <div className="flex text-yellow-400">
    {Array.from({ length: 5 }, (_, index) => (
      <span key={index}>{index < rate ? '★' : '☆'}</span>
    ))}
  </div>
);

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
    <div className="w-full bg-slate-200 text-black flex justify-center items-center p-4 md:gap-8">
      {transitions((style, i) => (
        <animated.div style={style} className="flex flex-col md:flex-row items-center gap-4 p-4 bg-slate-600 rounded-e-xl">
          <div className="w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 relative rounded-full overflow-hidden border-4 border-white">
            <Image src="/user.jpeg" layout="fill" objectFit="cover" alt='User image' />
          </div>
          <div className="space-y-4">
            <h2 className="text-lg md:text-xl lg:text-2xl font-semibold">{feedBacks[i].username}</h2>
            <p className="text-xs md:text-sm lg:text-base">{feedBacks[i].text}</p>
            <Stars rate={feedBacks[i].rate} />
            <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors text-xs md:text-sm lg:text-base">{feedBacks[i].course}</button>
          </div>
        </animated.div>
      ))}
    </div>
  );
};
