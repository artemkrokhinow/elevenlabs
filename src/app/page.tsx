"use client"
import styles from './home.module.css'
import {useState, useRef, useEffect, ChangeEvent} from 'react'
import VoicesList from "./pageList/voicesList"
import WordsList from "./pageList/wordList"

export default function Home() {

  const [inputText, setInputText] = useState('')
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null)
  const [favoriteStars, setFavoriteStars] = useState<string[]>([])
  const [selectedWord, setSelectedWord] = useState<string | null>(null)

/*
  const dropdownContainerRef = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const handleClick = (event: MouseEvent)=>{
     if(dropdownContainerRef.current && !dropdownContainerRef.current.contains(event.target as Node)  ){
        console.log('dropdownContainerRef ')
        setSelectedWord(null)
     }
    }
    document.addEventListener("mousedown", handleClick)
    console.log('useEffect')
    return()=>document.removeEventListener("mousedown", handleClick)
  },[]);*/

  const handleSpeak = async (inputText: string)=>{
    const response = await fetch('./api/generate-speech',{
        method : 'POST' ,
        headers:{ 'Content-Type': 'application/json'},
        body: JSON.stringify({
          text: selectedWord || inputText ,
          voiceId: selectedVoice
        })
    })
    if(!response.ok){ throw new Error('fetch generate-speech fail') } 
    const audioBlob = await response.blob()
    const audioUrl = URL.createObjectURL(audioBlob)
    const audio = new Audio(audioUrl)
    audio.play()
  }

  const handleVoiceClick = (voiceId: string)=>{
        setSelectedVoice(prevId => prevId === voiceId? null : voiceId)
        console.log(selectedVoice)
        console.log(voiceId)
  }

  const handleWordClick = (word: string)=>{
    setSelectedWord(word)
    setInputText(word)
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement> ) =>{
    setInputText(event.target.value)
    setSelectedWord(null)
  }
  const handleFavoriteStars = (voiceId: string)=>{
    setFavoriteStars( prev => {if (prev.includes(voiceId)){
      return prev.filter(id=> id!== voiceId)   
    } else{
       return [...prev, voiceId]
    }})

  return (
     <div  className={styles.mainContainer}>
       <main className={styles.contentWrapper}>
            <VoicesList
                onVoiceClick={handleVoiceClick}
                selectedVoiceId={selectedVoice}
                onToggleFavorite={handleFavoriteStars}
                 favoriteVoiceString={favoriteStars}

            >
                <div className={styles.expandedBlock}>
                  <div className={styles.inputGroup}>
                      <input
                          value={inputText}
                          onChange={handleInputChange}
                          placeholder="Enter your text..."
                          className={styles.customInput}
                      />
                      <button 
                        onClick={() => handleSpeak(inputText)}
                        disabled={!inputText}
                        className={styles.startButton}
                      >
                          Start
                      </button>
                  </div>
                  
                  <WordsList
                      selectedVoiceId={selectedVoice}
                      onWordClick={handleWordClick}
                      selectedWord={selectedWord}
                  />
              </div>
          </VoicesList>
        </main>
     </div>
  );
}
}