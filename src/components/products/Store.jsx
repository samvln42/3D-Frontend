import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import './store.css';

const Store = ({ handleStocked, setStocked, setStoreId }) => {

    const [stores, setStores] = useState([]);

    const containerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [showIndicator, setShowIndicator] = useState(true);

    useEffect(() => {
        let config = {
            method: "get",
            maxBodyLength: Infinity,

            url: import.meta.env.VITE_API + "/store/stores/",
            headers: {},
        };

        axios
            .request(config)
            .then((response) => {
                setStores(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    // Get stocked
    const handleGetStocked = (id) => {
        setStoreId(id);
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        fetch(import.meta.env.VITE_API + `/store/${id}/stocked`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setStocked(result);
                if (result && result.length > 0) {
                    handleStocked(result[0].id);
                }
            })
            .catch((error) => console.error(error));
    }

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - containerRef.current.offsetLeft);
        setScrollLeft(containerRef.current.scrollLeft);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - containerRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed multiplier
        containerRef.current.scrollLeft = scrollLeft - walk;
    };

    // Check if scrolled to end
    const handleScroll = () => {
        if (containerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
            const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 50;
            setShowIndicator(!isAtEnd);
        }
    };

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            // Check initially
            handleScroll();
        }
        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    return (
        <>
            <div
                className="store-container"
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
            >
                <p>Stores</p>
                {stores.map(store => (
                    <div key={store.id} className="store-circle" onClick={() => handleGetStocked(store.id)}>
                        <span>{store.name}</span>
                    </div>
                ))}
            </div>
            <div className="scroll-indicator-container">
                {showIndicator && <div className="scroll-indicator" />}
            </div>
        </>
    );
};

export default Store;
