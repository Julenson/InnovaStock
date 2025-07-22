import React, { ImgHTMLAttributes } from 'react';
import logo from './images/descarga.png';

export function InnovaSportLogo(props: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img 
      src={logo.src} 
      alt="Innova-Sport Logo" 
      {...props}
    />
  );
}
