import Languages from "../array/Languages";
import words from "../array/words";
import styles from '../home.module.css';
import FavoriteStar from "./star/FavoriteStar"
import React, { MouseEvent } from "react";

interface WordsListProps {
    selectedVoiceId: string | null;
    onWordClick: (word: string) => void;
    selectedWord: string | null;
    onToggleFavorite: (voiceId : string) => void;
    favoriteVoiceString: string[];
}

export default function WordsList({selectedVoiceId, onWordClick, selectedWord, onToggleFavorite, favoriteVoiceString}:WordsListProps ){
    if (!selectedVoiceId){return null}

    const currentVoiceId = voices.find((voice)=> voice.voiceId === selectedVoiceId)
    if (!currentVoiceId){return null}
    const ff = Languages.find((lang)=> lang.aviableVoice.includes(currentVoiceId.name))
    const findWords = words.find((word)=>word.name === ff?.name)
    const wordsObject = findWords?.text || []
  
    return(
   
        <div className={styles.wordsContainer}>
            {wordsObject.map((word)=>(
                <button  
                    key={word}
                    onClick={()=> onWordClick(word)} 
        
                    className={`${styles.wordButton} ${selectedWord === word ? styles.selected : ''}`}
                >
                    {word}
                      <FavoriteStar 
                                                isFavorite={favoriteVoiceString.includes(word)}
                                                onToggle={(e)=>{
                                                    e.stopPropagation();
                                               onToggleFavorite(word)}}
                                                />
                </button>
            ))}
       </div>
    )
}