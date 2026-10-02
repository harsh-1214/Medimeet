'use client'

import { useState, useEffect, useRef } from 'react';

export const useMediaStream = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  // Use a Ref to track the stream so the cleanup function always has the latest value
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function initStream() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });

        if (!isMounted) {
          // Component unmounted while getUserMedia was resolving
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = mediaStream;
        setStream(mediaStream);
      } catch (err) {
        if (isMounted) {
          console.error('Error accessing media devices:', err);
          setError(err as Error);
        }
      }
    }

    initStream();

    // CLEANUP: Always executed when component unmounts
    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  return { stream, error };
};

export default useMediaStream