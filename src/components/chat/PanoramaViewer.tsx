'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

interface PanoramaViewerProps {
    imageUrl: string;
    alt: string;
}

interface ThreeTexture {
    colorSpace?: unknown;
    dispose?: () => void;
}

interface ThreeMaterial {
    map?: ThreeTexture | null;
    needsUpdate: boolean;
    dispose: () => void;
}

interface ThreeGeometry {
    scale: (x: number, y: number, z: number) => void;
    dispose: () => void;
}

interface ThreeCamera {
    aspect: number;
    fov: number;
    updateProjectionMatrix: () => void;
    lookAt: (target: unknown) => void;
}

interface ThreeRenderer {
    domElement: HTMLCanvasElement;
    xr: {
        enabled: boolean;
        setSession: (session: unknown) => Promise<void> | void;
    };
    setPixelRatio: (value: number) => void;
    setSize: (width: number, height: number, updateStyle?: boolean) => void;
    setAnimationLoop: (callback: (() => void) | null) => void;
    render: (scene: unknown, camera: ThreeCamera) => void;
    dispose: () => void;
}

interface ThreeTextureLoader {
    setCrossOrigin: (value: string) => void;
    load: (
        url: string,
        onLoad: (texture: ThreeTexture) => void,
        onProgress?: unknown,
        onError?: () => void
    ) => void;
}

interface ThreeScene {
    add: (object: unknown) => void;
}

interface ThreeModule {
    Scene: new () => ThreeScene;
    PerspectiveCamera: new (fov: number, aspect: number, near: number, far: number) => ThreeCamera;
    WebGLRenderer: new (options: { antialias: boolean }) => ThreeRenderer;
    SphereGeometry: new (radius: number, widthSegments: number, heightSegments: number) => ThreeGeometry;
    TextureLoader: new () => ThreeTextureLoader;
    MeshBasicMaterial: new (options: { color: number }) => ThreeMaterial;
    Mesh: new (geometry: ThreeGeometry, material: ThreeMaterial) => unknown;
    Vector3: new (x: number, y: number, z: number) => unknown;
    MathUtils: { degToRad: (degrees: number) => number };
    SRGBColorSpace: unknown;
}

interface XRSessionLike {
    end?: () => Promise<void> | void;
    addEventListener?: (type: 'end', listener: () => void) => void;
}

export function PanoramaViewer({ imageUrl, alt }: PanoramaViewerProps) {
    const mountRef = useRef<HTMLDivElement | null>(null);
    const rendererRef = useRef<ThreeRenderer | null>(null);
    const vrSessionRef = useRef<XRSessionLike | null>(null);
    const [vrSupported, setVrSupported] = useState(false);
    const [vrActive, setVrActive] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const textureUrl = `/api/panorama-image?url=${encodeURIComponent(imageUrl)}`;

    useEffect(() => {
        let cancelled = false;
        const checkVrSupport = async () => {
            if (typeof navigator === 'undefined' || !navigator.xr?.isSessionSupported) {
                setVrSupported(false);
                return;
            }

            try {
                const supported = await navigator.xr.isSessionSupported('immersive-vr');
                if (!cancelled) setVrSupported(supported);
            } catch {
                if (!cancelled) setVrSupported(false);
            }
        };

        checkVrSupport();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        let disposed = false;
        let cleanup: (() => void) | undefined;

        const initializeViewer = async () => {
            const THREE = await import('three') as unknown as ThreeModule;
            if (disposed || !mountRef.current) return;

            setLoadError(null);

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1100);
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
            renderer.xr.enabled = true;
            rendererRef.current = renderer;

            const geometry = new THREE.SphereGeometry(500, 96, 48);
            geometry.scale(-1, 1, 1);

            const textureLoader = new THREE.TextureLoader();
            textureLoader.setCrossOrigin('anonymous');

            const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const sphere = new THREE.Mesh(geometry, material);
            scene.add(sphere);

            mount.innerHTML = '';
            mount.appendChild(renderer.domElement);
            renderer.domElement.setAttribute('aria-label', alt);
            renderer.domElement.setAttribute('role', 'img');
            renderer.domElement.style.display = 'block';
            renderer.domElement.style.width = '100%';
            renderer.domElement.style.height = '100%';
            renderer.domElement.style.touchAction = 'none';

            let lon = 0;
            let lat = 0;
            let isPointerDown = false;
            let pointerStartX = 0;
            let pointerStartY = 0;
            let lonStart = 0;
            let latStart = 0;
            let fov = 75;

            const resize = () => {
                const width = mount.clientWidth || window.innerWidth;
                const height = mount.clientHeight || window.innerHeight;
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height, false);
            };

            const render = () => {
                lat = Math.max(-85, Math.min(85, lat));
                const phi = THREE.MathUtils.degToRad(90 - lat);
                const theta = THREE.MathUtils.degToRad(lon);
                const target = new THREE.Vector3(
                    500 * Math.sin(phi) * Math.cos(theta),
                    500 * Math.cos(phi),
                    500 * Math.sin(phi) * Math.sin(theta)
                );
                camera.lookAt(target);
                renderer.render(scene, camera);
            };

            const onPointerDown = (event: PointerEvent) => {
                isPointerDown = true;
                pointerStartX = event.clientX;
                pointerStartY = event.clientY;
                lonStart = lon;
                latStart = lat;
                renderer.domElement.setPointerCapture(event.pointerId);
            };

            const onPointerMove = (event: PointerEvent) => {
                if (!isPointerDown) return;
                lon = lonStart - (event.clientX - pointerStartX) * 0.12;
                lat = latStart + (event.clientY - pointerStartY) * 0.12;
            };

            const onPointerUp = (event: PointerEvent) => {
                isPointerDown = false;
                try {
                    renderer.domElement.releasePointerCapture(event.pointerId);
                } catch {
                    // Ignore release errors if the browser already cleared capture.
                }
            };

            const onWheel = (event: WheelEvent) => {
                event.preventDefault();
                fov = Math.max(35, Math.min(95, fov + event.deltaY * 0.04));
                camera.fov = fov;
                camera.updateProjectionMatrix();
            };

            renderer.domElement.addEventListener('pointerdown', onPointerDown);
            renderer.domElement.addEventListener('pointermove', onPointerMove);
            renderer.domElement.addEventListener('pointerup', onPointerUp);
            renderer.domElement.addEventListener('pointercancel', onPointerUp);
            renderer.domElement.addEventListener('wheel', onWheel, { passive: false });
            window.addEventListener('resize', resize);

            textureLoader.load(
                textureUrl,
                (texture: ThreeTexture) => {
                    if (disposed) {
                        texture.dispose?.();
                        return;
                    }
                    texture.colorSpace = THREE.SRGBColorSpace;
                    material.map = texture;
                    material.needsUpdate = true;
                    setLoadError(null);
                },
                undefined,
                () => {
                    if (!disposed) setLoadError('Panorama image could not be loaded.');
                }
            );

            resize();
            renderer.setAnimationLoop(render);

            cleanup = () => {
                renderer.setAnimationLoop(null);
                renderer.domElement.removeEventListener('pointerdown', onPointerDown);
                renderer.domElement.removeEventListener('pointermove', onPointerMove);
                renderer.domElement.removeEventListener('pointerup', onPointerUp);
                renderer.domElement.removeEventListener('pointercancel', onPointerUp);
                renderer.domElement.removeEventListener('wheel', onWheel);
                window.removeEventListener('resize', resize);
                material.map?.dispose?.();
                material.dispose();
                geometry.dispose();
                renderer.dispose();
                if (renderer.domElement.parentNode) {
                    renderer.domElement.parentNode.removeChild(renderer.domElement);
                }
                if (rendererRef.current === renderer) {
                    rendererRef.current = null;
                }
            };
        };

        initializeViewer();

        return () => {
            disposed = true;
            cleanup?.();
        };
    }, [alt, textureUrl]);

    const handleEnterVr = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        const renderer = rendererRef.current;
        if (!renderer || !navigator.xr?.requestSession) return;

        try {
            if (vrSessionRef.current) {
                await vrSessionRef.current.end?.();
                vrSessionRef.current = null;
                setVrActive(false);
                return;
            }

            const session = await navigator.xr.requestSession('immersive-vr', {
                optionalFeatures: ['local-floor', 'bounded-floor'],
            }) as XRSessionLike;
            vrSessionRef.current = session;
            setVrActive(true);
            session.addEventListener?.('end', () => {
                vrSessionRef.current = null;
                setVrActive(false);
            });
            await renderer.xr.setSession(session);
        } catch (error) {
            console.warn('[PanoramaViewer] Failed to start VR session:', error);
            setVrActive(false);
        }
    }, []);

    useEffect(() => {
        return () => {
            if (vrSessionRef.current) {
                void vrSessionRef.current.end?.();
                vrSessionRef.current = null;
            }
        };
    }, []);

    return (
        <div className="relative h-full w-full overflow-hidden bg-black" onClick={(e) => e.stopPropagation()}>
            <div ref={mountRef} className="absolute inset-0" />
            {loadError && (
                <div className="absolute left-1/2 top-1/2 max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-md bg-black/80 px-4 py-3 text-center text-sm text-white">
                    {loadError}
                </div>
            )}
            {vrSupported && (
                <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="absolute bottom-4 right-4 bg-white/90 text-black hover:bg-white"
                    onClick={handleEnterVr}
                >
                    {vrActive ? 'Exit VR' : 'Enter VR'}
                </Button>
            )}
        </div>
    );
}
