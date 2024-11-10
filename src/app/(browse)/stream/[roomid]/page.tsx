"use client";

import React, { useEffect, useState } from "react";
import { Peer } from "peerjs";
import useMediaStream from "@/hooks/useMediaStream";
import { getCookie } from "cookies-next";
import axios from "axios";
import Bottom from "@/components/Bottom";
import Player from "@/components/Player";
import styles from './_components/room.module.css'
import usePlayer from "@/hooks/usePlayer";
import { cloneDeep } from "lodash";
import { useRouter } from "next/navigation";


const RoomPage = ({ params }: { params: { roomid: string } }) => {
  const [peerId, setPeerId] = useState("");
  const [peerobj, setPeerobj] = useState<Peer | null>(null);
  const [destPeerId, setDestPeerId] = useState("");
  const [intervalID, setIntervalID] = useState<NodeJS.Timeout | null>(null);

  // This User State is Specifically maintain to store the map of Peerid --> call, 
  // SO when Through Socket Io, 'user-leave' event is received, means in room anyone has leaved room,
  // So through Socket io, We will send the user leaved peerId
  // And through that peerid, and this map, I will Do users[UserLeavedPeerId].close(),
  // means I will close that peer from my side, So UI will be updated. 
  const [users, setUsers] = useState({})
  const router = useRouter();
  const {
    players,
    setPlayers,
    playerHighlighted,
    nonHighlightedPlayers,
    // toggleAudio,
    // toggleVideo,
    leaveRoom
  } = usePlayer(peerId, params.roomid, peerobj);


  const isDoctor = getCookie("role") === "doctor";

  useEffect(() => {
    // if (storedPeerId) {
    //   const peer = new Peer(storedPeerId);
    //   setPeerobj(peer);
    //   peer.on("open", (id) => {
    //     console.log(`My peer ID is: ${id}`);
    //     setPeerId(id);
    //   });
    //   peer.reconnect();
    //   console.log(peer);
    // } else {
    const peer = new Peer(); // Create a Peer object
    setPeerobj(peer);
    peer.on("open", (id) => {
      setPeerId(id);
      // localStorage.setItem('peerId',id);
    });


    // }
  }, []);

  const { stream } = useMediaStream();


  useEffect(() => {
    // testing is not completed
    const handleWindowClose = async() => {
      // Your logic here (e.g., alerting the user about unsaved changes)
      if (!peerId || !peerobj || isDoctor === null) return;
      const res = await axios.post("/api/resetPeerId", {
        roomId: params.roomid,
        isDoctor,
      });
    };

    window.addEventListener("beforeunload", handleWindowClose);

    return () => {
      // Clean up: Remove the event listener when the component unmounts
      window.removeEventListener("beforeunload", handleWindowClose);
    };
  }, []);

  useEffect(() => {
    // console.log(stream);
    // if (!stream) return;

    ;(async () => {
      if (!peerId || !peerobj || isDoctor === null) return;

      const res = await axios.post("/api/setpeerId", {
        peerId,
        roomId: params.roomid,
        isDoctor,
      });

      console.log("Successfully Set in database", res);

    })();

    // return () => {
    //   ;(async () => {
    //     if (!peerId || !peerobj || isDoctor === null) return;
  
    //     const res = await axios.post("/api/resetPeerId", {
    //       roomId: params.roomid,
    //       isDoctor,
    //     });
    //   })();
    // }

  }, [peerId,peerobj]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      (async () => {
        if (isDoctor === null) return;
        console.log("Interval is running...");
        const res = await axios.post("/api/getPeerId", {
          roomId: params.roomid,
          isDoctor,
        });

        const OtherdestPeerId = res.data.peerId;
        // console.log();
        if (!OtherdestPeerId) return;
        if (OtherdestPeerId === destPeerId) return;

        setDestPeerId(OtherdestPeerId);
        console.log("Destination peer Id is : ", OtherdestPeerId);
      })();
    }, 10000);

    setIntervalID(intervalId);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!!destPeerId && !!intervalID) {
      clearInterval(intervalID);
    }
  }, [destPeerId]);

  useEffect(() => {
    console.log(destPeerId);
    if (!peerobj || !stream || !destPeerId) return;

    const call = peerobj.call(destPeerId, stream);
    console.log("Call is : ", call);
    // console.log(call);
    if (call) {
      call.on("stream", (incomingStream) => {
        console.log("Stream Comes from other user : ", incomingStream);
        setPlayers((prev) => ({
          ...prev,
          [destPeerId]: {
            url: incomingStream,
            muted: false,
            playing: true,
          },
        }));

        setUsers((prev) => ({
          ...prev,
          [destPeerId]: call
        }))
      });
    }
  }, [stream, destPeerId]);

  useEffect(() => {
    if (!stream || !peerobj) return;

    peerobj.on("call", (call) => {
      const { peer: callerId } = call;
      call.answer(stream);

      call.on("stream", (incomingStream) => {
        console.log(incomingStream);
        console.log("Called id : ", call.peer);
        setPlayers((prev) => ({
          ...prev,
          [callerId]: {
            url: incomingStream,
            muted: false,
            playing: true,
          },
        }));

        setUsers((prev) => ({
          ...prev,
          [callerId]: call
        }))
      });
    });
  }, [stream, peerobj, destPeerId]);

  useEffect(() => {
    if (!stream || !peerId) return;
    console.log(`setting my stream ${peerId}`);
    setPlayers((prev) => ({
      ...prev,
      [peerId]: {
        url: stream,
        muted: false,
        playing: true,
      },
    }));
  }, [peerId, setPlayers, stream]);

  const handleUserLeave = (userId : string) => {
    console.log(`user ${userId} is leaving the room`);
    const playersCopy = cloneDeep(players);
    delete playersCopy[userId];
    setPlayers(playersCopy);
  }
  return (
    <>
      <div className={styles.activePlayerContainer}>
        {playerHighlighted && (
          <Player
            url={playerHighlighted.url}
            muted={playerHighlighted.muted}
            playing={playerHighlighted.playing}
            isActive = {true}
          />
        )}
      </div>
      <div className={styles.inActivePlayerContainer}>

        {Object.keys(nonHighlightedPlayers).map((playerId,ind) => {
          const { url, muted, playing } = nonHighlightedPlayers[playerId];
          console.log(playerId)
          if(ind === 0) return;
          // if(!url.active) {
          //   tries.current--;
          //   router.refresh();
          //   // if(tries.current === 0) {
          //   //   handleUserLeave(playerId);
          //   // }
          // }
          console.log(url)
          return (
            <Player
              key={playerId}
              url={url}
              muted={muted}
              playing={playing}
              isActive={false}
            />
          );
        })}
      </div>
      <Bottom
        muted={playerHighlighted?.muted}
        playing={playerHighlighted?.playing}
        // toggleAudio={toggleAudio}
        // toggleVideo={toggleVideo}
        leaveRoom={leaveRoom}
      />
    </>
  );
};

export default RoomPage;
