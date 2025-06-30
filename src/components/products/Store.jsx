import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import './store.css';

const Store = ({ handleStocked, setStocked, setStoreId, storeId, adminId, setAdminId }) => {
    const [stores, setStores] = useState([]);
    const containerRef = useRef(null);
    const isAdmin = stores.find(store => store.is_admin);

    let id = '';
    if (isAdmin) {
        id = stores.find(store => store.is_admin);
        setAdminId(id.id);
    }

    // Fetch stores with cleanup
    useEffect(() => {
        const controller = new AbortController();
        
        const fetchStores = async () => {
            try {
                const response = await axios.request({
                    method: "get",
                    url: import.meta.env.VITE_API + "/store/stores/",
                    headers: {},
                    signal: controller.signal
                });
                setStores(response.data);
            } catch (error) {
                if (!axios.isCancel(error)) {
                    console.error("Error fetching stores:", error);
                }
            }
        };

        fetchStores();
        return () => controller.abort();
    }, []);

    // Get stocked with cleanup
    useEffect(() => {
        const controller = new AbortController();
        
        const fetchStocked = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API}/store/${storeId || adminId}/stocked`,
                    {
                        method: "GET",
                        signal: controller.signal
                    }
                );
                const result = await response.json();
                setStocked(result);
                if (result && result.length > 0) {
                    handleStocked(result[0].id);
                }
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error("Error fetching stocked:", error);
                }
            }
        };

        if (storeId || adminId) {
            fetchStocked();
        }
        
        return () => controller.abort();
    }, [storeId, adminId]);

    // Handle store selection
    const handleGetStocked = (id) => {
        setStoreId(id);
    };

    // Scroll to end
    const handleScrollToEnd = () => {
        if (containerRef.current) {
            containerRef.current.scrollLeft = containerRef.current.scrollWidth;
        }
    };

    let activeStore = '';
    let activeAdmin = adminId;

    if(storeId){
        activeStore = storeId;
        activeAdmin = "";
    }

    return (
        <div className="list-container">
            <div className="store-container" ref={containerRef}>
                <p>Stores</p>
                {stores.map(store => (
                    <div 
                        key={store.id} 
                        className={`store-circle ${store.id === activeStore || store.id === activeAdmin ? 'active' : ''}`}
                        onClick={() => handleGetStocked(store.id)}
                    >
                        <span><h5>{store.name}</h5></span>
                    </div>
                ))}
            </div>
            <button className="scroll-to-end-button" onClick={handleScrollToEnd}>
                <i className="arrow-right">→</i>
            </button>
        </div>
    );
};

export default Store;
