import "@react-three/fiber";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, OrbitControls, Stars, Text } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { create } from "zustand";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronRight, LockKeyhole, RotateCcw, Volume2, VolumeX, Zap, Sparkles } from "lucide-react";

export type Team = "riders" | "echo";

export type Question = {
  q: string;
  clue: string;
  options: string[];
  correct: number;
  points: number;
};

export type Topic = {
  code: string;
  title: string;
  short: string;
  stageLabel: string;
  questions: Question[];
};

export const topics: Topic[] = [
  {
    code: "6.1",
    title: "Sound Waves",
    short: "Sound Waves",
    stageLabel: "Vibrations & Sound Energy",
    questions: [
      {
        q: "How does sound travel from a vibrating object through the air to your ear?",
        clue: "Watch the air particles: they bump into their neighbors and bounce back in waves!",
        options: [
          "Air particles vibrate back and forth, passing energy along like dominoes",
          "Air particles shoot across the room like tiny bullets",
          "Sound travels through empty space without touching any particles",
          "Air particles stay completely frozen in place"
        ],
        correct: 0,
        points: 25
      },
      {
        q: "Why is outer space completely silent?",
        clue: "Sound is a mechanical wave — it needs a material made of particles to travel.",
        options: [
          "Space is too cold for sound energy to exist",
          "Space is a vacuum with no air or particles to carry vibrations",
          "The Sun's bright light destroys all sound waves",
          "Zero gravity pulls sound waves apart"
        ],
        correct: 1,
        points: 30
      },
      {
        q: "Through which state of matter does sound travel the FASTEST?",
        clue: "When particles are packed tightly close together, vibrations pass along much quicker!",
        options: [
          "Solids (e.g. Steel or Wood)",
          "Liquids (e.g. Water)",
          "Gases (e.g. Air)",
          "A complete vacuum"
        ],
        correct: 0,
        points: 35
      }
    ]
  },
  {
    code: "6.2",
    title: "Reflections of Sound",
    short: "Reflections",
    stageLabel: "Echoes & Echolocation",
    questions: [
      {
        q: "What causes an echo when you shout in a large empty hall or cave?",
        clue: "An echo is a sound wave bouncing off a surface, just like light bounces off a mirror.",
        options: [
          "Sound waves bounce off hard, flat walls and return to your ears",
          "The air traps your voice and replays it after a delay",
          "The walls create a brand new voice of their own",
          "Sound waves lose all their energy and turn around"
        ],
        correct: 0,
        points: 25
      },
      {
        q: "Which of these materials is BEST for absorbing sound to prevent loud echoes in a cinema?",
        clue: "Soft, porous materials trap sound vibrations instead of letting them bounce.",
        options: [
          "Soft, thick acoustic curtains and foam panels",
          "A smooth, flat, rigid concrete wall",
          "A shiny polished metal sheet",
          "A large sheet of smooth glass"
        ],
        correct: 0,
        points: 30
      },
      {
        q: "How do bats and submarines use echoes to find objects in the dark or deep ocean?",
        clue: "They send out sound pulses and measure how long it takes for the bounce to return!",
        options: [
          "They emit sound waves and listen to the returning echo (Echolocation / Sonar)",
          "They use sound waves like flashlights to shine bright light",
          "They make loud noises to scare obstacles out of the way",
          "They listen to the thoughts of other creatures"
        ],
        correct: 0,
        points: 35
      }
    ]
  },
  {
    code: "6.3",
    title: "Structures of the Earth",
    short: "Earth Structures",
    stageLabel: "Crust, Mantle & Core",
    questions: [
      {
        q: "What are the four main layers of the Earth, from the outside to the center?",
        clue: "Start from the rocky surface we stand on, all the way down to the super-hot middle.",
        options: [
          "Atmosphere, Ocean, Crust, Magma",
          "Crust, Mantle, Outer Core, Inner Core",
          "Inner Core, Mantle, Crust, Atmosphere",
          "Soil, Water, Rock, Core"
        ],
        correct: 1,
        points: 30
      },
      {
        q: "Which layer of the Earth is the thin, solid outer shell where all life exists?",
        clue: "It is like the thin, crunchy shell of a hard-boiled egg!",
        options: [
          "The Crust",
          "The Mantle",
          "The Outer Core",
          "The Inner Core"
        ],
        correct: 0,
        points: 25
      },
      {
        q: "What is the Earth's Inner Core like at the very center of our planet?",
        clue: "Even though it is hotter than 5,000°C, crushing gravity and pressure keep it solid!",
        options: [
          "A solid, super-hot metal ball of iron and nickel",
          "A pool of frozen cryogenic ice",
          "A giant hollow cave full of air",
          "A bubbling lake of water and mud"
        ],
        correct: 0,
        points: 35
      }
    ]
  },
  {
    code: "6.4",
    title: "Changes in the Earth",
    short: "Earth Changes",
    stageLabel: "Plates, Quakes & Volcanoes",
    questions: [
      {
        q: "Earth's crust is divided into giant, slowly moving pieces of rock. What are they called?",
        clue: "These giant slabs float very slowly on the softer, hotter mantle below.",
        options: [
          "Tectonic Plates",
          "Continental Bricks",
          "Oceanic Puzzles",
          "Gravity Blocks"
        ],
        correct: 0,
        points: 30
      },
      {
        q: "What natural event happens when two tectonic plates suddenly slip or grind past each other?",
        clue: "The sudden release of trapped energy makes the ground shake violently!",
        options: [
          "An Earthquake",
          "A Solar Eclipse",
          "A sudden freeze of all oceans",
          "Earth stops rotating"
        ],
        correct: 0,
        points: 30
      },
      {
        q: "What can form over millions of years when two continental plates slowly crash into each other?",
        clue: "The immense force crumples and folds the rocky crust upward into towering peaks!",
        options: [
          "Towering Mountain Ranges (like the Himalayas)",
          "A bottomless trench with no rock",
          "A perfectly flat desert with no rocks",
          "The entire continent dissolves into the air"
        ],
        correct: 0,
        points: 35
      }
    ]
  },
  {
    code: "6.5",
    title: "Solar & Lunar Eclipses",
    short: "Eclipses",
    stageLabel: "Sun, Earth & Moon Shadows",
    questions: [
      {
        q: "What happens during a Solar Eclipse?",
        clue: "The Moon moves directly between the Sun and Earth, blocking out sunlight during the day.",
        options: [
          "The Sun passes between the Earth and Moon",
          "The Moon passes between the Sun and Earth, casting its shadow on Earth",
          "The Earth passes between the Sun and the Moon",
          "The Sun runs out of fuel for a few minutes"
        ],
        correct: 1,
        points: 35
      },
      {
        q: "What happens during a Lunar Eclipse?",
        clue: "Earth moves directly between the Sun and Moon, casting Earth's shadow across the full Moon.",
        options: [
          "Earth passes between the Sun and Moon, casting its shadow on the Moon",
          "The Moon falls out of orbit and hits Earth",
          "The Moon passes in front of the Sun",
          "The Moon turns completely invisible forever"
        ],
        correct: 0,
        points: 35
      },
      {
        q: "Why must you NEVER look directly at a Solar Eclipse with your bare eyes?",
        clue: "Even when mostly covered, the Sun's ultraviolet and infrared rays are intense enough to cause blindness.",
        options: [
          "The Sun's powerful rays can permanently burn and damage your eyes",
          "The Moon releases toxic space gas during an eclipse",
          "The eclipse creates blinding lightning bolts",
          "It causes permanent loss of hearing"
        ],
        correct: 0,
        points: 30
      }
    ]
  }
];

export type MascotFeedback = {
  isOpen: boolean;
  isCorrect: boolean;
  team: Team;
  points: number;
  streak: number;
  message: string;
  clue: string;
  canSteal: boolean;
  opponentTeam: Team;
};

type GameState = {
  topicIndex: number;
  questionIndex: number;
  selectedAnswer: Record<Team, number | null>;
  locked: Record<Team, boolean>;
  activeTurn: Team | null;
  attempted: Record<Team, boolean>;
  scores: Record<Team, number>;
  streaks: Record<Team, number>;
  timeLeft: number;
  message: string;
  answerRevealed: boolean;
  isVictoryOpen: boolean;
  mascotFeedback: MascotFeedback | null;

  buzz: (team: Team) => void;
  chooseAnswer: (team: Team, index: number) => void;
  lockAnswer: (team: Team) => void;
  resetRound: () => void;
  advanceQuestion: () => void;
  moveToTopic: (index: number) => void;
  closeVictory: () => void;
  closeMascotFeedback: () => void;
};

export const useEarthPhysicsGame = create<GameState>((set, get) => ({
  topicIndex: 0,
  questionIndex: 0,
  selectedAnswer: { riders: null, echo: null },
  locked: { riders: false, echo: false },
  activeTurn: null,
  attempted: { riders: false, echo: false },
  scores: { riders: 0, echo: 0 },
  streaks: { riders: 0, echo: 0 },
  timeLeft: 60,
  message: "Welcome! Hit your team buzzer (Wave Riders: Key A / Echo Team: Key L) to take the question.",
  answerRevealed: false,
  isVictoryOpen: false,
  mascotFeedback: null,

  buzz: (team: Team) => {
    const { activeTurn, attempted, answerRevealed } = get();
    if (activeTurn !== null || answerRevealed || attempted[team]) return;
    set({
      activeTurn: team,
      message: `⚡ ${team === "riders" ? "Wave Riders" : "Echo Team"} buzzed in first! Select your answer and lock it in.`
    });
  },

  chooseAnswer: (team: Team, index: number) => {
    const { activeTurn, locked, answerRevealed } = get();
    if (activeTurn !== team || locked[team] || answerRevealed) return;
    set((state) => ({
      selectedAnswer: { ...state.selectedAnswer, [team]: index }
    }));
  },

  lockAnswer: (team: Team) => {
    const { activeTurn, selectedAnswer, locked, topicIndex, questionIndex, attempted, answerRevealed, scores, streaks } = get();
    if (activeTurn !== team || locked[team] || answerRevealed) return;
    const choice = selectedAnswer[team];
    if (choice === null) return;

    const topic = topics[topicIndex];
    const currentQ = topic.questions[questionIndex];
    const isCorrect = choice === currentQ.correct;
    const opponent: Team = team === "riders" ? "echo" : "riders";

    if (isCorrect) {
      const newStreak = streaks[team] + 1;
      const multiplier = Math.min(newStreak, 3);
      const pointsWon = currentQ.points * multiplier;

      set((state) => ({
        locked: { ...state.locked, [team]: true },
        answerRevealed: true,
        scores: { ...state.scores, [team]: state.scores[team] + pointsWon },
        streaks: { ...state.streaks, [team]: newStreak },
        message: `🎯 Correct! ${team === "riders" ? "Wave Riders" : "Echo Team"} scored +${pointsWon} pts (${multiplier}x streak)!`,
        mascotFeedback: {
          isOpen: true,
          isCorrect: true,
          team,
          points: pointsWon,
          streak: multiplier,
          message: currentQ.options[currentQ.correct],
          clue: currentQ.clue,
          canSteal: false,
          opponentTeam: opponent
        }
      }));
    } else {
      const newAttempted = { ...attempted, [team]: true };
      const opponentAttempted = attempted[opponent];

      if (!opponentAttempted) {
        // Steal opportunity for opponent
        set((state) => ({
          locked: { ...state.locked, [team]: true },
          attempted: newAttempted,
          streaks: { ...state.streaks, [team]: 0 },
          activeTurn: opponent,
          message: `❌ Incorrect! ${opponent === "riders" ? "Wave Riders" : "Echo Team"} has a STEAL OPPORTUNITY!`,
          mascotFeedback: {
            isOpen: true,
            isCorrect: false,
            team,
            points: 0,
            streak: 0,
            message: `Selected: "${currentQ.options[choice]}"`,
            clue: currentQ.clue,
            canSteal: true,
            opponentTeam: opponent
          }
        }));
      } else {
        // Both missed
        set((state) => ({
          locked: { ...state.locked, [team]: true },
          attempted: newAttempted,
          streaks: { ...state.streaks, [team]: 0 },
          answerRevealed: true,
          message: `❌ Both teams missed! Correct answer was ${String.fromCharCode(65 + currentQ.correct)}.`,
          mascotFeedback: {
            isOpen: true,
            isCorrect: false,
            team,
            points: 0,
            streak: 0,
            message: `Option ${String.fromCharCode(65 + currentQ.correct)}: "${currentQ.options[currentQ.correct]}"`,
            clue: currentQ.clue,
            canSteal: false,
            opponentTeam: opponent
          }
        }));
      }
    }
  },

  closeMascotFeedback: () => set({ mascotFeedback: null }),

  resetRound: () => {
    set({
      selectedAnswer: { riders: null, echo: null },
      locked: { riders: false, echo: false },
      activeTurn: null,
      attempted: { riders: false, echo: false },
      answerRevealed: false,
      timeLeft: 60,
      message: "Round restarted. Hit your team buzzer to answer!"
    });
  },

  advanceQuestion: () => {
    const { topicIndex, questionIndex } = get();
    const topic = topics[topicIndex];
    if (questionIndex < topic.questions.length - 1) {
      set({
        questionIndex: questionIndex + 1,
        selectedAnswer: { riders: null, echo: null },
        locked: { riders: false, echo: false },
        activeTurn: null,
        attempted: { riders: false, echo: false },
        answerRevealed: false,
        timeLeft: 60,
        message: "Next challenge ready! Buzz in when set."
      });
    } else {
      // Advance topic or victory
      if (topicIndex < topics.length - 1) {
        get().moveToTopic(topicIndex + 1);
      } else {
        set({ isVictoryOpen: true });
      }
    }
  },

  moveToTopic: (topicIndex: number) => {
    set({
      topicIndex,
      questionIndex: 0,
      selectedAnswer: { riders: null, echo: null },
      locked: { riders: false, echo: false },
      activeTurn: null,
      attempted: { riders: false, echo: false },
      answerRevealed: false,
      timeLeft: 60,
      message: `Entered Topic ${topicIndex + 1}: ${topics[topicIndex].title}. Ready to buzz!`
    });
  },

  closeVictory: () => set({ isVictoryOpen: false })
}));

export function EarthPhysicsArena() {
  const topicIndex = useEarthPhysicsGame((state) => state.topicIndex);

  return (
    <div className="arena-shell">
      <Canvas shadows camera={{ position: [0, 7.5, 17], fov: 45 }} dpr={[1, 1.8]} gl={{ antialias: true }}>
        <Scene topicIndex={topicIndex} />
      </Canvas>
      <ArenaHud />
    </div>
  );
}

function Scene({ topicIndex }: { topicIndex: number }) {
  return (
    <>
      <color attach="background" args={["#07131e"]} />
      <fog attach="fog" args={["#07131e", 18, 42]} />
      <ambientLight intensity={1.2} color="#d8ecdf" />
      <directionalLight position={[-8, 16, 12]} intensity={2.8} color="#fff6dc" castShadow />
      <Stars radius={45} depth={20} count={600} factor={1.2} fade speed={0.15} />

      {/* Floating Lab Platform */}
      <group position={[0, -0.3, 0]}>
        <mesh receiveShadow>
          <cylinderGeometry args={[8.5, 9.2, 0.6, 64]} />
          <meshStandardMaterial color="#102535" roughness={0.5} metalness={0.4} />
        </mesh>
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.31, 0]}>
          <ringGeometry args={[8.1, 8.35, 64]} />
          <meshBasicMaterial color="#06b6d4" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Dynamic 3D Topic Simulations */}
      {topicIndex === 0 && <SoundWavesSim />}
      {topicIndex === 1 && <ReflectionsSim />}
      {topicIndex === 2 && <EarthStructuresSim />}
      {topicIndex === 3 && <EarthChangesSim />}
      {topicIndex === 4 && <EclipsesSim />}

      <OrbitControls enablePan={false} minDistance={7} maxDistance={28} minPolarAngle={Math.PI / 3.5} maxPolarAngle={Math.PI / 2.05} target={[0, 1.8, 0]} />
    </>
  );
}

/* 1. SOUND WAVES SIMULATION */
function SoundWavesSim() {
  const leftProngRef = useRef<THREE.Group>(null);
  const rightProngRef = useRef<THREE.Group>(null);
  const drumRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const vib = Math.sin(t * 22) * 0.05;
    if (leftProngRef.current) {
      leftProngRef.current.position.z = -0.38 + vib;
      leftProngRef.current.rotation.x = vib * 0.3;
    }
    if (rightProngRef.current) {
      rightProngRef.current.position.z = 0.38 - vib;
      rightProngRef.current.rotation.x = -vib * 0.3;
    }
    if (drumRef.current) drumRef.current.position.x = -0.22 + Math.sin(t * 22 - 3) * 0.08;
  });

  return (
    <group position={[0, 1.8, 0]}>
      {/* 3D Physics Tuning Fork & Wooden Resonance Box */}
      <group position={[-4.5, 0, 0]}>
        {/* Wooden resonance box */}
        <mesh position={[0, -0.9, 0]}>
          <boxGeometry args={[1.6, 0.9, 2.2]} />
          <meshStandardMaterial color="#854d0e" roughness={0.45} metalness={0.1} />
        </mesh>
        {/* Sound aperture */}
        <mesh position={[0.81, -0.9, 0]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.24, 0.24, 0.05, 32]} />
          <meshStandardMaterial color="#1c1917" roughness={0.9} />
        </mesh>
        {/* Brass collar */}
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[0.22, 0.26, 0.25, 24]} />
          <meshStandardMaterial color="#fbbf24" roughness={0.25} metalness={0.85} />
        </mesh>
        {/* Chrome Stem */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.65, 24]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.12} metalness={0.95} emissive="#38bdf8" emissiveIntensity={0.15} />
        </mesh>
        {/* U-Base curve */}
        <mesh position={[0, 0.38, 0]} rotation-y={Math.PI / 2} rotation-z={Math.PI}>
          <torusGeometry args={[0.38, 0.1, 16, 32, Math.PI]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.12} metalness={0.95} emissive="#38bdf8" emissiveIntensity={0.15} />
        </mesh>
        {/* Vibrating Prongs */}
        <group ref={leftProngRef} position={[0, 0.38, -0.38]}>
          <mesh position={[0, 1.1, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 2.2, 24]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.12} metalness={0.92} emissive="#38bdf8" emissiveIntensity={0.2} />
          </mesh>
          <mesh position={[0, 2.2, 0]}>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.12} metalness={0.92} />
          </mesh>
        </group>
        <group ref={rightProngRef} position={[0, 0.38, 0.38]}>
          <mesh position={[0, 1.1, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 2.2, 24]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.12} metalness={0.92} emissive="#38bdf8" emissiveIntensity={0.2} />
          </mesh>
          <mesh position={[0, 2.2, 0]}>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.12} metalness={0.92} />
          </mesh>
        </group>
        {/* Striker Mallet */}
        <group position={[-0.8, 1.8, -0.9]}>
          <mesh rotation-x={Math.PI / 3}>
            <cylinderGeometry args={[0.03, 0.04, 1.4, 16]} />
            <meshStandardMaterial color="#d97706" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.65, 0.38]}>
            <sphereGeometry args={[0.18, 20, 20]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} />
          </mesh>
        </group>
        <Text position={[0, 2.8, 0]} fontSize={0.24} color="#38bdf8">TUNING FORK // 440 Hz</Text>
      </group>

      {/* Wavefront Rings */}
      <group position={[-2.4, 0, 0]}>
        {[1, 2, 3, 4].map((i) => (
          <mesh key={i} rotation-y={Math.PI / 2} position={[i * 1.4 - 0.5, 0, 0]}>
            <ringGeometry args={[0.4 + i * 0.2, 0.48 + i * 0.2, 32]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.6 - i * 0.12} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>

      {/* Human Ear Receiver */}
      <group position={[5.0, 0, 0]}>
        <mesh><boxGeometry args={[0.4, 2.2, 1.2]} /><meshStandardMaterial color="#334155" roughness={0.4} /></mesh>
        <mesh ref={drumRef} rotation-z={Math.PI / 2} position={[-0.22, 0, 0]}><cylinderGeometry args={[0.55, 0.55, 0.1, 24]} /><meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={0.6} /></mesh>
        <Text position={[0, 1.7, 0]} fontSize={0.24} color="#22c55e">EAR DRUM // RECEIVER</Text>
      </group>
    </group>
  );
}

/* 2. REFLECTIONS OF SOUND SIMULATION */
function ReflectionsSim() {
  const [surface, setSurface] = useState<"concrete" | "foam">("concrete");
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);
  const ring4 = useRef<THREE.Mesh>(null);
  const refRing1 = useRef<THREE.Mesh>(null);
  const refRing2 = useRef<THREE.Mesh>(null);
  const refRing3 = useRef<THREE.Mesh>(null);
  const refRing4 = useRef<THREE.Mesh>(null);
  const detectorRef = useRef<THREE.Mesh>(null);
  const impactRef = useRef<THREE.Mesh>(null);

  const incRefs = [ring1, ring2, ring3, ring4];
  const refRefs = [refRing1, refRing2, refRing3, refRing4];

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const speed = 3.6;
    const startX = -4.0;
    const targetX = 3.55;
    const totalSpan = targetX - startX;

    incRefs.forEach((r, i) => {
      if (r.current) {
        const offset = (t * speed + i * (totalSpan / 4)) % totalSpan;
        const prog = offset / totalSpan;
        r.current.position.set(startX + offset, 0, 0);
        r.current.scale.set(0.5 + prog * 1.5, 0.5 + prog * 1.5, 1);
        (r.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0.1, 0.85 - prog * 0.35);
        if (prog > 0.95 && impactRef.current) {
          (impactRef.current.material as THREE.MeshBasicMaterial).opacity = surface === "foam" ? 0.35 : 0.85;
        }
      }
    });

    refRefs.forEach((r, i) => {
      if (r.current) {
        const offset = (t * speed + i * (totalSpan / 4)) % totalSpan;
        const prog = offset / totalSpan;
        r.current.position.set(targetX - offset, 0, 0);
        r.current.scale.set(0.6 + prog * 2.0, 0.6 + prog * 2.0, 1);
        const mat = r.current.material as THREE.MeshBasicMaterial;
        if (surface === "foam") {
          mat.opacity = 0;
        } else {
          mat.opacity = Math.max(0.1, 0.8 - prog * 0.4);
          if (prog > 0.93 && detectorRef.current) {
            (detectorRef.current.material as THREE.MeshBasicMaterial).opacity = 0.95;
          }
        }
      }
    });

    if (impactRef.current) {
      const mat = impactRef.current.material as THREE.MeshBasicMaterial;
      if (mat.opacity > 0.05) mat.opacity -= delta * 3.5;
    }
    if (detectorRef.current) {
      const mat = detectorRef.current.material as THREE.MeshBasicMaterial;
      if (mat.opacity > 0.2) mat.opacity -= delta * 2.2;
    }
  });

  return (
    <group position={[0, 1.8, 0]}>
      {/* Sound source & Receiver Transceiver */}
      <group position={[-4.5, 0, 0]}>
        <mesh position={[0, -0.7, 0]}><cylinderGeometry args={[0.35, 0.45, 1.4, 24]} /><meshStandardMaterial color="#1e293b" /></mesh>
        <mesh position={[0.25, 0, 0]} rotation-z={-Math.PI / 2}><cylinderGeometry args={[0.8, 0.25, 0.5, 32]} /><meshStandardMaterial color="#334155" metalness={0.5} /></mesh>
        <mesh position={[0.38, 0, 0]}><sphereGeometry args={[0.42, 32, 16]} /><meshStandardMaterial color="#f97316" emissive="#c2410c" emissiveIntensity={0.8} /></mesh>
        <mesh ref={detectorRef} position={[0.45, 0, 0]} rotation-y={Math.PI / 2}><ringGeometry args={[0.85, 1.05, 36]} /><meshBasicMaterial color="#22c55e" transparent opacity={0.2} side={THREE.DoubleSide} /></mesh>
        <Text position={[0, 1.3, 0]} fontSize={0.22} color="#f97316">TRANSMITTER & RECEIVER</Text>
      </group>

      {/* Incident & Reflected Ray lines */}
      <Line points={[[-4.0, 0, 0], [3.55, 1.2, 0]]} color="#f97316" lineWidth={2} transparent opacity={0.4} />
      <Line points={[[3.55, 1.2, 0], [-4.0, 2.4, 0]]} color="#38bdf8" lineWidth={2} transparent opacity={0.4} />

      {/* Outbound Incident Wavefronts */}
      {incRefs.map((r, i) => (
        <mesh key={i} ref={r} rotation-y={Math.PI / 2} position={[-4.0, 0, 0]}>
          <torusGeometry args={[0.75, 0.045, 12, 48]} />
          <meshBasicMaterial color="#f97316" transparent opacity={0.7} />
        </mesh>
      ))}

      {/* Returning Reflected Wavefronts */}
      {refRefs.map((r, i) => (
        <mesh key={i} ref={r} rotation-y={Math.PI / 2} position={[3.55, 0, 0]}>
          <torusGeometry args={[0.85, 0.05, 12, 48]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.75} />
        </mesh>
      ))}

      {/* Reflecting Wall */}
      <group position={[3.8, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.5, 4.4, 5.2]} />
          <meshStandardMaterial
            color={surface === "concrete" ? "#e2e8f0" : "#1e293b"}
            roughness={surface === "concrete" ? 0.18 : 0.95}
            metalness={surface === "concrete" ? 0.45 : 0.05}
          />
        </mesh>
        <mesh ref={impactRef} position={[-0.26, 0, 0]} rotation-y={-Math.PI / 2}>
          <planeGeometry args={[5.1, 4.3]} />
          <meshBasicMaterial color={surface === "foam" ? "#ef4444" : "#ffffff"} transparent opacity={0} side={THREE.DoubleSide} />
        </mesh>
        <Text position={[0, 2.5, 0]} fontSize={0.22} color={surface === "concrete" ? "#38bdf8" : "#ef4444"}>
          {surface === "concrete" ? "HARD WALL (95% ECHO)" : "ACOUSTIC FOAM (ABSORBED)"}
        </Text>
      </group>
    </group>
  );
}

/* 3. EARTH STRUCTURES SIMULATION */
function EarthStructuresSim() {
  const earthRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.18;
  });

  return (
    <group ref={earthRef} position={[0, 2.2, 0]}>
      {/* Crust */}
      <mesh><sphereGeometry args={[3.0, 48, 32, 0, Math.PI * 1.55]} /><meshStandardMaterial color="#1d4ed8" roughness={0.7} /></mesh>
      {/* Mantle */}
      <mesh><sphereGeometry args={[2.5, 40, 28, 0, Math.PI * 1.55]} /><meshStandardMaterial color="#d97706" emissive="#b45309" emissiveIntensity={0.35} /></mesh>
      {/* Outer Core */}
      <mesh><sphereGeometry args={[1.7, 36, 24, 0, Math.PI * 1.55]} /><meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.8} /></mesh>
      {/* Inner Core */}
      <mesh><sphereGeometry args={[0.9, 32, 24]} /><meshStandardMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={1.4} /></mesh>

      {/* Dipole Magnetic Field Rings */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation-y={(i * Math.PI) / 3}>
          <torusGeometry args={[3.9 + i * 0.4, 0.03, 10, 48]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

/* 4. CHANGES IN EARTH SIMULATION */
function EarthChangesSim() {
  const gRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (gRef.current) gRef.current.position.x = Math.sin(t * 0.8) * 0.08;
  });

  return (
    <group position={[0, 1.8, 0]}>
      <group ref={gRef}>
        {/* Left plate */}
        <mesh position={[-1.8, 0, 0]}><boxGeometry args={[3.6, 0.8, 3.6]} /><meshStandardMaterial color="#475569" /></mesh>
        <mesh position={[-1.2, 1.2, 0]}><coneGeometry args={[1.2, 1.6, 16]} /><meshStandardMaterial color="#78350f" /></mesh>
        {/* Right subducting plate */}
        <mesh position={[2.0, -0.15, 0]}><boxGeometry args={[3.6, 0.6, 3.6]} /><meshStandardMaterial color="#334155" /></mesh>
      </group>
      <Text position={[0, 2.5, 0]} fontSize={0.24} color="#f97316">CONVERGENT SUBDUCTION BOUNDARY</Text>
    </group>
  );
}

/* 5. ECLIPSES SIMULATION */
function EclipsesSim() {
  const moonRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (moonRef.current) moonRef.current.rotation.y = Math.sin(t * 0.4) * 0.15;
  });

  return (
    <group position={[0, 1.8, 0]}>
      {/* Sun */}
      <mesh position={[-6.0, 0, 0]}><sphereGeometry args={[1.6, 32, 24]} /><meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={1.8} /></mesh>
      <pointLight position={[-6.0, 0, 0]} intensity={14} distance={30} color="#ffedd5" />

      {/* Earth */}
      <mesh position={[1.5, 0, 0]}><sphereGeometry args={[1.2, 32, 24]} /><meshStandardMaterial color="#0284c7" /></mesh>

      {/* Moon */}
      <group ref={moonRef} position={[1.5, 0, 0]}>
        <mesh position={[-2.4, 0, 0]}><sphereGeometry args={[0.38, 24, 16]} /><meshStandardMaterial color="#94a3b8" /></mesh>
      </group>
      <Text position={[0, 2.3, 0]} fontSize={0.24} color="#fef08a">SOLAR ECLIPSE // SUN - MOON - EARTH</Text>
    </group>
  );
}

/* ARENA HUD: DUAL QUESTION CONSOLES ON LEFT & RIGHT BELOW TEAM NAMES */
function ArenaHud() {
  const state = useEarthPhysicsGame();
  const topic = topics[state.topicIndex];
  const question = topic.questions[state.questionIndex];
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/bg-music.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.45;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
    }
  };

  // Keyboard Buzzers: Key A = Wave Riders, Key L = Echo Team
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "a" || e.key === "A") state.buzz("riders");
      else if (e.key === "l" || e.key === "L") state.buzz("echo");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="arena-hud pointer-events-none">
      {/* Top Navigation Bar */}
      <header className="arena-topbar pointer-events-auto">
        <div className="arena-brand">
          <div className="arena-brand-mark"><Volume2 size={20} /></div>
          <div>
            <div className="arena-kicker">UNIT 06 // EARTH PHYSICS</div>
            <h1>Field Lab Command</h1>
          </div>
        </div>

        {/* 5-Topic Navigation Stepper */}
        <div className="arena-topic-stepper">
          {topics.map((item, idx) => (
            <button
              key={item.code}
              type="button"
              onClick={() => state.moveToTopic(idx)}
              className={cn("arena-topic-step-btn", state.topicIndex === idx && "is-active")}
            >
              <span>{idx + 1}</span> {item.short}
            </button>
          ))}
        </div>

        {/* Audio Pill & Timer */}
        <div className="arena-top-right">
          <button type="button" onClick={toggleMusic} className="arena-music-btn" title="Toggle Background Music">
            {isPlayingMusic ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>Music: {isPlayingMusic ? "ON" : "OFF"}</span>
          </button>
          <div className="arena-timer-pill">
            <span>⏱️</span>
            <strong>{state.timeLeft}s</strong>
          </div>
        </div>
      </header>

      {/* LEFT COLUMN: TEAM A (WAVE RIDERS) */}
      <section className="arena-side-col arena-side-col-left pointer-events-auto">
        {/* Team Header */}
        <div className={cn("arena-team-card team-card-riders", state.activeTurn === "riders" && "is-active")}>
          <div className="arena-team-meta">
            <div className="arena-sigil sigil-orange">WR</div>
            <div>
              <small>TEAM A</small>
              <strong>WAVE RIDERS</strong>
            </div>
          </div>
          <div className="arena-team-score-block">
            <span className="arena-score-val score-orange">{state.scores.riders}</span>
            <span className="arena-streak-tag">⚡ {state.streaks.riders}x Streak</span>
          </div>
        </div>

        {/* Team A Question & Answer Console (Directly Below Team A Name) */}
        <div className={cn("arena-console-card", state.activeTurn === "riders" && "is-active")}>
          <div className="arena-console-head">
            <span className="arena-code-pill code-orange">{topic.code} {topic.short}</span>
            <small>Q {state.questionIndex + 1}/{topic.questions.length}</small>
          </div>
          <h3 className="arena-q-text">{question.q}</h3>
          <p className="arena-q-clue">{question.clue}</p>

          <div className="arena-options-list">
            {question.options.map((opt, idx) => {
              const selected = state.selectedAnswer.riders === idx;
              const isCorrect = state.answerRevealed && idx === question.correct;
              const isWrong = state.answerRevealed && selected && !isCorrect;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={state.activeTurn !== "riders" || state.locked.riders || state.answerRevealed}
                  onClick={() => state.chooseAnswer("riders", idx)}
                  className={cn("arena-option-btn", selected && "is-selected-orange", isCorrect && "is-correct", isWrong && "is-wrong")}
                >
                  <span className="arena-opt-letter">{String.fromCharCode(65 + idx)}</span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          <div className="arena-console-actions">
            <Button
              type="button"
              disabled={state.activeTurn !== null || state.attempted.riders || state.answerRevealed}
              onClick={() => state.buzz("riders")}
              className="arena-buzz-btn buzz-orange"
            >
              <Zap size={14} /> BUZZ IN (KEY A)
            </Button>
            <Button
              type="button"
              disabled={state.activeTurn !== "riders" || state.selectedAnswer.riders === null || state.locked.riders || state.answerRevealed}
              onClick={() => state.lockAnswer("riders")}
              className="arena-lock-btn"
            >
              <LockKeyhole size={14} /> Lock Answer
            </Button>
          </div>
        </div>
      </section>

      {/* RIGHT COLUMN: TEAM B (ECHO TEAM) */}
      <section className="arena-side-col arena-side-col-right pointer-events-auto">
        {/* Team Header */}
        <div className={cn("arena-team-card team-card-echo", state.activeTurn === "echo" && "is-active")}>
          <div className="arena-team-meta">
            <div className="arena-sigil sigil-teal">ET</div>
            <div>
              <small>TEAM B</small>
              <strong>ECHO TEAM</strong>
            </div>
          </div>
          <div className="arena-team-score-block">
            <span className="arena-score-val score-teal">{state.scores.echo}</span>
            <span className="arena-streak-tag">⚡ {state.streaks.echo}x Streak</span>
          </div>
        </div>

        {/* Team B Question & Answer Console (Directly Below Team B Name) */}
        <div className={cn("arena-console-card", state.activeTurn === "echo" && "is-active")}>
          <div className="arena-console-head">
            <span className="arena-code-pill code-teal">{topic.code} {topic.short}</span>
            <small>Q {state.questionIndex + 1}/{topic.questions.length}</small>
          </div>
          <h3 className="arena-q-text">{question.q}</h3>
          <p className="arena-q-clue">{question.clue}</p>

          <div className="arena-options-list">
            {question.options.map((opt, idx) => {
              const selected = state.selectedAnswer.echo === idx;
              const isCorrect = state.answerRevealed && idx === question.correct;
              const isWrong = state.answerRevealed && selected && !isCorrect;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={state.activeTurn !== "echo" || state.locked.echo || state.answerRevealed}
                  onClick={() => state.chooseAnswer("echo", idx)}
                  className={cn("arena-option-btn", selected && "is-selected-teal", isCorrect && "is-correct", isWrong && "is-wrong")}
                >
                  <span className="arena-opt-letter">{String.fromCharCode(65 + idx)}</span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          <div className="arena-console-actions">
            <Button
              type="button"
              disabled={state.activeTurn !== null || state.attempted.echo || state.answerRevealed}
              onClick={() => state.buzz("echo")}
              className="arena-buzz-btn buzz-teal"
            >
              <Zap size={14} /> BUZZ IN (KEY L)
            </Button>
            <Button
              type="button"
              disabled={state.activeTurn !== "echo" || state.selectedAnswer.echo === null || state.locked.echo || state.answerRevealed}
              onClick={() => state.lockAnswer("echo")}
              className="arena-lock-btn"
            >
              <LockKeyhole size={14} /> Lock Answer
            </Button>
          </div>
        </div>
      </section>

      {/* Bottom Broadcast Bar */}
      <footer className="arena-bottom-bar pointer-events-auto">
        <div className="arena-broadcast-msg">
          <span className="arena-live-dot" />
          <span>{state.message}</span>
        </div>
        <div className="arena-bottom-btns">
          <Button type="button" variant="outline" onClick={state.resetRound} className="arena-sec-btn">
            <RotateCcw size={14} /> Reset Round
          </Button>
          <Button type="button" onClick={state.advanceQuestion} className="arena-next-btn">
            Next Challenge <ChevronRight size={14} />
          </Button>
        </div>
      </footer>

      {/* MASCOT FEEDBACK MODAL */}
      {state.mascotFeedback && state.mascotFeedback.isOpen && (
        <div className="mascot-modal-backdrop open pointer-events-auto">
          <div className={cn("mascot-modal-card", state.mascotFeedback.isCorrect ? "correct-mode" : "wrong-mode")}>
            <div className={cn("mascot-badge", state.mascotFeedback.isCorrect ? "badge-correct" : "badge-wrong")}>
              {state.mascotFeedback.isCorrect
                ? `🌟 CORRECT ANSWER! (+${state.mascotFeedback.points} PTS)`
                : state.mascotFeedback.canSteal
                ? "🛡️ SHIELD DEFENSE! STEAL OPPORTUNITY"
                : "❌ BOTH TEAMS SHIELDED!"}
            </div>

            <div className="mascot-body-row">
              <div className="mascot-avatar-col">
                <div className={cn("mascot-aura", state.mascotFeedback.isCorrect ? "aura-correct" : "aura-wrong")} />
                <img src="/mascot.png" className="mascot-img" alt="Terra Guardian" />
                <div className="mascot-name-tag">🌍 Terra Guardian</div>
              </div>

              <div className="mascot-speech-bubble">
                <h3 className="mascot-speech-title">
                  {state.mascotFeedback.isCorrect
                    ? `${state.mascotFeedback.team === "riders" ? "Wave Riders" : "Echo Team"} scored spot-on!`
                    : state.mascotFeedback.canSteal
                    ? `Earth's shield held! Steal for ${state.mascotFeedback.opponentTeam === "riders" ? "Wave Riders" : "Echo Team"}!`
                    : "Terra Guardian's Debrief:"}
                </h3>
                <div className="mascot-speech-text">
                  {state.mascotFeedback.isCorrect ? (
                    <div>
                      <strong>{state.mascotFeedback.message}</strong>
                      <span style={{ display: "block", color: "#94a3b8", fontSize: "0.8rem", marginTop: 4 }}>
                        💡 Scientific Principle: {state.mascotFeedback.clue}
                      </span>
                    </div>
                  ) : state.mascotFeedback.canSteal ? (
                    <div>
                      <strong>{state.mascotFeedback.team === "riders" ? "Wave Riders" : "Echo Team"}</strong> chose an incorrect option. Terra's shield deflected the strike!
                      <br /><br />
                      <span style={{ color: "#38bdf8", fontWeight: 800 }}>
                        ⚡ {state.mascotFeedback.opponentTeam === "riders" ? "Wave Riders" : "Echo Team"} can now buzz in to STEAL!
                      </span>
                      <span style={{ display: "block", color: "#94a3b8", fontSize: "0.8rem", marginTop: 4 }}>
                        💡 Clue: {state.mascotFeedback.clue}
                      </span>
                    </div>
                  ) : (
                    <div>
                      Both teams missed this inquiry. <strong>The correct answer is: {state.mascotFeedback.message}</strong>
                      <span style={{ display: "block", color: "#94a3b8", fontSize: "0.8rem", marginTop: 4 }}>
                        💡 Key Concept: {state.mascotFeedback.clue}
                      </span>
                    </div>
                  )}
                </div>
                {state.mascotFeedback.isCorrect && (
                  <div className="mascot-bonus-pill">
                    ⚡ {state.mascotFeedback.streak}x Streak Multiplier Active (+{state.mascotFeedback.points} Pts Total)
                  </div>
                )}
              </div>
            </div>

            <div className="mascot-footer">
              <span className="mascot-countdown-label">Challenge Feedback</span>
              <Button
                type="button"
                onClick={() => {
                  const wasSteal = state.mascotFeedback?.canSteal;
                  state.closeMascotFeedback();
                  if (!wasSteal && state.answerRevealed) {
                    state.advanceQuestion();
                  }
                }}
                className="mascot-action-btn"
              >
                {state.mascotFeedback.isCorrect
                  ? "Next Challenge ➔"
                  : state.mascotFeedback.canSteal
                  ? `⚡ Take Steal (Key ${state.mascotFeedback.opponentTeam === "riders" ? "A" : "L"})`
                  : "Next Question ➔"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
