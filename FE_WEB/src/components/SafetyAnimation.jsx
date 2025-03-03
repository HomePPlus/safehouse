// SafetyAnimation.jsx
import React from 'react';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { BoxBufferGeometry, TorusBufferGeometry, IcosahedronBufferGeometry, ConeBufferGeometry, DodecahedronBufferGeometry } from 'three';
import './SafetyAnimation.css';

// 3D 도형 클래스 정의 (BufferGeometry 사용)
class Cube extends THREE.BoxGeometry {}
class Torus extends THREE.TorusGeometry {
  constructor() {
    super(1, 0.4, 16, 100);
  }
}
class Icosahedron extends THREE.IcosahedronGeometry {
  constructor() {
    super(1, 0);
  }
}
class Cone extends THREE.ConeGeometry {
  constructor() {
    super(1, 2, 32);
  }
}
class Dodecahedron extends THREE.DodecahedronGeometry {
  constructor() {
    super(1, 0);
  }
}

const SafetyAnimation = () => {
  const containerRef = useRef(null);
  const appRef = useRef(null);

  useEffect(() => {
    class InteractiveBackground {
      constructor() {
        this.setup();
        this.createScene();
        this.createCamera();
        this.createGrid();
        this.setupEventListeners();
        this.animate();
      }

      setup() {
        this.gutter = 4;
        this.meshes = [];
        this.grid = { rows: 30, cols: 30 };
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.mouse = new THREE.Vector2(0, 0);
        this.targetMouse = new THREE.Vector2(0, 0);
      }

      createScene() {
        // Scene 설정
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        );
        this.camera.position.z = 30;

        // Renderer 설정
        this.renderer = new THREE.WebGLRenderer({ 
          antialias: true,
          alpha: true
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        containerRef.current.appendChild(this.renderer.domElement);
      }

      createGrid() {
        // 초록색 계열 머티리얼 생성
        const materials = [
          new THREE.MeshPhysicalMaterial({
            color: "#8fafa3",
            metalness: 0.58,
            roughness: 0.18
          }),
          new THREE.MeshStandardMaterial({
            color: "#4CAF50",
            metalness: 1,
            roughness: 0.5
          })
        ];

        // 도형 종류 배열
        const geometries = [
          new Cube(),
          new Torus(),
          new Icosahedron(),
          new Cone(),
          new Dodecahedron()
        ];

        // 그리드 메시 생성
        for(let y = 0; y < this.grid.rows; y++) {
          for(let x = 0; x < this.grid.cols; x++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const material = materials[Math.floor(Math.random() * materials.length)];
            
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = x * this.gutter - (this.grid.cols * this.gutter)/2;
            mesh.position.y = y * this.gutter - (this.grid.rows * this.gutter)/2;
            mesh.position.z = 0;
            
            this.meshes.push(mesh);
            this.scene.add(mesh);
          }
        }
      }

      setupEventListeners() {
        // 마우스 이벤트 리스너
        window.addEventListener('mousemove', (e) => {
          this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
          this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        // 윈도우 리사이즈 핸들러
        window.addEventListener('resize', () => this.handleResize());
      }

      handleResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
      }

      animate() {
        requestAnimationFrame(() => this.animate());
        
        // 마우스 위치 보간
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

        // 메시 애니메이션 업데이트
        this.meshes.forEach((mesh, i) => {
          mesh.rotation.x += this.mouse.y * 0.0005;
          mesh.rotation.y += this.mouse.x * 0.0005;
          mesh.rotation.z += 0.005;
        });

        this.renderer.render(this.scene, this.camera);
      }
    }

    // 애플리케이션 초기화
    appRef.current = new InteractiveBackground();

    // 클린업 함수
    return () => {
        if (appRef.current) {
            window.removeEventListener('mousemove', appRef.current.handleMouseMove);
            window.removeEventListener('resize', appRef.current.handleResize);
            if (containerRef.current && appRef.current.renderer) {
                containerRef.current.removeChild(appRef.current.renderer.domElement);
            }
        }
    };
  }, []);

  return (
    <div className="safety-container" ref={containerRef}>
      <p className="safety-text">
        안전한 주택
        <br />
        안주
      </p>
    </div>
  );
};

export default SafetyAnimation;
