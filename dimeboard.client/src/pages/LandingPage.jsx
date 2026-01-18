import React from "react";
import { Link } from "react-router-dom";
import landingImage from "../assets/Dimeboard Landing Page.jpg";
import "../styles/styles.css";

function LandingPage() {
    return (
        <section className="hero" style={{ backgroundImage: `url(${landingImage})` }}>
            {/* Logo Section */ }
            <div className="hero-top fade-in" style={{ animationDelay: "0.2s" }}>
                <h2 className="logo">DimeBoard</h2>
            </div>

            {/* Hero Section*/ }
            <div className="hero-content fade-in" style={{ animationDelay: "0.4s" }}>
                <h1>Powering Stocks, Crypto, and Blockchain Analysis with Code and AI</h1>
                <p>Gain actionable AI-powered analytical market insights with DimeBoard!</p>

                {/* Navigation Section (Start Now, Sign Up, Login) */ }
                <div className="hero-buttons fade-in" style={{ animationDelay: "0.6s" }}>
                    <Link to="/app" className="start-now">Start Now</Link>
                    <div className="bottom-buttons fade-in" style={{ animationDelay: "0.8s" }}>
                        <Link to="/signup" className="sign-up">Sign Up</Link>
                        <Link to="/login" className="login">Login</Link>
                    </div>
                </div>

            </div>
        </section> 
    );
}

export default LandingPage;

