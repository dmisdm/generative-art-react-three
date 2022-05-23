import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stats, OrbitControls } from "@react-three/drei";
import * as three from "three";
import "./styles.css";
import { randFloat } from "three/src/math/MathUtils";
import { useControls } from "leva";

type vec4 = [number, number, number, number];
type vec3 = [number, number, number];
type vec2 = [number, number];

const defaultCameraPosition: vec3 = [0, 7, 0];
const defaultCameraLookAt: vec3 = [0, 0, 0];

const Cube = () => {
  const cube = useRef<three.Mesh>(null);

  useFrame(() => {
    cube.current!.rotation.x += 0.01;
    cube.current!.rotation.y += 0.01;
  });

  return (
    <mesh ref={cube}>
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#0391BA" />
    </mesh>
  );
};

function Plane() {
  const { planeSize } = useControls({ planeSize: { x: 10, y: 0.02, z: 10 } });
  return (
    <mesh>
      <boxBufferGeometry args={[planeSize.x, planeSize.y, planeSize.z]} />
      <meshStandardMaterial color="#912" />
    </mesh>
  );
}

const Scene = () => {
  const { zoom } = useControls("Camera Settings", {
    zoom: {
      min: 4,
      max: 7,
      value: 7,
    },
  });
  const { ambientLightIntensity } = useControls({
    ambientLightIntensity: {
      min: 0,
      max: 2,
      value: 1,
    },
  });
  useFrame(({ camera }) => {
    camera.position.setY(zoom);
  });
  return (
    <>
      <fog near={1} color="hotpink" far={10} />
      <ambientLight intensity={ambientLightIntensity} />
      <gridHelper />
      <axesHelper />
      <pointLight intensity={1.0} position={defaultCameraPosition} />
      <Cube />
      <Plane />
    </>
  );
};

const App = () => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
      }}
    >
      <Canvas
        camera={{
          near: 0.1,
          far: 1000,
          zoom: 1,
        }}
        onCreated={({ gl, camera }) => {
          gl.setClearColor("#ccc");
          camera.position.set(...defaultCameraPosition);
          camera.lookAt(...defaultCameraLookAt);
        }}
      >
        <Stats />
        <OrbitControls />
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default App;
