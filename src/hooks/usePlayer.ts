"use client";

import { useState } from "react";
import { cloneDeep } from "lodash";
// import { useSocket } from "@/context/socket";
import Peer from "peerjs";
import { useRouter } from "next/navigation";
import { updateAppointmentStatus } from "@/actions/stream";

const usePlayer = (myId: string, roomId: string, peer: Peer | null) => {
  //   const socket = useSocket();
  const [players, setPlayers] = useState<
    Record<
      string,
      {
        url: MediaStream;
        muted: boolean;
        playing: boolean;
      }
    >
  >({});
  const router = useRouter();
  const playersCopy = cloneDeep(players);

  const playerHighlighted = playersCopy[myId];
  delete playersCopy[myId];
  // playersCopy.

  Object.keys(playersCopy).forEach((id) => {
    if (playersCopy[id]?.url === playerHighlighted?.url) {
      delete playersCopy[id];
    }
  });

  const nonHighlightedPlayers = playersCopy;

  const leaveRoom = async () => {
    try {
      console.log("leaving room", roomId);

      // 1. Turn off the physical Webcam and Microphone hardware!
      const myStream = players[myId]?.url;
      if (myStream) {
        myStream.getTracks().forEach((track) => track.stop());
      }

      // 2. Completely close the WebRTC connection (better than disconnect)
      peer?.destroy();

      // 3. Update appointment status in the database
      await updateAppointmentStatus(roomId);
    } catch (error) {
      console.error("Error while leaving room:", error);
    } finally {
      // 4. Always redirect home, even if the DB call has a hiccup
      router.replace("/");
    }
  };

  const toggleAudio = () => {
    setPlayers((prev) => {
      const copy = cloneDeep(prev);
      if (!copy[myId]) return prev;

      const isMuted = !copy[myId].muted;
      copy[myId].muted = isMuted;

      // Actually mute/unmute the WebRTC microphone stream sent to the other user
      const audioTrack = copy[myId].url?.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMuted; // enabled = false means muted
      }

      return { ...copy };
    });
  };

  const toggleVideo = () => {
    setPlayers((prev) => {
      const copy = cloneDeep(prev);
      if (!copy[myId]) return prev;

      const isPlaying = !copy[myId].playing;
      copy[myId].playing = isPlaying;

      // Actually turn on/off the WebRTC camera stream sent to the other user
      const videoTrack = copy[myId].url?.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = isPlaying; // enabled = false sends a black screen
      }

      return { ...copy };
    });
  };

  return {
    players,
    setPlayers,
    playerHighlighted,
    nonHighlightedPlayers,
    toggleAudio,
    toggleVideo,
    leaveRoom,
  };
};

export default usePlayer;
