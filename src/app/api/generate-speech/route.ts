import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { NextResponse } from 'next/server';

export async function POST(request : Request) {
    try{
    const {text, voiceId} = await request.json()
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io/",
        apiKey:process.env.ELEVENLABS_API_KEY
    });
   const audio = await client.textToSpeech.convert(voiceId, {
        text: text,
        modelId: 'eleven_multilingual_v2',
    });
    return new NextResponse(audio,{
        headers : {'Content-Type': 'audio/mpeg'} 
    })
}catch(error) {
    console.error('POST fail', error)
    return NextResponse.json({error: (error as Error).message},{status:500})
}
}

export async function GET(request : Request){
    try{
 const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io/",
        apiKey:process.env.ELEVENLABS_API_KEY
    });
    
  const {voices} = await client.voices.getAll();
 const aviableVoices = voices.map((voice)=>({
             voiceId: voice.voiceId,
            name: voice.name,
            category: voice.category,
            previewUrl: voice.previewUrl
 }))
 console.log(voices)
 return NextResponse.json(aviableVoices)
  }catch(error) {
     console.error('GET voices fail', error)
    return NextResponse.json({error}, {status: 500})
  }
}
