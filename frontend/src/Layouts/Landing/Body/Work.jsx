import React from "react";
import ImageOne from "./Assets/step1.png";
import ImageTwo from "./Assets/step2.png";
import ImageThree from "./Assets/step3.png";
//import ImageThree from "./Assets/delivery-image.png";

const Work = ({ innerRef }) => {
  const workInfoData = [
    {
      image: ImageOne,
      title: "Step 1",
      text: "First login/signup to your account.",
    },
    {
      image: ImageTwo,
      title: "Step 2",
      text: "Enter your School Name.",
    },
    {
      image: ImageThree,
      title: "Step 3",
      text: "Simply add create, add, delete events simply by clicking on a  calendar box.",
    },
  ];
  return (
    <div className="work-section-wrapper" ref={innerRef}>
      <div className="work-section-top">
        <p className="primary-subheading">Calendar Functions</p>
        <h1 className="primary-heading">How Does it Work?</h1>
        <p className="primary-text">
          Calendar++ redefines the traditional notion of personal scheduling by
          seamlessly integrating Canvas API features tailored to the unique
          needs of students. Users can effortlessly pick and customize their
          daily agenda, selecting diverse array of events, assignments, and
          reminders.
        </p>
      </div>
      <div className="work-section-bottom">
        {workInfoData.map((data) => (
          <div className="work-section-info" key={data.title}>
            <div className="info-boxes-img-container">
              <img src={data.image} alt="" />
            </div>
            <h2>{data.title}</h2>
            <p>{data.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Work;

/*
 Calendar++ redefines the traditional notion of personal scheduling by seamlessly
             integrating Canvas API features tailored to the unique 
             needs of students. Users can effortlessly pick and customize their daily agenda, selecting 
             diverse array of events, assignments, and reminders.

{
            image: ImageOne,
            title: "Step 1",
            text:  "First login/signup to your account.",

        },
        {
            image: ImageTwo,
            title: "Step 2",
            text:  "Enter your School Name.",
        },
        {
            image: ImageThree,
            title: "Step 3",
            text:  "Simply add create, add, delete events simply by clicking on a  calendar box.",

        },
        {
           

        },


*/
