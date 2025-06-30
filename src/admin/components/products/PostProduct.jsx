import React, { useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import { MdOutlineLibraryAdd } from "react-icons/md";
import AdminMenu from "../adminMenu/AdminMenu";

import './PostProduct.css';

const PostProduct = () => {

    var store_id = null;
    if (localStorage.getItem("user")) {
        store_id = JSON.parse(window.localStorage.getItem("user")).store_id;
    }

    const [productForms, setProductForms] = useState([
        { id: 1, formData: createEmptyFormData() }
    ]);

    // ฟังก์ชันสร้างฟอร์มเปล่า
    function createEmptyFormData() {
        return {
            name: '',
            price: '',
            category: '',
            description: '',
            sizes: [],
            colors: [],
            image: null
        };
    }

    // ฟังก์ชันจัดการฟอร์ม
    const handleAddForm = () => {
        setProductForms(prev => [
            ...prev,
            { id: Date.now(), formData: createEmptyFormData() }
        ]);
    };

    const handleDeleteForm = (formId) => {
        setProductForms(prev => prev.filter(form => form.id !== formId));
    };

    const handleInputChange = (formId, field, value) => {
        setProductForms(prev => prev.map(form => {
            if (form.id === formId) {
                return {
                    ...form,
                    formData: {
                        ...form.formData,
                        [field]: value
                    }
                };
            }
            return form;
        }));
    };

    const handleImageUpload = (formId, file) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleInputChange(formId, 'image', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // ฟังก์ชันจัดการ sizes
    const handleAddSize = (formId, size) => {
        if (!size) return;
        setProductForms(prev => prev.map(form => {
            if (form.id === formId && !form.formData.sizes.includes(size)) {
                return {
                    ...form,
                    formData: {
                        ...form.formData,
                        sizes: [...form.formData.sizes, size]
                    }
                };
            }
            return form;
        }));
    };

    const handleRemoveSize = (formId, sizeIndex) => {
        setProductForms(prev => prev.map(form => {
            if (form.id === formId) {
                return {
                    ...form,
                    formData: {
                        ...form.formData,
                        sizes: form.formData.sizes.filter((_, i) => i !== sizeIndex)
                    }
                };
            }
            return form;
        }));
    };

    // ฟังก์ชันจัดการ colors
    const handleAddColor = (formId, color) => {
        if (!color) return;
        setProductForms(prev => prev.map(form => {
            if (form.id === formId && !form.formData.colors.includes(color)) {
                return {
                    ...form,
                    formData: {
                        ...form.formData,
                        colors: [...form.formData.colors, color]
                    }
                };
            }
            return form;
        }));
    };

    const handleRemoveColor = (formId, colorIndex) => {
        setProductForms(prev => prev.map(form => {
            if (form.id === formId) {
                return {
                    ...form,
                    formData: {
                        ...form.formData,
                        colors: form.formData.colors.filter((_, i) => i !== colorIndex)
                    }
                };
            }
            return form;
        }));
    };

    // ฟังก์ชันจัดการ event
    const handleKeyPress = (formId, type, e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (type === 'size') {
                handleAddSize(formId, e.target.value);
            } else if (type === 'color') {
                handleAddColor(formId, e.target.value);
            }
            e.target.value = '';
        }
    };

    const handleButtonClick = (formId, type, input) => {
        if (type === 'size') {
            handleAddSize(formId, input.value);
        } else if (type === 'color') {
            handleAddColor(formId, input.value);
        }
        input.value = '';
    };

    // ฟังก์ชันจัดการการส่งข้อมูล
    const handleSubmit = async () => {
        try {
            // ตรวจสอบว่ามีฟอร์มอย่างน้อย 1 ฟอร์ม
            if (productForms.length === 0) {
                alert('Please add at least one product');
                return;
            }

            // แปลงข้อมูลให้ตรงกับ format ที่ต้องการ
            const goods_set = productForms.map(form => {
                // แปลงราคาให้เป็นตัวเลข
                const price = parseInt(form.formData.price);
                if (isNaN(price)) {
                    throw new Error('Price must be a valid number');
                }

                // ตรวจสอบและแปลงรูปภาพ
                let images = [];
                if (form.formData.image) {
                    // ตรวจสอบว่าเป็น base64 string
                    if (typeof form.formData.image === 'string' &&
                        form.formData.image.startsWith('data:image')) {
                        images = [form.formData.image];
                    } else {
                        throw new Error('Invalid image format');
                    }
                }

                return {
                    name: form.formData.name.trim(),
                    price: price,
                    description: form.formData.description.trim(),
                    category: form.formData.category.trim(),
                    sizes: form.formData.sizes,
                    colors: form.formData.colors,
                    images: images
                };
            });

            // ตรวจสอบข้อมูลที่จำเป็น
            const isValid = goods_set.every((product, index) => {
                if (!product.name) {
                    alert(`Product ${index + 1}: Name is required`);
                    return false;
                }
                if (!product.price || product.price <= 0) {
                    alert(`Product ${index + 1}: Valid price is required`);
                    return false;
                }
                // if (!product.category) {
                //     alert(`Product ${index + 1}: Category is required`);
                //     return false;
                // }

                if (!product.description) {
                    alert(`Product ${index + 1}: Description is required`);
                    return false;
                }

                // if (product.sizes.length === 0) {
                //     alert(`Product ${index + 1}: At least one size is required`);
                //     return false;
                // }

                // if (product.colors.length === 0) {
                //     alert(`Product ${index + 1}: At least one color is required`);
                //     return false;
                // }

                // if (product.images.length === 0) {
                //     alert(`Product ${index + 1}: Image is required`);
                //     return false;
                // }
                return true;

            });

            if (!isValid) return;

            // Log ข้อมูลที่จะส่งเพื่อตรวจสอบ
            // console.log('Sending data:', { goods_set });

            // ดึง token จาก localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found. Please login again.');
            }

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${token}`);
            // myHeaders.append("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM4NjQ0NjMwLCJpYXQiOjE3MzgwMzk4MzAsImp0aSI6ImE4OTkwMTExOWE1NDRhNTQ5N2Y3OTc1YTZlYjA3ZjZiIiwidXNlcl9pZCI6MX0.YgLe4ty51wdP3nDWyoS5NzZof97UYFbezqhk1cI3xrI");

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify({ goods_set }),
                redirect: "follow"
            };

            const response = await fetch(`${import.meta.env.VITE_API}/store/${store_id}/goods`, requestOptions);


            // ถ้าไม่สำเร็จ ให้ดูรายละเอียดข้อผิดพลาด
            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                let errorMessage;

                if (contentType && contentType.includes("application/json")) {
                    // ถ้าเป็น JSON ให้แสดงข้อความ error จาก API
                    const errorData = await response.json();
                    errorMessage = JSON.stringify(errorData);
                } else {
                    // ถ้าไม่ใช่ JSON ให้แสดง status text
                    errorMessage = `HTTP error! status: ${response.status} ${response.statusText}`;
                }

                throw new Error(errorMessage);
            }
            alert('Products submitted successfully!');

            // รีเซ็ตฟอร์มหลังจากส่งสำเร็จ
            setProductForms([{ id: 1, formData: createEmptyFormData() }]);

        } catch (error) {
            console.error('Error:', error);
            const errorMessage = error.message.includes('No authentication token')
                ? error.message
                : error.message.includes('Failed to fetch')
                    ? 'Cannot connect to server. Please check your connection.'
                    : error.message;
            alert(`Failed to submit products: ${errorMessage}`);
        }
    };

    return (
        <>
            <AdminMenu />
            <div className="dashboard-container post-product-container">
                <div className="main-content">



                    <div className="products-header">
                        <h2>Add Product</h2>
                        <button className="post-product-btn" onClick={handleSubmit}>
                            Post Product
                        </button>
                    </div>
                    <div className="products-grid">
                        {productForms.map((form) => (
                            <div key={form.id} className="product-form-card">
                                <div className="delete-icon" onClick={() => handleDeleteForm(form.id)}>×</div>
                                <div className="camera-icon">
                                    <div className='box_image_product'>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(form.id, e.target.files[0])}
                                            style={{ display: 'none' }}
                                            id={`image-upload-${form.id}`}
                                        />
                                    </div>
                                    <label htmlFor={`image-upload-${form.id}`}>
                                        <FaCamera style={{ cursor: 'pointer' }} />
                                    </label>
                                </div>
                                <div className="image-placeholder">
                                    {form.formData.image ? (
                                        <img
                                            src={form.formData.image}
                                            alt="Selected"
                                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                        />
                                    ) : (
                                        <img src="/placeholder.png" alt="" />
                                    )}
                                </div>
                                <form className="product-form">
                                    <input
                                        type="text"
                                        placeholder="Product Name"
                                        value={form.formData.name}
                                        onChange={(e) => handleInputChange(form.id, 'name', e.target.value)}
                                        className="form-input"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Product Price"
                                        value={form.formData.price}
                                        onChange={(e) => handleInputChange(form.id, 'price', e.target.value)}
                                        className="form-input"
                                    />
                                    {/* <select
                                    value={form.formData.category}
                                    onChange={(e) => handleInputChange(form.id, 'category', e.target.value)}
                                    className="form-input"
                                >
                                    <option value="">Select category</option>
                                    <option value="clothing">Clothing</option>
                                    <option value="shoes">Shoes</option>
                                    <option value="accessories">Accessories</option>
                                </select> */}
                                    <textarea
                                        placeholder="Description"
                                        value={form.formData.description}
                                        onChange={(e) => handleInputChange(form.id, 'description', e.target.value)}
                                        className="form-input"
                                    />

                                    {/* Sizes Section */}
                                    {/* <div className="tags-container">
                                    {form.formData.sizes.map((size, index) => (
                                        <span key={index} className="tag">
                                            {size}
                                            <button 
                                                type="button"
                                                onClick={() => handleRemoveSize(form.id, index)}
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Add Sizes..."
                                        className="form-input"
                                        onKeyPress={(e) => handleKeyPress(form.id, 'size', e)}
                                    />
                                    <button 
                                        type="button" 
                                        className="add-btn"
                                        onClick={(e) => handleButtonClick(form.id, 'size', e.target.previousSibling)}
                                    >
                                        Add
                                    </button>
                                </div> */}

                                    {/* Colors Section */}
                                    {/* <div className="tags-container">
                                    {form.formData.colors.map((color, index) => (
                                        <span key={index} className="tag">
                                            {color}
                                            <button 
                                                type="button"
                                                onClick={() => handleRemoveColor(form.id, index)}
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Add Colors..."
                                        className="form-input"
                                        onKeyPress={(e) => handleKeyPress(form.id, 'color', e)}
                                    />
                                    <button 
                                        type="button" 
                                        className="add-btn"
                                        onClick={(e) => handleButtonClick(form.id, 'color', e.target.previousSibling)}
                                    >
                                        Add
                                    </button>
                                </div> */}
                                </form>
                            </div>
                        ))}

                        <div className="add-form-card" onClick={handleAddForm}>
                            <div className="shopping-bag-icon"><MdOutlineLibraryAdd /></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostProduct;
