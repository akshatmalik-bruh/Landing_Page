/* eslint-disable react/no-unknown-property */
import * as THREE from 'three';
import { useRef, useState, useEffect, memo } from 'react';
import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber';
import {
  useFBO,
  useGLTF,
  useScroll,
  Image,
  Scroll,
  Preload,
  ScrollControls,
  MeshTransmissionMaterial,
  Text,
  Environment
} from '@react-three/drei';
import { easing } from 'maath';

export default function FluidGlass({ mode = 'lens', lensProps = {}, barProps = {}, cubeProps = {} }) {
  const Wrapper = mode === 'bar' ? Bar : mode === 'cube' ? Cube : Lens;
  const rawOverrides = mode === 'bar' ? barProps : mode === 'cube' ? cubeProps : lensProps;

  const {
    navItems,
    ...modeProps
  } = rawOverrides;

  return (
    <Canvas 
      camera={{ position: [0, 0, 20], fov: 15 }} 
      gl={{ alpha: true }}
      eventSource={document.body}
      eventPrefix="client"
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <Environment preset="city" />
      <Wrapper modeProps={modeProps}>
        <Preload />
      </Wrapper>
    </Canvas>
  );
}

const ModeWrapper = memo(function ModeWrapper({
  children,
  glb,
  geometryKey,
  lockToBottom = false,
  followPointer = true,
  modeProps = {},
  ...props
}) {
  const ref = useRef();
  
  // NOTE: In a real app, you would use useGLTF with a valid glb path.
  // We'll provide a fallback geometry if the glb isn't loaded so the app doesn't crash.
  let geo = null;
  let nodes = {};
  try {
      const gltf = useGLTF(glb);
      nodes = gltf.nodes;
      geo = nodes[geometryKey]?.geometry;
  } catch (e) {
      console.warn(`Could not load GLB at ${glb}. Using fallback geometry.`);
  }

  const { viewport: vp } = useThree();
  const geoWidthRef = useRef(1);

  useEffect(() => {
    if (geo) {
        geo.computeBoundingBox();
        geoWidthRef.current = geo.boundingBox.max.x - geo.boundingBox.min.x || 1;
    }
  }, [geo]);

  useFrame((state, delta) => {
    const { viewport, pointer, camera } = state;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);

    const destX = followPointer ? (pointer.x * v.width) / 2 : 0;
    const destY = lockToBottom ? -v.height / 2 + 0.2 : followPointer ? (pointer.y * v.height) / 2 : 0;
    
    if (ref.current) {
        easing.damp3(ref.current.position, [destX, destY, 15], 0.15, delta);

        if (modeProps.scale == null) {
          const maxWorld = v.width * 0.9;
          const desired = maxWorld / geoWidthRef.current;
          ref.current.scale.setScalar(Math.min(0.15, desired));
        }
    }
  });

  const { scale, ior, thickness, anisotropy, chromaticAberration, ...extraMat } = modeProps;

  return (
    <>
      {/* We use a fallback geometry if the GLB is missing */}
      <mesh ref={ref} scale={scale ?? 0.15} rotation-x={Math.PI / 2} {...props}>
        {geo ? (
          <bufferGeometry attach="geometry" {...geo} />
        ) : geometryKey === 'Cylinder' ? (
          <cylinderGeometry attach="geometry" args={[1, 1, 0.5, 32]} />
        ) : (
          <boxGeometry attach="geometry" args={[1, 1, 1]} />
        )}
        <MeshTransmissionMaterial
          ior={ior ?? 1.15}
          thickness={thickness ?? 5}
          anisotropy={anisotropy ?? 0.01}
          chromaticAberration={chromaticAberration ?? 0.1}
          clearcoat={1}
          roughness={0}
          transmission={1}
          transparent={true}
          {...extraMat}
        />
      </mesh>
    </>
  );
});

function Lens({ modeProps, ...p }) {
  return <ModeWrapper glb="/assets/3d/lens.glb" geometryKey="Cylinder" followPointer modeProps={modeProps} {...p} />;
}

function Cube({ modeProps, ...p }) {
  return <ModeWrapper glb="/assets/3d/cube.glb" geometryKey="Cube" followPointer modeProps={modeProps} {...p} />;
}

function Bar({ modeProps = {}, ...p }) {
  const defaultMat = {
    transmission: 1,
    roughness: 0,
    thickness: 10,
    ior: 1.15,
    color: '#ffffff',
    attenuationColor: '#ffffff',
    attenuationDistance: 0.25
  };

  return (
    <ModeWrapper
      glb="/assets/3d/bar.glb"
      geometryKey="Cube"
      lockToBottom
      followPointer={false}
      modeProps={{ ...defaultMat, ...modeProps }}
      {...p}
    />
  );
}

function NavItems({ items }) {
  const group = useRef();
  const { viewport, camera } = useThree();

  const DEVICE = {
    mobile: { max: 639, spacing: 0.2, fontSize: 0.035 },
    tablet: { max: 1023, spacing: 0.24, fontSize: 0.035 },
    desktop: { max: Infinity, spacing: 0.3, fontSize: 0.035 }
  };
  const getDevice = () => {
    const w = window.innerWidth;
    return w <= DEVICE.mobile.max ? 'mobile' : w <= DEVICE.tablet.max ? 'tablet' : 'desktop';
  };

  const [device, setDevice] = useState(getDevice());

  useEffect(() => {
    const onResize = () => setDevice(getDevice());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { spacing, fontSize } = DEVICE[device];

  useFrame(() => {
    if (!group.current) return;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);
    group.current.position.set(0, -v.height / 2 + 0.2, 15.1);

    group.current.children.forEach((child, i) => {
      child.position.x = (i - (items.length - 1) / 2) * spacing;
    });
  });

  const handleNavigate = link => {
    if (!link) return;
    link.startsWith('#') ? (window.location.hash = link) : (window.location.href = link);
  };

  return (
    <group ref={group} renderOrder={10}>
      {items.map(({ label, link }) => (
        <Text
          key={label}
          fontSize={fontSize}
          color="white"
          anchorX="center"
          anchorY="middle"
          depthWrite={false}
          outlineWidth={0}
          outlineBlur="20%"
          outlineColor="#000"
          outlineOpacity={0.5}
          depthTest={false}
          renderOrder={10}
          onClick={e => {
            e.stopPropagation();
            handleNavigate(link);
          }}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'auto')}
        >
          {label}
        </Text>
      ))}
    </group>
  );
}

function Images() {
  const group = useRef();
  const data = useScroll();
  const { height } = useThree(s => s.viewport);

  useFrame(() => {
    if (group.current) {
        group.current.children[0].material.zoom = 1 + data.range(0, 1 / 3) / 3;
        group.current.children[1].material.zoom = 1 + data.range(0, 1 / 3) / 3;
        group.current.children[2].material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2;
        group.current.children[3].material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2;
        group.current.children[4].material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2;
    }
  });

  // Replaced external images with basic planes to avoid load errors if assets are missing
  return (
    <group ref={group}>
      <mesh position={[-2, 0, 0]} scale={[3, height / 1.1, 1]}><planeGeometry/><meshBasicMaterial color="#333" /></mesh>
      <mesh position={[2, 0, 3]} scale={[3,3,1]}><planeGeometry/><meshBasicMaterial color="#444" /></mesh>
      <mesh position={[-2.05, -height, 6]} scale={[1, 3, 1]}><planeGeometry/><meshBasicMaterial color="#555" /></mesh>
      <mesh position={[-0.6, -height, 9]} scale={[1, 2, 1]}><planeGeometry/><meshBasicMaterial color="#666" /></mesh>
      <mesh position={[0.75, -height, 10.5]} scale={[1.5,1.5,1]}><planeGeometry/><meshBasicMaterial color="#777" /></mesh>
    </group>
  );
}

function Typography() {
  const DEVICE = {
    mobile: { fontSize: 0.2 },
    tablet: { fontSize: 0.4 },
    desktop: { fontSize: 0.6 }
  };
  const getDevice = () => {
    const w = window.innerWidth;
    return w <= 639 ? 'mobile' : w <= 1023 ? 'tablet' : 'desktop';
  };

  const [device, setDevice] = useState(getDevice());

  useEffect(() => {
    const onResize = () => setDevice(getDevice());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const { fontSize } = DEVICE[device];

  return (
    <Text
      position={[0, 0, 12]}
      fontSize={fontSize}
      letterSpacing={-0.05}
      outlineWidth={0}
      outlineBlur="20%"
      outlineColor="#000"
      outlineOpacity={0.5}
      color="white"
      anchorX="center"
      anchorY="middle"
    >
      Fluid Glass Integration
    </Text>
  );
}
