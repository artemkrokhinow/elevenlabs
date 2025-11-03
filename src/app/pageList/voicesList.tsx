import React, { MouseEvent } from 'react';
import Languages from "../array/Languages";
import voices from "../array/voices";
import Image from 'next/image';
import styles from '../home.module.css';
import FavoriteStar from "./star/FavoriteStar"

interface VoicesListProps {
    onVoiceClick: (voiceId: string) => void;
    selectedVoiceId: string | null;
    children: React.ReactNode;
    onToggleFavorite: (voiceId : string) => void;
    favoriteVoiceString: string[];
}

export default function VoicesList({ onVoiceClick, selectedVoiceId, children, onToggleFavorite, favoriteVoiceString }: VoicesListProps) {
    return (
        <>
            {voices.map((voice) => {
                const isSelected = selectedVoiceId === voice.voiceId;
                const isFavorite = favoriteVoiceString.includes(voice.voiceId)
                const langInfo = Languages.find((lang) => lang.aviableVoice.includes(voice.name));

                return (
                    <div key={voice.name}>
                        <button
                            onClick={() => onVoiceClick(voice.voiceId)}
                            className={`${styles.voiceButton} ${isSelected ? styles.selected : ''}`}
                        >  <span style={{ display: 'flex', alignItems: 'center' }}>
                            <span>{voice.name}</span>
                            <FavoriteStar 
                            isFavorite={isFavorite}
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