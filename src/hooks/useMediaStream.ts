'use client'

import {useState, useEffect, useRef} from 'react'

const useMediaStream = () => {
    const [state,setState] = useState<MediaStream | null>(null)
    const isStreamSet = useRef(false)

    useEffect(() => {
        if (isStreamSet.current) return;
        
        (async function initStream() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: true
                })
                console.log("setting your stream")
                setState(stream)
            } catch (e) {
                console.log("Error in media navigator", e)
            }
        })()

        return () => {
            state?.getTracks().forEach((track) => {
                track.stop();
            });
            setState(null);
            isStreamSet.current = false
        }
    }, [])


    if(!!state){
        console.log('Stream successfully set')
        isStreamSet.current = true;
    }
    return {
        stream : state
    }
}

export default useMediaStream