"use client";

import React from 'react';
import { FaInstagram, FaPhone, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-slate-500 w-full  p-4 flex flex-col items-center gap-4">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
          <FaInstagram size={24} />
          <span>Instagram</span>
        </a>
        
        <a href="tel:+1234567890" className="flex items-center gap-2">
          <FaPhone size={24} />
          <span>+1 234 567 890</span>
        </a>
        
        <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
          <FaYoutube size={24} />
          <span>YouTube</span>
        </a>
      </div>
      <div className="text-center">
        © {new Date().getFullYear()} Your Brand. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
