import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>Shiksha</h3>
                        <p className="text-muted">
                            Your gateway to knowledge and skills. Learn from the best instructors worldwide.
                        </p>
                    </div>
                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="#about">About Us</a></li>
                            <li><a href="#careers">Careers</a></li>
                            <li><a href="#blog">Blog</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Support</h4>
                        <ul>
                            <li><a href="#help">Help Center</a></li>
                            <li><a href="#terms">Terms of Service</a></li>
                            <li><a href="#privacy">Privacy Policy</a></li>
                            <li><a href="#refund">Refund Policy</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Follow Us</h4>
                        <div className="social-links">
                            <a href="#facebook" className="social-link">Facebook</a>
                            <a href="#twitter" className="social-link">Twitter</a>
                            <a href="#instagram" className="social-link">Instagram</a>
                            <a href="#linkedin" className="social-link">LinkedIn</a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p className="text-muted">© 2025 Shiksha. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
