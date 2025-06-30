import React, { useEffect, useRef } from 'react'
import { Sphere, useTexture, OrbitControls, Html } from "@react-three/drei";
import "./panoramascene.css";


const hotspots = [

    {
        id: "hmsc1-to-hmsc2",
        position: [-15, -80, -150],
        rotation: [-1.5, 0, 1.6],
        label: "➡",
        targetImage: 1
    },

    {
        id: "hmsc2-to-hmsc1",
        position: [-5, -100, -140],
        rotation: [-1.5, 0, 1.6],
        label: "⬅",
        targetImage: 0
    },

    {
        id: "hmsc2-to-hmsc3",
        position: [-5, -90, -160],
        rotation: [-1.5, 0, 1.6],
        label: "➡",
        targetImage: 2
    },

    {
        id: "hmsc3-to-hmsc2",
        position: [0, -120, -100],
        rotation: [-1.5, 0, 1.6],
        label: "⬅",
        targetImage: 1
    },

    {
        id: "hmsc3-to-hmsc4",
        position: [50, -140, -80],
        rotation: [-1.5, 0, 0],
        label: "➡",
        targetImage: 3
    },

    {
        id: "hmsc4-to-hmsc3",
        position: [-20, -120, -80],
        rotation: [-1.5, 0, 1.6],
        label: "⬅",
        targetImage: 2
    },

    {
        id: "hmsc4-to-hmsc5",
        position: [120, -120, -10],
        rotation: [-1.5, 0, 0],
        label: "➡",
        targetImage: 4
    },

    {
        id: "hmsc5-to-hmsc4",
        position: [-20, -120, -150],
        rotation: [-1.5, 0, 1.6],
        label: "⬅",
        targetImage: 3
    },

    {
        id: "hmsc5-to-hmsc6",
        position: [-10, -50, -200],
        rotation: [-1.2, 0, 0],
        label: "➡",
        targetImage: 5
    },

    {
        id: "hmsc6-to-hmsc5",
        position: [10, -100, -100],
        rotation: [-1.5, 0, 1.6],
        label: "⬅",
        targetImage: 4
    },

    {
        id: "hmsc6-to-hmsc7",
        position: [100, -100, 10],
        rotation: [-1.5, 0, 0],
        label: "➡",
        targetImage: 6
    },

    {
        id: "hmsc7-to-hmsc6",
        position: [0, -100, -120],
        rotation: [-1.5, 0, 1.6],
        label: "⬅",
        targetImage: 5
    },

    {
        id: "hmsc7-to-hmsc8"    ,
        position: [0, -100, -150],
        rotation: [-1.5, 0, 1.6],
        label: "➡",
        targetImage: 7
    },

    {
        id: "hmsc8-to-hmsc7",
        position: [0, -100, -120],
        rotation: [-1.5, 0, 1.6],
        label: "⬅",
        targetImage: 6
    },



    // เพิ่มปุ่มพิเศษสำหรับรูปที่ 1
    {
        id: "hmsc1-to-buy",
        position: [100, -40, -50],
        label: "Go to buy",
        isSpecialAction: true,
        actionType: "show-product-hmsc1-1",
        rotation: [0, -1.6, 0],
    },

    {
        id: "hmsc1-to-buy",
        position: [-100, -30, -50],
        label: "Go to buy",
        isSpecialAction: true,
        actionType: "show-product-hmsc1-2",
        rotation: [0, 1.6, 0],
    },

    {
        id: "hmsc2-to-buy",
        position: [100, -40, -50],
        label: "Go to buy",
        isSpecialAction: true,
        actionType: "show-product-hmsc2-1",
        rotation: [0, -1.6, 0],
    },

    {
        id: "hmsc2-to-buy",
        position: [-100, -30, -50],
        label: "Go to buy",
        isSpecialAction: true,
        actionType: "show-product-hmsc2-2",
        rotation: [0, 1.6, 0],
    },

    {
        id: "hmsc5-to-buy",
        position: [100, -30, -50],
        label: "Go to buy",
        isSpecialAction: true,
        actionType: "show-product-hmsc5-1",
        rotation: [0, -1.5, 0],
    },

    {
        id: "hmsc7-to-buy",
        position: [100, -30, 20],
        label: "Go to buy",
        isSpecialAction: true,
        actionType: "show-product-hmsc7-1",
        rotation: [0, -1.5, 0],
    },

    {
        id: "hmsc7-to-buy",
        position: [-100, -30, 20],
        label: "Go to buy",
        isSpecialAction: true,
        actionType: "show-product-hmsc7-2",
        rotation: [0, 1.5, 0],
    },

    {
        id: "hmsc8-to-buy",
        position: [100, -30, 20],
        label: "Go to buy",
        isSpecialAction: true,
        actionType: "show-product-hmsc8-1",
        rotation: [0, -1.6, 0],
    },

    {
        id: "hmsc8-to-buy",
        position: [-100, -30, 20],
        label: "Go to buy",
        isSpecialAction: true,
        actionType: "show-product-hmsc8-2",
        rotation: [0, 1.6, 0],
    },


];

const PanoramaScene = ({ image, onHotspotClick, currentImage, handleStocked, handleOpen3DMode, setIs3DMode, isTransitioning }) => {
    const texture = useTexture(image);
    const controlsRef = useRef();
    const cameraRef = useRef();

    useEffect(() => {
        setTimeout(() => {
            if (controlsRef.current) {
                controlsRef.current.object.rotation.y = 0;
                controlsRef.current.update();
            }
        }, 100);
    }, [currentImage]);

    // กรองเฉพาะ hotspot ที่ควรแสดงในภาพปัจจุบัน
    const visibleHotspots = hotspots.filter(spot => {
        if (currentImage === 0) return spot.id.startsWith("hmsc1");
        if (currentImage === 1) return spot.id.startsWith("hmsc2");
        if (currentImage === 2) return spot.id.startsWith("hmsc3");
        if (currentImage === 3) return spot.id.startsWith("hmsc4");
        if (currentImage === 4) return spot.id.startsWith("hmsc5");
        if (currentImage === 5) return spot.id.startsWith("hmsc6");
        if (currentImage === 6) return spot.id.startsWith("hmsc7");
        if (currentImage === 7) return spot.id.startsWith("hmsc8");

        return false;
    });


    // จัดการการคลิกบน hotspot
    const handleHotspotClick = (spot) => {

        // Open 3D Mode
        handleOpen3DMode && handleOpen3DMode();
        setIs3DMode && setIs3DMode(true);

        if (spot.isSpecialAction) {
            if (spot.actionType === "show-product-hmsc1-1") {
                handleStocked && handleStocked(16); // เรียก handleStocked() เมื่อกดปุ่ม hall-info From P3D
                // onSpecialAction && onSpecialAction(spot.actionType);
            } else if (spot.actionType === "show-product-hmsc1-2") {
                handleStocked && handleStocked(17);
            } else if (spot.actionType === "show-product-hmsc2-1") {
                handleStocked && handleStocked(18);
            } else if (spot.actionType === "show-product-hmsc2-2") {
                handleStocked && handleStocked(21);
            } else if (spot.actionType === "show-product-hmsc5-1") {
                handleStocked && handleStocked(22);
            } else if (spot.actionType === "show-product-hmsc7-1") {
                handleStocked && handleStocked(24);
            } else if (spot.actionType === "show-product-hmsc7-2") {
                handleStocked && handleStocked(26);
            } else if (spot.actionType === "show-product-hmsc8-1") {
                handleStocked && handleStocked(28);
            } else if (spot.actionType === "show-product-hmsc8-2") {
                handleStocked && handleStocked(29);
            }

            // Open Full Screen
            setTimeout(() => {
                const container = document.querySelector('.gallery-wrapper');
                if (container) {
                    if (container.requestFullscreen) {
                        container.requestFullscreen();
                    } else if (container.mozRequestFullScreen) {
                        container.mozRequestFullScreen();
                    } else if (container.webkitRequestFullscreen) {
                        container.webkitRequestFullscreen();
                    } else if (container.msRequestFullscreen) {
                        container.msRequestFullscreen();
                    }
                    container.classList.add('fullscreen-canvas');
                }
            }, 5);
        } else {
            // นำทางไปยังรูปอื่น
            onHotspotClick(spot.targetImage);
        }
    };



    return (
        <>
            <OrbitControls
                ref={controlsRef}
                enableZoom={false}
                rotateSpeed={-0.2}
                enableDamping={true}
                dampingFactor={0.05}
                minPolarAngle={0}
                maxPolarAngle={Math.PI}
                minAzimuthAngle={-Infinity}
                maxAzimuthAngle={Infinity}
                target={[0, 0, 0]}
            />
            <ambientLight intensity={1} />
            <group position={[0, 0, isTransitioning ? 1000 : 0]}>
                <Sphere
                    args={[500, 60, 40]}
                    scale={[-1, 1, 1]}
                    rotation={[0, Math.PI, 0]}
                >
                    <meshBasicMaterial
                        map={texture}
                        side={1}
                        transparent={true}
                        opacity={isTransitioning ? 0 : 1}
                    />
                </Sphere>
            </group>

            {visibleHotspots.map((spot) => (
                <Html
                    key={spot.id}
                    position={spot.position}
                    rotation={spot.rotation}
                    transform
                    occlude
                    distanceFactor={100}
                    zIndexRange={[0, 0]}
                    style={{
                        transition: 'all 0.3s ease',
                        opacity: isTransitioning ? 0 : 1,
                        pointerEvents: isTransitioning ? 'none' : 'auto'
                    }}
                >
                    <div
                        onClick={() => handleHotspotClick(spot)}
                        className={`hotspot ${spot.isSpecialAction ? 'special-hotspot' : 'standard-hotspot'}`}
                        id={spot.id}
                    >
                        <span>{spot.label}</span>
                    </div>
                </Html>
            ))}
        </>
    )
}

export default PanoramaScene
