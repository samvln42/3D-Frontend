import React, { useState, useEffect } from 'react'
import AdminMenu from '../adminMenu/AdminMenu'
import { Link, useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'
import { OrbitControls } from '@react-three/drei'
import { HiTrash } from 'react-icons/hi'
import { CiCamera } from 'react-icons/ci'
import { FaEdit } from 'react-icons/fa'
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import axios from 'axios'
import './panorama.css'

const Sphere = ({ imageUrl }) => {
    const texture = useLoader(TextureLoader, imageUrl)
    return (
        <mesh scale={[-1, 1, 1]}>
            <sphereGeometry args={[500, 60, 40]} />
            <meshBasicMaterial map={texture} side={2} />
        </mesh>
    )
}

const PanoramaItem = ({ panorama, onDelete }) => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const store_id = user?.store_id || null;
    const MySwal = withReactContent(Swal);


    const [is3dMode, setIs3dMode] = useState(false);

    // get 3d mode
    useEffect(() => {
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        fetch(`${import.meta.env.VITE_API}/store/${store_id}/mode-3d`, requestOptions)
            .then((response) => response.json())
            .then((result) => setIs3dMode(result.is_enabled))
            .catch((error) => console.error(error));
    }, [store_id]);


    if (!is3dMode) {
        navigate("/dashboard");
    }

    useEffect(() => {
        let data = JSON.stringify({
            token: token,
        });

        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: import.meta.env.VITE_API + "/user/check-token",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            data: data,
        };

        axios
            .request(config)
            .then((response) => {
                if (response.data.result != "success") {
                    localStorage.clear();

                    navigate("/loginuser");
                    return;
                }
            })
            .catch((error) => {
                localStorage.clear();
                console.log(error);
                navigate("/loginuser");
                return;
            });
    }, [token]);

    const handleDelete = (id) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                const requestOptions = {
                    method: "DELETE",
                    redirect: "follow"
                };

                fetch(`${import.meta.env.VITE_API}/store/mode-3d/images/${id}/delete`, requestOptions)
                    .then((response) => response.text())
                    .then((result) => {
                        MySwal.fire({
                            title: 'Success',
                            text: 'Panorama deleted successfully',
                            icon: 'success'
                        }).then(() => {
                            onDelete();
                        });
                    })
                    .catch((error) => {
                        MySwal.fire({
                            title: 'Error',
                            text: 'Failed to delete panorama',
                            icon: 'error'
                        });
                    });
            }
        });
    }

    return (
        <div className="panorama_list_item">
            <div className="panorama_list_item_image">
                <button className='view_panorama_btn'><CiCamera id='panorama_icon_camera' /></button>
                <button className='delete_panorama_btn' onClick={() => handleDelete(panorama.id)}><HiTrash id='panorama_icon_trash' /></button>
                <Canvas camera={{
                    position: [0.1, 0, 0],
                    fov: 75,
                    near: 1,
                    far: 1100
                }}>
                    <OrbitControls
                        enableZoom={false}
                        autoRotate
                        autoRotateSpeed={0.5}
                        reverseOrbit={true}
                        rotateSpeed={0.5}
                        minPolarAngle={Math.PI / 2}
                        maxPolarAngle={Math.PI / 2}
                    />
                    <Sphere imageUrl={panorama.image} />
                </Canvas>
            </div>
            <div className="panorama_list_item_info">
                <div className="panorama_info_row">
                    <h2>{panorama.name}</h2>
                    <button className='panorama_edit'><FaEdit id='panorama_icon_pencil' /></button>
                </div>
                <div className="panorama_info_row">
                    <p>Position: {panorama.sort_order}</p>
                    <button className='panorama_edit'><FaEdit id='panorama_icon_pencil' /></button>
                </div>
            </div>
        </div>
    )
}

const Panorama = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const store_id = user?.store_id || null;
    const [panoramas, setPanoramas] = useState([]);


    const fetchPanoramas = () => {
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        fetch(`${import.meta.env.VITE_API}/store/${store_id}/mode-3d/images`, requestOptions)
            .then((response) => response.json())
            .then((result) => setPanoramas(result))
            .catch((error) => console.error(error));
    }

    useEffect(() => {
        fetchPanoramas();
    }, [store_id]);

    return (
        <>
            <AdminMenu />
            <section id='panorama'>
                <div className="panorama_container">
                    <div className="panorama_header">
                        <h1>Panorama</h1>
                        <Link to="/add-panorama" className='panorama_add_btn'>Add Panorama</Link>
                    </div>
                    <div className="panorama_content">
                        {panoramas.map((panorama, index) => (
                            <PanoramaItem
                                key={index}
                                panorama={panorama}
                                onDelete={fetchPanoramas}
                            />
                        ))}
                        {panoramas.length === 0 && <p className='no_panoramas'>No panoramas found</p>}
                    </div>
                </div>
            </section>
        </>
    )
}

export default Panorama
