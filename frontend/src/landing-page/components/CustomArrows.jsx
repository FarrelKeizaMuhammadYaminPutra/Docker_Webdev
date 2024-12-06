import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

// Custom arrow component
const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ 
                ...style, 
                display: "block", 
                right: "-40px",  // Posisi di luar slider
                top: "37%"
            }}
            onClick={onClick}
        />
    );
};

const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ 
                ...style, 
                display: "block", 
                left: "-40px",  // Posisi di luar slider
                top: "37%"
            }}
            onClick={onClick}
        />
    );
};

export { NextArrow, PrevArrow };
