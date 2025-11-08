  "use client"
  import styles from './home.module.css'
  import {useState, useRef, useEffect, ChangeEvent} from 'react'
  import VoicesList, { Voice } from "./pageList/voicesList"
  import WordsList  from "./pageList/wordList"
  import FavoriteList from "./pageList/FavoriteList/Favorite"
  import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

  export default function Home() {

    const [inputText, setInputText] = useState('')
    const [selectedVoice, setSelectedVoice] = useState<string | null>(null)
    const [favoriteStars, setFavoriteStars] = useState<string[]>([])
    const [favoriteWord, setFavoriteWord] = useState<string[]>([])
    const [selectedWord, setSelectedWord] = useState<string | null>(null)
    const [history, setHistory ] = useState<string[]>([])
    const [voicesLoaded, setVoicesLoaded] = useState<Voice[]>([])
 



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
    const handleVoicesLoaded = (Voice) =>{
      setVoicesLoaded(Voice)
    }
    const handleHistoryCreate = (word:string)=>{
      
      if(!history.includes(word)){
    const historyEntry = `${selectedVoice} : ${selectedWord}`
    setHistory(prev=> [...prev , historyEntry]) }
    }
    const handleWordClick = (word: string)=>{
      setSelectedWord(word)
      setInputText(word)
    handleHistoryCreate(word)
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
  }
  const handleFavoriteWord = (word: string) =>{
    setFavoriteWord(prev=> {if(prev.includes(word)){
    
      return prev.filter(w=> w!== word)
      
    } else{ return [...prev, word]}
  })
  }
    return (
      <div  className={styles.mainContainer}>
        <main className={styles.contentWrapper}>
             <FavoriteList
            onToggleFavorite={handleFavoriteWord}
              favoriteVoiceString={favoriteWord}

                        />
           <WordsList
                        selectedVoiceId={selectedVoice}
                        onWordClick={handleWordClick}
                        selectedWord={selectedWord}
                        onToggleFavorite={handleFavoriteWord}
                        favoriteVoiceString={favoriteWord}
            
                    />
              <VoicesList
                  onVoiceClick={handleVoiceClick}
                  selectedVoiceId={selectedVoice}
                  onToggleFavorite={handleFavoriteStars}
                  favoriteVoiceString={favoriteStars}
                  onVoicesLoaded={handleVoicesLoaded}
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
                            Speak
                        </button>
                    </div>
                    
                  
                </div>
            </VoicesList>
             
         
          </main>
          
      </div>
    );
  }
