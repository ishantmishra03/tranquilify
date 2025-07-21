import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, Music2, Volume2 } from "lucide-react";
import { useAppContext } from "../../context/AppContext"; // ✅ Import

const cdnUrl = import.meta.env.VITE_CDN_URL;

const tracks = [
  {
    id: "calm",
    name: "Gentle Rain",
    url: `${cdnUrl}/rain.mp3`,
    description: "Calming rain to soothe your mind.",
  },
  {
    id: "focus",
    name: "Forest Morning",
    url: `${cdnUrl}/forest.mp3`,
    description: "Birds and breeze to gently uplift.",
  },
  {
    id: "uplift",
    name: "Ocean Waves",
    url: `${cdnUrl}/ocean.mp3`,
    description: "Rhythmic ocean waves to lift your spirits.",
  },
  {
    id: "night",
    name: "Night Breeze",
    url: `${cdnUrl}/night.mp3`,
    description: "Crickets and breeze under the night sky.",
  },
  {
    id: "river",
    name: "River Flow",
    url: `${cdnUrl}/river.mp3`,
    description: "Gentle flowing river water.",
  },
  {
    id: "fireplace",
    name: "Cozy Fireplace",
    url: `${cdnUrl}/fireplace.mp3`,
    description: "Warm crackling fireplace sounds.",
  },
  {
    id: "morning",
    name: "Morning Birds",
    url: `${cdnUrl}/birds.mp3`,
    description: "Lively birdsong to energize your morning.",
  },
  {
    id: "wind",
    name: "Mountain Wind",
    url: `${cdnUrl}/wind.mp3`,
    description: "Crisp wind blowing through highlands.",
  },
  {
    id: "rainforest",
    name: "Rainforest",
    url: `${cdnUrl}/rainforest.mp3`,
    description: "Lush rainforest ambiance with wildlife.",
  },
  {
    id: "ocean",
    name: "Gentle Waves",
    url: `${cdnUrl}/ocean.mp3`,
    description: "Soothing bites of waves caressing the shore.",
  },
  {
    id: "fireflies",
    name: "Evening Ambience",
    url: `${cdnUrl}/fireflies.mp3`,
    description: "Soft evening ambience with crickets.",
  },
];

const formatTime = (sec) => {
  if (isNaN(sec)) return "0:00";
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const SuggestedSoundscape = ({ mood = 3, stressLevel = 2 }) => {
  const { isDarkMode } = useAppContext(); 

  const getSuggestedTrack = () => {
    if (stressLevel >= 3 || mood <= 2)
      return tracks.find((t) => t.id === "calm");
    else if (stressLevel === 2 || mood === 3)
      return tracks.find((t) => t.id === "focus");
    else return tracks.find((t) => t.id === "uplift");
  };

  const suggestedTrack = getSuggestedTrack();

  const [currentTrack, setCurrentTrack] = useState(suggestedTrack);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);

  const playTrack = (track) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }

    const audio = new Audio(track.url);
    audio.volume = volume;
    audio.loop = false;

    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });

    audio.addEventListener("ended", () => {
      setPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    });

    audio
      .play()
      .then(() => {
        audioRef.current = audio;
        setPlaying(true);
        setCurrentTrack(track);
      })
      .catch(console.error);
  };

  const togglePlayPause = () => {
    if (!audioRef.current) {
      playTrack(currentTrack);
    } else {
      if (playing) {
        audioRef.current.pause();
        setPlaying(false);
      } else {
        audioRef.current.play();
        setPlaying(true);
      }
    }
  };

  const onCardClick = (track) => {
    if (currentTrack.id === track.id) {
      togglePlayPause();
    } else {
      playTrack(track);
    }
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) audioRef.current.volume = vol;
  };

  const handleSeekChange = (e) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div
      className={`max-w-5xl mx-auto p-6 space-y-10 ${
        isDarkMode ? "text-white" : "text-gray-900"
      }`}
    >
      {/* MAIN TRACK CARD */}
      <div className="relative bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl p-8 shadow-xl text-white flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
        {currentTrack.id === suggestedTrack.id && (
          <div className="absolute top-4 left-4 bg-green-200 text-green-900 font-semibold text-xs uppercase px-3 py-1 rounded-full shadow-md select-none">
            Suggested
          </div>
        )}

        <div className="bg-white bg-opacity-30 p-6 rounded-full flex items-center justify-center">
          <Music2 className="w-16 h-16" />
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-4xl font-bold truncate">{currentTrack.name}</h2>
          <p className="mt-3 text-lg">{currentTrack.description}</p>

          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTrack && playing ? currentTime : 0}
            onChange={handleSeekChange}
            className="w-full mt-6 rounded-lg cursor-pointer accent-green-300"
          />
          <div className="flex justify-between text-sm font-mono mt-1 select-none">
            <span>{formatTime(currentTrack && playing ? currentTime : 0)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="flex items-center space-x-4 mt-5 max-w-xs">
            <Volume2 className="w-7 h-7 text-green-300" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolumeChange}
              className="w-full cursor-pointer accent-green-400"
            />
          </div>
        </div>

        <button
          onClick={togglePlayPause}
          className="bg-white bg-opacity-40 hover:bg-opacity-60 p-6 rounded-full transition flex items-center justify-center shadow-lg flex-shrink-0"
        >
          {playing ? (
            <Pause className="w-10 h-10 text-green-900" />
          ) : (
            <Play className="w-10 h-10 text-green-900" />
          )}
        </button>
      </div>

      {/* OTHER TRACKS */}
      <div>
        <h3 className="text-2xl font-semibold mb-6">Other Soundscapes</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {tracks
            .filter((t) => t.id !== currentTrack.id)
            .map((track) => {
              const isSuggested = track.id === suggestedTrack.id;
              return (
                <div
                  key={track.id}
                  onClick={() => onCardClick(track)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      onCardClick(track);
                    }
                  }}
                  className={`cursor-pointer rounded-2xl p-5 border flex flex-col transition shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 hover:shadow-lg ${
                    isDarkMode
                      ? "bg-gray-900 text-white border-gray-700"
                      : "bg-white text-gray-900 border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-lg truncate">
                      {track.name}
                    </h4>
                    {isSuggested && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold select-none">
                        Suggested
                      </span>
                    )}
                  </div>
                  <p
                    className={`mb-4 flex-grow ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {track.description}
                  </p>
                  <button
                    className="self-start bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition flex items-center justify-center"
                    aria-label="Play track"
                  >
                    <Play className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default SuggestedSoundscape;
