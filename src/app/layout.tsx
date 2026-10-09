import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'LeadershipOS | Lead with intention',description:'A private local leadership workspace.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
