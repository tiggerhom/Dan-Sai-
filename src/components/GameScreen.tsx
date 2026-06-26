import React, { useRef, useEffect, useState, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { ControlBindings } from '../types';
import { 
  playJumpSound, 
  playCollectSound, 
  playRattleSound, 
  playPacifySound, 
  playVictorySound, 
  playDefeatSound,
  playClickSound 
} from '../lib/audio';
import { 
  Heart, 
  RefreshCw, 
  LogOut, 
  Award, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  Compass, 
  ArrowLeft, 
  ArrowRight, 
  ArrowUp, 
  ArrowDown, 
  Zap, 
  Activity,
  Flame
} from 'lucide-react';

interface GameScreenProps {
  controls: ControlBindings;
  onBackToMenu: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

// Ground component with tiled texture
function Ground() {
  const texture = useLoader(THREE.TextureLoader, 'https://res.cloudinary.com/dsucg33fv/image/upload/v1782439980/ground_d1kjrx.png');
  
  useEffect(() => {
    if (texture) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(16, 16); // tiling small
      texture.needsUpdate = true;
    }
  }, [texture]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial map={texture} roughness={0.9} metalness={0.1} />
    </mesh>
  );
}

// Phra That Si Song Rak Pagoda (Goal Site)
function Pagoda() {
  return (
    <group position={[0, 0, -20]}>
      {/* Pagoda Base Block 1 */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 1, 4]} />
        <meshStandardMaterial color="#f4f4f5" roughness={0.7} />
      </mesh>
      
      {/* Pagoda Base Block 2 */}
      <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.8, 3]} />
        <meshStandardMaterial color="#e4e4e7" roughness={0.7} />
      </mesh>

      {/* Pagoda Middle Octagonal structure */}
      <mesh position={[0, 2.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.4, 1.0, 8]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.3} metalness={0.2} /> {/* Gold trim */}
      </mesh>

      {/* Main Golden Spire Dome */}
      <mesh position={[0, 3.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 1.2, 1.2, 16]} />
        <meshStandardMaterial color="#fef08a" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Top Tall Sharp Spire */}
      <mesh position={[0, 5.2, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.8, 2.4, 16]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Golden Tip Ring */}
      <mesh position={[0, 6.4, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.5} />
      </mesh>

      {/* Decorative Red and Gold Traditional Banners */}
      <group position={[-2.2, 0, 2.2]}>
        <mesh position={[0, 2, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 4, 8]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        <mesh position={[0.4, 3.6, 0]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.8, 0.4, 0.02]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      </group>

      <group position={[2.2, 0, 2.2]}>
        <mesh position={[0, 2, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 4, 8]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        <mesh position={[-0.4, 3.6, 0]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.8, 0.4, 0.02]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      </group>

      {/* Soft light radiating from the pagoda */}
      <pointLight position={[0, 5, 0]} color="#fbbf24" intensity={2.5} distance={15} decay={2} />
    </group>
  );
}

// 3D Cylinder Kratip (Sticky Rice Basket) Component
function KratipModel({ position, collected }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current && !collected) {
      // Bob up and down and rotate
      groupRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 3 + position[0]) * 0.15;
      groupRef.current.rotation.y += 0.02;
    }
  });

  if (collected) return null;

  return (
    <group ref={groupRef} position={position}>
      {/* Basket lid */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.26, 0.26, 0.12, 12]} />
        <meshStandardMaterial color="#fef08a" roughness={0.8} />
      </mesh>
      {/* Basket main body */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.24, 0.35, 12]} />
        <meshStandardMaterial color="#ca8a04" roughness={0.9} />
      </mesh>
      {/* Dark stripe patterns */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.245, 0.245, 0.03, 12]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <mesh position={[0, -0.08, 0]}>
        <cylinderGeometry args={[0.245, 0.245, 0.03, 12]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      {/* Little red thread hanging */}
      <mesh position={[0, -0.2, 0.24]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.02, 0.2, 0.02]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      {/* Tiny glowing particle aura */}
      <pointLight color="#a3e635" intensity={0.6} distance={2} />
    </group>
  );
}

// 3D Red Mask (Item.png) Component
function MaskModel({ position, collected }) {
  const texture = useLoader(THREE.TextureLoader, 'https://res.cloudinary.com/dsucg33fv/image/upload/v1782439981/item_a371ol.png');
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current && !collected) {
      // Bob up and down and rotate
      groupRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 4.5 + position[0]) * 0.12;
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 1.5;
    }
  });

  if (collected) return null;

  return (
    <group ref={groupRef} position={position}>
      <Billboard>
        <mesh castShadow scale={[1.3, 1.3, 1.3]}>
          <planeGeometry args={[1.0, 1.0]} />
          <meshBasicMaterial 
            map={texture} 
            transparent={true} 
            alphaTest={0.45} 
            side={THREE.DoubleSide} 
          />
        </mesh>
      </Billboard>
      {/* Red glowing light under mask */}
      <pointLight color="#ef4444" intensity={1.5} distance={3} />
    </group>
  );
}

// Enemy Sprite component handling 256x256 sprite sheet offsets
// Sheet has 4 columns (repeat.x = 0.25) and 2 rows (repeat.y = 0.5)
// Row 1 (Idle): top row, so V offset = 0.5
// Row 2 (Walk): bottom row, so V offset = 0.0
function GhostSprite({ frameIndex, isWalking, facingLeft, flashWhiteTimer, flashRedTimer }) {
  const texture = useLoader(THREE.TextureLoader, 'https://res.cloudinary.com/dsucg33fv/image/upload/v1782439979/enemy_mp1zhh.png');

  // Clone texture to avoid multi-instance frame index bleed
  const clonedTexture = useMemo(() => {
    const t = texture.clone();
    t.wrapS = THREE.ClampToEdgeWrapping;
    t.wrapT = THREE.ClampToEdgeWrapping;
    t.minFilter = THREE.NearestFilter;
    t.magFilter = THREE.NearestFilter;
    t.repeat.set(0.25, 0.5);
    return t;
  }, [texture]);

  // Row 1 (Idle) = 1, Row 2 (Walk) = 0
  const rowY = isWalking ? 0 : 1;

  useEffect(() => {
    if (clonedTexture) {
      clonedTexture.offset.set(frameIndex * 0.25, rowY * 0.5);
    }
  }, [clonedTexture, frameIndex, rowY]);

  // Flash state coloring
  let tintColor = '#ffffff';
  let emissiveColor = '#000000';
  let emissiveIntensity = 0;

  if (flashWhiteTimer > 0) {
    tintColor = '#ffffff';
    emissiveColor = '#ffffff';
    emissiveIntensity = 3.5;
  } else if (flashRedTimer > 0) {
    tintColor = '#ff6666';
    emissiveColor = '#ff0000';
    emissiveIntensity = 2.5;
  }

  return (
    <Billboard>
      <mesh castShadow receiveShadow scale={[facingLeft ? 1 : -1, 1, 1]}>
        <planeGeometry args={[1.5, 1.5]} />
        <meshStandardMaterial 
          map={clonedTexture} 
          transparent={true} 
          alphaTest={0.4} 
          side={THREE.DoubleSide}
          color={tintColor}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
          roughness={0.6}
        />
      </mesh>
    </Billboard>
  );
}

// Stylized 3D Phi Ta Khon Ghost Enemy Component using 2D spritesheet
function GhostModel({ position, pacified, facingLeft, frameIndex, isWalking, flashWhiteTimer, flashRedTimer, isFlyingOut }) {
  const meshRef = useRef<THREE.Group>(null);
  const timeOffset = useRef(Math.random() * 100);

  useFrame((state) => {
    if (meshRef.current) {
      const elapsed = state.clock.getElapsedTime();
      
      if (pacified) {
        // Pacified float up to heaven
        meshRef.current.position.y += 0.06;
        meshRef.current.rotation.y += 0.08;
      } else if (isFlyingOut) {
        // High-velocity spin and fly away
        meshRef.current.rotation.y += 0.25;
        meshRef.current.rotation.x += 0.15;
      } else {
        // Normal breathing bob
        meshRef.current.position.y = position[1] + Math.sin(elapsed * 3.0 + timeOffset.current) * 0.08;
      }
    }
  });

  return (
    <group ref={meshRef} position={[position[0], pacified || isFlyingOut ? position[1] : position[1], position[2]]}>
      <GhostSprite 
        frameIndex={frameIndex}
        isWalking={isWalking}
        facingLeft={facingLeft}
        flashWhiteTimer={flashWhiteTimer}
        flashRedTimer={flashRedTimer}
      />
      
      {/* Red evil light under the ghost when not pacified */}
      {!pacified && (
        <pointLight color={flashRedTimer > 0 ? '#ef4444' : '#a855f7'} intensity={1.2} distance={4} />
      )}
    </group>
  );
}

// Interactive Grass Component
function NPCSprite({ frameIndex, isWalking, facingLeft }) {
  const texture = useLoader(THREE.TextureLoader, 'https://res.cloudinary.com/dsucg33fv/image/upload/v1782439980/npc1_pdraha.png');

  // Clone texture to avoid multi-instance frame index bleed
  const clonedTexture = useMemo(() => {
    const t = texture.clone();
    t.wrapS = THREE.ClampToEdgeWrapping;
    t.wrapT = THREE.ClampToEdgeWrapping;
    t.minFilter = THREE.NearestFilter;
    t.magFilter = THREE.NearestFilter;
    t.repeat.set(0.25, 0.5);
    return t;
  }, [texture]);

  // Row 1 (Idle) = 1, Row 2 (Walk) = 0
  const rowY = isWalking ? 0 : 1;

  useEffect(() => {
    if (clonedTexture) {
      clonedTexture.offset.set(frameIndex * 0.25, rowY * 0.5);
    }
  }, [clonedTexture, frameIndex, rowY]);

  return (
    <Billboard>
      <mesh castShadow receiveShadow scale={[facingLeft ? 1 : -1, 1, 1]}>
        <planeGeometry args={[1.5, 1.5]} />
        <meshStandardMaterial 
          map={clonedTexture} 
          transparent={true} 
          alphaTest={0.4} 
          side={THREE.DoubleSide}
          roughness={0.6}
        />
      </mesh>
    </Billboard>
  );
}

function NPCModel({ position, facingLeft, frameIndex, isWalking }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const elapsed = state.clock.getElapsedTime();
      // Normal breathing bob
      meshRef.current.position.y = position[1] + Math.sin(elapsed * 2.2) * 0.04;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <NPCSprite 
        frameIndex={frameIndex}
        isWalking={isWalking}
        facingLeft={facingLeft}
      />
      <pointLight color="#f59e0b" intensity={0.6} distance={4} />
    </group>
  );
}

// Boss Sprite component handling 450x450px sprite sheet with 2 frames, 2 rows
// Columns = 2, Rows = 2. repeat.x = 0.5, repeat.y = 0.5
function BossSprite({ frameIndex, rowY, facingLeft, flashWhiteTimer, flashRedTimer, pulseScale }) {
  const texture = useLoader(THREE.TextureLoader, 'https://res.cloudinary.com/dsucg33fv/image/upload/v1782439980/boss_pblkge.png');

  const clonedTexture = useMemo(() => {
    const t = texture.clone();
    t.wrapS = THREE.ClampToEdgeWrapping;
    t.wrapT = THREE.ClampToEdgeWrapping;
    t.minFilter = THREE.NearestFilter;
    t.magFilter = THREE.NearestFilter;
    t.repeat.set(0.5, 0.5);
    return t;
  }, [texture]);

  useEffect(() => {
    if (clonedTexture) {
      clonedTexture.offset.set(frameIndex * 0.5, rowY * 0.5);
    }
  }, [clonedTexture, frameIndex, rowY]);

  let tintColor = '#ffffff';
  let emissiveColor = '#000000';
  let emissiveIntensity = 0;

  if (flashWhiteTimer > 0) {
    tintColor = '#ffffff';
    emissiveColor = '#ffffff';
    emissiveIntensity = 3.5;
  } else if (flashRedTimer > 0) {
    tintColor = '#ff6666';
    emissiveColor = '#ff0000';
    emissiveIntensity = 2.5;
  }

  const baseScale = 3.2; // Massive boss presence
  const finalScaleX = facingLeft ? -baseScale * pulseScale : baseScale * pulseScale;
  const finalScaleYZ = baseScale * pulseScale;

  return (
    <mesh castShadow scale={[finalScaleX, finalScaleYZ, finalScaleYZ]}>
      <planeGeometry args={[1.0, 1.0]} />
      <meshStandardMaterial 
        map={clonedTexture} 
        transparent={true} 
        alphaTest={0.45} 
        side={THREE.DoubleSide}
        emissive={new THREE.Color(emissiveColor)}
        emissiveIntensity={emissiveIntensity}
        color={new THREE.Color(tintColor)}
        roughness={0.4}
        metalness={0.1}
      />
    </mesh>
  );
}

// Stylized 3D Giant Boss component using custom boss sprite
function BossModel({ position, facingLeft, frameIndex, isWalking, flashWhiteTimer, flashRedTimer, isFlyingOut, pulseScale, rowY }) {
  const meshRef = useRef<THREE.Group>(null);
  const timeOffset = useRef(Math.random() * 100);

  useFrame((state) => {
    if (meshRef.current) {
      const elapsed = state.clock.getElapsedTime();
      if (isFlyingOut) {
        meshRef.current.rotation.y += 0.35;
        meshRef.current.rotation.x += 0.2;
      } else {
        meshRef.current.position.y = position[1] + Math.sin(elapsed * 4.0 + timeOffset.current) * 0.12;
      }
    }
  });

  return (
    <group ref={meshRef} position={[position[0], position[1], position[2]]}>
      <Billboard>
        <BossSprite 
          frameIndex={frameIndex}
          rowY={rowY}
          facingLeft={facingLeft}
          flashWhiteTimer={flashWhiteTimer}
          flashRedTimer={flashRedTimer}
          pulseScale={pulseScale}
        />
      </Billboard>
      {/* Giant evil light under boss */}
      <pointLight color={flashRedTimer > 0 ? '#ff0000' : '#dc2626'} intensity={2.5} distance={10} position={[0, 0.5, 0]} />
    </group>
  );
}

// Glowing Golden Warp Portal Model
function WarpPortalModel({ position, playerPos }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const elapsed = state.clock.getElapsedTime();
      groupRef.current.rotation.y = elapsed * 1.5;
      groupRef.current.position.y = position[1] + Math.sin(elapsed * 3.0) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={[position[0], position[1], position[2]]}>
      {/* Outer Golden Torus */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.12, 16, 64]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.9} />
      </mesh>
      {/* Inner Portal Cylindrical Energy */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <cylinderGeometry args={[1.1, 1.1, 0.15, 32]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.4} />
      </mesh>
      {/* Dynamic light emission */}
      <pointLight color="#f59e0b" intensity={4.0} distance={8} />
    </group>
  );
}

// Falling Circular Fireball Model
function FireballModel({ position }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <pointLight color="#f97316" intensity={2.5} distance={6} />
    </group>
  );
}

// Ground Warning Circular Indicator
function FireballWarning({ position, radius, ratio }) {
  return (
    <group position={[position[0], 0.05, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Outer red pulsing boundary */}
      <mesh>
        <ringGeometry args={[radius * 0.95, radius, 32]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>
      {/* Inner warning expansion filling circle */}
      <mesh>
        <ringGeometry args={[0, radius * ratio, 32]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.45 * ratio} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Interactive Grass Component
function GrassModel({ position, playerPos }) {
  const texture = useLoader(THREE.TextureLoader, 'https://res.cloudinary.com/dsucg33fv/image/upload/v1782439980/grass_2_kjkske.png');
  const meshRef = useRef<THREE.Group>(null);
  const scaleRef = useRef({ y: 1.0, xz: 1.0 });

  useEffect(() => {
    if (texture) {
      texture.minFilter = THREE.NearestFilter;
      texture.magFilter = THREE.NearestFilter;
    }
  }, [texture]);

  useFrame(() => {
    if (meshRef.current) {
      // Calculate distance to player
      const dist = Math.hypot(playerPos.x - position[0], playerPos.z - position[2]);
      
      // If player stepped on it (dist < 0.9), squish it flat
      const targetY = dist < 0.9 ? 0.12 : 1.0;
      const targetXZ = dist < 0.9 ? 1.35 : 1.0; // Expand slightly outwards when flat

      // Smoothly interpolate scale
      scaleRef.current.y += (targetY - scaleRef.current.y) * 0.2;
      scaleRef.current.xz += (targetXZ - scaleRef.current.xz) * 0.2;

      meshRef.current.scale.set(scaleRef.current.xz * 1.3, scaleRef.current.y * 1.3, scaleRef.current.xz * 1.3);
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <Billboard>
        <mesh position={[0, 0.45, 0]}>
          <planeGeometry args={[1.0, 1.0]} />
          <meshBasicMaterial 
            map={texture} 
            transparent={true} 
            alphaTest={0.4} 
            side={THREE.DoubleSide} 
          />
        </mesh>
      </Billboard>
    </group>
  );
}

// Sparkle/Visual Skill Effect Rings
function SkillRing({ position, color, radius, visible }) {
  if (!visible) return null;

  return (
    <mesh position={[position.x, 0.02, position.z]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius * 0.8, radius, 32]} />
      <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.65} />
    </mesh>
  );
}

// 3D Particles representation
function ParticlesContainer({ list }) {
  return (
    <>
      {list.map((p, idx) => (
        <mesh key={idx} position={[p.x, p.y, p.z]}>
          <boxGeometry args={[p.size, p.size, p.size]} />
          <meshBasicMaterial color={p.color} transparent opacity={1 - p.age / p.maxAge} />
        </mesh>
      ))}
    </>
  );
}

// Player Sprite component handling 256x256 sprite sheet offsets
function PlayerSprite({ actionState, frameIndex, facingLeft }) {
  const texture = useLoader(THREE.TextureLoader, 'https://res.cloudinary.com/dsucg33fv/image/upload/v1782439981/player_mask_fmn9yv.png');
  
  // Choose Row from top down:
  // Row 1 (Idle): top, so V offset = 0.75
  // Row 2 (Walk): second, so V offset = 0.50
  // Row 3 (Attack): third, so V offset = 0.25
  // Row 4 (Dance): bottom, so V offset = 0.00
  let rowY = 3;
  if (actionState === 'dance') rowY = 0;
  else if (actionState === 'attack') rowY = 1;
  else if (actionState === 'walk') rowY = 2;
  else rowY = 3;

  useEffect(() => {
    if (texture) {
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.minFilter = THREE.NearestFilter;
      texture.magFilter = THREE.NearestFilter;
      texture.repeat.set(0.25, 0.25);
      texture.offset.set(frameIndex * 0.25, rowY * 0.25);
    }
  }, [texture, frameIndex, rowY]);

  return (
    <Billboard>
      <mesh castShadow receiveShadow scale={[facingLeft ? -1 : 1, 1, 1]}>
        <planeGeometry args={[1.7, 1.7]} />
        <meshBasicMaterial 
          map={texture} 
          transparent={true} 
          alphaTest={0.45} 
          side={THREE.DoubleSide}
        />
      </mesh>
    </Billboard>
  );
}

// Main game controller with input, update tick and camera follow
function GameController({
  controls,
  playerPos,
  setPlayerPos,
  score,
  setScore,
  kratipsCollected,
  setKratipsCollected,
  ghostsPacified,
  setGhostsPacified,
  lives,
  setLives,
  gameStatus,
  setGameStatus,
  kratips,
  setKratips,
  ghosts,
  setGhosts,
  touchLeft,
  touchRight,
  touchUp,
  touchDown,
  touchAction,
  touchDance,
  keysPressed,
  particlesList,
  setParticlesList,
  skillActive,
  setSkillActive,
  masks,
  setMasks,
  isPaused,
  boss,
  setBoss,
  npc,
  setNpc,
  dialogIndex,
  setDialogIndex,
  warpPortal,
  setWarpPortal,
  bossFireballs,
  setBossFireballs
}) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [actionState, setActionState] = useState<'idle' | 'walk' | 'attack' | 'dance'>('idle');
  const [facingLeft, setFacingLeft] = useState(false);

  // Attack frame timer & cooldown
  const animTimer = useRef(0);
  const attackCooldown = useRef(0);
  const danceTimer = useRef(0);
  const lastTime = useRef(performance.now());
  const invulnTimer = useRef(0);
  const enemySpawnTimer = useRef(Math.random() * 2.0 + 1.0); // 1 to 3 seconds spawn timer

  useFrame((state) => {
    const now = performance.now();
    const dt = (now - lastTime.current) / 1000;
    lastTime.current = now;

    if (isPaused || (gameStatus !== 'PLAYING' && gameStatus !== 'CUTSCENE')) {
      lastTime.current = performance.now();
      return;
    }

    let spawnedEnemy: any = null;

    // Tick invuln
    if (invulnTimer.current > 0) {
      invulnTimer.current -= dt;
    }

    // --- 0.2 ENEMY SPAWNING SYSTEM (Every 1-3 seconds) ---
    if (gameStatus === 'PLAYING' && !boss && !warpPortal) {
      enemySpawnTimer.current -= dt;
      if (enemySpawnTimer.current <= 0) {
        // Spawn from random direction around the player at a distance of 14-18 units
        const spawnDist = 14.0 + Math.random() * 4.0;
        const spawnAngle = Math.random() * Math.PI * 2;
        let spawnX = playerPos.x + Math.cos(spawnAngle) * spawnDist;
        let spawnZ = playerPos.z + Math.sin(spawnAngle) * spawnDist;
        
        // Clamp to playable area limits to make sure they are on the grass map
        spawnX = Math.max(-22, Math.min(22, spawnX));
        spawnZ = Math.max(-22, Math.min(22, spawnZ));

        spawnedEnemy = {
          id: Date.now() + Math.random(),
          x: spawnX,
          y: 0.5,
          z: spawnZ,
          startX: spawnX,
          range: 5.0 + Math.random() * 3.0,
          vx: (Math.random() > 0.5 ? 1 : -1) * (1.6 + Math.random() * 0.8), // 1.6 to 2.4 speed
          hue: Math.floor(Math.random() * 360),
          pacified: false,
          hp: 2,
          hitCooldown: 0,
          knockbackX: 0,
          knockbackZ: 0,
          knockbackTimer: 0,
          isFlyingOut: false,
          flyVelocityY: 0,
          flashWhiteTimer: 0,
          flashRedTimer: 0,
          facingLeft: Math.random() > 0.5,
          frameIndex: 0,
          animTimer: 0,
          isWalking: true,
        };

        // Reset timer
        enemySpawnTimer.current = 1.0 + Math.random() * 2.0; // 1-3 seconds
      }
    }

    // --- 0.5 CUTSCENE ANIMATION ENGINE ---
    if (gameStatus === 'CUTSCENE') {
      setActionState('idle');
      setFrameIndex(0);
      
      if (npc) {
        let nx = npc.x;
        let nz = npc.z;
        let nFrameIndex = npc.frameIndex;
        let nAnimTimer = npc.animTimer + dt;
        let nIsWalking = npc.isWalking;

        if (nIsWalking) {
          if (nAnimTimer >= 0.12) {
            nAnimTimer = 0;
            nFrameIndex = (nFrameIndex + 1) % 4;
          }

          nx -= 2.5 * dt; // Walk in speed
          if (nx <= 1.8) {
            nx = 1.8;
            nIsWalking = false;
            nFrameIndex = 0;
          }
        }

        setNpc({
          ...npc,
          x: nx,
          isWalking: nIsWalking,
          frameIndex: nFrameIndex,
          animTimer: nAnimTimer
        });
      }

      // Cinematic Eye-level tracking lookAt the dialog characters
      const focusX = playerPos.x + 0.9;
      const focusZ = playerPos.z;
      state.camera.position.x += (playerPos.x + 0.9 - state.camera.position.x) * 0.05;
      state.camera.position.y += (playerPos.y + 1.4 - state.camera.position.y) * 0.05;
      state.camera.position.z += ((focusZ + 3.8) - state.camera.position.z) * 0.05;
      state.camera.lookAt(focusX, playerPos.y + 0.15, focusZ);

      return;
    }

    // --- 1. HANDLE KEYS & DIAL MOVEMENT ---
    let dx = 0;
    let dz = 0;

    // Read bound keys (A, D, W, S, ArrowKeys etc)
    const isPressed = (actionKey: keyof ControlBindings): boolean => {
      const bound = controls[actionKey].toLowerCase();
      
      // Hardware checks
      if (actionKey === 'left' && (keysPressed.current[bound] || keysPressed.current['arrowleft'] || touchLeft.current)) return true;
      if (actionKey === 'right' && (keysPressed.current[bound] || keysPressed.current['arrowright'] || touchRight.current)) return true;
      if (actionKey === 'jump' && (keysPressed.current[bound] || keysPressed.current['arrowup'] || touchUp.current)) return true; // Jump acts as Up
      if (actionKey === 'action' && (keysPressed.current[bound] || keysPressed.current['arrowdown'] || touchDown.current)) return true; // Action acts as Down
      return false;
    };

    // Calculate directions (8-way movement mapping on Ground Plane X / Z)
    if (isPressed('left')) dx = -1;
    if (isPressed('right')) dx = 1;
    if (isPressed('jump')) dz = -1; // up/forward
    if (isPressed('action')) dz = 1; // down/backward

    // Special trigger keys F (Attack) and O (Dance)
    const isF_Pressed = keysPressed.current['f'] || touchAction.current;
    const isO_Pressed = keysPressed.current['o'] || touchDance.current;

    // State Priorities:
    // 1. Attack action
    // 2. Dance action
    // 3. Walk
    // 4. Idle
    let nextState: 'idle' | 'walk' | 'attack' | 'dance' = 'idle';

    if (attackCooldown.current > 0) {
      nextState = 'attack';
      attackCooldown.current -= dt;
    } else if (isF_Pressed) {
      nextState = 'attack';
      attackCooldown.current = 0.5; // Attack lasts 500ms
      playRattleSound();
      // Shockwave/ring triggers attack
      setSkillActive({ type: 'attack', radius: 1.5 });
      
      // Spawn particles
      spawn3DParticles(playerPos.x, 0.4, playerPos.z, '#ef4444', 15);
    } else if (isO_Pressed) {
      nextState = 'dance';
      danceTimer.current = 0.1;
      // Spawn beautiful gold particles around player
      if (Math.random() < 0.3) {
        spawn3DParticles(playerPos.x, 0.2, playerPos.z, '#fbbf24', 3);
        playCollectSound();
      }
      setSkillActive({ type: 'dance', radius: 3.5 });
    } else {
      if (dx !== 0 || dz !== 0) {
        nextState = 'walk';
      } else {
        nextState = 'idle';
      }
    }

    // Set animation facing direction
    if (dx < 0) setFacingLeft(true);
    if (dx > 0) setFacingLeft(false);

    setActionState(nextState);

    // --- 2. UPDATE SPRITE FRAME INDEX ---
    animTimer.current += dt;
    const frameRate = nextState === 'walk' ? 0.1 : 0.15;
    if (animTimer.current >= frameRate) {
      animTimer.current = 0;
      setFrameIndex((prev) => (prev + 1) % 4);
    }

    // --- 3. MOVEMENT PHYSICS ---
    let speed = 6.2;
    if (nextState === 'dance') speed = 1.2; // Slow down during dance
    if (nextState === 'attack') speed = 0.5; // Walk extremely slow during attack

    if (dx !== 0 && dz !== 0) {
      // Normalize diagonal
      const len = Math.hypot(dx, dz);
      dx /= len;
      dz /= len;
    }

    let newX = playerPos.x + dx * speed * dt;
    let newZ = playerPos.z + dz * speed * dt;

    // Bounds limit
    newX = Math.max(-24.5, Math.min(24.5, newX));
    newZ = Math.max(-24.5, Math.min(24.5, newZ));

    // Pagoda solid collision check (Pagoda radius 2.2 at [0, -20])
    const distToPagoda = Math.hypot(newX, newZ - (-20));
    if (distToPagoda < 2.0) {
      // push back
      const angle = Math.atan2(newZ - (-20), newX);
      newX = Math.cos(angle) * 2.0;
      newZ = -20 + Math.sin(angle) * 2.0;
    }

    setPlayerPos({ x: newX, y: 0.8, z: newZ });

    // --- 4. GHOST COLLISIONS & PACIFY CHECK ---
    const ghostsToProcess = spawnedEnemy ? [...ghosts, spawnedEnemy] : ghosts;
    const updatedGhosts = ghostsToProcess.map((g) => {
      // 1. Tick cooldowns & timers
      const hitCooldown = Math.max(0, (g.hitCooldown ?? 0) - dt);
      const flashWhiteTimer = Math.max(0, (g.flashWhiteTimer ?? 0) - dt);
      const flashRedTimer = Math.max(0, (g.flashRedTimer ?? 0) - dt);
      let animTimer = (g.animTimer ?? 0) + dt;
      let frameIndex = g.frameIndex ?? 0;

      // Animating the frames
      const isWalking = !g.pacified && !g.isFlyingOut && (Math.hypot(playerPos.x - g.x, playerPos.z - g.z) > 0.2);
      const animRate = isWalking ? 0.12 : 0.18;
      if (animTimer >= animRate) {
        animTimer = 0;
        frameIndex = (frameIndex + 1) % 4;
      }

      // If already fully pacified (floating up to heaven)
      if (g.pacified) {
        return {
          ...g,
          hitCooldown,
          flashWhiteTimer,
          flashRedTimer,
          animTimer,
          frameIndex,
          isWalking: false,
        };
      }

      // If flying out (dead, physics handles flying up and out)
      if (g.isFlyingOut) {
        let gy = g.y ?? 0.5;
        let gx = g.x + (g.knockbackX ?? 0) * dt;
        let gz = g.z + (g.knockbackZ ?? 0) * dt;
        let flyVelY = (g.flyVelocityY ?? 12) - 30 * dt; // gravity
        gy += flyVelY * dt;

        return {
          ...g,
          x: gx,
          y: gy,
          z: gz,
          flyVelocityY: flyVelY,
          hitCooldown,
          flashWhiteTimer,
          flashRedTimer,
          animTimer,
          frameIndex,
          isWalking: false,
        };
      }

      // Calculate distance & dir to player
      const dirX = playerPos.x - g.x;
      const dirZ = playerPos.z - g.z;
      const dist = Math.hypot(dirX, dirZ);

      let gx = g.x;
      let gz = g.z;
      let gy = g.y ?? 0.5;
      let facingLeft = g.facingLeft ?? true;
      let hp = g.hp ?? 2;
      let isFlyingOut = false;
      let flyVelocityY = 0;
      let knockbackX = g.knockbackX ?? 0;
      let knockbackZ = g.knockbackZ ?? 0;
      let knockbackTimer = Math.max(0, (g.knockbackTimer ?? 0) - dt);

      // Handle knockback physics
      if (knockbackTimer > 0) {
        gx += knockbackX * dt;
        gz += knockbackZ * dt;
        // Bounds limit for knocked-back ghosts
        gx = Math.max(-24.5, Math.min(24.5, gx));
        gz = Math.max(-24.5, Math.min(24.5, gz));
      } else {
        // Walk/Track towards player
        if (dist > 0.1 && gameStatus === 'PLAYING' && !isPaused) {
          const speed = Math.abs(g.vx);
          gx += (dirX / dist) * speed * dt;
          gz += (dirZ / dist) * speed * dt;
          // Face the direction of movement
          facingLeft = (dirX < 0);
        }
      }

      // Attack check (Dance pacifies immediately, punch F hits)
      let nextPacified = false;
      let nextFlashRedTimer = flashRedTimer;
      let nextFlashWhiteTimer = flashWhiteTimer;

      // Close to player -> flash red as attack signal
      if (dist < 1.6 && !g.isFlyingOut && !g.pacified) {
        nextFlashRedTimer = 0.25;
      }

      // If dance range covers ghost, pacify immediately
      if (nextState === 'dance' && dist < 3.6) {
        playPacifySound();
        spawn3DParticles(gx, 1.0, gz, '#eab308', 25);
        setGhostsPacified((prev) => prev + 1);
        setScore((prev) => prev + 400);
        nextPacified = true;
      } 
      // If punch range covers ghost and cooldown over
      else if (nextState === 'attack' && dist < 1.6 && hitCooldown <= 0) {
        const nextHp = hp - 1;
        // knockback opposite to direction player is facing or opposite to vector
        const normKx = dist > 0.1 ? (dirX / dist) : 1;
        const normKz = dist > 0.1 ? (dirZ / dist) : 0;

        playPacifySound(); // Play satisfying slap/hit sound

        if (nextHp <= 0) {
          // 2nd Hit: FLY OUT OF SCREEN!
          isFlyingOut = true;
          flyVelocityY = 12.0;
          knockbackX = normKx * 16;
          knockbackZ = normKz * 16;
          nextFlashWhiteTimer = 1.5;
          setGhostsPacified((prev) => prev + 1);
          setScore((prev) => prev + 500);
          spawn3DParticles(gx, 0.8, gz, '#ffffff', 30);
        } else {
          // 1st Hit: KNOCKBACK BACKWARDS!
          hp = nextHp;
          knockbackX = normKx * 14;
          knockbackZ = normKz * 14;
          knockbackTimer = 0.35;
          nextFlashWhiteTimer = 0.45;
          spawn3DParticles(gx, 0.8, gz, '#ef4444', 15);
        }
      }

      // Check damage contact (if ghost is alive and not flying out or pacified)
      if (!nextPacified && !isFlyingOut && dist < 1.1 && invulnTimer.current <= 0 && gameStatus === 'PLAYING') {
        playDefeatSound();
        setLives((prev) => {
          const nextLives = prev - 1;
          if (nextLives <= 0) {
            setGameStatus('GAMEOVER');
          }
          return nextLives;
        });
        invulnTimer.current = 1.8; // invuln for 1.8s
        spawn3DParticles(playerPos.x, 0.8, playerPos.z, '#ef4444', 18);
      }

      return {
        ...g,
        x: gx,
        y: gy,
        z: gz,
        facingLeft,
        hp,
        isFlyingOut,
        flyVelocityY,
        knockbackX,
        knockbackZ,
        knockbackTimer,
        pacified: nextPacified,
        hitCooldown: nextState === 'attack' && dist < 1.6 ? 0.55 : hitCooldown,
        flashWhiteTimer: nextFlashWhiteTimer,
        flashRedTimer: nextFlashRedTimer,
        animTimer,
        frameIndex,
        isWalking,
      };
    });
    setGhosts(updatedGhosts);

    // --- 5. KRATIP COLLECTION CHECK ---
    const updatedKratips = kratips.map((k) => {
      if (k.collected) return k;

      const dist = Math.hypot(playerPos.x - k.x, playerPos.z - k.z);
      if (dist < 1.2) {
        playCollectSound();
        spawn3DParticles(k.x, 0.5, k.z, '#bef264', 18);
        setKratipsCollected((prev) => prev + 1);
        setScore((prev) => prev + 250);
        return { ...k, collected: true };
      }
      return k;
    });
    setKratips(updatedKratips);

    // --- 5.5 RED MASK COLLECTION CHECK ---
    const updatedMasks = masks.map((m) => {
      if (m.collected) return m;

      const dist = Math.hypot(playerPos.x - m.x, playerPos.z - m.z);
      if (dist < 1.2) {
        playCollectSound();
        spawn3DParticles(m.x, 0.5, m.z, '#ef4444', 20); // Red sparkle burst
        setLives((prev) => Math.min(5, prev + 1)); // Heal 1 heart up to 5 max
        setScore((prev) => prev + 150);
        return { ...m, collected: true };
      }
      return m;
    });
    setMasks(updatedMasks);

    // --- 6. FINAL BOSS SPAWNING & UPDATE TICK ---
    // Trigger Boss spawn when player returns to pagoda with 5 kratips and 3 pacified ghosts
    const bossTriggerDist = Math.hypot(playerPos.x - 0, playerPos.z - (-20));
    if (kratipsCollected >= 5 && ghostsPacified >= 3 && !boss && !warpPortal && bossTriggerDist < 4.0 && gameStatus === 'PLAYING') {
      setBoss({
        x: 0,
        y: 1.5,
        z: -14, // Spawn in front of the pagoda
        hp: 6,
        maxHp: 6,
        facingLeft: true,
        flashWhiteTimer: 0,
        flashRedTimer: 0,
        isFlyingOut: false,
        flyVelocityY: 0,
        frameIndex: 0,
        animTimer: 0,
        active: true,
        pattern: 'idle',
        patternTimer: 2.0,
        pulseScale: 1.0,
        rowY: 1,
        targetDashX: 0,
        targetDashZ: -14,
        dashType: 'near'
      });
      playVictorySound(); // Dramatic sound
      spawn3DParticles(0, 1.5, -14, '#ef4444', 60);
      spawn3DParticles(0, 1.5, -14, '#fbbf24', 60);
    }

    if (boss) {
      const bFlashWhiteTimer = Math.max(0, boss.flashWhiteTimer - dt);
      const bFlashRedTimer = Math.max(0, boss.flashRedTimer - dt);

      if (boss.isFlyingOut) {
        let bY = boss.y;
        let bX = boss.x;
        let bZ = boss.z;
        let flyVelY = boss.flyVelocityY - 30 * dt; // gravity
        bY += flyVelY * dt;
        bX += 4.5 * dt; // side flyout velocity

        setBoss({
          ...boss,
          x: bX,
          y: bY,
          z: bZ,
          flyVelocityY: flyVelY,
          flashWhiteTimer: bFlashWhiteTimer,
          flashRedTimer: bFlashRedTimer
        });
      } else {
        // --- BOSS PATTERN STATE MACHINE ---
        let bPattern = boss.pattern ?? 'idle';
        let bPatternTimer = (boss.patternTimer ?? 2.0) - dt;
        let bPulseScale = boss.pulseScale ?? 1.0;
        let bRowY = boss.rowY ?? 1;
        let bx = boss.x;
        let bz = boss.z;
        let bFacingLeft = boss.facingLeft;
        let bFrameIndex = boss.frameIndex;
        let bAnimTimer = boss.animTimer + dt;
        let bTargetDashX = boss.targetDashX ?? bx;
        let bTargetDashZ = boss.targetDashZ ?? bz;

        // Base 2-frame animation toggle every 0.25 seconds
        if (bAnimTimer >= 0.25) {
          bAnimTimer = 0;
          bFrameIndex = (bFrameIndex + 1) % 2;
        }

        const bDirX = playerPos.x - bx;
        const bDirZ = playerPos.z - bz;
        const bDist = Math.hypot(bDirX, bDirZ);

        if (bPattern === 'idle') {
          bRowY = 1;
          bPulseScale = 1.0;
          bFacingLeft = (bDirX < 0);
          
          if (bPatternTimer <= 0) {
            // Choose next action: Dash (60% chance) or Pulsate Fireball preparation (40% chance)
            const roll = Math.random();
            if (roll < 0.6) {
              bPattern = 'dash';
              bPatternTimer = 1.2;
              bRowY = 1;
              
              // Decide Near vs Far dash
              const isNear = Math.random() > 0.4;
              if (isNear) {
                // Dash close to player position
                bTargetDashX = playerPos.x + (Math.random() - 0.5) * 5.0;
                bTargetDashZ = playerPos.z + (Math.random() - 0.5) * 5.0;
              } else {
                // Dash far away
                bTargetDashX = (Math.random() > 0.5 ? 1 : -1) * (12.0 + Math.random() * 8.0);
                bTargetDashZ = -8.0 + Math.random() * 16.0;
              }
              // Clamp within playable boundary limits
              bTargetDashX = Math.max(-22.0, Math.min(22.0, bTargetDashX));
              bTargetDashZ = Math.max(-22.0, Math.min(22.0, bTargetDashZ));
            } else {
              bPattern = 'pulsate_prepare';
              bPatternTimer = 1.6;
              bRowY = 0; // Prepare shooting frame
            }
          }
        } 
        else if (bPattern === 'dash') {
          bRowY = 1;
          bPulseScale = 1.0;
          
          // Dash movement speed
          bx += (bTargetDashX - bx) * 4.5 * dt;
          bz += (bTargetDashZ - bz) * 4.5 * dt;
          bFacingLeft = (bTargetDashX < bx);

          if (bPatternTimer <= 0 || Math.hypot(bTargetDashX - bx, bTargetDashZ - bz) < 0.5) {
            // After dash, prepare shooting fireballs
            bPattern = 'pulsate_prepare';
            bPatternTimer = 1.6;
            bRowY = 0;
          }
        } 
        else if (bPattern === 'pulsate_prepare') {
          bRowY = 0;
          bFacingLeft = (bDirX < 0);
          // Pulsating scale expand/shrink warning step
          bPulseScale = 1.0 + Math.sin(state.clock.getElapsedTime() * 16.0) * 0.25;

          if (bPatternTimer <= 0) {
            // Trigger Fireball launch!
            bPattern = 'shoot_fireballs';
            bPatternTimer = 1.0;
            bPulseScale = 1.25; // Stretch on impact
            
            // Spawn 3 circular falling fireballs targeting the player zone
            playCollectSound(); // launch sound
            spawn3DParticles(bx, 2.0, bz, '#ef4444', 20);

            const fireballsListToSpawn = [
              // Fireball directly targeting current player position
              {
                id: Date.now() + Math.random(),
                startX: bx,
                startY: 2.0,
                startZ: bz,
                x: bx,
                y: 2.0,
                z: bz,
                targetX: playerPos.x,
                targetZ: playerPos.z,
                timeToLand: 2.0,
                elapsed: 0,
                impactRadius: 1.8,
                hasLanded: false
              },
              // Offset Fireball Left
              {
                id: Date.now() + Math.random() + 1,
                startX: bx,
                startY: 2.0,
                startZ: bz,
                x: bx,
                y: 2.0,
                z: bz,
                targetX: playerPos.x + (Math.random() * 5.0 - 6.0),
                targetZ: playerPos.z + (Math.random() * 4.0 - 2.0),
                timeToLand: 2.4,
                elapsed: 0,
                impactRadius: 1.8,
                hasLanded: false
              },
              // Offset Fireball Right
              {
                id: Date.now() + Math.random() + 2,
                startX: bx,
                startY: 2.0,
                startZ: bz,
                x: bx,
                y: 2.0,
                z: bz,
                targetX: playerPos.x + (Math.random() * 5.0 + 1.0),
                targetZ: playerPos.z + (Math.random() * 4.0 - 2.0),
                timeToLand: 2.4,
                elapsed: 0,
                impactRadius: 1.8,
                hasLanded: false
              }
            ];

            setBossFireballs((prev) => [...prev, ...fireballsListToSpawn]);
          }
        } 
        else if (bPattern === 'shoot_fireballs') {
          bRowY = 0;
          bPulseScale = 1.1;
          bFacingLeft = (bDirX < 0);
          
          if (bPatternTimer <= 0) {
            bPattern = 'idle';
            bPatternTimer = 1.5;
            bRowY = 1;
            bPulseScale = 1.0;
          }
        }

        // Hit detection from Player Attack:
        let nextHp = boss.hp;
        let nextIsFlyingOut = boss.isFlyingOut;
        let nextFlyVelY = boss.flyVelocityY;
        let nextFlashWhite = bFlashWhiteTimer;
        let nextFlashRed = bFlashRedTimer;

        // Is the player actively swinging the rattle?
        const isPlayerAttacking = (nextState === 'attack');
        
        if (isPlayerAttacking && bDist < 2.2 && boss.flashWhiteTimer <= 0) {
          nextHp = boss.hp - 1;
          nextFlashWhite = 0.5; // Flash white
          playPacifySound();
          spawn3DParticles(bx, 1.0, bz, '#ffffff', 25);

          if (nextHp <= 0) {
            // Defeated! Rocket upwards and SPAWN WARP PORTAL (instead of immediately changing status)
            nextIsFlyingOut = true;
            nextFlyVelY = 14.0;
            setScore((prev) => prev + 2500);
            playVictorySound();
            spawn3DParticles(bx, 1.0, bz, '#fbbf24', 45);

            // Spawn Golden Warp Portal at Golden Pagoda
            setWarpPortal({
              x: 0,
              z: -14,
              active: true
            });

            // Save high score on boss defeat
            const currentHigh = Number(localStorage.getItem('dansai_high_score') || '0');
            const finalScore = score + 2500;
            if (finalScore > currentHigh) {
              localStorage.setItem('dansai_high_score', finalScore.toString());
            }
          }
        }

        // Contact damage with player
        if (!nextIsFlyingOut && bDist < 1.6 && invulnTimer.current <= 0 && gameStatus === 'PLAYING') {
          playDefeatSound();
          setLives((prev) => {
            const nextLives = Math.max(0, prev - 1);
            if (nextLives <= 0) {
              setGameStatus('GAMEOVER');
            }
            return nextLives;
          });
          invulnTimer.current = 1.8;
          spawn3DParticles(playerPos.x, 0.8, playerPos.z, '#ef4444', 20);
        }

        setBoss({
          ...boss,
          x: bx,
          z: bz,
          facingLeft: bFacingLeft,
          frameIndex: bFrameIndex,
          animTimer: bAnimTimer,
          flashWhiteTimer: nextFlashWhite,
          flashRedTimer: nextFlashRed,
          hp: nextHp,
          isFlyingOut: nextIsFlyingOut,
          flyVelocityY: nextFlyVelY,
          maxHp: boss.maxHp,
          active: boss.active,
          pattern: bPattern,
          patternTimer: bPatternTimer,
          pulseScale: bPulseScale,
          rowY: bRowY,
          targetDashX: bTargetDashX,
          targetDashZ: bTargetDashZ
        });
      }
    }

    // --- 6.2 WARP PORTAL COLLISION & EXIT TRIGGER ---
    if (warpPortal && warpPortal.active && gameStatus === 'PLAYING') {
      const distToPortal = Math.hypot(playerPos.x - warpPortal.x, playerPos.z - warpPortal.z);
      if (distToPortal < 1.3) {
        // Walk into warp portal -> Trigger Ending cutscene!
        playVictorySound();
        spawn3DParticles(playerPos.x, 0.8, playerPos.z, '#fbbf24', 50);
        setWarpPortal({ ...warpPortal, active: false }); // Consume/Deactivate
        setGameStatus('CUTSCENE');
        
        // Stand facing each other for cutscene ending conversation
        setPlayerPos({ x: -2.0, y: 0.8, z: -17 });
        setNpc({
          x: 8.0,
          y: 0.8,
          z: -17,
          isWalking: true,
          frameIndex: 0,
          facingLeft: true,
          animTimer: 0
        });
        setDialogIndex(0);
      }
    }

    // --- 6.5 BOSS FIREBALLS UPDATE TICK & DAMAGE ---
    if (bossFireballs.length > 0 && gameStatus === 'PLAYING') {
      const nextFireballs = bossFireballs.map((fb) => {
        const elapsed = fb.elapsed + dt;
        const ratio = Math.min(1.0, elapsed / fb.timeToLand);
        
        // Math Interpolation of falling trajectory (Arc path height)
        const x = fb.startX + (fb.targetX - fb.startX) * ratio;
        const z = fb.startZ + (fb.targetZ - fb.startZ) * ratio;
        const y = fb.startY + (0.5 - fb.startY) * ratio + Math.sin(ratio * Math.PI) * 5.0; // parabolic height arc

        let hasLanded = fb.hasLanded;
        let pDamage = false;

        if (ratio >= 1.0 && !hasLanded) {
          hasLanded = true;
          // Spawn impact particles
          spawn3DParticles(fb.targetX, 0.5, fb.targetZ, '#ef4444', 20);
          spawn3DParticles(fb.targetX, 0.5, fb.targetZ, '#f97316', 15);
          playDefeatSound(); // boom sound

          // Collision splash check against Player
          const distToSlam = Math.hypot(playerPos.x - fb.targetX, playerPos.z - fb.targetZ);
          if (distToSlam < fb.impactRadius && invulnTimer.current <= 0) {
            pDamage = true;
          }
        }

        return {
          ...fb,
          x,
          y,
          z,
          elapsed,
          hasLanded,
          playerHit: pDamage
        };
      });

      // Apply player damage if hit by splash
      const hitAny = nextFireballs.some(fb => fb.playerHit);
      if (hitAny && invulnTimer.current <= 0) {
        playDefeatSound();
        setLives((prev) => {
          const nextLives = Math.max(0, prev - 1);
          if (nextLives <= 0) {
            setGameStatus('GAMEOVER');
          }
          return nextLives;
        });
        invulnTimer.current = 1.8;
        spawn3DParticles(playerPos.x, 0.8, playerPos.z, '#ef4444', 22);
      }

      // Filter out completed/landed fireballs
      setBossFireballs(nextFireballs.filter(fb => fb.elapsed < fb.timeToLand + 0.15));
    }

    // --- 7. CAMERA TRACK FOLLOW ---
    // Beautiful isometric high-angle third person tracking
    state.camera.position.x += (playerPos.x - state.camera.position.x) * 0.08;
    state.camera.position.y += (playerPos.y + 7.0 - state.camera.position.y) * 0.08;
    state.camera.position.z += (playerPos.z + 7.5 - state.camera.position.z) * 0.08;
    state.camera.lookAt(playerPos.x, playerPos.y, playerPos.z - 1.5);

    // --- 8. UPDATE PARTICLES AGE ---
    setParticlesList((prev) => 
      prev
        .map((p) => ({
          ...p,
          x: p.x + p.vx * dt * 25,
          y: p.y + p.vy * dt * 25,
          z: p.z + p.vz * dt * 25,
          age: p.age + 1,
        }))
        .filter((p) => p.age < p.maxAge)
    );
  });

  // Helper to spawn 3D particles in canvas environment
  const spawn3DParticles = (x: number, y: number, z: number, color: string, count: number) => {
    const list: Array<any> = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.1 + 0.05;
      list.push({
        x,
        y,
        z,
        vx: Math.cos(angle) * speed,
        vy: (Math.random() * 0.1 + 0.05), // fly upwards!
        vz: Math.sin(angle) * speed,
        color,
        size: Math.random() * 0.12 + 0.08,
        age: 0,
        maxAge: Math.random() * 25 + 20,
      });
    }
    setParticlesList((prev) => [...prev, ...list]);
  };

  return (
    <group position={[playerPos.x, playerPos.y, playerPos.z]}>
      {/* Player character billboard mesh */}
      <PlayerSprite actionState={actionState} frameIndex={frameIndex} facingLeft={facingLeft} />
      
      {/* Invulnerable flashing halo */}
      {invulnTimer.current > 0 && Math.floor(Date.now() / 100) % 2 === 0 && (
        <mesh position={[0, -0.3, 0]}>
          <ringGeometry args={[0.9, 1.0, 16]} />
          <meshBasicMaterial color="#ef4444" side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Visual active aura under player's feet */}
      {actionState === 'dance' && (
        <mesh position={[0, -0.79, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.1, 0.8, 32]} />
          <meshBasicMaterial color="#eab308" side={THREE.DoubleSide} transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
}

// 8 structural sentences for the RPG Ending Dialogue between player and village elder
const ENDING_DIALOGUES = [
  { speaker: 'ผู้ใหญ่บ้าน (NPC)', text: 'โอ้โห! เจ้าหนุ่ม! ในที่สุดเจ้าก็ปราบผีตาโขนยักษ์แสนเกเรลงได้แล้ว!' },
  { speaker: 'คุณ (Player)', text: 'ขอบคุณครับผู้ใหญ่! มันเหนื่อยมากเลยครับ แต่ผมต้องการปกป้องเทศกาลนี้ให้สำเร็จ' },
  { speaker: 'ผู้ใหญ่บ้าน (NPC)', text: 'เทศกาลด่านซ้ายปีนี้รอดพ้นจากความปั่นป่วนเพราะความกล้าหาญของเจ้าแท้ๆ' },
  { speaker: 'คุณ (Player)', text: 'ผมแค่ทำตามหน้าที่คนด่านซ้ายครับ แถมยังได้เก็บหน้ากากโบราณและข้าวเหนียวแสนอร่อยด้วย!' },
  { speaker: 'ผู้ใหญ่บ้าน (NPC)', text: 'เยี่ยมยอด! เจ้าแสดงความเคารพต่อประเพณีและยังปกป้องพระธาตุเจดีย์ศรีสองรักได้งดงาม' },
  { speaker: 'คุณ (Player)', text: 'หวังว่าปีนี้ชาวบ้านจะมาร่วมรำระบำเต้นเซิ้งกันได้อย่างสนุกสนานไร้กังวลนะครับ' },
  { speaker: 'ผู้ใหญ่บ้าน (NPC)', text: 'แน่นอนสิ! เจ้าคือวีรบุรุษแห่งเทศกาลผีตาโขนด่านซ้ายอย่างเป็นทางการ!' },
  { speaker: 'คุณ (Player)', text: 'ไชโย! งั้นพวกเรามาร่วมฉลองเปิดเทศกาลกันเลยดีกว่าครับ!' }
];

export default function GameScreen({ controls, onBackToMenu, isMuted, onToggleMute }: GameScreenProps) {
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return Number(localStorage.getItem('dansai_high_score') || '0');
  });
  const [kratipsCollected, setKratipsCollected] = useState<number>(0);
  const [ghostsPacified, setGhostsPacified] = useState<number>(0);
  const [lives, setLives] = useState<number>(5);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [masks, setMasks] = useState<Array<{ id: number; x: number; z: number; collected: boolean }>>(() => {
    return Array.from({ length: 4 }).map((_, idx) => ({
      id: idx + 1,
      x: Math.random() * 36 - 18,
      z: Math.random() * 36 - 18,
      collected: false
    }));
  });
  const [gameStatus, setGameStatus] = useState<'PLAYING' | 'GAMEOVER' | 'VICTORY' | 'CUTSCENE' | 'FINISH'>('PLAYING');

  // Giant Boss Ghost state
  const [boss, setBoss] = useState<{
    x: number;
    y: number;
    z: number;
    hp: number;
    maxHp: number;
    facingLeft: boolean;
    flashWhiteTimer: number;
    flashRedTimer: number;
    isFlyingOut: boolean;
    flyVelocityY: number;
    frameIndex: number;
    animTimer: number;
    active: boolean;
    pattern?: string;
    patternTimer?: number;
    pulseScale?: number;
    rowY?: number;
    targetDashX?: number;
    targetDashZ?: number;
    dashType?: string;
  } | null>(null);

  // NPC ending companion state
  const [npc, setNpc] = useState<{
    x: number;
    y: number;
    z: number;
    isWalking: boolean;
    frameIndex: number;
    facingLeft: boolean;
    animTimer: number;
  } | null>(null);

  const [dialogIndex, setDialogIndex] = useState<number>(0);

  // Warp Portal door state
  const [warpPortal, setWarpPortal] = useState<{
    x: number;
    z: number;
    active: boolean;
  } | null>(null);

  // Boss Fireballs state
  const [bossFireballs, setBossFireballs] = useState<Array<{
    id: number;
    startX: number;
    startY: number;
    startZ: number;
    x: number;
    y: number;
    z: number;
    targetX: number;
    targetZ: number;
    timeToLand: number;
    elapsed: number;
    impactRadius: number;
    hasLanded: boolean;
  }>>([]);

  // Ground resources targets
  const TARGET_KRATIP = 5;
  const TARGET_GHOSTS = 10;

  // Real-time mutable references for smooth keystrokes
  const keysPressed = useRef<Record<string, boolean>>({});

  // Touch triggers for virtual joystick
  const touchLeft = useRef(false);
  const touchRight = useRef(false);
  const touchUp = useRef(false);
  const touchDown = useRef(false);
  const touchAction = useRef(false);
  const touchDance = useRef(false);

  // Player position state
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0.8, z: 0 });

  // Custom 3D components list
  const [kratips, setKratips] = useState([
    { id: 1, x: 6, z: -8, collected: false },
    { id: 2, x: -10, z: -15, collected: false },
    { id: 3, x: 12, z: -12, collected: false },
    { id: 4, x: -14, z: 6, collected: false },
    { id: 5, x: 10, z: 12, collected: false },
    { id: 6, x: -4, z: 10, collected: false },
    { id: 7, x: 4, z: -18, collected: false },
    { id: 8, x: -16, z: -8, collected: false },
  ]);

  const [ghosts, setGhosts] = useState([
    { id: 1, x: -6, y: 0.5, z: -5, startX: -6, range: 4.5, vx: 1.8, hue: 0, pacified: false, hp: 2, hitCooldown: 0, knockbackX: 0, knockbackZ: 0, knockbackTimer: 0, isFlyingOut: false, flyVelocityY: 0, flashWhiteTimer: 0, flashRedTimer: 0, facingLeft: true, frameIndex: 0, animTimer: 0, isWalking: false },
    { id: 2, x: 8, y: 0.5, z: -14, startX: 8, range: 5.0, vx: -2.2, hue: 120, pacified: false, hp: 2, hitCooldown: 0, knockbackX: 0, knockbackZ: 0, knockbackTimer: 0, isFlyingOut: false, flyVelocityY: 0, flashWhiteTimer: 0, flashRedTimer: 0, facingLeft: true, frameIndex: 0, animTimer: 0, isWalking: false },
    { id: 3, x: -12, y: 0.5, z: 10, startX: -12, range: 6.0, vx: 1.6, hue: 280, pacified: false, hp: 2, hitCooldown: 0, knockbackX: 0, knockbackZ: 0, knockbackTimer: 0, isFlyingOut: false, flyVelocityY: 0, flashWhiteTimer: 0, flashRedTimer: 0, facingLeft: true, frameIndex: 0, animTimer: 0, isWalking: false },
    { id: 4, x: 12, y: 0.5, z: 8, startX: 12, range: 4.0, vx: -1.9, hue: 35, pacified: false, hp: 2, hitCooldown: 0, knockbackX: 0, knockbackZ: 0, knockbackTimer: 0, isFlyingOut: false, flyVelocityY: 0, flashWhiteTimer: 0, flashRedTimer: 0, facingLeft: true, frameIndex: 0, animTimer: 0, isWalking: false },
    { id: 5, x: 0, y: 0.5, z: 6, startX: 0, range: 5.5, vx: 2.0, hue: 200, pacified: false, hp: 2, hitCooldown: 0, knockbackX: 0, knockbackZ: 0, knockbackTimer: 0, isFlyingOut: false, flyVelocityY: 0, flashWhiteTimer: 0, flashRedTimer: 0, facingLeft: true, frameIndex: 0, animTimer: 0, isWalking: false },
  ]);

  // Interactive grass elements
  const [grasses, setGrasses] = useState<Array<{ id: number; x: number; z: number }>>(() => {
    return Array.from({ length: 45 }).map((_, idx) => {
      let x = Math.random() * 44 - 22;
      let z = Math.random() * 44 - 22;
      // Keep away from pagoda center at [0, -20]
      while (Math.hypot(x, z - (-20)) < 3.0) {
        x = Math.random() * 44 - 22;
        z = Math.random() * 44 - 22;
      }
      return { id: idx + 1, x, z };
    });
  });

  // Visual effects
  const [particlesList, setParticlesList] = useState<Array<any>>([]);
  const [skillActive, setSkillActive] = useState<{ type: string; radius: number } | null>(null);

  // Load keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      // Disable default browser scroll with arrows/space
      if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setGameStatus((currentStatus) => {
          if (currentStatus === 'PLAYING') {
            setIsPaused((p) => !p);
            playClickSound();
          }
          return currentStatus;
        });
      }
      if (e.key === ' ') {
        setGameStatus((status) => {
          if (status === 'CUTSCENE') {
            setDialogIndex((prevIdx) => {
              const nextIdx = prevIdx + 1;
              if (nextIdx >= 8) {
                playVictorySound();
                setTimeout(() => {
                  setGameStatus('FINISH');
                }, 10);
                return prevIdx;
              } else {
                playClickSound();
                return nextIdx;
              }
            });
          }
          return status;
        });
      }
      keysPressed.current[k] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keysPressed.current[k] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Periodic red mask drop (every 12 seconds if playing and not paused)
  useEffect(() => {
    if (gameStatus !== 'PLAYING' || isPaused) return;

    const interval = setInterval(() => {
      setMasks((prev) => {
        // Limit active uncollected masks on map to 6
        const activeCount = prev.filter((m) => !m.collected).length;
        if (activeCount >= 6) return prev;

        const newMask = {
          id: Date.now(),
          x: Math.random() * 36 - 18,
          z: Math.random() * 36 - 18,
          collected: false,
        };
        return [...prev, newMask];
      });
    }, 12000);

    return () => clearInterval(interval);
  }, [gameStatus, isPaused]);

  // Sync high score update
  useEffect(() => {
    const saved = localStorage.getItem('dansai_high_score');
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
  }, [gameStatus]);

  const initLevel = () => {
    setPlayerPos({ x: 0, y: 0.8, z: 4 });
    setScore(0);
    setKratipsCollected(0);
    setGhostsPacified(0);
    setLives(5);
    setIsPaused(false);
    setGameStatus('PLAYING');
    setParticlesList([]);
    setSkillActive(null);
    setBoss(null);
    setNpc(null);
    setDialogIndex(0);
    setWarpPortal(null);
    setBossFireballs([]);

    // Initial 4 scattered masks
    const initialMasks = Array.from({ length: 4 }).map((_, idx) => ({
      id: idx + 1,
      x: Math.random() * 36 - 18,
      z: Math.random() * 36 - 18,
      collected: false
    }));
    setMasks(initialMasks);

    // Reset components list
    setKratips([
      { id: 1, x: 6, z: -8, collected: false },
      { id: 2, x: -10, z: -15, collected: false },
      { id: 3, x: 12, z: -12, collected: false },
      { id: 4, x: -14, z: 6, collected: false },
      { id: 5, x: 10, z: 12, collected: false },
      { id: 6, x: -4, z: 10, collected: false },
      { id: 7, x: 4, z: -18, collected: false },
      { id: 8, x: -16, z: -8, collected: false },
    ]);

    setGhosts([
      { id: 1, x: -6, y: 0.5, z: -5, startX: -6, range: 4.5, vx: 1.8, hue: 0, pacified: false, hp: 2, hitCooldown: 0, knockbackX: 0, knockbackZ: 0, knockbackTimer: 0, isFlyingOut: false, flyVelocityY: 0, flashWhiteTimer: 0, flashRedTimer: 0, facingLeft: true, frameIndex: 0, animTimer: 0, isWalking: false },
      { id: 2, x: 8, y: 0.5, z: -14, startX: 8, range: 5.0, vx: -2.2, hue: 120, pacified: false, hp: 2, hitCooldown: 0, knockbackX: 0, knockbackZ: 0, knockbackTimer: 0, isFlyingOut: false, flyVelocityY: 0, flashWhiteTimer: 0, flashRedTimer: 0, facingLeft: true, frameIndex: 0, animTimer: 0, isWalking: false },
      { id: 3, x: -12, y: 0.5, z: 10, startX: -12, range: 6.0, vx: 1.6, hue: 280, pacified: false, hp: 2, hitCooldown: 0, knockbackX: 0, knockbackZ: 0, knockbackTimer: 0, isFlyingOut: false, flyVelocityY: 0, flashWhiteTimer: 0, flashRedTimer: 0, facingLeft: true, frameIndex: 0, animTimer: 0, isWalking: false },
      { id: 4, x: 12, y: 0.5, z: 8, startX: 12, range: 4.0, vx: -1.9, hue: 35, pacified: false, hp: 2, hitCooldown: 0, knockbackX: 0, knockbackZ: 0, knockbackTimer: 0, isFlyingOut: false, flyVelocityY: 0, flashWhiteTimer: 0, flashRedTimer: 0, facingLeft: true, frameIndex: 0, animTimer: 0, isWalking: false },
      { id: 5, x: 0, y: 0.5, z: 6, startX: 0, range: 5.5, vx: 2.0, hue: 200, pacified: false, hp: 2, hitCooldown: 0, knockbackX: 0, knockbackZ: 0, knockbackTimer: 0, isFlyingOut: false, flyVelocityY: 0, flashWhiteTimer: 0, flashRedTimer: 0, facingLeft: true, frameIndex: 0, animTimer: 0, isWalking: false },
    ]);

    const initialGrasses = Array.from({ length: 45 }).map((_, idx) => {
      let x = Math.random() * 44 - 22;
      let z = Math.random() * 44 - 22;
      while (Math.hypot(x, z - (-20)) < 3.0) {
        x = Math.random() * 44 - 22;
        z = Math.random() * 44 - 22;
      }
      return { id: idx + 1, x, z };
    });
    setGrasses(initialGrasses);
  };

  const formatKeyDisplay = (key: string) => {
    if (key === ' ') return 'Space';
    if (key === 'arrowleft') return '←';
    if (key === 'arrowright') return '→';
    if (key === 'arrowup') return '↑';
    return key.toUpperCase();
  };

  return (
    <div className="w-full min-h-screen bg-black text-white font-kanit flex flex-col justify-between overflow-hidden">
      
      {/* 1. TOP HUD HEADER WITH HEALTH & SCORES */}
      <div className="bg-zinc-950/95 border-b border-red-950 px-4 py-3 flex flex-wrap items-center justify-between gap-4 z-10 shadow-lg">
        
        {/* Game Title Info */}
        <div className="flex items-center gap-2">
          <button 
            id="game-back-to-menu-btn"
            onClick={() => {
              playClickSound();
              onBackToMenu();
            }}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition text-zinc-300 flex items-center justify-center cursor-pointer"
            title="กลับหน้าหลัก"
          >
            <LogOut className="w-5 h-5 text-red-500" />
          </button>
          
          <div>
            <h1 className="text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-400 tracking-wider">
              Dan Sai Adventure
            </h1>
            <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
              3D Phi Ta Khon Edition
            </p>
          </div>
        </div>

        {/* Dynamic score and lives items */}
        <div className="flex items-center gap-4 md:gap-6">
          
          {/* Hearts lives visual */}
          <div className="flex items-center gap-1">
            <span className="text-zinc-500 text-xs font-semibold mr-1">พลังชีวิต:</span>
            {Array.from({ length: 5 }).map((_, i) => (
              <Heart 
                key={i}
                className={`w-5 h-5 md:w-6 md:h-6 transition-all ${
                  i < lives 
                    ? 'fill-red-600 text-red-600 drop-shadow-[0_0_5px_rgba(239,68,68,0.6)] scale-110 animate-pulse' 
                    : 'text-zinc-800 fill-zinc-900'
                }`}
              />
            ))}
          </div>

          {/* Sticky rice basket collection progress */}
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-xl">
            <Sparkles className="w-4 h-4 text-lime-400" />
            <div className="text-xs">
              <span className="text-zinc-400">กระติบ:</span>{' '}
              <span className={`font-bold ${kratipsCollected >= TARGET_KRATIP ? 'text-lime-400' : 'text-yellow-500'}`}>
                {kratipsCollected}/{TARGET_KRATIP}
              </span>
            </div>
          </div>

          {/* Ghosts Pacified counts */}
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-xl">
            <Award className="w-4 h-4 text-yellow-500" />
            <div className="text-xs">
              <span className="text-zinc-400">ปราบผี:</span>{' '}
              <span className={`font-bold ${ghostsPacified >= TARGET_GHOSTS ? 'text-lime-400' : 'text-yellow-500'}`}>
                {ghostsPacified}/{TARGET_GHOSTS}
              </span>
            </div>
          </div>

          {/* Score counter values */}
          <div className="text-right">
            <p className="text-[10px] text-zinc-500 leading-none uppercase tracking-wider">SCORE</p>
            <p className="text-base md:text-lg font-black text-yellow-400 font-mono tracking-tight">{score}</p>
          </div>
          
        </div>

        {/* Sound toggling config */}
        <div className="flex items-center gap-2">
          <button
            id="game-volume-toggle"
            onClick={() => {
              onToggleMute();
              playClickSound();
            }}
            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 transition cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-yellow-500" />}
          </button>
        </div>

      </div>

      {/* 2. THREE.JS 3D CANVAS VIEWPORT */}
      <div className="flex-1 relative bg-black flex items-center justify-center p-1 border-b border-zinc-900 min-h-[400px]">
        
        <Canvas shadows camera={{ fov: 45, position: [0, 9, 10] }} className="w-full h-full bg-[#020204]">
          <color attach="background" args={['#020205']} />
          <fog attach="fog" args={['#020205', 10, 24]} />
          
          {/* Ambient light for subtle fill */}
          <ambientLight intensity={1.1} />
          
          {/* Main directional light cast shadows */}
          <directionalLight 
            position={[10, 18, 5]} 
            intensity={1.8} 
            castShadow 
            shadow-mapSize-width={1024} 
            shadow-mapSize-height={1024} 
          />
          <pointLight position={[playerPos.x, playerPos.y + 1, playerPos.z]} color="#f59e0b" intensity={0.8} distance={8} />

          <Suspense fallback={null}>
            {/* Ground Plane with repeating texture */}
            <Ground />

            {/* Render interactive grasses */}
            {grasses.map((gr) => (
              <GrassModel key={gr.id} position={[gr.x, 0.0, gr.z]} playerPos={playerPos} />
            ))}

            {/* Sacred golden Phra That Chetiya pagoda */}
            <Pagoda />

            {/* Render scattered collectible rice baskets */}
            {kratips.map((k) => (
              <KratipModel key={k.id} position={[k.x, 0.4, k.z]} collected={k.collected} />
            ))}

            {/* Render scattered collectible Red Mask Items */}
            {masks.map((m) => (
              <MaskModel key={m.id} position={[m.x, 0.4, m.z]} collected={m.collected} />
            ))}

            {/* Render patrolling Phi Ta Khon ghosts */}
            {ghosts.map((g) => (
              <GhostModel 
                key={g.id} 
                position={[g.x, g.y ?? 0.5, g.z]} 
                pacified={g.pacified} 
                facingLeft={g.facingLeft ?? true}
                frameIndex={g.frameIndex ?? 0}
                isWalking={g.isWalking ?? false}
                flashWhiteTimer={g.flashWhiteTimer ?? 0}
                flashRedTimer={g.flashRedTimer ?? 0}
                isFlyingOut={g.isFlyingOut ?? false}
              />
            ))}

            {/* Render Giant Boss Ghost if active */}
            {boss && (
              <BossModel 
                position={[boss.x, boss.y, boss.z]} 
                facingLeft={boss.facingLeft}
                frameIndex={boss.frameIndex}
                isWalking={!boss.isFlyingOut}
                flashWhiteTimer={boss.flashWhiteTimer}
                flashRedTimer={boss.flashRedTimer}
                isFlyingOut={boss.isFlyingOut}
                pulseScale={boss.pulseScale ?? 1.0}
                rowY={boss.rowY ?? 1}
              />
            )}

            {/* Render Warp Portal door if active */}
            {warpPortal && warpPortal.active && (
              <WarpPortalModel position={[warpPortal.x, 0.2, warpPortal.z]} playerPos={playerPos} />
            )}

            {/* Render Boss Fireballs */}
            {bossFireballs.map((fb) => (
              <group key={fb.id}>
                {fb.y > 0.5 && (
                  <FireballModel position={[fb.x, fb.y, fb.z]} />
                )}
                {fb.y > 0.5 && (
                  <FireballWarning 
                    position={[fb.targetX, 0.05, fb.targetZ]} 
                    radius={fb.impactRadius} 
                    ratio={Math.min(1.0, fb.elapsed / fb.timeToLand)} 
                  />
                )}
              </group>
            ))}

            {/* Render Cutscene NPC if active */}
            {npc && (
              <NPCModel 
                position={[npc.x, npc.y, npc.z]} 
                facingLeft={npc.facingLeft}
                frameIndex={npc.frameIndex}
                isWalking={npc.isWalking}
              />
            )}

            {/* Dynamic visual effect shockwaves */}
            <SkillRing 
              position={playerPos} 
              color={skillActive?.type === 'attack' ? '#ef4444' : '#eab308'} 
              radius={skillActive?.type === 'attack' ? 1.6 : 3.6} 
              visible={!!skillActive} 
            />

            {/* Dynamic particle meshes list */}
            <ParticlesContainer list={particlesList} />

            {/* Interactive Player controller */}
            <GameController
              controls={controls}
              playerPos={playerPos}
              setPlayerPos={setPlayerPos}
              score={score}
              setScore={setScore}
              kratipsCollected={kratipsCollected}
              setKratipsCollected={setKratipsCollected}
              ghostsPacified={ghostsPacified}
              setGhostsPacified={setGhostsPacified}
              lives={lives}
              setLives={setLives}
              gameStatus={gameStatus}
              setGameStatus={setGameStatus}
              kratips={kratips}
              setKratips={setKratips}
              ghosts={ghosts}
              setGhosts={setGhosts}
              touchLeft={touchLeft}
              touchRight={touchRight}
              touchUp={touchUp}
              touchDown={touchDown}
              touchAction={touchAction}
              touchDance={touchDance}
              keysPressed={keysPressed}
              particlesList={particlesList}
              setParticlesList={setParticlesList}
              skillActive={skillActive}
              setSkillActive={setSkillActive}
              masks={masks}
              setMasks={setMasks}
              isPaused={isPaused}
              boss={boss}
              setBoss={setBoss}
              npc={npc}
              setNpc={setNpc}
              dialogIndex={dialogIndex}
              setDialogIndex={setDialogIndex}
              warpPortal={warpPortal}
              setWarpPortal={setWarpPortal}
              bossFireballs={bossFireballs}
              setBossFireballs={setBossFireballs}
            />
          </Suspense>
        </Canvas>

        {/* MISSION INSTRUCTIONS OVERLAY OVER CANVAS */}
        {gameStatus === 'PLAYING' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-md border border-red-900/50 text-zinc-100 px-5 py-2 rounded-full text-xs flex items-center gap-2 pointer-events-none z-10 text-center shadow-xl">
            <Flame className="w-4 h-4 text-yellow-500 animate-pulse" />
            <span>ภารกิจ: เก็บกระติบให้ครบ 5 อัน และปราบผีอย่างน้อย 3 ตน เพื่อเข้าสู่พระธาตุสีทองที่อยู่ฝั่งเหนือ (Z = -20)!</span>
          </div>
        )}

        {/* BOSS HEALTH BAR OVERLAY */}
        {gameStatus === 'PLAYING' && boss && !boss.isFlyingOut && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-zinc-950/90 border border-red-900/60 p-3 rounded-2xl shadow-2xl z-10 select-none flex flex-col items-center min-w-[280px] md:min-w-[340px] animate-fade-in">
            <div className="flex items-center justify-between w-full text-[10px] text-red-500 font-black uppercase tracking-widest mb-1.5 animate-pulse">
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-red-500" />
                บอสใหญ่ ผีตาโขนยักษ์ (PHI TA KHON GIANT)
              </span>
              <span>{boss.hp}/{boss.maxHp} HP</span>
            </div>
            
            {/* Health bar container */}
            <div className="w-full h-3 bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden p-[2px]">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${(boss.hp / boss.maxHp) * 100}%` }}
              />
            </div>
            
            <p className="text-[9px] text-zinc-500 mt-1.5 font-sans text-center">
              [ เดินเข้าใกล้แล้วกดปุ่ม <kbd className="px-1 py-0.2 rounded bg-zinc-800 font-mono text-[8px] text-red-400">F</kbd> หรือโจมตีเพื่อสร้างความเสียหาย! ]
            </p>
          </div>
        )}

        {/* GORGEOUS MINIMAP RADAR IN COMPASS STYLE */}
        {gameStatus === 'PLAYING' && (
          <div className="absolute top-4 right-4 bg-zinc-950/90 border border-zinc-800 p-3 rounded-2xl shadow-2xl z-10 select-none flex flex-col items-center">
            <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1.5">
              <Compass className="w-3 h-3 text-red-500" />
              <span>เรดาร์ด่านซ้าย (Radar)</span>
            </div>
            
            {/* Minimap Circle representing the 50x50 field */}
            <div className="w-24 h-24 rounded-full bg-zinc-900/80 border border-zinc-700 relative overflow-hidden flex items-center justify-center">
              {/* Center Crosshairs */}
              <div className="absolute inset-0 border-t border-b border-zinc-800/60" />
              <div className="absolute inset-0 border-l border-r border-zinc-800/60" />

              {/* Pagoda Location (at 0, -20) */}
              <div 
                className="absolute w-2 h-2 rounded-full bg-yellow-500 animate-ping"
                style={{
                  left: `${((0 + 25) / 50) * 100}%`,
                  top: `${(((-20) + 25) / 50) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                title="พระธาตุเจดีย์"
              />
              <div 
                className="absolute w-2.5 h-2.5 bg-yellow-500 border border-white rotate-45"
                style={{
                  left: `${((0 + 25) / 50) * 100}%`,
                  top: `${(((-20) + 25) / 50) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              />

              {/* Collectible Rice Baskets (Kratips) */}
              {kratips.map((k) => {
                if (k.collected) return null;
                return (
                  <div 
                    key={k.id}
                    className="absolute w-1.5 h-1.5 rounded-full bg-lime-400"
                    style={{
                      left: `${((k.x + 25) / 50) * 100}%`,
                      top: `${((k.z + 25) / 50) * 100}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                );
              })}

              {/* Patrol Ghosts */}
              {ghosts.map((g) => {
                if (g.pacified) return null;
                return (
                  <div 
                    key={g.id}
                    className="absolute w-1.5 h-1.5 rounded-full bg-red-500"
                    style={{
                      left: `${((g.x + 25) / 50) * 100}%`,
                      top: `${((g.z + 25) / 50) * 100}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                );
              })}

              {/* Red Mask Items */}
              {masks.map((m) => {
                if (m.collected) return null;
                return (
                  <div 
                    key={m.id}
                    className="absolute w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse border border-red-300"
                    style={{
                      left: `${((m.x + 25) / 50) * 100}%`,
                      top: `${((m.z + 25) / 50) * 100}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                );
              })}

              {/* Player Character Dot (White/Red) */}
              <div 
                className="absolute w-2.5 h-2.5 rounded-full bg-white border border-red-600 flex items-center justify-center"
                style={{
                  left: `${((playerPos.x + 25) / 50) * 100}%`,
                  top: `${((playerPos.z + 25) / 50) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="w-1 h-1 bg-red-600 rounded-full" />
              </div>

            </div>
            
            <div className="flex flex-wrap gap-x-2 gap-y-1 text-[9px] text-zinc-500 mt-2 font-medium justify-center max-w-[140px]">
              <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-white border border-red-500 inline-block"></span>คุณ</span>
              <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 bg-yellow-500 rotate-45 inline-block"></span>เจดีย์</span>
              <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-lime-400 inline-block"></span>กระติบ</span>
              <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span>ผีตาโขน</span>
              <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-red-400 border border-red-300 inline-block animate-pulse"></span>หน้ากาก</span>
            </div>
          </div>
        )}

        {/* PAUSE OVERLAY */}
        {gameStatus === 'PLAYING' && isPaused && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="space-y-4 max-w-md">
              <div className="w-20 h-20 bg-zinc-800/50 border border-yellow-500/50 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg shadow-yellow-500/10">
                <Compass className="w-12 h-12 text-yellow-400 animate-pulse" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-400 tracking-wider">
                เกมหยุดชั่วคราว
              </h2>
              <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
                คุณสามารถกดปุ่ม <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-mono text-xs text-yellow-500">ESC</kbd> บนคีย์บอร์ด หรือคลิกปุ่มด้านล่างเพื่อเล่นต่อ
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-md justify-center">
              <button
                id="hud-resume-btn"
                onClick={() => {
                  playClickSound();
                  setIsPaused(false);
                }}
                className="py-3 px-8 rounded-xl bg-gradient-to-r from-lime-600 to-emerald-600 hover:from-lime-500 hover:to-emerald-500 text-white font-extrabold transition shadow-lg flex items-center justify-center gap-2 cursor-pointer min-w-[150px]"
              >
                เล่นต่อ (RESUME)
              </button>
              <button
                id="hud-restart-level-btn-paused"
                onClick={() => {
                  playClickSound();
                  initLevel();
                  setIsPaused(false);
                }}
                className="py-3 px-8 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-extrabold transition border border-zinc-800 flex items-center justify-center gap-2 cursor-pointer min-w-[150px]"
              >
                <RefreshCw className="w-5 h-5 text-yellow-500" />
                เริ่มใหม่ (REPLAY)
              </button>
              <button
                id="hud-exit-to-menu-btn-paused"
                onClick={() => {
                  playClickSound();
                  onBackToMenu();
                }}
                className="py-3 px-8 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-extrabold transition border border-zinc-800 flex items-center justify-center gap-2 cursor-pointer min-w-[150px]"
              >
                กลับเมนู (MENU)
              </button>
            </div>
          </div>
        )}

        {/* VICTORY & GAME OVER OVERLAYS */}
        {(gameStatus === 'VICTORY' || gameStatus === 'GAMEOVER') && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
            {gameStatus === 'VICTORY' ? (
              <div className="space-y-4 animate-bounce-short">
                <div className="w-20 h-20 bg-yellow-500/10 border border-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg shadow-yellow-500/20">
                  <Award className="w-12 h-12 text-yellow-400 animate-pulse" />
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-lime-400 tracking-wider">
                  สำเร็จภารกิจแอดเวนเจอร์ 3D!
                </h2>
                <p className="text-zinc-300 max-w-md mx-auto text-sm md:text-base leading-relaxed">
                  ยินดีด้วย! คุณเดินทางฝ่าฝูงผีตาโขนแสนซน สะสมกระติบข้าวเหนียว และมาสักการะเจดีย์พระธาตุศรีสองรักด่านซ้ายในรูปแบบสามมิติได้อย่างสง่างาม!
                </p>
                <div className="py-2 bg-zinc-900/50 border border-zinc-800 rounded-xl max-w-xs mx-auto">
                  <p className="text-xs text-zinc-400">คะแนนประวัติศาสตร์ของคุณ</p>
                  <p className="text-3xl font-mono font-black text-yellow-400">{score}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-20 h-20 bg-red-500/10 border border-red-500 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg shadow-red-500/20">
                  <ShieldAlert className="w-12 h-12 text-red-500" />
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-red-500 tracking-wider">
                  พลังชีวิตหมดสิ้น!
                </h2>
                <p className="text-zinc-300 max-w-md mx-auto text-sm leading-relaxed">
                  เหล่าผีตาโขนจอมกวนหยอกล้อจนคุณเหน็ดเหนื่อย หน้ากากดินเผาหลุดร่วง ลองเริ่มใหม่อีกครั้งเพื่อพิชิตพระธาตุเจดีย์ด่านซ้าย!
                </p>
              </div>
            )}

            <div className="flex gap-4 mt-6">
              <button
                id="hud-restart-level-btn"
                onClick={initLevel}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-500 hover:to-yellow-500 text-white font-extrabold transition shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-5 h-5" />
                เล่นอีกครั้ง (REPLAY)
              </button>
              <button
                id="hud-exit-to-menu-btn"
                onClick={onBackToMenu}
                className="py-3 px-6 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-extrabold transition border border-zinc-800 cursor-pointer"
              >
                กลับเมนูหลัก (MENU)
              </button>
            </div>
          </div>
        )}

        {/* RPG-STYLE DIALOGUE OVERLAY FOR THE CUTSCENE */}
        {gameStatus === 'CUTSCENE' && (
          <div className="absolute bottom-6 left-4 right-4 bg-zinc-950/95 border-2 border-red-900/50 rounded-2xl p-4 md:p-6 shadow-2xl z-20 flex flex-col md:flex-row items-center gap-4 animate-fade-in pointer-events-auto">
            {/* Left Portrait - Player */}
            <div className={`flex flex-col items-center shrink-0 transition-all duration-300 ${ENDING_DIALOGUES[dialogIndex].speaker.includes('คุณ') ? 'scale-105 opacity-100' : 'scale-95 opacity-40'}`}>
              <div className="w-16 h-16 rounded-full bg-red-950/80 border-2 border-red-500 overflow-hidden flex items-center justify-center shadow-lg shadow-red-500/10">
                <img src="https://res.cloudinary.com/dsucg33fv/image/upload/v1782439981/item_a371ol.png" alt="Player" className="w-10 h-10 object-contain animate-pulse" referrerPolicy="no-referrer" />
              </div>
              <span className="text-[11px] font-black text-red-400 mt-1 uppercase tracking-wider">คุณ (Player)</span>
            </div>

            {/* Main dialogue box */}
            <div className="flex-1 w-full bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-3 md:p-4 min-h-[90px] flex flex-col justify-between">
              <div>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-1">
                  {ENDING_DIALOGUES[dialogIndex].speaker}
                </p>
                <p className="text-zinc-100 text-sm md:text-base font-medium leading-relaxed font-sans text-left">
                  {ENDING_DIALOGUES[dialogIndex].text}
                </p>
              </div>
              
              {/* Controls indication */}
              <div className="flex justify-between items-center mt-3 pt-2 border-t border-zinc-800/50">
                <span className="text-[10px] text-zinc-500 font-mono">
                  [กด SPACEBAR หรือ คลิกปุ่มถัดไป]
                </span>
                <button
                  id="dialog-next-btn"
                  onClick={() => {
                    playClickSound();
                    const nextIdx = dialogIndex + 1;
                    if (nextIdx >= 8) {
                      playVictorySound();
                      setTimeout(() => {
                        setGameStatus('FINISH');
                      }, 10);
                    } else {
                      setDialogIndex(nextIdx);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-yellow-400 hover:text-yellow-300 font-bold transition-all px-3 py-1 bg-zinc-800 hover:bg-zinc-700/80 rounded-lg cursor-pointer border border-zinc-700/50"
                >
                  <span>ถัดไป</span>
                  <span className="animate-pulse">➔</span>
                </button>
              </div>
            </div>

            {/* Right Portrait - NPC */}
            <div className={`flex flex-col items-center shrink-0 transition-all duration-300 ${ENDING_DIALOGUES[dialogIndex].speaker.includes('ผู้ใหญ่บ้าน') ? 'scale-105 opacity-100' : 'scale-95 opacity-40'}`}>
              <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-500 overflow-hidden flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <img src="https://res.cloudinary.com/dsucg33fv/image/upload/v1782439980/npc1_pdraha.png" alt="NPC" className="w-10 h-10 object-contain" referrerPolicy="no-referrer" />
              </div>
              <span className="text-[11px] font-black text-emerald-400 mt-1 uppercase tracking-wider font-sans">ผู้ใหญ่บ้าน (NPC)</span>
            </div>
          </div>
        )}

        {/* FINISH SCREEN WITH TITLE RETURN BUTTON */}
        {gameStatus === 'FINISH' && (
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="space-y-6 max-w-lg animate-bounce-short">
              <div className="w-24 h-24 bg-gradient-to-r from-yellow-500 to-amber-500 p-0.5 rounded-full flex items-center justify-center mx-auto mb-2 shadow-2xl shadow-yellow-500/20">
                <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center">
                  <Award className="w-14 h-14 text-yellow-400 animate-pulse" />
                </div>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-lime-400 tracking-widest font-sans uppercase">
                FINISH
              </h2>
              
              <h3 className="text-xl md:text-2xl font-extrabold text-zinc-100 font-sans">
                ฉลองชัยเทศกาลด่านซ้ายสำเร็จเสร็จสิ้น!
              </h3>
              
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-sans max-w-md mx-auto">
                ความมุ่งมั่นและใจสู้ของคุณได้ช่วยเปิดม่านงานเทศกาลผีตาโขนได้อย่างงดงามดั่งตั้งใจ วีรบุรุษแห่งด่านซ้ายของชาวเรา!
              </p>
              
              <div className="grid grid-cols-2 gap-4 py-3 px-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl max-w-sm mx-auto">
                <div className="text-center">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">บาสเก็ตกระติบ</p>
                  <p className="text-xl font-mono font-black text-lime-400">{kratipsCollected}/{TARGET_KRATIP}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">คะแนนรวมสูงสุด</p>
                  <p className="text-xl font-mono font-black text-yellow-400">{score}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-md justify-center">
              <button
                id="finish-exit-to-menu-btn"
                onClick={() => {
                  playClickSound();
                  onBackToMenu();
                }}
                className="py-4 px-8 rounded-xl bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-500 hover:to-yellow-500 text-white font-extrabold transition shadow-lg flex items-center justify-center gap-2 cursor-pointer text-sm uppercase tracking-wider"
              >
                กลับหน้าหลัก (BACK TO TITLE)
              </button>
              <button
                id="finish-replay-btn"
                onClick={() => {
                  playClickSound();
                  initLevel();
                }}
                className="py-4 px-8 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-extrabold transition border border-zinc-800 flex items-center justify-center gap-2 cursor-pointer text-sm uppercase tracking-wider"
              >
                <RefreshCw className="w-4 h-4 text-yellow-500" />
                เริ่มใหม่ (REPLAY)
              </button>
            </div>
          </div>
        )}

      </div>

      {/* 3. CONTROL OVERLAY & KEYS GUIDE */}
      <div className="bg-zinc-950 border-t border-zinc-900 px-4 py-4 z-10">
        
        {/* PC Keyboard Bindings display */}
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center items-center gap-x-8 gap-y-3 mb-3 text-xs text-zinc-500">
          <span className="font-bold text-zinc-400">ปุ่มคีย์บอร์ดที่ปรับเปลี่ยนได้จริง:</span>
          <div className="flex items-center gap-1.5">
            <kbd className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-yellow-500 font-bold font-mono">
              {formatKeyDisplay(controls.left)}
            </kbd>
            <span>ซ้าย (Left)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-yellow-500 font-bold font-mono">
              {formatKeyDisplay(controls.right)}
            </kbd>
            <span>ขวา (Right)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-yellow-500 font-bold font-mono">
              {formatKeyDisplay(controls.jump)}
            </kbd>
            <span>ขึ้น/เหนือ (Up)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-yellow-500 font-bold font-mono">
              {formatKeyDisplay(controls.action)}
            </kbd>
            <span>ลง/ใต้ (Down)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="px-2 py-1 rounded bg-red-800 border border-red-700 text-white font-bold font-mono">
              F
            </kbd>
            <span>ต่อยโจมตี (Attack)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="px-2 py-1 rounded bg-yellow-800 border border-yellow-700 text-white font-bold font-mono">
              O
            </kbd>
            <span>เต้นสร้างสกิล (Dance Skill)</span>
          </div>
        </div>

        {/* 4. RESPONSIVE TOUCHPAD FOR MOBILE USERS */}
        <div className="flex flex-col sm:flex-row justify-between items-center max-w-xl mx-auto gap-4 p-2 select-none md:hidden border-t border-zinc-900/40 pt-3">
          
          {/* Circular D-Pad for 8-way navigation */}
          <div className="grid grid-cols-3 gap-1.5 bg-zinc-900/60 p-2 rounded-2xl border border-zinc-800">
            <div />
            <button
              id="mobile-nav-up"
              onTouchStart={() => { touchUp.current = true; }}
              onTouchEnd={() => { touchUp.current = false; }}
              onMouseDown={() => { touchUp.current = true; }}
              onMouseUp={() => { touchUp.current = false; }}
              className="w-11 h-11 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center text-zinc-300"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
            <div />

            <button
              id="mobile-nav-left"
              onTouchStart={() => { touchLeft.current = true; }}
              onTouchEnd={() => { touchLeft.current = false; }}
              onMouseDown={() => { touchLeft.current = true; }}
              onMouseUp={() => { touchLeft.current = false; }}
              className="w-11 h-11 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center text-zinc-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-11 h-11 bg-zinc-950 rounded-xl flex items-center justify-center text-[10px] text-zinc-600 font-bold uppercase">3D</div>
            <button
              id="mobile-nav-right"
              onTouchStart={() => { touchRight.current = true; }}
              onTouchEnd={() => { touchRight.current = false; }}
              onMouseDown={() => { touchRight.current = true; }}
              onMouseUp={() => { touchRight.current = false; }}
              className="w-11 h-11 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center text-zinc-300"
            >
              <ArrowRight className="w-5 h-5" />
            </button>

            <div />
            <button
              id="mobile-nav-down"
              onTouchStart={() => { touchDown.current = true; }}
              onTouchEnd={() => { touchDown.current = false; }}
              onMouseDown={() => { touchDown.current = true; }}
              onMouseUp={() => { touchDown.current = false; }}
              className="w-11 h-11 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center text-zinc-300"
            >
              <ArrowDown className="w-5 h-5" />
            </button>
            <div />
          </div>

          {/* Action buttons for P (Attack) and O (Dance) on mobile */}
          <div className="flex gap-4">
            {/* O - Dance */}
            <button
              id="mobile-act-dance"
              onTouchStart={() => { touchDance.current = true; }}
              onTouchEnd={() => { touchDance.current = false; }}
              onMouseDown={() => { touchDance.current = true; }}
              onMouseUp={() => { touchDance.current = false; }}
              className="w-14 h-14 rounded-full bg-yellow-600 border-2 border-yellow-500 hover:bg-yellow-500 active:scale-95 text-white flex flex-col items-center justify-center transition shadow-lg shadow-yellow-950/50"
              title="เต้นสร้างสกิล [O]"
            >
              <Flame className="w-5 h-5 fill-white" />
              <span className="text-[9px] font-bold mt-0.5 uppercase">Dance [O]</span>
            </button>

            {/* F - Attack */}
            <button
              id="mobile-act-punch"
              onTouchStart={() => { touchAction.current = true; }}
              onTouchEnd={() => { touchAction.current = false; }}
              onMouseDown={() => { touchAction.current = true; }}
              onMouseUp={() => { touchAction.current = false; }}
              className="w-14 h-14 rounded-full bg-red-600 border-2 border-red-500 hover:bg-red-500 active:scale-95 text-white flex flex-col items-center justify-center transition shadow-lg shadow-red-950/50"
              title="โจมตี [F]"
            >
              <Zap className="w-5 h-5 fill-white" />
              <span className="text-[9px] font-bold mt-0.5 uppercase">Punch [F]</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
