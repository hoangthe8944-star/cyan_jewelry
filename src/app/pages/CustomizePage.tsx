import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Sparkles, Upload, MessageSquare, RotateCw, LoaderCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { PageTransition } from '../components/PageTransition';

// Declare BABYLON on window for the loaded library
declare global {
  interface Window {
    BABYLON: any;
  }
}

function formatVndCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

// 3D Model templates configuration
const MODEL_TEMPLATES: Record<string, Array<{ name: string; path: string; type: string; size: string; defaultCut?: string }>> = {
  'Nhẫn': [
    { name: 'Nhẫn Độc bản', path: '/nhan.glb', type: 'glb', size: '122 KB', defaultCut: 'Diamond' },
    { name: 'Nhẫn Thanh lịch', path: '/nhan3.glb', type: 'glb', size: '65 KB', defaultCut: 'Vuông' },
    { name: 'Nhẫn Cao cấp', path: '/nhan4.glb', type: 'glb', size: '273 KB', defaultCut: 'Giọt nước' },
    { name: 'Nhẫn Vương miện', path: '/nhan2.glb', type: 'glb', size: '1.3 MB', defaultCut: 'Oval' }
  ],
  'Dây chuyền': [
    { name: 'Dây chuyền Đơn giản', path: '/daychuyen2.glb', type: 'glb', size: '441 KB', defaultCut: 'Heart' },
    { name: 'Dây chuyền Ngọc bảo', path: '/daychuyen3.glb', type: 'glb', size: '326 KB', defaultCut: 'Oval' },
    { name: 'Dây chuyền Cổ điển', path: '/daychuyen.glb', type: 'glb', size: '3.1 MB', defaultCut: 'Giọt nước' }
  ],
  'Hoa tai': [
    { name: 'Bông tai Ngọc trai', path: '/bongtai4.glb', type: 'glb', size: '242 KB', defaultCut: 'Diamond' },
    { name: 'Bông tai Giọt nước', path: '/bongtai2.glb', type: 'glb', size: '371 KB', defaultCut: 'Heart' },
    { name: 'Bông tai Đính đá', path: '/bongtai.glb', type: 'glb', size: '753 KB', defaultCut: 'Vuông' },
    { name: 'Bông tai Kỷ vật', path: '/bongtai3.glb', type: 'glb', size: '1.2 MB', defaultCut: 'Oval' }
  ],
  'Vòng tay': [
    { name: 'Vòng tay Mảnh', path: '/vongtay2.glb', type: 'glb', size: '1.3 MB', defaultCut: 'Diamond' },
    { name: 'Vòng tay Xích', path: '/vongtay4.glb', type: 'glb', size: '1.1 MB', defaultCut: 'Diamond' },
    { name: 'Vòng tay Bản rộng', path: '/vongtay.glb', type: 'glb', size: '878 KB', defaultCut: 'Vuông' },
    { name: 'Vòng tay Trầm hương', path: '/vongtay3.glb', type: 'glb', size: '589 KB', defaultCut: 'Bán cầu' }
  ]
};

export function CustomizePage() {
  const location = useLocation();
  const navigate = useNavigate();

  // If navigated from a specific product, we pre-fill some info
  const incomingProduct = location.state as {
    productName?: string;
    productSku?: string;
    price?: number;
    image?: string;
  } | null;

  const [jewelryType, setJewelryType] = useState('Nhẫn');
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
  const [material, setMaterial] = useState('Vàng 18K');
  const [gemstone, setGemstone] = useState('Kim cương');
  const [gemCut, setGemCut] = useState('Diamond');
  const [size, setSize] = useState('12');
  const [engraving, setEngraving] = useState('');
  const [sketch, setSketch] = useState<File | null>(null);
  const [sketchPreview, setSketchPreview] = useState<string | null>(null);
  
  // Customer info
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [successDesignCode, setSuccessDesignCode] = useState<string | null>(null);

  // Model loading states
  const [modelLoading, setModelLoading] = useState(false);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // 3D canvas refs
  const mountRef = useRef<HTMLDivElement>(null);
  const [threeLoaded, setThreeLoaded] = useState(false);
  const sceneRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const modelContainerRef = useRef<any>(null);
  const loadIdRef = useRef(0);
  const triggerMaterialUpdateRef = useRef<() => void>(() => {});
  const gemGeometriesRef = useRef<Record<string, any>>({});

  // Reset template index when jewelry type changes
  useEffect(() => {
    setSelectedTemplateIndex(0);
  }, [jewelryType]);

  const activeTemplate = MODEL_TEMPLATES[jewelryType]?.[selectedTemplateIndex] || MODEL_TEMPLATES[jewelryType]?.[0];

  // Auto-set the gem cut shape based on the chosen template configuration
  useEffect(() => {
    if (activeTemplate && activeTemplate.defaultCut) {
      setGemCut(activeTemplate.defaultCut);
    }
  }, [activeTemplate]);

  // Load Babylon.js and loaders dynamically
  useEffect(() => {
    if (window.BABYLON && window.BABYLON.SceneLoader) {
      setThreeLoaded(true);
      return;
    }

    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject();
        document.head.appendChild(script);
      });
    };

    const loadAllScripts = async () => {
      try {
        if (!window.BABYLON) {
          await loadScript('https://cdn.babylonjs.com/babylon.js');
        }
        await loadScript('https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js');
        setThreeLoaded(true);
      } catch (err) {
        console.error('Failed to load Babylon.js scripts:', err);
        toast.error('Không thể tải thư viện mô phỏng 3D.');
      }
    };

    loadAllScripts();
  }, []);

  // Set up Babylon.js Scene
  useEffect(() => {
    if (!threeLoaded || !mountRef.current) return;

    const BABYLON = window.BABYLON;

    // Create Canvas
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.touchAction = 'none';
    canvas.style.outline = 'none';
    mountRef.current.appendChild(canvas);

    // Initialize Engine
    const engine = new BABYLON.Engine(canvas, true);
    rendererRef.current = engine;

    // Create Scene
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0.06, 0.11, 0.15, 1.0); // #0F1C26 Dark luxury background
    sceneRef.current = scene;

    // Load gemstone geometries once from shape.obj
    BABYLON.SceneLoader.ImportMeshAsync('', '/', 'shape.obj', scene)
      .then((result: any) => {
        result.meshes.forEach((mesh: any) => {
          mesh.setEnabled(false);
          if (mesh.getTotalVertices && mesh.getTotalVertices() > 0) {
            const bounds = mesh.getHierarchyBoundingVectors(true);
            const center = BABYLON.Vector3.Center(bounds.min, bounds.max);
            mesh.position.subtractInPlace(center);
            mesh.bakeCurrentTransformIntoVertices();
          }
          const name = mesh.name;
          gemGeometriesRef.current[name] = mesh;
        });
        console.log('[Gem Cache] Loaded gemstone shapes from shape.obj:', Object.keys(gemGeometriesRef.current));
        // Re-trigger material/gem update now that geometries are cached
        if (triggerMaterialUpdateRef.current) {
          triggerMaterialUpdateRef.current();
        }
      })
      .catch((err: any) => {
        console.error('[Gem Cache] Failed to load shape.obj:', err);
      });

    // Camera
    const camera = new BABYLON.ArcRotateCamera(
      'camera',
      -Math.PI / 2,
      Math.PI / 3,
      7,
      BABYLON.Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 1;
    camera.upperRadiusLimit = 150;
    cameraRef.current = camera;

    // Lights
    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.6;

    const dirLight1 = new BABYLON.DirectionalLight('dirLight1', new BABYLON.Vector3(5, -10, 7), scene);
    dirLight1.intensity = 0.85;

    const dirLight2 = new BABYLON.DirectionalLight('dirLight2', new BABYLON.Vector3(-5, 5, -2), scene);
    dirLight2.intensity = 0.45;

    // Create parent Node for loaded models
    const modelContainer = new BABYLON.TransformNode('modelContainer', scene);
    modelContainerRef.current = modelContainer;

    // Idle rotation in render loop
    let isInteracting = false;
    
    // Listen to camera controls to pause idle rotation when user interacts
    camera.onViewMatrixChangedObservable.add(() => {
      isInteracting = true;
      // Reset interacting flag shortly after last movement
      clearTimeout(canvas.dataset.interactTimer as any);
      canvas.dataset.interactTimer = setTimeout(() => {
        isInteracting = false;
      }, 3000) as any;
    });

    scene.onBeforeRenderObservable.add(() => {
      if (!isInteracting && modelContainerRef.current) {
        modelContainerRef.current.rotation.y += 0.005;
      }
    });

    // Run Engine Loop
    engine.runRenderLoop(() => {
      scene.render();
    });

    // Resize Handler
    const handleResize = () => {
      engine.resize();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      engine.dispose();
      if (mountRef.current && canvas.parentNode) {
        mountRef.current.removeChild(canvas);
      }
    };
  }, [threeLoaded]);

  // Load the 3D model and apply materials using Babylon.js
  useEffect(() => {
    if (!threeLoaded || !sceneRef.current || !modelContainerRef.current || !activeTemplate) return;

    const BABYLON = window.BABYLON;
    const scene = sceneRef.current;
    const modelContainer = modelContainerRef.current;

    // Increment load session ID and track this load
    loadIdRef.current += 1;
    const currentLoadId = loadIdRef.current;

    // Clear previous children
    const prevMeshes = modelContainer.getChildMeshes();
    prevMeshes.forEach((mesh: any) => {
      mesh.dispose();
    });
    const prevNodes = modelContainer.getChildren();
    prevNodes.forEach((node: any) => {
      node.dispose();
    });

    // Reset container rotation, scale, and position
    modelContainer.rotation.set(0, 0, 0);
    modelContainer.scaling.set(1, 1, 1);
    modelContainer.position.set(0, 0, 0);

    setModelLoading(true);
    setLoadProgress(0);

    // Only show loading spinner/overlay if loading takes longer than 250ms
    const overlayTimeout = setTimeout(() => {
      if (loadIdRef.current === currentLoadId) {
        setShowLoadingOverlay(true);
      }
    }, 250);

    // Load Mesh
    const lastSlash = activeTemplate.path.lastIndexOf('/');
    const directory = activeTemplate.path.substring(0, lastSlash + 1) || '/';
    const filename = activeTemplate.path.substring(lastSlash + 1);

    BABYLON.SceneLoader.ImportMeshAsync(
      '',
      directory,
      filename,
      scene,
      (evt: any) => {
        if (currentLoadId !== loadIdRef.current) return;
        if (evt.lengthComputable && evt.total > 0) {
          const percent = Math.round((evt.loaded / evt.total) * 100);
          setLoadProgress(percent);
        }
      }
    ).then((result: any) => {
      if (currentLoadId !== loadIdRef.current) {
        // Dispose loaded meshes to avoid leak and duplicates if load is outdated
        result.meshes.forEach((mesh: any) => mesh.dispose());
        return;
      }
      clearTimeout(overlayTimeout);

      const meshes = result.meshes;
      
      // Parent meshes to modelContainer
      meshes.forEach((mesh: any) => {
        if (!mesh.parent) {
          mesh.parent = modelContainer;
        }
      });

      // Find Bounding Box to center and scale
      let min: any = null;
      let max: any = null;
      
      meshes.forEach((mesh: any) => {
        // Skip root mesh helper or empty nodes
        if (mesh.getTotalVertices() > 0) {
          const bounds = mesh.getHierarchyBoundingVectors(true);
          if (!min) {
            min = bounds.min;
            max = bounds.max;
          } else {
            min = BABYLON.Vector3.Minimize(min, bounds.min);
            max = BABYLON.Vector3.Maximize(max, bounds.max);
          }
        }
      });

      if (min && max) {
        const center = BABYLON.Vector3.Center(min, max);
        
        // Shift meshes so they are centered around the local origin of modelContainer
        meshes.forEach((mesh: any) => {
          if (mesh.parent === modelContainer) {
            mesh.position.subtractInPlace(center);
          }
        });

        // Let the camera auto-zoom to fit the meshes centered at (0,0,0) perfectly
        if (scene.activeCamera) {
          scene.activeCamera.zoomOn(meshes, true);
          // Move the camera further back (multiply by 2.2) to make the model smaller with elegant padding
          scene.activeCamera.radius *= 2.2;
        }
      }

      setModelLoading(false);
      setShowLoadingOverlay(false);

      // Force instant material application for the newly loaded model
      if (triggerMaterialUpdateRef.current) {
        triggerMaterialUpdateRef.current();
      }
    }).catch((err: any) => {
      if (currentLoadId !== loadIdRef.current) return;
      clearTimeout(overlayTimeout);

      console.error('Error loading Babylon.js model:', err);
      toast.error('Lỗi khi tải tệp tin mô hình 3D.');
      setModelLoading(false);
      setShowLoadingOverlay(false);
    });

    return () => {
      clearTimeout(overlayTimeout);
    };
  }, [activeTemplate, threeLoaded]);

  // Apply materials dynamically in real-time without reloading the model file
  useEffect(() => {
    const updateMaterials = () => {
      if (!threeLoaded || !sceneRef.current || !modelContainerRef.current) return;
      if (modelContainerRef.current.getChildMeshes().length === 0) return;

      const BABYLON = window.BABYLON;
      const scene = sceneRef.current;
      const modelContainer = modelContainerRef.current;

      // Set colors based on selections
      let metalColorStr = '#d4af37'; // Yellow Gold
      if (material === 'Vàng hồng 18K') metalColorStr = '#e5c2b2';
      if (material === 'Vàng trắng 18K' || material === 'Bạch kim') metalColorStr = '#e5e8e8';
      if (material === 'Bạc') metalColorStr = '#d9dbdd';

      let gemColorStr = '#ffffff'; // Diamond
      if (gemstone === 'Emerald (Ngọc lục bảo)') gemColorStr = '#50c878';
      if (gemstone === 'Sapphire (Lam ngọc)') gemColorStr = '#0f52ba';
      if (gemstone === 'Ruby (Hồng ngọc)') gemColorStr = '#e0115f';

      // Discard previous custom stones from the scene to prevent duplicates
      const prevCustomGems = scene.meshes.filter((m: any) => m.name && m.name.startsWith("customGem_"));
      prevCustomGems.forEach((mesh: any) => mesh.dispose());

      const applyMaterialToMesh = (mesh: any) => {
        if (!mesh.material) return;

        const name = (mesh.name || '').toLowerCase();
        const matName = (mesh.material.name || '').toLowerCase();
        
        const metalColor = BABYLON.Color3.FromHexString(metalColorStr);

        const isGem = 
          name.includes('gem') || 
          name.includes('diamond') || 
          name.includes('da_') || 
          name.includes('da ') || 
          name.includes('stone') || 
          name.includes('glass') || 
          name.includes('crystal') ||
          matName.includes('gem') || 
          matName.includes('diamond') || 
          matName.includes('da_') || 
          matName.includes('da ') || 
          matName.includes('stone') || 
          matName.includes('glass') || 
          matName.includes('crystal');

        if (isGem) {
          // Hide original gem placeholder mesh but keep it enabled in hierarchy
          mesh.isVisible = false;
          mesh.visibility = 0;
          mesh.getChildMeshes && mesh.getChildMeshes().forEach((c: any) => {
            c.isVisible = false;
            c.visibility = 0;
          });
          return; // Custom cuts handled below
        }

        const metalMat = new BABYLON.PBRMaterial('metalMat', scene);
        metalMat.albedoColor = metalColor;
        metalMat.metallic = 0.95;
        metalMat.roughness = 0.15;
        mesh.material = metalMat;
      };

      const meshes = modelContainer.getChildMeshes();
      
      // Identify all gem placeholder meshes
      const gemPlaceholders: any[] = [];
      meshes.forEach((mesh: any) => {
        applyMaterialToMesh(mesh);
        mesh.getChildMeshes && mesh.getChildMeshes().forEach((child: any) => applyMaterialToMesh(child));
        
        const name = (mesh.name || '').toLowerCase();
        const matName = (mesh.material && mesh.material.name || '').toLowerCase();
        const isGem = 
          name.includes('gem') || 
          name.includes('diamond') || 
          name.includes('da_') || 
          name.includes('da ') || 
          name.includes('stone') || 
          name.includes('glass') || 
          name.includes('crystal') ||
          (mesh.material && (
            matName.includes('gem') || 
            matName.includes('diamond') || 
            matName.includes('da_') || 
            matName.includes('da ') || 
            matName.includes('stone') || 
            matName.includes('glass') || 
            matName.includes('crystal')
          ));

        if (isGem) {
          gemPlaceholders.push(mesh);
        }
      });

      // If 'Không đính đá', just hide them and do not create custom cut shapes
      if (gemstone === 'Không đính đá') {
        gemPlaceholders.forEach((placeholder: any) => {
          placeholder.isVisible = false;
          placeholder.visibility = 0;
          placeholder.getChildMeshes && placeholder.getChildMeshes().forEach((c: any) => {
            c.isVisible = false;
            c.visibility = 0;
          });
        });
        return;
      }

      // Generate custom cut shapes at placeholder locations
      gemPlaceholders.forEach((placeholder: any, idx: number) => {
        placeholder.isVisible = false; // Hide placeholder
        placeholder.visibility = 0;
        placeholder.getChildMeshes && placeholder.getChildMeshes().forEach((c: any) => {
          c.isVisible = false;
          c.visibility = 0;
        });

        const getCustomMesh = () => {
          if (gemCut === 'Diamond' && gemGeometriesRef.current['Round_diamond']) {
            return gemGeometriesRef.current['Round_diamond'].clone("customGem_" + idx);
          } else if (gemCut === 'Vuông' && gemGeometriesRef.current['Cushion_diamond']) {
            return gemGeometriesRef.current['Cushion_diamond'].clone("customGem_" + idx);
          } else if (gemCut === 'Heart' && gemGeometriesRef.current['Heart_diamond']) {
            return gemGeometriesRef.current['Heart_diamond'].clone("customGem_" + idx);
          } else if (gemCut === 'Giọt nước' && gemGeometriesRef.current['Pear_diamond']) {
            return gemGeometriesRef.current['Pear_diamond'].clone("customGem_" + idx);
          } else if (gemCut === 'Oval' && gemGeometriesRef.current['Oval_diamond']) {
            return gemGeometriesRef.current['Oval_diamond'].clone("customGem_" + idx);
          }
          return null;
        };

        let gemCutMesh = getCustomMesh();
        if (gemCutMesh) {
          gemCutMesh.setEnabled(true);
        } else {
          // Procedural fallback
          if (gemCut === 'Diamond') {
            const profile = [
              new BABYLON.Vector3(0, -0.5, 0),
              new BABYLON.Vector3(0.5, -0.1, 0),
              new BABYLON.Vector3(0.5, 0, 0),
              new BABYLON.Vector3(0.3, 0.3, 0),
              new BABYLON.Vector3(0, 0.3, 0)
            ];
            gemCutMesh = BABYLON.MeshBuilder.CreateLathe("customGem_" + idx, {
              shape: profile,
              tessellation: 8
            }, scene);
          } else if (gemCut === 'Vuông') {
            const profile = [
              new BABYLON.Vector3(0, -0.5, 0),
              new BABYLON.Vector3(0.5, -0.1, 0),
              new BABYLON.Vector3(0.5, 0, 0),
              new BABYLON.Vector3(0.4, 0.25, 0),
              new BABYLON.Vector3(0, 0.25, 0)
            ];
            gemCutMesh = BABYLON.MeshBuilder.CreateLathe("customGem_" + idx, {
              shape: profile,
              tessellation: 4
            }, scene);
            gemCutMesh.rotation.y = Math.PI / 4;
          } else if (gemCut === 'Bán cầu') {
            const profile = [];
            for (let i = 0; i <= 10; i++) {
              const angle = (i / 10) * Math.PI / 2;
              profile.push(new BABYLON.Vector3(Math.cos(angle) * 0.5, Math.sin(angle) * 0.5 - 0.25, 0));
            }
            profile.push(new BABYLON.Vector3(0, -0.25, 0));
            gemCutMesh = BABYLON.MeshBuilder.CreateLathe("customGem_" + idx, {
              shape: profile,
              tessellation: 24
            }, scene);
          } else if (gemCut === 'Giọt nước') {
            gemCutMesh = BABYLON.MeshBuilder.CreateSphere("customGem_" + idx, { segments: 16, diameter: 1 }, scene);
            gemCutMesh.scaling.set(0.75, 1.25, 0.75);
            const positions = gemCutMesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
            for (let i = 0; i < positions.length; i += 3) {
              let x = positions[i];
              let y = positions[i+1];
              let z = positions[i+2];
              const progress = (y + 0.625) / 1.25;
              const factor = Math.max(0.1, 1 - progress);
              positions[i] = x * factor;
              positions[i+2] = z * factor;
            }
            gemCutMesh.setVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
            gemCutMesh.createNormals(true);
          } else if (gemCut === 'Heart') {
            gemCutMesh = BABYLON.MeshBuilder.CreateSphere("customGem_" + idx, { segments: 16, diameter: 1 }, scene);
            gemCutMesh.scaling.set(1.0, 0.9, 0.7);
            const positions = gemCutMesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
            for (let i = 0; i < positions.length; i += 3) {
              let x = positions[i];
              let y = positions[i+1];
              let z = positions[i+2];
              if (y > 0) {
                y -= 0.18 * Math.max(0, 1 - Math.abs(x) * 3);
              }
              if (y < 0) {
                const progress = (y + 0.5);
                x *= progress * 2.0;
                z *= progress * 2.0;
              }
              if (y > -0.2 && y < 0.2) {
                x *= 1.25;
              }
              positions[i] = x;
              positions[i+1] = y;
              positions[i+2] = z;
            }
            gemCutMesh.setVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
            gemCutMesh.createNormals(true);
          } else if (gemCut === 'Oval') {
            gemCutMesh = BABYLON.MeshBuilder.CreateSphere("customGem_" + idx, { segments: 16, diameter: 1 }, scene);
            gemCutMesh.scaling.set(0.7, 0.5, 1.2);
          }
        }

        if (gemCutMesh) {
          // Parent custom gem to the same parent as placeholder to maintain coordinate space
          gemCutMesh.parent = placeholder.parent || modelContainer;

          // Copy position and rotation of original placeholder
          gemCutMesh.position.copyFrom(placeholder.position);
          if (placeholder.rotationQuaternion) {
            gemCutMesh.rotationQuaternion = placeholder.rotationQuaternion.clone();
          } else {
            gemCutMesh.rotation.copyFrom(placeholder.rotation);
          }

          // Calculate precise scaling to fit the placeholder bounds exactly
          let scaleX = placeholder.scaling.x;
          let scaleY = placeholder.scaling.y;
          let scaleZ = placeholder.scaling.z;

          if (placeholder.getBoundingInfo && gemCutMesh.getBoundingInfo) {
            const placeholderLocalSize = placeholder.getBoundingInfo().boundingBox.extendSize.scale(2);
            const customLocalSize = gemCutMesh.getBoundingInfo().boundingBox.extendSize.scale(2);
            
            if (customLocalSize.x > 0 && customLocalSize.y > 0 && customLocalSize.z > 0) {
              scaleX = (placeholderLocalSize.x * placeholder.scaling.x) / customLocalSize.x;
              scaleY = (placeholderLocalSize.y * placeholder.scaling.y) / customLocalSize.y;
              scaleZ = (placeholderLocalSize.z * placeholder.scaling.z) / customLocalSize.z;
            }
          }

          gemCutMesh.scaling.set(scaleX, scaleY, scaleZ);

          // Apply gem materials
          const gemColor = BABYLON.Color3.FromHexString(gemColorStr);
          const gemMat = new BABYLON.PBRMaterial('gemMat_' + idx, scene);
          gemMat.albedoColor = gemColor;
          gemMat.metallic = 0.0;
          gemMat.roughness = 0.05;
          gemMat.indexOfRefraction = 2.4;
          gemMat.alpha = 0.85;
          gemMat.subSurface.isRefractionEnabled = true;
          gemMat.subSurface.refractionIntensity = 0.95;
          gemCutMesh.material = gemMat;
        }
      });
    };

    triggerMaterialUpdateRef.current = updateMaterials;
    updateMaterials();
  }, [activeTemplate, material, gemstone, gemCut, threeLoaded]);

  useEffect(() => {
    if (incomingProduct?.productName) {
      setNotes(`Yêu cầu tùy chỉnh dựa trên sản phẩm mẫu: ${incomingProduct.productName} (${incomingProduct.productSku || 'N/A'})`);
      
      const nameLower = incomingProduct.productName.toLowerCase();
      if (nameLower.includes('nhẫn') || nameLower.includes('ring')) setJewelryType('Nhẫn');
      else if (nameLower.includes('dây chuyền') || nameLower.includes('vòng cổ') || nameLower.includes('necklace')) setJewelryType('Dây chuyền');
      else if (nameLower.includes('bông tai') || nameLower.includes('hoa tai') || nameLower.includes('earring')) setJewelryType('Hoa tai');
      else if (nameLower.includes('vòng tay') || nameLower.includes('lắc tay') || nameLower.includes('bracelet')) setJewelryType('Vòng tay');
    }
  }, [incomingProduct]);

  const handleSketchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSketch(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSketchPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast.success('Đã tải ảnh thiết kế phác thảo lên thành công.');
    }
  };

  const calculateEstimate = () => {
    let base = 5000000;
    if (jewelryType === 'Dây chuyền') base += 3500000;
    if (jewelryType === 'Vòng tay') base += 2500000;
    if (jewelryType === 'Hoa tai') base += 1500000;

    if (material === 'Bạch kim') base += 10000000;
    if (material === 'Vàng trắng 18K') base += 4500000;
    if (material === 'Vàng hồng 18K') base += 4000000;
    if (material === 'Bạc') base -= 3500000;

    if (gemstone === 'Kim cương') base += 15000000;
    if (gemstone === 'Emerald (Ngọc lục bảo)') base += 12000000;
    if (gemstone === 'Sapphire (Lam ngọc)') base += 9000000;
    if (gemstone === 'Ruby (Hồng ngọc)') base += 10000000;
    if (gemstone === 'Không đính đá') base = Math.max(2000000, base - 3000000);

    if (engraving) base += 500000;

    return base;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !email) {
      toast.error('Vui lòng nhập đầy đủ thông tin liên hệ bắt buộc.');
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      const code = 'CST-' + Math.random().toString(36).substring(2, 10).toUpperCase();
      setSuccessDesignCode(code);
      setSubmitting(false);
      
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
      
      toast.success('Gửi yêu cầu thiết kế thành công! Chuyên viên Oriven sẽ liên hệ lại quý khách.');
    }, 2000);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#FAF9F6] pb-24 pt-28 lg:pt-36">
        <div className="mx-auto max-w-[1300px] px-6">
          
          <button
            onClick={() => navigate(-1)}
            className="mb-8 flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Quay lại</span>
          </button>

          {successDesignCode ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto border border-[#A36B31]/30 bg-white p-8 sm:p-12 text-center rounded-2xl shadow-xl"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-[#A36B31]/10 flex items-center justify-center mb-6">
                <Sparkles className="h-8 w-8 text-[#A36B31]" />
              </div>
              <h2 className="font-sterling text-3xl sm:text-4xl text-primary mb-4">Yêu Cầu Đã Được Tiếp Nhận</h2>
              <p className="text-foreground/75 leading-8 max-w-md mx-auto mb-8">
                Cảm ơn quý khách <strong>{fullName}</strong> đã tin tưởng giao phó ý tưởng thiết kế độc bản cho Oriven Jewelry. 
                Mã yêu cầu thiết kế của quý khách là:
              </p>
              <div className="bg-[#FAF9F6] border border-border py-4 px-6 rounded-lg font-mono text-[#A36B31] text-lg font-semibold tracking-widest inline-block mb-8">
                {successDesignCode}
              </div>
              <p className="text-xs text-foreground/50 mb-8 max-w-sm mx-auto">
                Chuyên viên tư vấn trang sức cao cấp của Oriven sẽ liên hệ trực tiếp với quý khách qua số điện thoại <strong>{phone}</strong> hoặc email <strong>{email}</strong> trong vòng 2-4 giờ làm việc.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/home')}
                  className="px-8 py-4 bg-primary text-white hover:bg-secondary transition-colors text-sm uppercase tracking-widest font-semibold"
                >
                  Quay lại trang chủ
                </button>
                <button
                  onClick={() => {
                    setSuccessDesignCode(null);
                    setEngraving('');
                    setSketch(null);
                    setSketchPreview(null);
                  }}
                  className="px-8 py-4 border border-primary text-primary hover:bg-muted transition-colors text-sm uppercase tracking-widest font-semibold"
                >
                  Tạo yêu cầu mới
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Left Column: 3D Preview (Luxurious Viewport) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="sticky top-28 bg-[#0F1C26] rounded-2xl overflow-hidden border border-[#A36B31]/30 shadow-2xl relative">
                  
                  {/* Viewport header */}
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 pointer-events-none">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-white/50">Studio 3D độc quyền</span>
                    <h3 className="text-base text-[#f2e2cf] font-medium font-sterling flex items-center gap-1.5">
                      <span>Mô phỏng 3D tương tác</span>
                      <Sparkles className="h-3.5 w-3.5 text-[#A36B31] animate-pulse" />
                    </h3>
                  </div>

                  <div className="absolute top-4 right-4 z-10 pointer-events-none flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] text-white/70 uppercase tracking-widest border border-white/5">
                    <RotateCw className="h-3 w-3 animate-spin duration-3000" />
                    <span>Kéo để xoay</span>
                  </div>

                  {/* 3D Canvas mount point */}
                  <div 
                    ref={mountRef} 
                    className="w-full aspect-square md:aspect-[4/5] min-h-[350px] cursor-grab active:cursor-grabbing flex items-center justify-center relative"
                  >
                    {!threeLoaded && (
                      <div className="text-center text-white/60 flex flex-col items-center gap-3">
                        <LoaderCircle className="h-8 w-8 animate-spin text-[#A36B31]" />
                        <p className="text-xs uppercase tracking-widest">Đang khởi động không gian 3D...</p>
                      </div>
                    )}
                    {threeLoaded && (
                      <div className={`absolute inset-0 bg-[#0F1C26]/80 backdrop-blur-sm flex flex-col items-center justify-center text-white/90 z-20 space-y-4 transition-all duration-300 ease-in-out ${
                        showLoadingOverlay ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                      }`}>
                        <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-[#A36B31] animate-spin"></div>
                        <div className="text-center space-y-1">
                          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#f2e2cf]">Đang tải mô hình 3D...</p>
                          <p className="text-[10px] text-white/50 font-mono">{loadProgress}%</p>
                        </div>
                        <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#A36B31] transition-all duration-300 ease-out" 
                            style={{ width: `${loadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Configuration bar overlay */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white text-xs space-y-2 pointer-events-none z-10">
                    <div className="flex justify-between">
                      <span className="text-white/50 uppercase tracking-wider">Cấu hình:</span>
                      <span className="font-semibold text-[#f2e2cf]">{activeTemplate?.name} • {material} • {gemstone}</span>
                    </div>
                  </div>

                </div>

                <div className="bg-white border border-border p-6 rounded-2xl space-y-4 shadow-sm text-sm">
                  <h4 className="font-semibold text-primary uppercase tracking-wider text-xs">Cách tương tác thiết kế 3D:</h4>
                  <ul className="space-y-2 text-foreground/75 list-disc pl-5">
                    <li>Nhấp chuột trái (hoặc vuốt trên điện thoại) và kéo để xoay đa góc độ.</li>
                    <li>Thay đổi loại trang sức, đá chủ hoặc chất liệu ở cột bên phải để thấy thay đổi thời gian thực.</li>
                  </ul>
                </div>
              </div>

              {/* Right Column: Form Settings Customize */}
              <div className="lg:col-span-7 space-y-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#A36B31] font-semibold mb-2">Độc bản nghệ thuật</p>
                  <h1 className="font-sterling text-4xl sm:text-5xl text-primary">Tùy Chỉnh Thiết Kế Trang Sức</h1>
                  <p className="mt-4 text-foreground/70 leading-7 text-sm sm:text-base">
                    Tinh chỉnh vật liệu, đá quý, kiểu dáng hoặc tải lên phác thảo ý tưởng của riêng bạn. Nghệ nhân lành nghề của Oriven Jewelry sẽ hiện thực hóa tạo tác dành riêng cho bạn.
                  </p>
                </div>

                {incomingProduct && (
                  <div className="flex items-center gap-4 bg-white border border-[#A36B31]/20 p-4 rounded-xl shadow-sm">
                    {incomingProduct.image && (
                      <img src={incomingProduct.image} alt={incomingProduct.productName} className="w-16 h-16 object-cover rounded-lg bg-muted border border-border" />
                    )}
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">Đang thiết kế dựa trên mẫu</p>
                      <h4 className="font-medium text-foreground text-base">{incomingProduct.productName}</h4>
                      {incomingProduct.productSku && <p className="text-xs text-muted-foreground mt-1">Mã mẫu: {incomingProduct.productSku}</p>}
                    </div>
                  </div>
                )}

                <div className="bg-white border border-border p-8 rounded-2xl shadow-sm space-y-8">
                  {/* Step 1: Chọn kiểu dáng & Mẫu thiết kế 3D */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-primary border-b border-border pb-2">1. Loại trang sức</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {['Nhẫn', 'Dây chuyền', 'Hoa tai', 'Vòng tay'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setJewelryType(type)}
                            className={`py-3.5 px-3 border text-center transition-all text-sm ${
                              jewelryType === type ? 'border-primary bg-primary text-white font-medium' : 'border-border hover:border-primary text-foreground'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-xs uppercase tracking-widest text-[#11212D]/60 font-semibold block mb-2">Chọn mẫu thiết kế 3D từ Oriven</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {MODEL_TEMPLATES[jewelryType]?.map((tmpl, idx) => (
                          <button
                            key={tmpl.path}
                            type="button"
                            onClick={() => setSelectedTemplateIndex(idx)}
                            className={`p-4 border text-left transition-all rounded-xl relative flex items-center justify-between ${
                              selectedTemplateIndex === idx 
                                ? 'border-[#A36B31] bg-[#A36B31]/5 text-primary' 
                                : 'border-border hover:border-[#A36B31]/50 text-foreground'
                            }`}
                          >
                            <div className="space-y-1">
                              <p className="text-sm font-medium">{tmpl.name}</p>
                              <p className="text-[10px] text-muted-foreground">Kiểu file: {tmpl.type.toUpperCase()} • Dung lượng: {tmpl.size}</p>
                            </div>
                            {selectedTemplateIndex === idx && (
                              <div className="w-5 h-5 rounded-full bg-[#A36B31] flex items-center justify-center flex-shrink-0 ml-3">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Chọn chất liệu */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-primary border-b border-border pb-2">2. Chất liệu kim loại</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {['Vàng 18K', 'Vàng hồng 18K', 'Vàng trắng 18K', 'Bạch kim', 'Bạc'].map((mat) => (
                        <button
                          key={mat}
                          type="button"
                          onClick={() => setMaterial(mat)}
                          className={`py-3.5 px-3 border text-center transition-all text-sm ${
                            material === mat ? 'border-primary bg-primary text-white' : 'border-border hover:border-primary text-foreground'
                          }`}
                        >
                          {mat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 3: Chọn đá quý chủ */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-primary border-b border-border pb-2">3. Đá quý đính kèm</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        'Kim cương',
                        'Emerald (Ngọc lục bảo)',
                        'Sapphire (Lam ngọc)',
                        'Ruby (Hồng ngọc)',
                        'Không đính đá',
                      ].map((gem) => (
                        <button
                          key={gem}
                          type="button"
                          onClick={() => setGemstone(gem)}
                          className={`py-3.5 px-3 border text-center text-xs sm:text-sm transition-all ${
                            gemstone === gem ? 'border-primary bg-primary text-white' : 'border-border hover:border-primary text-foreground'
                          }`}
                        >
                          {gem}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 4: Kích cỡ & Khắc chữ */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-[#11212D]/60 font-semibold">Kích cỡ (Size)</label>
                      <select
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                      >
                        {Array.from({ length: 15 }, (_, i) => i + 6).map((sz) => (
                          <option key={sz} value={`${sz}`}>{`Size ${sz}`}</option>
                        ))}
                        <option value="Tư vấn sau">Yêu cầu tư vấn kích thước sau</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-[#11212D]/60 font-semibold">Khắc chữ cá nhân hóa (+500.000đ)</label>
                      <input
                        type="text"
                        value={engraving}
                        onChange={(e) => setEngraving(e.target.value)}
                        placeholder="Tên, ngày kỷ niệm, hoặc thông điệp..."
                        maxLength={20}
                        className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Estimate price breakdown widget */}
                  <div className="bg-[#FAF9F6] border border-border p-6 rounded-xl space-y-4">
                    <div className="flex justify-between items-end border-b border-border pb-3">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">Ước tính khoảng giá chế tác sơ bộ</p>
                        <p className="text-3xl font-sterling text-[#A36B31] mt-1">{formatVndCurrency(calculateEstimate())}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground bg-white border px-2.5 py-1 rounded-full uppercase tracking-wider">Tham khảo</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      * Khoản chi phí chế tác chính thức phụ thuộc vào khối lượng vàng và đá quý thực tế sau khi phác thảo và duyệt bản vẽ 3D thiết kế hoàn thiện.
                    </p>
                  </div>

                  {/* Step 5: Upload phác thảo */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-primary border-b border-border pb-2">4. Tải lên ảnh phác thảo ý tưởng (Tùy chọn)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary transition-colors relative bg-[#FAF9F6]">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleSketchChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <Upload className="h-8 w-8 text-[#A36B31] mb-2" />
                        <p className="text-sm font-semibold">Tải ảnh bản vẽ sketch của bạn lên</p>
                        <p className="text-xs text-muted-foreground mt-1">Định dạng JPG, PNG dung lượng dưới 5MB</p>
                      </div>
                      
                      {sketchPreview ? (
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-muted border border-border">
                          <img src={sketchPreview} alt="Sketch preview" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="rounded-xl border border-border bg-[#FAF9F6]/50 p-6 flex items-center justify-center text-center text-xs text-muted-foreground">
                          Chưa có thiết kế tải lên. Nghệ nhân Oriven sẽ vẽ phác thảo dựa trên mô tả ý tưởng của bạn.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Step 6: Contact Info */}
                  <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-border">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-primary border-b border-border pb-2">5. Thông tin liên hệ tư vấn chế tác</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Họ tên *</label>
                        <input
                          required
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Nguyễn Văn A"
                          className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Số điện thoại *</label>
                        <input
                          required
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="0901234567"
                          className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Email *</label>
                        <input
                          required
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="nguyenvana@example.com"
                          className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Mô tả thêm ý tưởng của quý khách</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Hãy chia sẻ thêm về câu chuyện hoặc phong cách quý khách mong muốn gửi gắm vào tác phẩm..."
                        rows={4}
                        className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-foreground outline-none focus:border-primary resize-none"
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="w-full bg-[#A36B31] py-5 text-white hover:bg-[#8e5c27] transition-all uppercase tracking-widest text-sm font-semibold shadow-lg shadow-[#A36B31]/10 flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        {submitting ? (
                          <LoaderCircle className="h-5 w-5 animate-spin" />
                        ) : (
                          <MessageSquare className="h-5 w-5" />
                        )}
                        <span>{submitting ? 'Đang xử lý ý tưởng...' : 'Gửi yêu cầu chế tác độc bản'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </PageTransition>
  );
}
