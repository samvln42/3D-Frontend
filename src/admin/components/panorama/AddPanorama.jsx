import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { HiPlus } from "react-icons/hi"
import { CiCamera } from "react-icons/ci"
import { HiTrash } from "react-icons/hi"
import AdminMenu from '../adminMenu/AdminMenu'
import './panorama.css'
import imageicon from "../../../img/imageicon.jpg"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { Link, useNavigate } from 'react-router-dom'

const AddPanorama = () => {
    const token = localStorage.getItem("token");
    const MySwal = withReactContent(Swal);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const store_id = user?.store_id || null;
    const navigate = useNavigate();
    const [panoramas, setPanoramas] = useState([{
        name: "",
        image: "",
    }]);

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


    const handleImageUpload = (e, index) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            const updatedPanoramas = [...panoramas];
            updatedPanoramas[index] = {
                ...updatedPanoramas[index],
                image: reader.result
            };
            setPanoramas(updatedPanoramas);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e, index, field) => {
        const updatedPanoramas = [...panoramas];
        updatedPanoramas[index] = {
            ...updatedPanoramas[index],
            [field]: e.target.value
        };
        setPanoramas(updatedPanoramas);
    };

    const handleAddPanorama = () => {
        setPanoramas([...panoramas, {
            name: "",
            image: "",
        }]);
    };

    const handleDeleteImage = (index) => {
        const updatedPanoramas = panoramas.filter((_, i) => i !== index);
        setPanoramas(updatedPanoramas);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if any panorama has no image
        const hasEmptyImage = panoramas.some(panorama => !panorama.image || panorama.image === "");
        if (hasEmptyImage) {
            MySwal.fire({
                title: "Error!",
                text: "Please add images for all panoramas.",
                icon: "error",
            });
            return;
        }

        // Check if any panorama has no name
        const hasEmptyName = panoramas.some(panorama => !panorama.name || panorama.name.trim() === "");
        if (hasEmptyName) {
            MySwal.fire({
                title: "Error!",
                text: "Please enter names for all panoramas.",
                icon: "error",
            });
            return;
        }

        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                images: panoramas.map(panorama => ({
                    image: panorama.image,
                    name: panorama.name.trim(),
                }))
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            const response = await fetch(`${import.meta.env.VITE_API}/store/${store_id}/mode-3d/images/bulk-create`, requestOptions);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to post panoramas');
            }

            await MySwal.fire({
                title: "Success!",
                text: "Post panorama success!",
                icon: "success",
            });

            navigate("/panorama")
        } catch (error) {
            console.error('Error:', error);
            MySwal.fire({
                title: "Error!",
                text: error.message || "There was an error posting the panorama.",
                icon: "error",
            });
        }
    };

    return (
        <>
            <AdminMenu />
            <section id="posts">
                <div className="container_panorama">
                    <form onSubmit={handleSubmit}>
                        <div className="panorama_btn_head">
                            <Link to="/panorama" className='panorama_add_btn'>Back</Link>
                            <h2>Add Panorama images</h2>
                            <div className="panorama_btn_submit">
                                <button type="submit">Post panorama</button>
                            </div>
                        </div>

                        <div className="panorama_content_box">
                            <div className="panorama_grid_container">
                                {panoramas.map((panorama, index) => (
                                    <div className="panorama_grid_item" key={index}>
                                        <div className="panorama_image_input_box">
                                            <img src={panorama.image || imageicon} alt="panorama" />
                                            <input
                                                id={`file-input-${index}`}
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, index)}
                                            />
                                        </div>
                                        <div className="panorama_image_actions">
                                            <label htmlFor={`file-input-${index}`} className="panorama_edit_image">
                                                <CiCamera id="panorama_icon_camera" />
                                            </label>
                                            <button
                                                type="button"
                                                className="panorama_delete_image"
                                                onClick={() => handleDeleteImage(index)}
                                            >
                                                <HiTrash id="panorama_icon_trash" />
                                            </button>
                                        </div>
                                        <div className="panorama_input_fields">
                                            <input
                                                type="text"
                                                placeholder="Enter name"
                                                value={panorama.name}
                                                onChange={(e) => handleInputChange(e, index, 'name')}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <div className="panorama_add_box" onClick={handleAddPanorama}>
                                    <HiPlus id="panorama_icon_plus" />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
};

export default AddPanorama;
