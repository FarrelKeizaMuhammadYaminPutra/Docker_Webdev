import React from 'react';
import './Footer.css';
// import youtube_icon from '../../assets/youtube.png';
import instagram_icon from '../../../assets/instagram.png';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-icons">
                    <a href="https://www.instagram.com/nailanaiiy/" target="_blank" rel="noopener noreferrer">
                        <img src={instagram_icon} alt="Instagram" />
                    </a>
                    <a href="https://www.instagram.com/farrelkeiza_/" target="_blank" rel="noopener noreferrer">
                        <img src={instagram_icon} alt="Instagram" />
                    </a>
                </div>
            </div>
            <div className="footer-bottom">
                <p>Made by Naila and Farrel | From Kelompok 11</p>
                <p>&copy; 2024 The Films.</p>
            </div>
        </footer>
    );
}

export default Footer;
