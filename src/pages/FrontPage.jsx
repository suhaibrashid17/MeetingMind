import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Clock, MessageCircle, Users, Calendar, FileText, ChevronDown, CheckCircle, Shield, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MeetingMindFrontPage = () => {
  const mountRef = useRef(null);
  const heroSectionRef = useRef(null);
  const featuresSectionRef = useRef(null);
  const testimonialsSectionRef = useRef(null);
  const pricingSectionRef = useRef(null);
  const ctaSectionRef = useRef(null);
  const navigate = useNavigate()
  const [currentSection, setCurrentSection] = useState('hero');
  const [scrollY, setScrollY] = useState(0);
  const [animatedNumbers, setAnimatedNumbers] = useState({
    efficiency: 0,
    meetings: 0,
    time: 0,
    organizations: 0
  });
  
  // Animation for stats counter
  useEffect(() => {
    if (scrollY > 500) {
      const interval = setInterval(() => {
        setAnimatedNumbers(prev => ({
          efficiency: prev.efficiency >= 40 ? 40 : prev.efficiency + 1,
          meetings: prev.meetings >= 5000 ? 5000 : prev.meetings + 125,
          time: prev.time >= 80 ? 80 : prev.time + 2,
          organizations: prev.organizations >= 500 ? 500 : prev.organizations + 25
        }));
      }, 30);
      
      return () => clearInterval(interval);
    }
  }, [scrollY]);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      const heroPos = heroSectionRef.current?.getBoundingClientRect().top;
      const featuresPos = featuresSectionRef.current?.getBoundingClientRect().top;
      const testimonialsPos = testimonialsSectionRef.current?.getBoundingClientRect().top;
      const pricingPos = pricingSectionRef.current?.getBoundingClientRect().top;
      const ctaPos = ctaSectionRef.current?.getBoundingClientRect().top;
      
      const viewportHeight = window.innerHeight;
      
      if (heroPos >= -viewportHeight/2) {
        setCurrentSection('hero');
      } else if (featuresPos < viewportHeight/2 && featuresPos >= -viewportHeight/2) {
        setCurrentSection('features');
      } else if (testimonialsPos < viewportHeight/2 && testimonialsPos >= -viewportHeight/2) {
        setCurrentSection('testimonials');
      } else if (pricingPos < viewportHeight/2 && pricingPos >= -viewportHeight/2) {
        setCurrentSection('pricing');
      } else if (ctaPos < viewportHeight/2) {
        setCurrentSection('cta');
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimize for performance
    renderer.setClearColor(0x000000, 0);
    
    mountRef.current.appendChild(renderer.domElement);
    
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0x4F9BFF, 2, 10);
    pointLight1.position.set(2, 2, 2);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x3a7bd5, 2, 10);
    pointLight2.position.set(-2, -2, -2);
    scene.add(pointLight2);
    
    const brainParticles = new THREE.Group();
    
    const particleCount = 1500; // Reduced for smoother performance
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const opacities = new Float32Array(particleCount); // For pop-in animation
    const connections = new THREE.Group();
    
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      const radiusBase = 2 + Math.random() * 0.8;
      
      let radius = radiusBase;
      if (phi < Math.PI / 2) {
        radius *= (1 + 0.2 * Math.sin(theta * 2));
      } else {
        radius *= (1 + 0.3 * Math.cos(theta * 3));
      }
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta) * 0.8;
      const z = radius * Math.cos(phi) * 1.2;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y + 0.5;
      positions[i * 3 + 2] = z;
      
      const colorChoice = Math.random();
      if (colorChoice < 0.6) {
        colors[i * 3] = 0.2 + Math.random() * 0.2;
        colors[i * 3 + 1] = 0.5 + Math.random() * 0.3;
        colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
      } else if (colorChoice < 0.9) {
        colors[i * 3] = 0.2 + Math.random() * 0.2;
        colors[i * 3 + 1] = 0.7 + Math.random() * 0.3;
        colors[i * 3 + 2] = 0.7 + Math.random() * 0.3;
      } else {
        colors[i * 3] = 0.5 + Math.random() * 0.3;
        colors[i * 3 + 1] = 0.2 + Math.random() * 0.2;
        colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
      }
      
      sizes[i] = 0.05 + Math.random() * 0.08;
      opacities[i] = 0; // Start invisible for pop-in
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    particles.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
    
    const particleMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float size;
        attribute float opacity;
        varying vec3 vColor;
        varying float vOpacity;
        
        void main() {
          vColor = color;
          vOpacity = opacity;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vOpacity;
        
        void main() {
          float r = distance(gl_PointCoord, vec2(0.5, 0.5));
          if (r > 0.5) discard;
          
          float glow = 1.0 - r * 2.0;
          glow = pow(glow, 1.5);
          
          gl_FragColor = vec4(vColor, glow * vOpacity);
        }
      `,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      vertexColors: true
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    brainParticles.add(particleSystem);
    
    const connectionMaterial = new THREE.LineBasicMaterial({
      color: 0x3a7bd5,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending
    });
    
    const connectionDensity = 100; // Reduced for performance
    const connectionGroup = new THREE.Group();
    
    for (let i = 0; i < connectionDensity; i++) {
      const index1 = Math.floor(Math.random() * particleCount);
      let nearestIndex = -1;
      let minDistance = 100;
      
      for (let j = 0; j < 10; j++) {
        const testIndex = Math.floor(Math.random() * particleCount);
        
        const x1 = positions[index1 * 3];
        const y1 = positions[index1 * 3 + 1];
        const z1 = positions[index1 * 3 + 2];
        
        const x2 = positions[testIndex * 3];
        const y2 = positions[testIndex * 3 + 1];
        const z2 = positions[testIndex * 3 + 2];
        
        const distance = Math.sqrt(
          Math.pow(x2 - x1, 2) + 
          Math.pow(y2 - y1, 2) + 
          Math.pow(z2 - z1, 2)
        );
        
        if (distance < minDistance && distance > 0.1) {
          minDistance = distance;
          nearestIndex = testIndex;
        }
      }
      
      if (nearestIndex >= 0 && minDistance < 2) {
        const x1 = positions[index1 * 3];
        const y1 = positions[index1 * 3 + 1];
        const z1 = positions[index1 * 3 + 2];
        
        const x2 = positions[nearestIndex * 3];
        const y2 = positions[nearestIndex * 3 + 1];
        const z2 = positions[nearestIndex * 3 + 2];
        
        const connectionGeometry = new THREE.BufferGeometry();
        const linePositions = new Float32Array([x1, y1, z1, x2, y2, z2]);
        connectionGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        
        const line = new THREE.Line(connectionGeometry, connectionMaterial);
        connectionGroup.add(line);
      }
    }
    
    brainParticles.add(connectionGroup);
    scene.add(brainParticles);
    
    const ringGroup = new THREE.Group();
    
    for (let i = 0; i < 5; i++) {
      const ringGeometry = new THREE.RingGeometry(2 + i * 0.5, 2.1 + i * 0.5, 64);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x4F9BFF : 0x3a7bd5,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
      });
      
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -1.5;
      ringGroup.add(ring);
    }
    
    scene.add(ringGroup);
    
    const circuitGroup = new THREE.Group();
    
    const createCircuitLine = (startX, startZ, endX, endZ) => {
      const points = [];
      points.push(new THREE.Vector3(startX, -2.5, startZ));
      points.push(new THREE.Vector3(endX, -2.5, endZ));
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ 
        color: 0x4F9BFF, 
        transparent: true, 
        opacity: 0.5 
      });
      
      return new THREE.Line(geometry, material);
    };
    
    const gridSize = 20;
    const gridGap = 1;
    
    for (let i = -gridSize/2; i <= gridSize/2; i += gridGap) {
      const lineH = createCircuitLine(-gridSize/2, i, gridSize/2, i);
      circuitGroup.add(lineH);
      
      const lineV = createCircuitLine(i, -gridSize/2, i, gridSize/2);
      circuitGroup.add(lineV);
    }
    
    for (let i = 0; i < 40; i++) {
      const x = Math.floor(Math.random() * gridSize - gridSize/2);
      const z = Math.floor(Math.random() * gridSize - gridSize/2);
      
      const nodeGeometry = new THREE.CircleGeometry(0.1, 16);
      const nodeMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x4F9BFF, 
        transparent: true, 
        opacity: 0.8 
      });
      
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.rotation.x = -Math.PI / 2;
      node.position.set(x, -2.49, z);
      circuitGroup.add(node);
    }
    
    scene.add(circuitGroup);
    
    const createFloatingText = (x, y, z) => {
      const dotGeometry = new THREE.SphereGeometry(0.1, 16, 16);
      const dotMaterial = new THREE.MeshBasicMaterial({
        color: 0x4F9BFF,
        transparent: true,
        opacity: 0.8
      });
      
      const dot = new THREE.Mesh(dotGeometry, dotMaterial);
      dot.position.set(x, y, z);
      return dot;
    };
    
    const floatingElements = new THREE.Group();
    
    const elementCount = 16;
    for (let i = 0; i < elementCount; i++) {
      const angle = (i / elementCount) * Math.PI * 2;
      const radius = 4 + Math.random() * 1.5;
      const height = Math.random() * 4 - 2;
      
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = height;
      
      const element = createFloatingText(x, y, z);
      element.userData = {
        originalPosition: new THREE.Vector3(x, y, z),
        speed: 0.2 + Math.random() * 0.3,
        offset: Math.random() * Math.PI * 2
      };
      
      floatingElements.add(element);
    }
    
    scene.add(floatingElements);
    
    const streamParticlesCount = 200; // Reduced for performance
    const streamGeometry = new THREE.BufferGeometry();
    const streamPositions = new Float32Array(streamParticlesCount * 3);
    const streamSizes = new Float32Array(streamParticlesCount);
    
    for (let i = 0; i < streamParticlesCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      const radius = 10 + Math.random() * 20;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      streamPositions[i * 3] = x;
      streamPositions[i * 3 + 1] = y;
      streamPositions[i * 3 + 2] = z;
      
      streamSizes[i] = 0.03 + Math.random() * 0.05;
    }
    
    streamGeometry.setAttribute('position', new THREE.BufferAttribute(streamPositions, 3));
    streamGeometry.setAttribute('size', new THREE.BufferAttribute(streamSizes, 1));
    
    const streamMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float size;
        
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        void main() {
          float r = distance(gl_PointCoord, vec2(0.5, 0.5));
          if (r > 0.5) discard;
          
          vec3 color = vec3(0.3, 0.6, 1.0);
          gl_FragColor = vec4(color, 1.0 - r * 1.5);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false
    });
    
    const streamParticles = new THREE.Points(streamGeometry, streamMaterial);
    scene.add(streamParticles);
    
    const holoGroup = new THREE.Group();
    
    const holoScreenGeometry = new THREE.PlaneGeometry(4, 2, 50, 25);
    const holoScreenMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        uniform float time;
        
        void main() {
          vUv = uv;
          
          vec3 pos = position;
          float wave = sin(pos.x * 5.0 + time * 2.0) * 0.05;
          wave += sin(pos.y * 10.0 + time * 3.0) * 0.03;
          pos.z += wave;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float time;
        
        void main() {
          float gridX = step(0.1, mod(vUv.x * 20.0, 1.0));
          float gridY = step(0.1, mod(vUv.y * 10.0, 1.0));
          float grid = gridX * gridY;
          
          float scanLine = step(0.5, sin(vUv.y * 100.0 + time * 10.0));
          
          float edgeX = pow(sin(vUv.x * 3.14), 4.0);
          float edgeY = pow(sin(vUv.y * 3.14), 4.0);
          float edge = edgeX * edgeY;
          
          vec3 color = vec3(0.3, 0.6, 1.0);
          float alpha = (grid * 0.15) + (scanLine * 0.05) + (edge * 0.3);
          
          gl_FragColor = vec4(color, alpha * 0.5);
        }
      `,
      uniforms: {
        time: { value: 0 }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    
    const holoScreen = new THREE.Mesh(holoScreenGeometry, holoScreenMaterial);
    holoScreen.position.set(0, 0, -6);
    holoScreen.rotation.y = Math.PI;
    holoGroup.add(holoScreen);
    
    const createHoloMeter = (x, size) => {
      const geometry = new THREE.RingGeometry(size, size + 0.1, 32);
      const material = new THREE.MeshBasicMaterial({
        color: 0x4F9BFF,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
      });
      
      const ring = new THREE.Mesh(geometry, material);
      ring.position.set(x, 0, -5.95);
      ring.rotation.y = Math.PI;
      
      return ring;
    };
    
    const meter1 = createHoloMeter(-1.2, 0.3);
    const meter2 = createHoloMeter(-0.6, 0.2);
    const meter3 = createHoloMeter(0, 0.4);
    const meter4 = createHoloMeter(0.6, 0.3);
    const meter5 = createHoloMeter(1.2, 0.25);
    
    holoGroup.add(meter1, meter2, meter3, meter4, meter5);
    scene.add(holoGroup);
    
    camera.position.z = 6;
    camera.position.y = 1;
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.maxPolarAngle = Math.PI / 1.5;
    controls.minPolarAngle = Math.PI / 3;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.enabled = false;
    
    // Pop-in animation for particles
    let popInProgress = 0;
    const popInDuration = 3000; // 3 seconds
    const updatePopIn = () => {
      popInProgress += 16; // Assuming 60fps
      const progress = Math.min(popInProgress / popInDuration, 1);
      const opacities = particleSystem.geometry.attributes.opacity.array;
      for (let i = 0; i < particleCount; i++) {
        opacities[i] = progress * (0.5 + Math.random() * 0.5); // Randomize final opacity slightly
      }
      particleSystem.geometry.attributes.opacity.needsUpdate = true;
      if (progress < 1) {
        requestAnimationFrame(updatePopIn);
      }
    };
    updatePopIn();
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      const time = Date.now() * 0.001;
      
      let brainRotationSpeed = 0.001;
      let particleAnimationIntensity = 1;
      
      if (currentSection === 'hero') {
        brainRotationSpeed = 0.001;
        particleAnimationIntensity = 1;
      } else if (currentSection === 'features') {
        brainRotationSpeed = 0.002;
        particleAnimationIntensity = 1.5;
      } else if (currentSection === 'testimonials' || currentSection === 'pricing') {
        brainRotationSpeed = 0.0005;
        particleAnimationIntensity = 0.7;
      } else if (currentSection === 'cta') {
        brainRotationSpeed = 0.003;
        particleAnimationIntensity = 2;
      }
      
      holoScreenMaterial.uniforms.time.value = time;
      
      brainParticles.rotation.y += brainRotationSpeed;
      
      ringGroup.children.forEach((ring, i) => {
        const t = time + i * 0.3;
        ring.scale.set(1 + Math.sin(t) * 0.1, 1 + Math.sin(t) * 0.1, 1);
        ring.material.opacity = 0.2 + Math.sin(t) * 0.1;
        ring.rotation.z = time * 0.1 * (i % 2 === 0 ? 1 : -1);
      });
      
      const positions = particleSystem.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        const t = time + i * 0.0001;
        
        positions[idx] += Math.sin(t * 0.2) * 0.001 * particleAnimationIntensity;
        positions[idx + 1] += Math.cos(t * 0.1) * 0.001 * particleAnimationIntensity;
        positions[idx + 2] += Math.sin(t * 0.3) * 0.001 * particleAnimationIntensity;
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;
      
      circuitGroup.children.forEach((element, i) => {
        if (element.type === 'Mesh') {
          const t = time + i * 0.1;
          element.material.opacity = 0.3 + Math.sin(t * 2) * 0.5;
          element.scale.set(1 + Math.sin(t) * 0.3, 1 + Math.sin(t) * 0.3, 1);
        }
      });
      
      floatingElements.children.forEach((element, i) => {
        const userData = element.userData;
        const t = time + userData.offset;
        
        const orbitRadius = 0.2;
        const orbitSpeed = userData.speed;
        
        element.position.x = userData.originalPosition.x + Math.sin(t * orbitSpeed) * orbitRadius;
        element.position.y = userData.originalPosition.y + Math.cos(t * orbitSpeed * 1.5) * orbitRadius * 0.5;
        element.position.z = userData.originalPosition.z + Math.sin(t * orbitSpeed * 0.7) * orbitRadius;
        
        element.material.opacity = 0.5 + Math.sin(t * 2) * 0.3;
        
        const scale = 1 + Math.sin(t * 3) * 0.2;
        element.scale.set(scale, scale, scale);
      });
      
      const streamPositions = streamParticles.geometry.attributes.position.array;
      for (let i = 0; i < streamParticlesCount; i++) {
        const idx = i * 3;
        const x = streamPositions[idx];
        const y = streamPositions[idx + 1];
        const z = streamPositions[idx + 2];
        
        const dirX = -x;
        const dirY = -y;
        const dirZ = -z;
        
        const length = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
        const normalizedDirX = dirX / length;
        const normalizedDirY = dirY / length;
        const normalizedDirZ = dirZ / length;
        
        const speed = 0.05;
        streamPositions[idx] += normalizedDirX * speed;
        streamPositions[idx + 1] += normalizedDirY * speed;
        streamPositions[idx + 2] += normalizedDirZ * speed;
        
        const distanceToCenter = Math.sqrt(
          streamPositions[idx] * streamPositions[idx] + 
          streamPositions[idx + 1] * streamPositions[idx + 1] + 
          streamPositions[idx + 2] * streamPositions[idx + 2]
        );
        
        if (distanceToCenter < 3) {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;
          
          const radius = 15 + Math.random() * 10;
          streamPositions[idx] = radius * Math.sin(phi) * Math.cos(theta);
          streamPositions[idx + 1] = radius * Math.sin(phi) * Math.sin(theta);
          streamPositions[idx + 2] = radius * Math.cos(phi);
        }
      }
      streamParticles.geometry.attributes.position.needsUpdate = true;
      
      holoGroup.children.forEach((element, i) => {
        if (element.geometry.type === 'RingGeometry') {
          const t = time + i * 0.5;
          
          element.rotation.z = time * (i % 2 === 0 ? 0.2 : -0.3);
          
          const scale = 1 + Math.sin(t * 1.5) * 0.2;
          element.scale.set(scale, scale, 1);
        }
      });
      
      // Adjusted parallax to keep particles visible
      const parallaxY = scrollY * 0.0005; // Reduced parallax effect
      brainParticles.position.y = 0.5 - parallaxY;
      
      camera.position.y = 1 - parallaxY;
      camera.lookAt(0, 0, 0);
      
      controls.update();
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
 
  }, [currentSection, scrollY]);
  
  const scrollToSection = (sectionRef) => {
    sectionRef.current.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-black text-white overflow-x-hidden">
      <div 
        ref={mountRef} 
        className="fixed inset-0 z-0 pointer-events-none"
      />
      
      <nav className="fixed top-0 left-0 right-0 z-10 bg-slate-900/70 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <MessageCircle size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold">MeetingMind</span>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection(heroSectionRef)} className={`transition ${currentSection === 'hero' ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}>
              Home
            </button>
            <button onClick={() => scrollToSection(featuresSectionRef)} className={`transition ${currentSection === 'features' ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}>
              Features
            </button>
            <button onClick={() => scrollToSection(testimonialsSectionRef)} className={`transition ${currentSection === 'testimonials' ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}>
              Testimonials
            </button>
            <button onClick={() => scrollToSection(pricingSectionRef)} className={`transition ${currentSection === 'pricing' ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}>
              Pricing
            </button>
          </div>
          
          <div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full transition transform hover:scale-105">
              Get Started
            </button>
          </div>
        </div>
      </nav>
      
      <section 
        ref={heroSectionRef} 
        className="min-h-screen flex items-center relative z-10 pt-20"
      >
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-white">
              Transform Meeting Chaos into Clarity
            </h1>
            <p className="text-xl text-gray-300 mb-10">
              MeetingMind uses AI to analyze, summarize, and extract insights from your meetings, 
              helping teams focus on execution rather than documentation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button className="hover:cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-medium transition transform hover:scale-105 flex items-center justify-center" onClick={()=>navigate("/home")}>
                Get Started
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10 pb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{animatedNumbers.efficiency}%</div>
                <div className="text-gray-400 text-sm">More Efficient Meetings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{animatedNumbers.meetings.toLocaleString()}+</div>
                <div className="text-gray-400 text-sm">Meetings Processed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{animatedNumbers.time}%</div>
                <div className="text-gray-400 text-sm">Time Saved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{animatedNumbers.organizations.toLocaleString()}+</div>
                <div className="text-gray-400 text-sm">Organizations</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section 
        ref={featuresSectionRef} 
        className="min-h-screen py-20 relative z-10"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Unlock Meeting Intelligence</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our AI analyzes meeting content, extracts key points and action items, 
              and helps your team stay organized and accountable.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 transform transition hover:scale-105">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                <MessageCircle size={24} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Transcription</h3>
              <p className="text-gray-300">
                Automatically transcribe meetings with speaker identification and 
                98% accuracy, even with multiple speakers or accents.
              </p>
            </div>
            
            <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 transform transition hover:scale-105">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                <FileText size={24} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Summaries</h3>
              <p className="text-gray-300">
                Generate concise summaries with key points, decisions made, and action 
                items extracted automatically from your discussions.
              </p>
            </div>
            
            <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 transform transition hover:scale-105">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                <Calendar size={24} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Task Tracking</h3>
              <p className="text-gray-300">
                Automatically identify action items and tasks, assign them to team members, 
                and track progress through integrations with your tools.
              </p>
            </div>
            
            <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 transform transition hover:scale-105">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                <Users size={24} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Team Insights</h3>
              <p className="text-gray-300">
                Gain insights into participation patterns, discussion topics, and team 
                dynamics to improve collaboration and meeting effectiveness.
              </p>
            </div>
            
            <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 transform transition hover:scale-105">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                <BarChart size={24} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Analytics Dashboard</h3>
              <p className="text-gray-300">
                Track meeting trends, productivity metrics, and team engagement through 
                comprehensive analytics and visualizations.
              </p>
            </div>
            
            <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 transform transition hover:scale-105">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                <Shield size={24} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Enterprise Security</h3>
              <p className="text-gray-300">
                End-to-end encryption and enterprise-grade security ensure your meeting 
                content remains private and protected.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section 
        ref={testimonialsSectionRef} 
        className="min-h-screen py-20 relative z-10"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Trusted by innovative teams and organizations around the world.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-8 relative">
              <div className="text-5xl text-blue-400/20 font-serif absolute top-4 left-6">"</div>
              <p className="text-lg mb-6 pt-4 relative z-10">
                MeetingMind has completely transformed how our product team operates. 
                We've reduced meeting time by 35% while actually improving our ability to 
                track decisions and follow through on action items.
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-xl font-bold">
                  JD
                </div>
                <div className="ml-4">
                  <div className="font-medium">Jennifer Davis</div>
                  <div className="text-gray-400 text-sm">VP of Product, TechCorp</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-8 relative">
              <div className="text-5xl text-blue-400/20 font-serif absolute top-4 left-6">"</div>
              <p className="text-lg mb-6 pt-4 relative z-10">
                As a remote team leader, keeping everyone aligned was always challenging.
                With MeetingMind, our meetings are more focused, and the automated follow-ups
                ensure nothing falls through the cracks.
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-xl font-bold">
                  ML
                </div>
                <div className="ml-4">
                  <div className="font-medium">Miguel Lopez</div>
                  <div className="text-gray-400 text-sm">Engineering Director, RemoteWorks</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-8 relative">
              <div className="text-5xl text-blue-400/20 font-serif absolute top-4 left-6">"</div>
              <p className="text-lg mb-6 pt-4 relative z-10">
                The AI summaries are incredibly accurate. What used to take our team members
                hours of note-taking and review is now automated, letting us focus on strategic work
                instead of administrative tasks.
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-xl font-bold">
                  SJ
                </div>
                <div className="ml-4">
                  <div className="font-medium">Sarah Johnson</div>
                  <div className="text-gray-400 text-sm">COO, InnovateNow</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-8 relative">
              <div className="text-5xl text-blue-400/20 font-serif absolute top-4 left-6">"</div>
              <p className="text-lg mb-6 pt-4 relative z-10">
                Integration with our existing workflow tools was seamless. MeetingMind doesn't 
                just make meetings better - it makes our entire project management system more effective
                by connecting discussions to actions.
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-xl font-bold">
                  RK
                </div>
                <div className="ml-4">
                  <div className="font-medium">Raj Kumar</div>
                  <div className="text-gray-400 text-sm">Project Manager, GlobalSolutions</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <div className="inline-flex items-center justify-center space-x-2 mb-6">
              <CheckCircle size={20} className="text-blue-400" />
              <span className="text-gray-300">Trusted by 500+ organizations worldwide</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 opacity-60">
              <div className="h-8">Company Logo 1</div>
              <div className="h-8">Company Logo 2</div>
              <div className="h-8">Company Logo 3</div>
              <div className="h-8">Company Logo 4</div>
              <div className="h-8">Company Logo 5</div>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="bg-slate-900 py-12 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <MessageCircle size={18} className="text-white" />
                </div>
                <span className="text-xl font-bold">MeetingMind</span>
              </div>
              <p className="text-gray-400 text-sm">
                Transforming meetings with AI-powered insights and automation.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-blue-400 transition">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-blue-400 transition">Pricing</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-blue-400 transition">Testimonials</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Community</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} MeetingMind. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MeetingMindFrontPage;