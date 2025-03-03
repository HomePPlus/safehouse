// // // src/components/particle/ParticleBackground.jsx
// // import React from 'react';
// // import { useEffect, useRef } from 'react';
// // import * as THREE from 'three';
// // import "./ParticleBackground.css"

// // const ParticleBackground = () => {
// //   const containerRef = useRef(null);
// //   const scene = useRef(null);
// //   const camera = useRef(null);
// //   const renderer = useRef(null);
// //   const particles = useRef(null);
// //   const animationFrameId = useRef(null);

// //   useEffect(() => {
// //     // 1. Three.js 초기화
// //     scene.current = new THREE.Scene();
// //     camera.current = new THREE.PerspectiveCamera(
// //       75,
// //       window.innerWidth / window.innerHeight,
// //       0.1,
// //       1000
// //     );
// //     renderer.current = new THREE.WebGLRenderer({ 
// //       alpha: true,
// //       antialias: true 
// //     });
    
// //     // 2. 렌더러 설정
// //     renderer.current.setSize(window.innerWidth, window.innerHeight);
// //     renderer.current.setPixelRatio(window.devicePixelRatio);
// //     containerRef.current.appendChild(renderer.current.domElement);

// //     // 3. 카메라 위치 설정
// //     camera.current.position.z = 500;

// //     // 4. 파티클 생성
// //     const geometry = new THREE.BufferGeometry();
// //     const vertices = [];
// //     const particleCount = 5000;

// //     for (let i = 0; i < particleCount; i++) {
// //       vertices.push(
// //         THREE.MathUtils.randFloatSpread(2000), // X
// //         THREE.MathUtils.randFloatSpread(2000), // Y
// //         THREE.MathUtils.randFloatSpread(2000)  // Z
// //       );
// //     }

// //     geometry.setAttribute(
// //       'position',
// //       new THREE.Float32BufferAttribute(vertices, 3)
// //     );

// //     const material = new THREE.PointsMaterial({
// //       size: 3,
// //       color: 0x00ff88,
// //       transparent: true,
// //       opacity: 0.8,
// //     });

// //     particles.current = new THREE.Points(geometry, material);
// //     scene.current.add(particles.current);

// //     // 5. 애니메이션 루프
// //     const animate = () => {
// //       animationFrameId.current = requestAnimationFrame(animate);
      
// //       particles.current.rotation.x += 0.001;
// //       particles.current.rotation.y += 0.002;
      
// //       renderer.current.render(scene.current, camera.current);
// //     };
// //     animate();

// //     // 6. 리사이즈 핸들러
// //     const handleResize = () => {
// //       camera.current.aspect = window.innerWidth / window.innerHeight;
// //       camera.current.updateProjectionMatrix();
// //       renderer.current.setSize(window.innerWidth, window.innerHeight);
// //     };

// //     window.addEventListener('resize', handleResize);

// //     // 7. 클린업 함수
// //     return () => {
// //       window.removeEventListener('resize', handleResize);
// //       cancelAnimationFrame(animationFrameId.current);
// //       renderer.current.dispose();
// //       containerRef.current.removeChild(renderer.current.domElement);
// //     };
// //   }, []);

// //   return <div ref={containerRef} className="particle-container" />;
// // };

// // export default ParticleBackground;

// import React, { useEffect, useRef } from 'react';
// import * as THREE from 'three';

// const ParticleBackground = () => {
//   const containerRef = useRef(null);

//   useEffect(() => {
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//     const renderer = new THREE.WebGLRenderer({ antialias: true });

//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setClearColor(0xffffff); // 흰색 배경
//     containerRef.current.appendChild(renderer.domElement);

//     const geometry = new THREE.BufferGeometry();
//     const particleCount = 5000;
//     const positions = new Float32Array(particleCount * 3);
//     const colors = new Float32Array(particleCount * 3);
//     const sizes = new Float32Array(particleCount);

//     const color = new THREE.Color();

//     for (let i = 0; i < particleCount * 3; i++) {
//       positions[i] = (Math.random() - 0.5) * 10;
//       color.setHSL(0.33 + Math.random() * 0.05, 0.9, 0.5 + Math.random() * 0.2);
//       colors[i * 3] = color.r;
//       colors[i * 3 + 1] = color.g;
//       colors[i * 3 + 2] = color.b;
//       sizes[i] = Math.random() * 5 + 1;
//     }

//     geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
//     geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
//     geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

//     const material = new THREE.PointsMaterial({
//       size: 0.07,
//       vertexColors: true,
//       transparent: true,
//       opacity: 0.3,
//     });

//     const particles = new THREE.Points(geometry, material);
//     scene.add(particles);

//     camera.position.z = 5;

//     const animate = () => {
//       requestAnimationFrame(animate);

//       particles.rotation.x += 0.001;
//       particles.rotation.y += 0.002;

//       const positions = particles.geometry.attributes.position.array;
//       for (let i = 0; i < positions.length; i += 3) {
//         positions[i] += Math.sin(Date.now() * 0.001 + i) * 0.001;
//         positions[i + 1] += Math.cos(Date.now() * 0.002 + i) * 0.001;
//       }
//       particles.geometry.attributes.position.needsUpdate = true;

//       renderer.render(scene, camera);
//     };

//     animate();

//     const handleResize = () => {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     };

//     window.addEventListener('resize', handleResize);

//     return () => {
//       window.removeEventListener('resize', handleResize);
//       containerRef.current.removeChild(renderer.domElement);
//     };
//   }, []);

//   return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />;
// };

// export default ParticleBackground;


// import React, { useEffect, useRef } from 'react';
// import * as THREE from 'three';

// const ParticleBackground = () => {
//   const containerRef = useRef(null);

//   useEffect(() => {
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//     const renderer = new THREE.WebGLRenderer({ antialias: true });

//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setClearColor(0xffffff); // 흰색 배경
//     containerRef.current.appendChild(renderer.domElement);

//     const geometry = new THREE.BufferGeometry();
//     const particleCount = 5000;
//     const positions = new Float32Array(particleCount * 3);
//     const colors = new Float32Array(particleCount * 3);
//     const sizes = new Float32Array(particleCount);

//     const color = new THREE.Color();
//     const radius = 5; // 구의 반지름

//     for (let i = 0; i < particleCount; i++) {
//       // 구면 좌표계를 사용하여 파티클 위치 계산
//       const theta = Math.random() * Math.PI * 2; // 0 to 2π
//       const phi = Math.acos((Math.random() * 2) - 1); // 0 to π
//       const x = radius * Math.sin(phi) * Math.cos(theta);
//       const y = radius * Math.sin(phi) * Math.sin(theta);
//       const z = radius * Math.cos(phi);

//       positions[i * 3] = x;
//       positions[i * 3 + 1] = y;
//       positions[i * 3 + 2] = z;

//       color.setHSL(0.33 + Math.random() * 0.05, 0.9, 0.5 + Math.random() * 0.2);
//       colors[i * 3] = color.r;
//       colors[i * 3 + 1] = color.g;
//       colors[i * 3 + 2] = color.b;

//       sizes[i] = Math.random() * 0.1 + 0.05;
//     }

//     geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
//     geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
//     geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

//     const material = new THREE.PointsMaterial({
//       size: 0.1,
//       vertexColors: true,
//       transparent: true,
//       opacity: 0.5,
//     });

//     const particles = new THREE.Points(geometry, material);
//     scene.add(particles);

//     camera.position.z = 10;

//     const animate = () => {
//       requestAnimationFrame(animate);

//       particles.rotation.x += 0.0005;
//       particles.rotation.y += 0.001;

//       renderer.render(scene, camera);
//     };

//     animate();

//     const handleResize = () => {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     };

//     window.addEventListener('resize', handleResize);

//     return () => {
//       window.removeEventListener('resize', handleResize);
//       containerRef.current.removeChild(renderer.domElement);
//     };
//   }, []);

//   return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />;
// };

// export default ParticleBackground;
// import React, { useEffect, useRef } from 'react';
// import * as THREE from 'three';

// const ParticleBackground = () => {
//   const containerRef = useRef(null);

//   useEffect(() => {
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//     const renderer = new THREE.WebGLRenderer({ antialias: true });

//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setClearColor(0xffffff); // 흰색 배경
//     containerRef.current.appendChild(renderer.domElement);

//     const geometry = new THREE.BufferGeometry();
//     const particleCount = 10000;
//     const positions = new Float32Array(particleCount * 3);
//     const colors = new Float32Array(particleCount * 3);
//     const sizes = new Float32Array(particleCount);

//     const color = new THREE.Color();

//     const heartShape = (t) => {
//       const x = 16 * Math.pow(Math.sin(t), 3);
//       const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
//       return [x, y];
//     };

//     for (let i = 0; i < particleCount; i++) {
//       const t = Math.PI * 2 * Math.random();
//       const [x, y] = heartShape(t);
//       const z = (Math.random() - 0.5) * 2;

//       positions[i * 3] = x * 0.1;
//       positions[i * 3 + 1] = y * 0.1;
//       positions[i * 3 + 2] = z * 0.1;

//       color.setHSL(0.0 + Math.random() * 0.1, 0.8, 0.6 + Math.random() * 0.2);
//       colors[i * 3] = color.r;
//       colors[i * 3 + 1] = color.g;
//       colors[i * 3 + 2] = color.b;

//       sizes[i] = Math.random() * 0.05 + 0.02;
//     }

//     geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
//     geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
//     geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

//     const material = new THREE.PointsMaterial({
//       size: 0.1,
//       vertexColors: true,
//       transparent: true,
//       opacity: 0.6,
//     });

//     const particles = new THREE.Points(geometry, material);
//     scene.add(particles);

//     camera.position.z = 5;

//     const animate = () => {
//       requestAnimationFrame(animate);

//       particles.rotation.y += 0.001;

//       renderer.render(scene, camera);
//     };

//     animate();

//     const handleResize = () => {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     };

//     window.addEventListener('resize', handleResize);

//     return () => {
//       window.removeEventListener('resize', handleResize);
//       containerRef.current.removeChild(renderer.domElement);
//     };
//   }, []);

//   return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />;
// };

// export default ParticleBackground;

// import React, { useEffect, useRef } from 'react';
// import * as THREE from 'three';

// const ParticleBackground = () => {
//   const containerRef = useRef(null);

//   useEffect(() => {
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//     const renderer = new THREE.WebGLRenderer({ antialias: true });

//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setClearColor(0xffffff); // 흰색 배경
//     containerRef.current.appendChild(renderer.domElement);

//     const geometry = new THREE.BufferGeometry();
//     const particleCount = 18000; // 파티클 수 증가
//     const positions = new Float32Array(particleCount * 3);
//     const colors = new Float32Array(particleCount * 3);
//     const sizes = new Float32Array(particleCount);

//     const color = new THREE.Color();

//     // 하트 모양 함수 수정 (채워진 하트)
//     const heartShape = (t, r) => {
//       const x = r * 16 * Math.pow(Math.sin(t), 3);
//       const y = r * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
//       return [x, y];
//     };

//     // 파티클 크기 조절 (값이 클수록 파티클이 커짐)
//     const particleSize = 0.08;

//     for (let i = 0; i < particleCount; i++) {
//       const t = Math.PI * 2 * Math.random();
//       const r = Math.random(); // 0에서 1 사이의 랜덤 값으로 하트를 채움
//       const [x, y] = heartShape(t, r);
//       const z = (Math.random() - 0.5) * 0.5;

//       positions[i * 3] = x * 0.1;
//       positions[i * 3 + 1] = y * 0.1;
//       positions[i * 3 + 2] = z * 0.1;

//       // 초록색 계열로 변경 (HSL 색상 모델 사용)
//       color.setHSL(0.33 + Math.random() * 0.1, 0.9, 0.5 + Math.random() * 0.2);
//       colors[i * 3] = color.r;
//       colors[i * 3 + 1] = color.g;
//       colors[i * 3 + 2] = color.b;

//       sizes[i] = Math.random() * particleSize + particleSize * 0.5;
//     }

//     geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
//     geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
//     geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

//     const material = new THREE.PointsMaterial({
//       size: particleSize,
//       vertexColors: true,
//       transparent: true,
//       opacity: 0.8,
//     });

//     const particles = new THREE.Points(geometry, material);
//     scene.add(particles);

//     camera.position.z = 13;

//     const animate = () => {
//       requestAnimationFrame(animate);

//       particles.rotation.y += 0.001;

//       renderer.render(scene, camera);
//     };

//     animate();

//     const handleResize = () => {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     };

//     window.addEventListener('resize', handleResize);

//     return () => {
//       window.removeEventListener('resize', handleResize);
//       containerRef.current.removeChild(renderer.domElement);
//     };
//   }, []);

//   return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />;
// };

// export default ParticleBackground;

// import React, { useEffect, useRef } from 'react';
// import * as THREE from 'three';

// const ParticleBackground = () => {
//   const containerRef = useRef(null);

//   useEffect(() => {
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//     const renderer = new THREE.WebGLRenderer({ antialias: true });

//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setClearColor(0xffffff);
//     containerRef.current.appendChild(renderer.domElement);

//     const particleCount = 5000;
//     const positions = new Float32Array(particleCount * 3);
//     const colors = new Float32Array(particleCount * 3);

//     const color = new THREE.Color();

//     // 하트 모양 파티클 생성
//     const heartShape = new THREE.Shape();
//     const x = 0, y = 0;
//     // 하트를 뒤집기 위해 y 좌표에 -를 붙임
//     heartShape.moveTo(x + 0.5, -(y + 0.5));
//     heartShape.bezierCurveTo(x + 0.5, -(y + 0.5), x + 0.4, -y, x, -y);
//     heartShape.bezierCurveTo(x - 0.6, -y, x - 0.6, -(y + 0.7), x - 0.6, -(y + 0.7));
//     heartShape.bezierCurveTo(x - 0.6, -(y + 1.1), x - 0.3, -(y + 1.54), x + 0.5, -(y + 1.9));
//     heartShape.bezierCurveTo(x + 1.2, -(y + 1.54), x + 1.6, -(y + 1.1), x + 1.6, -(y + 0.7));
//     heartShape.bezierCurveTo(x + 1.6, -(y + 0.7), x + 1.6, -y, x + 1, -y);
//     heartShape.bezierCurveTo(x + 0.7, -y, x + 0.5, -(y + 0.5), x + 0.5, -(y + 0.5));

//     const heartGeometry = new THREE.ShapeGeometry(heartShape);
//     // 초록색으로 변경
//     const heartMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

//     for (let i = 0; i < particleCount; i++) {
//       const x = (Math.random() - 0.5) * 10;
//       const y = (Math.random() - 0.5) * 10;
//       const z = (Math.random() - 0.5) * 10;

//       positions[i * 3] = x;
//       positions[i * 3 + 1] = y;
//       positions[i * 3 + 2] = z;

//       color.setHSL(0, 1, 0.5 + Math.random() * 0.2);
//       colors[i * 3] = color.r;
//       colors[i * 3 + 1] = color.g;
//       colors[i * 3 + 2] = color.b;

//       const heart = new THREE.Mesh(heartGeometry, heartMaterial);
//       heart.position.set(x, y, z);
//       // 크기를 더 작게 조정 (0.02 -> 0.01)
//       heart.scale.set(0.01, 0.01, 0.01);
//       scene.add(heart);
//     }

//     camera.position.z = 5;

//     const animate = () => {
//       requestAnimationFrame(animate);
//       scene.rotation.y += 0.001;
//       renderer.render(scene, camera);
//     };

//     animate();

//     const handleResize = () => {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     };

//     window.addEventListener('resize', handleResize);

//     return () => {
//       window.removeEventListener('resize', handleResize);
//       containerRef.current.removeChild(renderer.domElement);
//     };
//   }, []);

//   return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />;
// };

// export default ParticleBackground;

// import React, { useEffect, useRef } from 'react';
// import * as THREE from 'three';

// const ParticleBackground = () => {
//   const containerRef = useRef(null);
//   const mousePosition = useRef({ x: 0, y: 0 });
//   const hearts = useRef([]);

//   useEffect(() => {
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//     const renderer = new THREE.WebGLRenderer({ antialias: true });

//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setClearColor(0xffffff);
//     containerRef.current.appendChild(renderer.domElement);

//     // 하트 모양 정의
//     const heartShape = new THREE.Shape();
//     const x = 0, y = 0;
//     heartShape.moveTo(x + 0.5, -(y + 0.5));
//     heartShape.bezierCurveTo(x + 0.5, -(y + 0.5), x + 0.4, -y, x, -y);
//     heartShape.bezierCurveTo(x - 0.6, -y, x - 0.6, -(y + 0.7), x - 0.6, -(y + 0.7));
//     heartShape.bezierCurveTo(x - 0.6, -(y + 1.1), x - 0.3, -(y + 1.54), x + 0.5, -(y + 1.9));
//     heartShape.bezierCurveTo(x + 1.2, -(y + 1.54), x + 1.6, -(y + 1.1), x + 1.6, -(y + 0.7));
//     heartShape.bezierCurveTo(x + 1.6, -(y + 0.7), x + 1.6, -y, x + 1, -y);
//     heartShape.bezierCurveTo(x + 0.7, -y, x + 0.5, -(y + 0.5), x + 0.5, -(y + 0.5));

//     const heartGeometry = new THREE.ShapeGeometry(heartShape);
//     const heartMaterial = new THREE.MeshBasicMaterial({ 
//       color: 0x00ff00,
//       transparent: true,
//       opacity: 0.8
//     });

//     camera.position.z = 5;

//     // 마우스 이벤트 처리
//     const handleMouseMove = (event) => {
//       // 마우스 좌표를 3D 공간 좌표로 변환
//       mousePosition.current.x = (event.clientX / window.innerWidth) * 2 - 1;
//       mousePosition.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

//       // 새로운 하트 생성
//       const heart = new THREE.Mesh(heartGeometry, heartMaterial.clone());
      
//       // 마우스 위치에 하트 배치
//       heart.position.set(
//         mousePosition.current.x * 5,
//         mousePosition.current.y * 3,
//         0
//       );
      
//       // 하트 크기 설정
//       heart.scale.set(0.05, 0.05, 0.05);
      
//       // 하트에 초기 속성 추가
//       heart.userData = {
//         life: 1.0,
//         velocity: new THREE.Vector3(
//           (Math.random() - 0.5) * 0.02,
//           (Math.random() - 0.5) * 0.02,
//           (Math.random() - 0.5) * 0.02
//         )
//       };

//       scene.add(heart);
//       hearts.current.push(heart);
//     };

//     const animate = () => {
//       requestAnimationFrame(animate);

//       // 각 하트 업데이트
//       hearts.current.forEach((heart, index) => {
//         // 생명력 감소
//         heart.userData.life -= 0.01;
        
//         // 위치 업데이트
//         heart.position.add(heart.userData.velocity);
        
//         // 회전
//         heart.rotation.z += 0.02;
        
//         // 투명도 업데이트
//         heart.material.opacity = heart.userData.life;

//         // 생명력이 다한 하트 제거
//         if (heart.userData.life <= 0) {
//           scene.remove(heart);
//           hearts.current.splice(index, 1);
//         }
//       });

//       renderer.render(scene, camera);
//     };

//     animate();

//     window.addEventListener('mousemove', handleMouseMove);
    
//     const handleResize = () => {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     };

//     window.addEventListener('resize', handleResize);

//     return () => {
//       window.removeEventListener('mousemove', handleMouseMove);
//       window.removeEventListener('resize', handleResize);
//       containerRef.current.removeChild(renderer.domElement);
//     };
//   }, []);

//   return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />;
// };

// export default ParticleBackground;


import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import "./ParticleBackground.css";

const ParticleBackground = () => {
  // DOM 요소와 마우스 위치, 하트 배열을 위한 ref 생성
  const containerRef = useRef(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const hearts = useRef([]);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  
  useEffect(() => {
    
    const container = containerRef.current;
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Three.js 기본 설정
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
         antialias: true,
         alpha: true // 배경 투명하게
    });
    rendererRef.current = renderer;     

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff, 0); // 투명 배경
    containerRef.current.appendChild(renderer.domElement);

    // 하트 모양 정의
    const heartShape = new THREE.Shape();
    const x = 0, y = 0;
    heartShape.moveTo(x + 0.5, -(y + 0.5));
    heartShape.bezierCurveTo(x + 0.5, -(y + 0.5), x + 0.4, -y, x, -y);
    heartShape.bezierCurveTo(x - 0.6, -y, x - 0.6, -(y + 0.7), x - 0.6, -(y + 0.7));
    heartShape.bezierCurveTo(x - 0.6, -(y + 1.1), x - 0.3, -(y + 1.54), x + 0.5, -(y + 1.9));
    heartShape.bezierCurveTo(x + 1.2, -(y + 1.54), x + 1.6, -(y + 1.1), x + 1.6, -(y + 0.7));
    heartShape.bezierCurveTo(x + 1.6, -(y + 0.7), x + 1.6, -y, x + 1, -y);
    heartShape.bezierCurveTo(x + 0.7, -y, x + 0.5, -(y + 0.5), x + 0.5, -(y + 0.5));

    const heartGeometry = new THREE.ShapeGeometry(heartShape);
    const heartMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xff0000, // 빨간색 하트
      transparent: true,
      opacity: 0.8
    });

    camera.position.z = 5;

    // 하트 생성 간격 제어
    let lastHeartTime = 0;
    const heartInterval = 100; // 100ms 간격으로 하트 생성
    const maxHearts = 50; // 최대 하트 개수

    // 마우스 이벤트 처리
    const handleMouseMove = (event) => {
      const currentTime = Date.now();
      if (currentTime - lastHeartTime < heartInterval) return;
      lastHeartTime = currentTime;

      // 최대 하트 개수 제한
      if (hearts.current.length >= maxHearts) {
        const oldestHeart = hearts.current.shift();
        scene.remove(oldestHeart);
      }

      // 마우스 좌표를 3D 공간 좌표로 변환
      mousePosition.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mousePosition.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // 새로운 하트 생성
      const heart = new THREE.Mesh(heartGeometry, heartMaterial.clone());
      
      // 마우스 위치에 하트 배치
      heart.position.set(
        mousePosition.current.x * 5,
        mousePosition.current.y * 3,
        0
      );
      
      // 하트 크기 설정 (더 작게 조정)
      heart.scale.set(0.05, 0.05, 0.05);
      
      // 하트 초기 속성 설정
      heart.userData = {
        life: 0.5, // 생명력 감소
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02, // X축 속도
          (Math.random() - 0.5) * 0.02, // Y축 속도
          (Math.random() - 0.5) * 0.02  // Z축 속도
        )
      };

      scene.add(heart);
      hearts.current.push(heart);
    };

    // 애니메이션 루프
    const animate = () => {
      requestAnimationFrame(animate);

      // 각 하트 업데이트
      hearts.current.forEach((heart, index) => {
        // 생명력 감소
        heart.userData.life -= 0.01;
        
        // 위치 업데이트
        heart.position.add(heart.userData.velocity);
        
        // 회전
        heart.rotation.z += 0.02;
        
        // 투명도 업데이트
        heart.material.opacity = heart.userData.life;

        // 생명력이 다한 하트 제거
        if (heart.userData.life <= 0) {
          scene.remove(heart);
          hearts.current.splice(index, 1);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // 이벤트 리스너 등록
    window.addEventListener('mousemove', handleMouseMove);
    
    // 화면 크기 변경 처리
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // 컴포넌트 언마운트 시 정리
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      // cleanup 함수에서 안전하게 참조
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (<div ref={containerRef} className="particle-container" />);
};

export default ParticleBackground;
