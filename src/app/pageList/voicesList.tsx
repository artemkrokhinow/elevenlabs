"use client"
import React, {useState, useEffect} from 'react';
import Languages from "../array/Languages";
import Image from 'next/image';
import styles from '../home.module.css';
import FavoriteStar from "./star/FavoriteStar"


export interface Voice {
  voiceId: string;
  name: string;
  category: string;
  previewUrl: string;
}
interface VoicesListProps {
    onVoiceClick: (voiceId: string) => void;
    selectedVoiceId: string | null;
    children: React.ReactNode;
    onToggleFavorite: (voiceId : string) => void;
    favoriteVoiceString: string[];
    onVoicesLoaded: (loadedVoices: Voice[]) => void
}
 

export default function VoicesList({ onVoiceClick, selectedVoiceId, children, onToggleFavorite, favoriteVoiceString, onVoicesLoaded }: VoicesListProps) {
const [voices, setVoices] = useState<Voice[]>([])


    useEffect(()=>{
     const fetchVoices = async ()=>{
      const response = await fetch('./api/generate-speech',{
          method : 'GET' })
      
      if(!response.ok){ throw new Error('fetch GET voices fail') } 
      const data = await response.json()
      setVoices(data)
      onVoicesLoaded(data)
       console.log(data)
    }
    fetchVoices()
}, [])
    return (
        <>
            {voices.map((voice) => {
                const isSelected = selectedVoiceId === voice.voiceId;
                const langInfo = Languages.find((lang) => lang.aviableVoice.includes(voice.name));

                return (
                    <div key={voice.name}>
                        <button
                            onClick={() => onVoiceClick(voice.voiceId)}
                            className={`${styles.voiceButton} ${isSelected ? styles.selected : ''}`}
                        >  <span style={{ display: 'flex', alignItems: 'center' }}>
                            <span>{voice.name}</span>
                            <FavoriteStar 
                            isFavorite={favoriteVoiceString.includes(voice.voiceId)}
                            onToggle={(e)=>{
                                e.stopPropagation();
                           onToggleFavorite(voice.voiceId)}}
                            /></span>
                            {langInfo && (
                                <span className={styles.voiceDetails}>
                                    <span>{langInfo.name}</span>
                                    <Image
                                        src={langInfo.imageUrl}
                                        alt={`${langInfo.name} flag`}
                                        width={24}
                                        height={16}
                                    />
                                </span>
                            )}
                            
                        </button>
                        {isSelected && children}
                    </div>
                );
            })}
        </>
    );
}