import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useNavigate } from "react-router-dom";
import { Music, PauseCircleIcon, ArrowLeft, Eye, EyeOff } from "lucide-react";

import { GalaxyScene } from "../components/AmbientRoom/Galaxy";
import { OceanScene } from "../components/AmbientRoom/Ocean";
import { ForestScene } from "../components/AmbientRoom/Forest";
import { SkyScene } from "../components/AmbientRoom/Sky";
import { MountainScene } from "../components/AmbientRoom/Mountain";

const themes = [
  {
    id: "galaxy",
    name: "Galaxy",
    Component: GalaxyScene,
    music: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: "ocean",
    name: "Ocean",
    Component: OceanScene,
    music: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: "forest",
    name: "Forest",
    Component: ForestScene,
    music: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
  {
    id: "sky",
    name: "Sky",
    Component: SkyScene,
    music: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
  {
    id: "mountain",
    name: "Mountain",
    Component: MountainScene,
    music: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  },
];

const AmbientRoom = () => {
  const navigate = useNavigate();
  const [activeTheme, setActiveTheme] = useState(themes[0]);
  const [playing, setPlaying] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    setActiveTheme(randomTheme);
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.src = activeTheme.music;
    if (playing) audioRef.current.play();
    else audioRef.current.pause();
  }, [activeTheme, playing]);

  const handleBack = () => {
    navigate(-1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const ThemeButton = ({ theme, isActive, onClick }) => (
    <button
      onClick={() => onClick(theme)}
      className={`px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap transition ${
        isActive
          ? "bg-emerald-500 text-white shadow-lg"
          : "bg-white/20 text-white hover:bg-white/40"
      }`}
    >
      {theme.name}
    </button>
  );

  return (
    <div className="w-full h-screen relative bg-black flex flex-col select-none">
      <audio ref={audioRef} loop />

      <div
        className={`absolute inset-0 z-30 flex flex-col justify-between transition-opacity duration-500 ${
          controlsVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex justify-between p-4">
          <button
            onClick={handleBack}
            className="p-2 rounded-full bg-white/90 dark:bg-zinc-800/90 shadow-md hover:bg-white dark:hover:bg-zinc-700 transition"
          >
            <ArrowLeft className="w-6 h-6 text-emerald-600" />
          </button>

          <button
            onClick={() => setPlaying(!playing)}
            className="p-2 rounded-full bg-white/90 dark:bg-zinc-800/90 shadow-md hover:bg-white dark:hover:bg-zinc-700 transition"
          >
            {playing ? <Music className="w-6 h-6 text-emerald-500" /> : <PauseCircleIcon className="w-6 h-6 text-red-400" />}
          </button>
        </div>

        <div>
          <div className="text-center text-white p-4 pointer-events-none">
            <h2 className="text-3xl font-semibold mb-1">Ambient Focus Mode</h2>
            <p className="text-slate-300 max-w-md mx-auto">
              Visual calm, gentle sound. One moment at a time.
            </p>
          </div>

          <div className="w-full px-4 py-2 bg-black/70 backdrop-blur-sm overflow-x-auto flex space-x-3 border-t border-gray-700">
            {themes.map((theme) => (
              <ThemeButton
                key={theme.id}
                theme={theme}
                isActive={theme.id === activeTheme.id}
                onClick={setActiveTheme}
              />
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => setControlsVisible(!controlsVisible)}
        className="absolute bottom-6 left-6 z-40 p-2 rounded-full bg-white/30 hover:bg-white/50 transition shadow-md backdrop-blur-md"
      >
        {controlsVisible ? <EyeOff className="w-6 h-6 text-gray-900" /> : <Eye className="w-6 h-6 text-gray-900" />}
      </button>

      <div className="flex-grow">
        <Canvas camera={{ position: [0, 0, 5], fov: 70 }}>
          <activeTheme.Component />
        </Canvas>
      </div>
    </div>
  );
};

export default AmbientRoom;
