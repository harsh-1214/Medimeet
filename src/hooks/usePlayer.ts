"use client";

import { useState } from "react";
import { cloneDeep } from "lodash";
// import { useSocket } from "@/context/socket";
import Peer from "peerjs";
import {useRouter } from "next/navigation";
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

  const nonHighlightedPlayers = playersCopy;

  const leaveRoom = async() => {
    //   socket.emit('user-leave', myId, roomId)
      console.log("leaving room", roomId)
      const res = await updateAppointmentStatus(roomId);
      // peer?.emit('close');
      peer?.disconnect();
      router.replace('/')
      // router.refresh();
  }

  // const toggleAudio = () => {
  //     console.log("I toggled my audio")
  //     setPlayers((prev) => {
  //         const copy = cloneDeep(prev)
  //         copy[myId].muted = !copy[myId].muted
  //         return {...copy}
  //     })
  //     socket.emit('user-toggle-audio', myId, roomId)
  // }

  // const toggleVideo = () => {
  //     console.log("I toggled my video")
  //     setPlayers((prev) => {
  //         const copy = cloneDeep(prev)
  //         copy[myId].playing = !copy[myId].playing
  //         return {...copy}
  //     })
  //     socket.emit('user-toggle-video', myId, roomId)
  // }

  return {
    players,
    setPlayers,
    playerHighlighted,
    nonHighlightedPlayers,
    // toggleAudio,
    // toggleVideo,
    leaveRoom,
  };
};

export default usePlayer;
