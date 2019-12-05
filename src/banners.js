import React from 'react';
import paris from './Images/paris.jpg'
import london from './Images/bignben.jpg'
import copenhagen from './Images/nyhavb.jpg'

export const ParisBanner = () => {


    return (
        <div className={"img-container"}>
            <img src={paris} alt="Hon hon hon" className={"img-fluid mt-3 rounded shadow-lg"}/>
            <h1 className={"centered"}>PARIS</h1>
        </div>
    )
};

export const LondonBanner = () => {
    return (
        <div className={"london-container"}>
            <img src={london} alt="FUCK BORIS" className={"img-fluid rounded shadow-lg"}/>
            <h1 className={"centered"}>LONDON</h1>
        </div>
    )
};

export const CopenhagenBanner = () => {
    return (
        <div className={"nyhavn-container rounded shadow-lg"}>
            <h1 className={"centered"}>COPENHAGEN</h1>
        </div>
    )
};
