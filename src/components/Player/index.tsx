import ReactPlayer from "react-player";
import cx from "classnames";
import { Mic, MicOff, UserSquare2, UserSquare2Icon } from "lucide-react";

import styles from "@/components/Player/index.module.css";

const Player = ({
  url,
  muted,
  playing,
  isActive,
}: {
  url: MediaStream;
  muted: boolean;
  playing: boolean;
  isActive: boolean;
}) => {
  return (
    <div
      className={cx(styles.playerContainer, {
        [styles.notActive]: !isActive,
        [styles.active]: isActive,
        [styles.notPlaying]: !playing,
      })}
    >
      {playing ? (
        <ReactPlayer
          url={url}
          muted={muted}
          playing={playing}
          width="100%"
          height="100%"
        />
      ) : (
        <>
          <UserSquare2Icon className={styles.user} size={isActive ? 400 : 150} />
        </>
      )}
    </div>
  );
};

export default Player;
