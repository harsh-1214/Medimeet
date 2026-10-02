import cx from "classnames";
import { Mic, Video, PhoneOff, MicOff, VideoOff } from "lucide-react";

import styles from "@/components/Bottom/index.module.css";

const Bottom = ({
  muted,
  playing,
  leaveRoom,
  toggleAudio,
  toggleVideo,
}: {
  muted: boolean;
  playing: boolean;
  leaveRoom: () => void;
  toggleAudio: () => void;
  toggleVideo: () => void;
}) => {
  return (
    <div className={cx(styles.bottomMenu,"gap-5")}>
      {muted ? (
        <MicOff
          className={cx(styles.icon, styles.active)}
          size={55}
          onClick={toggleAudio}
        />
      ) : (
        <Mic className={styles.icon} size={55} onClick={toggleAudio} />
      )}
      {playing ? (
        <Video
          className={styles.icon}
          size={55}
           onClick={toggleVideo}
        />
      ) : (
        <VideoOff
          className={cx(styles.icon, styles.active)}
          size={55}
          onClick={toggleVideo}
        />
      )}
      <PhoneOff size={55} className={cx(styles.icon)} onClick={leaveRoom} />
    </div>
  );
};

export default Bottom;
