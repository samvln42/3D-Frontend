import React, { useEffect } from 'react'
import './map.css'
import 'animate.css'
import { TbMoodLookLeft } from "react-icons/tb";
import { FaRegFaceLaugh } from "react-icons/fa6";

const Map = ({ currentImageIndex }) => {

    useEffect(() => {
        if (currentImageIndex === 0) {
            document.getElementById('human').style.transform = 'rotateZ(0deg)';
        } else if (currentImageIndex === 1) {
            document.getElementById('human').style.transform = 'rotateZ(90deg)';
        } else if (currentImageIndex === 2) {
            document.getElementById('human').style.transform = 'rotateY(3.142rad)';
        } else if (currentImageIndex === 3) {
            document.getElementById('human').style.transform = 'rotateZ(-0.25turn)';
        }
    }, [currentImageIndex]);
    return (
        <div className='map-container'>
            <div className='map-content'>
                <div id='front'></div>
                <div id='back'></div>
                <div id='left'></div>
                <div id='right'></div>
                <div id="human"><TbMoodLookLeft /> <span id='look_at'></span></div>
            </div>
        </div>
    )
}

export default Map
