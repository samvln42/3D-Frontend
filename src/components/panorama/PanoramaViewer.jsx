import { Canvas } from "@react-three/fiber";
import { useState, useRef, useEffect } from "react";
import PanoramaScene from "./PanoramaScene"; // นำเข้าฟังก์ชันจากไฟล์ PanoramaScene
import "./panoramaviewer.css";

const PanoramaViewer = ({ handleStocked, handleOpen3DMode, setIs3DMode, handleClose3DMode, findPanoramaImage }) => {

    const panoramaImages = findPanoramaImage;


    const [currentImage, setCurrentImage] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const containerRef = useRef(null);


    const handleHotspotClick = (targetImage) => {
        if (isTransitioning) return;
        
        setIsTransitioning(true);
        
        // Add transition class
        const container = containerRef.current;
        if (container) {
            container.classList.add('walk-transition');
        }

        // Update image after transition
        setTimeout(() => {
            setCurrentImage(targetImage);
            if (container) {
                container.classList.remove('walk-transition');
            }
            setIsTransitioning(false);
        }, 100); // เพิ่มเวลา transition ให้ยาวขึ้น
    };

    // Handle fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            const container = containerRef.current;
            if (container && !document.fullscreenElement) {
                container.classList.remove('fullscreen-panorama');
            }
            setIsFullscreen(!!document.fullscreenElement);
        };

        // Add event listeners
        const events = [
            'fullscreenchange',
            'webkitfullscreenchange',
            'mozfullscreenchange',
            'MSFullscreenChange'
        ];

        events.forEach(event => {
            document.addEventListener(event, handleFullscreenChange);
        });

        // Cleanup function
        return () => {
            events.forEach(event => {
                document.removeEventListener(event, handleFullscreenChange);
            });
        };
    }, []);

    // Enter fullscreen effect
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const enterFullscreen = async () => {
            if (!document.fullscreenElement) {
                try {
                    if (container.requestFullscreen) {
                        await container.requestFullscreen();
                    } else if (container.mozRequestFullScreen) {
                        await container.mozRequestFullScreen();
                    } else if (container.webkitRequestFullscreen) {
                        await container.webkitRequestFullscreen();
                    } else if (container.msRequestFullscreen) {
                        await container.msRequestFullscreen();
                    }
                    container.classList.add('fullscreen-panorama');
                } catch (err) {
                    console.error('Error attempting to enable fullscreen:', err);
                }
            }
        };

        enterFullscreen();

        // Cleanup function
        return () => {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
        };
    }, []);

    const toggleFullscreen = () => {
        if (isFullscreen) {
            document.exitFullscreen();
            setIsFullscreen(false);
            handleClose3DMode && handleClose3DMode();
        }
    };

    return (
        <div className="panorama-container" ref={containerRef}>
            {isFullscreen &&
                <button className="fullscreen-button" onClick={toggleFullscreen}>
                    ⤡
                </button>
            }
            <Canvas>
                <PanoramaScene
                    image={panoramaImages[currentImage]}
                    onHotspotClick={handleHotspotClick}
                    currentImage={currentImage}
                    handleStocked={handleStocked}
                    handleOpen3DMode={handleOpen3DMode}
                    setIs3DMode={setIs3DMode}
                    handleClose3DMode={handleClose3DMode}
                    isTransitioning={isTransitioning}
                />
            </Canvas>
        </div>
    );
};

export default PanoramaViewer;
