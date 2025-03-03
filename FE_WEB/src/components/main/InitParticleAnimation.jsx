// Three.js를 이용한 파티클 시스템 예시
import React from 'react';
import { useEffect } from 'react';
import * as THREE from 'three';

const initParticleAnimation = () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  
  // 파티클 생성 로직
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  for (let i = 0; i < 5000; i++) {
    vertices.push(THREE.MathUtils.randFloatSpread(2000));
  }
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  
  const material = new THREE.PointsMaterial({ size: 3, color: 0x00ff00 });
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);
  
  // 애니메이션 루프
  const animate = () => {
    requestAnimationFrame(animate);
    particles.rotation.x += 0.001;
    particles.rotation.y += 0.002;
    renderer.render(scene, camera);
  };
  animate();
};
