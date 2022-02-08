import { useEffect, useState } from "react";
import playImg from "./play.png";
import pauseImg from "./pause-button.png";
import "./VideoPlayer.css";
import VideoPlayerClass from "./video_player_class";
export default function VideoPlayer({ src, type }) {
  const [isPlaying, setIsPlaying] = useState(false);
  useEffect(() => {
    const VidPlayer = new VideoPlayerClass(84, setIsPlaying);
  }, []);
  return (
    <div className="video_player">
      <video loop={true} className="video">
        <source src={src} type="video/mp4" />
      </video>
      <div className="play_button">
        <img src={isPlaying ? pauseImg : playImg} alt="" />
      </div>
      <div className="time_progress">
        <div className="fill"></div>
      </div>
      <div className="volume_metter">
        <div className="volume"></div>
      </div>
      <div className="volumeup hint">&uarr;</div>
      <div className="volumedown hint">&darr;</div>
      <div className="later hint">&rarr;</div>
      <div className="sooner hint">&larr;</div>
    </div>
  );
}
