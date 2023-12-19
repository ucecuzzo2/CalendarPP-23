import React from "react";
import "./body.css";
import { Stack, Image } from "@chakra-ui/react";
import ImageBackground from "./Assets/home-banner-background.png";
import { FiArrowRight } from "react-icons/fi";
import BannerImage from "./Assets/icon.png";

const Body = ({ innerRef }) => {
  const [isOpen, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!isOpen);
  };

  return (
    <div className="home-container" ref={innerRef}>
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={ImageBackground} alt="" />
        </div>
        <div className="home-text-section">
          <h1 className="primary-heading">Hello! Welcome to Calendar++</h1>
          <p className="primary-text">
            Your Personal Calendar, Shaped by Student Ingenuity.
          </p>
          <button className="secondary-button">
            Get Started <FiArrowRight />
          </button>
        </div>
        <div
          className="home-image-container"
          style={{ backgroundColor: "transparent" }}
        >
          <img src={BannerImage} alt="" />
        </div>
      </div>
    </div>
  );
};

const Button = ({ onClick, children }) => {
  return (
    <button className="button" type="button" onClick={onClick}>
      {children}
    </button>
  );
};

export default Body;
