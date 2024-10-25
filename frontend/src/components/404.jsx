// src/components/NotFound.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Particles } from 'react-tsparticles'; // Change here
import './404.css'; // Make sure to create this file for custom styles

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-black overflow-hidden">
      {/* Particles Background */}
      <Particles
        id="tsparticles"
        options={{
          particles: {
            number: {
              value: 160,
              density: {
                enable: true,
                value_area: 800,
              },
            },
            color: {
              value: "#ffffff",
            },
            shape: {
              type: "circle",
              stroke: {
                width: 0,
                color: "#000000",
              },
            },
            opacity: {
              value: 0.7,
              random: true,
              anim: {
                enable: true,
                speed: 1,
                opacity_min: 0,
                sync: false,
              },
            },
            size: {
              value: 3,
              random: true,
              anim: {
                enable: false,
                speed: 4,
                size_min: 0.3,
                sync: false,
              },
            },
            move: {
              enable: true,
              speed: 0.17,
              direction: "none",
              random: true,
              straight: false,
              out_mode: "out",
              bounce: false,
            },
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: {
                enable: false,
              },
              onclick: {
                enable: false,
              },
              resize: false,
            },
          },
          retina_detect: true,
        }}
      />
      {/* Animated Background */}
      <div className="background-animation"></div>
      <h1 className="text-6xl font-bold mb-4 text-white z-10">404</h1>
      <p className="text-xl mb-8 text-white z-10">Oops! Page not found.</p>
      <button
        onClick={() => navigate('/')} // Redirects to the home page
        className="px-6 py-2 bg-teal-500 text-white rounded hover:bg-teal-400 transition duration-200 z-10"
      >
        Go to Home
      </button>
    </div>
  );
};

export default NotFound;
