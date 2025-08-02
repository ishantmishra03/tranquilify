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
  { id: "galaxy", name: "Galaxy", Component: GalaxyScene },
  { id: "ocean", name: "Ocean", Component: OceanScene },
  { id: "forest", name: "Forest", Component: ForestScene },
  { id: "sky", name: "Sky", Component: SkyScene },
  { id: "mountain", name: "Mountain", Component: MountainScene },
];

const AmbientMusic = ({ isPlaying }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.play();
    else audioRef.current.pause();
  }, [isPlaying]);

  return (
    <audio ref={audioRef} loop>
      <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" type="audio/mpeg" />
    </audio>
  );
};

const AmbientRoom = () => {
  const navigate = useNavigate();
  const [playing, setPlaying] = useState(true);
  const [activeTheme, setActiveTheme] = useState(themes[0]);
  const [controlsVisible, setControlsVisible] = useState(true);

  useEffect(() => {
    const random = themes[Math.floor(Math.random() * themes.length)];
    setActiveTheme(random);
  }, []);

  const handleBack = () => {
    navigate(-1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const ThemeButton = ({ theme, isActive, onClick }) => (
    <button
      onClick={() => onClick(theme)}
      className={`px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap
        transition 
        ${
          isActive
            ? "bg-emerald-500 text-white shadow-lg"
            : "bg-white/20 text-white hover:bg-white/40"
        }`}
      aria-label={`Switch to ${theme.name} theme`}
    >
      {theme.name}
    </button>
  );

  return (
    <div className="w-full h-screen relative bg-black flex flex-col select-none">
      <AmbientMusic isPlaying={playing} />

     
      <div
        className={`absolute inset-0 z-30 flex flex-col justify-between transition-opacity duration-500
          ${controlsVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        
        <div className="flex justify-between p-4">
          <button
            onClick={handleBack}
            className="p-2 rounded-full bg-white/90 dark:bg-zinc-800/90 shadow-md hover:bg-white dark:hover:bg-zinc-700 transition"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 text-emerald-600" />
          </button>

          <button
            onClick={() => setPlaying(!playing)}
            className="p-2 rounded-full bg-white/90 dark:bg-zinc-800/90 shadow-md hover:bg-white dark:hover:bg-zinc-700 transition"
            aria-label={playing ? "Pause ambient music" : "Play ambient music"}
          >
            {playing ? (
              <Music className="w-6 h-6 text-emerald-500" />
            ) : (
              <PauseCircleIcon className="w-6 h-6 text-red-400" />
            )}
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

      {/* show/hide controls */}
      <button
        onClick={() => setControlsVisible(!controlsVisible)}
        className="absolute bottom-6 left-6 z-40 p-2 rounded-full bg-white/30 hover:bg-white/50 transition shadow-md backdrop-blur-md"
        aria-label={controlsVisible ? "Hide controls" : "Show controls"}
      >
        {controlsVisible ? (
          <EyeOff className="w-6 h-6 text-gray-900" />
        ) : (
          <Eye className="w-6 h-6 text-gray-900" />
        )}
      </button>

      {/* 3D Scene */}
      <div className="flex-grow">
        <Canvas camera={{ position: [0, 0, 5], fov: 70 }}>
          <activeTheme.Component />
        </Canvas>
      </div>
    </div>
  );
};

export default AmbientRoom;
