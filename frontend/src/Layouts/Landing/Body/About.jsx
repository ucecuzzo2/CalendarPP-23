import React from "react";
import AboutBackground from "./Assets/about-background.png";
//import AboutBackgroundImage from "./Assets/-image.png";

const About = ({ innerRef }) => {
  return (
    <div className="about-section-container" ref={innerRef}>
      <div className="about-background-image-container">
        <img src={AboutBackground} alt="" />
      </div>
      <div className="about-section-image-container">
        {/*<img src={AboutBackgroundImage} alt="" />*/}
      </div>
      <div className="about-section-text-container">
        <p className="primary-subheading">Team "No Bugs" Mission</p>
        <h1 className="primary-heading">Why Calendar++ ?</h1>
        <p className="primary-text">
          Calendar++, is not your standard generic calendar app. Our
          student-designed software is redefined to personal scheduling,
          seamlessly blending creativity and functionality to bring you a truly
          unique and user-centric calendar experience.
        </p>
        <p className="primary-text">
          "We are motivated by the desire to provide a more tailored solution to
          calendar apps, we embarked on the journey to create a revolutionary
          calendar app designed exclusively for students." - (Micheal, Gabe,
          Javier, and Gerald)
        </p>
        <div className="about-buttons-container">
          <button className="secondary-button">Learn More About Us</button>
        </div>
      </div>
    </div>
  );
};

export default About;
