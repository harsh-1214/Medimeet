"use client";

import React, { useEffect, useState } from "react";
import { MediaConnection, Peer } from "peerjs";
import useMediaStream from "@/hooks/useMediaStream";
import axios from "axios";
import Bottom from "@/components/Bottom";
import Player from "@/components/Player";
import styles from "./_components/room.module.css";
import usePlayer from "@/hooks/usePlayer";
import { cloneDeep } from "lodash";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const RoomPage = ({ params }: { params: { roomid: string } }) => {
  const [peerId, setPeerId] = useState("");
  const [peerobj, setPeerobj] = useState<Peer | null>(null);
  const [destPeerId, setDestPeerId] = useState("");
  const { user, isLoaded } = useUser();

  // This User State is Specifically maintain to store the map of Peerid --> call,
  // SO when Through Socket Io, 'user-leave' event is received, means in room anyone has leaved room,
  // So through Socket io, We will send the user leaved peerId
  // And through that peerid, and this map, I will Do users[UserLeavedPeerId].close(),
  // means I will close that peer from my side, So UI will be updated.
  const [users, setUsers] = useState({});
  const {
    players,
    setPlayers,
    playerHighlighted,
    nonHighlightedPlayers,
    toggleAudio,
    toggleVideo,
    leaveRoom,
  } = usePlayer(peerId, params.roomid, peerobj);

  const isDoctor = user?.publicMetadata?.role === "doctor";

  useEffect(() => {
    
    const peer = new Peer(); // Create a Peer object
    setPeerobj(peer);
    peer.on("open", (id) => {
      setPeerId(id);
      // localStorage.setItem('peerId',id);
    });

    return () => {
      peer.destroy();
    };
    // }
  }, []);

  const { stream } = useMediaStream();

  useEffect(() => {
    const handleWindowClose = () => {
      if (!peerId || !isDoctor) return;

      // sendBeacon is synchronous and guaranteed to fire even if the tab closes
      const data = JSON.stringify({ roomId: params.roomid, isDoctor });
      navigator.sendBeacon(
        "/api/resetPeerId",
        new Blob([data], { type: "application/json" }),
      );
    };

    window.addEventListener("beforeunload", handleWindowClose);
    return () => window.removeEventListener("beforeunload", handleWindowClose);
  }, [peerId, isDoctor, params.roomid]);

  useEffect(() => {
    // console.log(stream);
    // if (!stream) return;

    (async () => {
      if (!isLoaded || !peerId || !peerobj) return;

      const res = await axios.post("/api/setpeerId", {
        peerId,
        roomId: params.roomid,
        isDoctor,
      });

      console.log("Successfully Set in database", res);
    })();

  }, [peerId, peerobj, isDoctor, params.roomid, isLoaded]);

  useEffect(() => {
    // Wait until Clerk is loaded AND Peer is ready. Stop if we already found the destination.
    if (user === undefined || !peerId || destPeerId) return;

    const intervalId = setInterval(async () => {
      console.log("Searching for other user...");
      try {
        const res = await axios.post("/api/getPeerId", {
          roomId: params.roomid,
          isDoctor,
        });

        const OtherdestPeerId = res.data.peerId;

        if (OtherdestPeerId && OtherdestPeerId !== destPeerId) {
          setDestPeerId(OtherdestPeerId);
          clearInterval(intervalId); // Clear it immediately once found!
        }
      } catch (error) {
        console.error("Polling error", error);
      }
    }, 3000); // 3 seconds is much better for a demo UX

    // Cleanup when component unmounts or re-renders
    return () => clearInterval(intervalId);
  }, [user, isDoctor, peerId, destPeerId, params.roomid]);

  // useEffect(() => {
  //   if (!!destPeerId && !!intervalID) {
  //     clearInterval(intervalID);
  //   }
  // }, [destPeerId]);

  useEffect(() => {
    if (!peerobj || !stream || !destPeerId || !peerId) return;

    const call = peerobj.call(destPeerId, stream);

    if (call) {
      const handleStream = (incomingStream: MediaStream) => {
        setPlayers((prev: any) => ({
          ...(prev[peerId] ? { [peerId]: prev[peerId] } : {}),
          [destPeerId]: {
            url: incomingStream,
            muted: false,
            playing: true,
          },
        }));

        setUsers((prev: any) => ({
          ...prev,
          [destPeerId]: call,
        }));
      };

      call.on("stream", handleStream);
      // call.on("close", () => {
      //   handleUserLeave(destPeerId); // (Use callerId in the incoming call useEffect)
      // });

      // REQUIRED FOR DEMO: Prevents duplicate video feeds when React re-renders
      return () => {
        call.off("stream", handleStream);
        call.close();
      };
    }
  }, [stream, destPeerId, peerobj, peerId]);

  useEffect(() => {
    if (!stream || !peerobj || !peerId) return;

    const handleCall = (call: MediaConnection) => {
      const { peer: callerId } = call;
      call.answer(stream);

      call.on("stream", (incomingStream: MediaStream) => {
        setPlayers((prev: any) => ({
          ...(prev[peerId] ? { [peerId]: prev[peerId] } : {}),
          [callerId]: {
            url: incomingStream,
            muted: false,
            playing: true,
          },
        }));

        setUsers((prev: any) => ({
          ...prev,
          [callerId]: call,
        }));
      });
    };

    peerobj.on("call", handleCall);

    // REQUIRED FOR DEMO: Prevents answering the same call multiple times and crashing the UI
    return () => {
      peerobj.off("call", handleCall);
    };
  }, [stream, peerobj, peerId]);

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
  }, [peerId, stream]);

  const handleUserLeave = (userId: string) => {
    console.log(`user ${userId} is leaving the room`);
    const playersCopy = cloneDeep(players);
    delete playersCopy[userId];
    setPlayers(playersCopy);
  };
  return (
    <>
      <div className={styles.activePlayerContainer}>
        {playerHighlighted && (
          <Player
            url={playerHighlighted.url}
            muted={playerHighlighted.muted}
            playing={playerHighlighted.playing}
            isActive={true}
          />
        )}
      </div>
      <div className={styles.inActivePlayerContainer}>
        {Object.keys(nonHighlightedPlayers).map((playerId, ind) => {
          const { url, muted, playing } = nonHighlightedPlayers[playerId];
          console.log(playerId);
          // if(ind === 0) return;
          // if(!url.active) {
          //   tries.current--;
          //   router.refresh();
          //   // if(tries.current === 0) {
          //   //   handleUserLeave(playerId);
          //   // }
          // }
          console.log(url);
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
        toggleAudio={toggleAudio}
        toggleVideo={toggleVideo}
        leaveRoom={leaveRoom}
      />
    </>
  );
};

export default RoomPage;
