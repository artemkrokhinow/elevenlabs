"use client"
import Languages from "./array/Languages";
import voices from "./array/voices";
import Image from 'next/image'
import {useState, useRef, useEffect} from 'react'

const languageToVoiceMap: {[key: string]: string} = {
  'English': 'Callum',
  'French': 'Liam',
  'Ukrainian': 'Alice'
}

const languagesRaw = Languages.map((language)=>{
 const voiceName =  languageToVoiceMap[language.name];
 const foundVoice = voices.find((voice) => voice.name === voiceName)
 return {
  ...Languages , voiceId: foundVoice
 }
})

export default function Home() {

  const [inputText, setInputText] = useState('')
  const [selectedLanguageId, setSelectedLanguageId] = useState(1)
  const [isVoicesVisible, setVoicesVisible] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState('')



const dropdownContainerRef = useRef<HTMLDivElement>(null);
useEffect(()=>{
  const handleClick = (event: MouseEvent)=>{
   if(dropdownContainerRef.current && !dropdownContainerRef.current.contains(event.target as Node)  ){
      setVoicesVisible(false)
      console.log('dropdownContainerRef ')
   }
  }
   
      document.addEventListener("mousedown", handleClick)
         console.log('useEffect')
      return()=>document.removeEventListener("mousedown", handleClick)
   
   },[]);



const handleSpeak = async ()=>{
  const selectedLanguage = Languages.find( lang=> lang.id === selectedLanguageId)
  if(selectedLanguage){
  const response = await fetch('./api/generate-speech',{
      method : 'POST' ,
      headers:{ 'Content-Type': 'application/json'},
      body: JSON.stringify({
        text: inputText,
        voiceId: selectedLanguage.voiceId
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
}
const pressButton = (id: number )=>{
 
  setSelectedLanguageId(id)
  setVoicesVisible(!isVoicesVisible)
}
const pressVoiceButton = (name: string)=>{
 setSelectedVoice(name)
}

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
       <div className="w-[450px]">
       <input id="placeholder" value={inputText} onChange={(e)=> setInputText(e.target.value)} 
       className=' w-[300px] h-[50px] pl-[10px] text-black  bg-white rounded-lg border  border-gray-500'placeholder="write text" ></input>
    <button onClick ={handleSpeak} className='  gap-3 p-3 border rounded-lg transition-colors ' >speak</button>
                 <div ref={dropdownContainerRef} className="mt-4 flex gap-4 items-start">
  

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
      {voices.map((voice) => (
        
        <li key={voice.voiceId}> 
          <button onClick ={handleSpeak} className='w-full text-left p-3 border rounded-lg border-gray-700 hover:bg-gray-800'>
            {voice.name  } 
          </button>
        </li>
      ))}
    </ul>
  </div>

</div>
       </div>
      </main>
      
    </div>
  );
}
