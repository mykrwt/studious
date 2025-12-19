class InfiniteCarGame {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.car = null;
        this.trackPieces = [];
        this.clock = new THREE.Clock();
        this.keys = {};
        
        // Game state
        this.speed = 0;
        this.maxSpeed = 50;
        this.acceleration = 0.3;
        this.brakeDeceleration = 0.5;
        this.friction = 0.95;
        this.turnSpeed = 0.02;
        this.score = 0;
        this.distance = 0;
        
        // Track generation
        this.trackWidth = 10;
        this.trackLength = 50;
        this.maxTrackPieces = 10;
        this.lastTrackPosition = 0;
        
        // Car movement
        this.carRotation = 0;
        this.carPosition = new THREE.Vector3(0, 0, 0);
        
        this.init();
        this.setupEventListeners();
        this.loadModels();
    }
    
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB);
        this.scene.fog = new THREE.Fog(0x87CEEB, 10, 100);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 8, -15);
        this.camera.lookAt(0, 0, 0);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.getElementById('gameContainer').appendChild(this.renderer.domElement);
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(50, 50, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        directionalLight.shadow.camera.left = -100;
        directionalLight.shadow.camera.right = 100;
        directionalLight.shadow.camera.top = 100;
        directionalLight.shadow.camera.bottom = -100;
        this.scene.add(directionalLight);
        
        // Create ground plane
        const groundGeometry = new THREE.PlaneGeometry(200, 200);
        const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.1;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Hide loading screen
        document.getElementById('loading').style.display = 'none';
    }
    
    loadModels() {
        const loader = new THREE.GLTFLoader();
        
        // Load car model
        loader.load(
            './low_poly_lada_2107.glb',
            (gltf) => {
                this.car = gltf.scene;
                this.car.scale.set(0.8, 0.8, 0.8);
                this.car.position.set(0, 0.5, 0);
                this.car.castShadow = true;
                this.car.receiveShadow = true;
                
                // Make car material shinier
                this.car.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        if (child.material) {
                            child.material.metalness = 0.3;
                            child.material.roughness = 0.7;
                        }
                    }
                });
                
                this.scene.add(this.car);
                console.log('Car model loaded successfully');
            },
            (progress) => {
                console.log('Loading car model...', (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
                console.error('Error loading car model:', error);
                // Create a fallback car
                this.createFallbackCar();
            }
        );
        
        // Load track model and generate infinite track
        loader.load(
            './low_poly_race_track.glb',
            (gltf) => {
                console.log('Track model loaded successfully');
                // Create initial track pieces
                this.generateInitialTrack();
                this.animate();
            },
            (progress) => {
                console.log('Loading track model...', (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
                console.error('Error loading track model:', error);
                // Create fallback track
                this.createFallbackTrack();
                this.animate();
            }
        );
    }
    
    createFallbackCar() {
        // Create a simple box car as fallback
        const carGeometry = new THREE.BoxGeometry(2, 1, 4);
        const carMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        this.car = new THREE.Mesh(carGeometry, carMaterial);
        this.car.position.set(0, 0.5, 0);
        this.car.castShadow = true;
        this.scene.add(this.car);
    }
    
    createFallbackTrack() {
        // Create simple track pieces as fallback
        for (let i = 0; i < 5; i++) {
            this.createTrackPiece(i * this.trackLength);
        }
    }
    
    generateInitialTrack() {
        // Generate initial track pieces
        for (let i = 0; i < this.maxTrackPieces; i++) {
            this.createTrackPiece(i * this.trackLength);
        }
    }
    
    createTrackPiece(zPosition) {
        const loader = new THREE.GLTFLoader();
        
        loader.load(
            './low_poly_race_track.glb',
            (gltf) => {
                const trackPiece = gltf.scene.clone();
                trackPiece.position.set(0, 0, zPosition);
                trackPiece.scale.set(1, 1, 1);
                trackPiece.castShadow = true;
                trackPiece.receiveShadow = true;
                
                // Make track material darker for road effect
                trackPiece.traverse((child) => {
                    if (child.isMesh && child.material) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        if (child.material.color) {
                            child.material.color.multiplyScalar(0.8);
                        }
                    }
                });
                
                this.trackPieces.push({
                    mesh: trackPiece,
                    position: zPosition
                });
                this.scene.add(trackPiece);
                this.lastTrackPosition = Math.max(this.lastTrackPosition, zPosition);
            },
            undefined,
            (error) => {
                console.warn('Failed to load track piece, creating fallback');
                this.createFallbackTrackPiece(zPosition);
            }
        );
    }
    
    createFallbackTrackPiece(zPosition) {
        // Create a simple road piece as fallback
        const roadGeometry = new THREE.BoxGeometry(this.trackWidth, 0.1, this.trackLength);
        const roadMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.position.set(0, 0, zPosition);
        road.castShadow = false;
        road.receiveShadow = true;
        
        this.trackPieces.push({
            mesh: road,
            position: zPosition
        });
        this.scene.add(road);
        this.lastTrackPosition = Math.max(this.lastTrackPosition, zPosition);
    }
    
    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (event) => {
            this.keys[event.code] = true;
        });
        
        document.addEventListener('keyup', (event) => {
            this.keys[event.code] = false;
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    updateCar() {
        if (!this.car) return;
        
        // Handle acceleration
        if (this.keys['KeyW'] || this.keys['ArrowUp']) {
            this.speed = Math.min(this.speed + this.acceleration, this.maxSpeed);
        } else if (this.keys['KeyS'] || this.keys['ArrowDown']) {
            this.speed = Math.max(this.speed - this.brakeDeceleration, -10);
        } else {
            this.speed *= this.friction;
        }
        
        // Handle steering
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
            this.carRotation += this.turnSpeed * (this.speed / this.maxSpeed);
        }
        if (this.keys['KeyD'] || this.keys['ArrowRight']) {
            this.carRotation -= this.turnSpeed * (this.speed / this.maxSpeed);
        }
        
        // Update car position
        this.carPosition.x += Math.sin(this.carRotation) * this.speed * 0.1;
        this.carPosition.z += Math.cos(this.carRotation) * this.speed * 0.1;
        
        // Keep car on track (simple bounds)
        this.carPosition.x = Math.max(-this.trackWidth/2, Math.min(this.trackWidth/2, this.carPosition.x));
        
        // Update car mesh
        this.car.position.copy(this.carPosition);
        this.car.rotation.y = this.carRotation;
        
        // Add car tilting effect
        this.car.rotation.z = -this.carRotation * 0.3;
    }
    
    updateCamera() {
        if (!this.car) return;
        
        const cameraOffset = new THREE.Vector3(
            Math.sin(this.carRotation) * -15,
            8,
            Math.cos(this.carRotation) * -15
        );
        
        this.camera.position.copy(this.car.position).add(cameraOffset);
        this.camera.lookAt(this.car.position.x, this.car.position.y + 2, this.car.position.z + 10);
    }
    
    updateTrack() {
        // Remove track pieces that are too far behind
        this.trackPieces = this.trackPieces.filter(track => {
            if (this.car && track.position < this.car.position.z - 100) {
                this.scene.remove(track.mesh);
                return false;
            }
            return true;
        });
        
        // Generate new track pieces ahead
        while (this.trackPieces.length < this.maxTrackPieces) {
            this.lastTrackPosition += this.trackLength;
            this.createTrackPiece(this.lastTrackPosition);
        }
    }
    
    updateUI() {
        document.getElementById('speed').textContent = Math.round(this.speed * 3.6);
        document.getElementById('score').textContent = Math.floor(this.score);
        document.getElementById('distance').textContent = Math.floor(this.distance);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const deltaTime = this.clock.getDelta();
        
        if (this.car) {
            this.updateCar();
            this.updateTrack();
            
            // Update score and distance
            this.score += this.speed * deltaTime * 10;
            this.distance += this.speed * deltaTime;
        }
        
        this.updateCamera();
        this.updateUI();
        this.renderer.render(this.scene, this.camera);
    }
}

// Start the game when page loads
window.addEventListener('load', () => {
    new InfiniteCarGame();
});