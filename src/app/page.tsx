"use client"
import Languages from "./array/Languages";
import voices from "./array/voices";
import Image from 'next/image'
import words from "./array/words"
import {useState, useRef, useEffect} from 'react'





export default function Home() {

  // const [inputText, setInputText] = useState('')
  const [selectedLanguageId, setSelectedLanguageId] = useState(1)
  const [isVoicesVisible, setVoicesVisible] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null)
  const [selectedWord, setSelectedWord] = useState<string | null>(null)



const Languagesfind = Languages.find((lang)=>lang.id === selectedLanguageId)
const aviable = Languagesfind?.aviableVoice || []
const aviableVoices = voices.filter(voic=> aviable.includes(voic.name)) 


const WordsObject = words.find(word=>  word.name === Languagesfind?.name )
const WordsText= WordsObject?.text || []



const dropdownContainerRef = useRef<HTMLDivElement>(null);
useEffect(()=>{
  const handleClick = (event: MouseEvent)=>{
   if(dropdownContainerRef.current && !dropdownContainerRef.current.contains(event.target as Node)  ){
      setVoicesVisible(false)
      console.log('dropdownContainerRef ')
      setSelectedWord(null)
   }
  }
   
      document.addEventListener("mousedown", handleClick)
         console.log('useEffect')
      return()=>document.removeEventListener("mousedown", handleClick)
   
   },[]);



const handleSpeak = async ()=>{
  const response = await fetch('./api/generate-speech',{
      method : 'POST' ,
      headers:{ 'Content-Type': 'application/json'},
      body: JSON.stringify({
        text: selectedWord,
        voiceId: selectedVoice
      })
  })
  if(!response.ok){
      throw new Error('fetch generate-speech fail')
  } 
  const audioBlob = await response.blob()
  const audioUrl = URL.createObjectURL(audioBlob)
  const audio = new Audio(audioUrl)
  audio.play()

}
const pressButton = (id: number )=>{
 
  setSelectedLanguageId(id)
  setVoicesVisible(!isVoicesVisible)
  setSelectedVoice(null)
}
const voiceButton = (voiceId: string)=>{
  setSelectedVoice(voiceId)
}

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
       <div ref={dropdownContainerRef} className="w-[450px]">
      {/* <input id="placeholder" value={inputText} onChange={(e)=> setInputText(e.target.value)} 
       className=' w-[300px] h-[50px] pl-[10px] text-black  bg-white rounded-lg border  border-gray-500'placeholder="write text" ></input> */}
    
                 <div  className="mt-4 flex gap-4 items-start">


  <ul className="space-y-2 w-[250px] flex-shrink-0">
    {Languages.map((Language) => (
      <li key={Language.id}>
        <button 
          onClick={() => pressButton(Language.id)}
          className={`flex items-center justify-between gap-3 p-3 border rounded-lg transition-colors w-full ${
            selectedLanguageId === Language.id ? 'bg-blue-500 border-blue-400' : 'border-gray-600 hover:bg-gray-800'
          }`}
        >
          <span>{Language.name}</span>
          <Image 
            src={Language.imageUrl}
            alt={`${Language.name} flag`}
            width={24}
            height={16}
          />
        </button>
      </li>
    ))}
  </ul>

  


  <div 
    className={`transition-all duration-300 ease-in-out w-[150px] ${
      isVoicesVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
    }`}
  >
    <ul className="space-y-2">
      {aviableVoices.map((voice) => (
        
        <li key={voice.voiceId}> 
          <button onClick ={()=>voiceButton(voice.voiceId)}   className={`w-full text-left p-3 border rounded-lg transition-colors ${
          selectedVoice === voice.voiceId 
            ? 'bg-blue-500 border-blue-400' 
            : 'border-gray-700 hover:bg-gray-800' 
        }`}>
            {voice.name } 
          </button>
        </li>
      ))}
    </ul>

      



  </div>
  <div 
    className={`transition-all duration-300 ease-in-out w-[150px] ${
      isVoicesVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
    }`}
  >
<ul className="space-y-2">
      {WordsText.map((Word) => (
        
        <li key={Word}> 
          <button onClick ={()=>setSelectedWord(Word)} className={`w-full text-left p-3 border rounded-lg transition-colors ${
          selectedWord === Word
            ? 'bg-blue-500 border-blue-400'
            : 'border-gray-700 hover:bg-gray-800'
        }`}>
            {Word } 
          </button>
        </li>
      ))}
    </ul>
    </div>
    <div 
    className={`transition-all duration-300 ease-in-out w-[150px] ${
      selectedWord !== null? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
    }`}
  >
    <button onClick ={handleSpeak} className='  gap-3 p-3 border rounded-lg transition-colors ' >speak</button>
    </div>
</div>
       </div>
      </main>
      
    </div>
  );
}
