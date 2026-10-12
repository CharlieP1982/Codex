'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
const storageKey='leadershipos-gravity-logo';
const allowedImage=/^data:image\/(png|jpeg|webp);base64,/;
const logoEvent='leadershipos-logo-changed';
export function BrandLogo({position='right'}:{position?:'left'|'right'}){
 const [logo,setLogo]=useState('');const [message,setMessage]=useState('');const input=useRef<HTMLInputElement>(null);
 useEffect(()=>{
  const load=()=>{try{const saved=localStorage.getItem(storageKey);if(saved&&allowedImage.test(saved))setLogo(saved);}catch{setMessage('Your browser cannot remember a logo. You can still choose one for this session.');}};
  const changed=(event:Event)=>{const data=(event as CustomEvent<string>).detail;if(data&&allowedImage.test(data))setLogo(data);};
  load();window.addEventListener('storage',load);window.addEventListener(logoEvent,changed);
  return ()=>{window.removeEventListener('storage',load);window.removeEventListener(logoEvent,changed);};
 },[position]);
 async function choose(file?:File){
  if(!file)return;
  if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>2*1024*1024){setMessage('Choose a PNG, JPG or WebP image smaller than 2 MB.');return;}
  try{
   const data=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(new Error('read'));reader.readAsDataURL(file);});
   if(!allowedImage.test(data))throw new Error('format');
   await new Promise<void>((resolve,reject)=>{const image=new Image();image.onload=()=>resolve();image.onerror=()=>reject(new Error('image'));image.src=data;});
   setLogo(data);window.dispatchEvent(new CustomEvent(logoEvent,{detail:data}));
   try{localStorage.setItem(storageKey,data);setMessage('Logo saved in this browser.');}catch{setMessage('Logo shown for this session. Browser storage is unavailable or full.');}
  }catch{setMessage('That image could not be opened. Please try another PNG or JPG.');}
 }
 return <div className="text-left">
  <Link href="/" aria-label="Gravity Media LeadershipOS home">{logo?<img src={logo} alt="Gravity Media" className="h-auto max-h-12 w-full max-w-[220px] object-contain object-left"/>:<span className="block font-black tracking-wide text-[19px]">GRAVITY MEDIA</span>}<span className="block mt-2 text-sm font-semibold tracking-tight">LeadershipOS</span></Link>
  <input ref={input} type="file" accept="image/png,image/jpeg,image/webp" aria-label="Choose Gravity Media logo" className="sr-only" onChange={event=>{void choose(event.target.files?.[0]);event.target.value='';}}/>
  <button type="button" className="mt-1 text-xs underline text-[#69616d] p-1" onClick={()=>input.current?.click()}>{logo?'Change logo':'Choose logo'}</button>
  {message&&<p role="status" className="text-xs muted mt-1 max-w-[260px]">{message}</p>}
 </div>;
}
