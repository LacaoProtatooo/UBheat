import React, { useState } from "react";
import { ContainerScroll } from "../ui/container-scroll-animation";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";
import { Meteors } from "../ui/meteor";
import Heatmap from "./Heatmap";
import { Card } from "../ui/card";
import { CardHenrich } from "../ui/CardHenrich";
import { CardJuliana } from "../ui/CardJuliana";
import { TextGenerateEffect } from "../ui/text-generate";
import { TracingBeam } from "../ui/tracing-beam";
import { Navbar } from "../ui/navbar";

// Modified MeteorCard component with header text absolutely positioned
const MeteorCard = ({ title, description, logo, headerText, customPadding }) => {
  // Use custom padding if provided; default is "py-28".
  const paddingClasses = customPadding ? customPadding : "py-28";
  return (
    <div className="relative max-w-xl w-full">
      {/* Background gradient with blur */}
      <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 rounded-full blur-3xl" />
      {/* Card content */}
      <div
        className={`relative shadow-xl bg-gray-900 border border-gray-800 px-10 ${paddingClasses} h-full overflow-hidden rounded-2xl flex flex-col justify-end items-center`}
      >
        {/* Header - always rendered at the top */}
        <div className="absolute top-4 left-0 right-0 text-center z-50 mt-16">
          <h1 className="font-bold text-2xl text-white">
            {headerText || title}
          </h1>
        </div>
        {/* Spacer to ensure content does not overlap header */}
        <div className="mt-16 w-full"></div>
        {/* If a logo is provided, render it */}
        {logo && (
          <>
            <div className="mb-2">
              {/* Optional extra text above logo can be added here if needed */}
              {/* For example, a subtitle: */}
              <p className="font-medium text-sm text-zinc-300">
                {/* You can customize this subtitle as needed */}
                Official Logo
              </p>
            </div>
            <img
              src={logo}
              alt="Logo"
              className="w-80 h-40 object-contain mb-4"
            />
          </>
        )}
        {/* Description, if provided */}
        {description && (
          <p className="font-normal text-lg text-slate-500 mb-20 relative z-50 text-center">
            {description}
          </p>
        )}
        {/* Meteor effect overlay */}
        <Meteors number={20} />
      </div>
    </div>
  );
};

const aboutItems = [
  {
    name: "Precision Metrics",
    title: "Accurate",
    quote: "Deliver verified temperature readings with ±0.3°C precision using open-source weather API with cross-validation across 15 Philippine regions."
  },
  {
    name: "Data Integrity Hub",
    title: "Reliable",
    quote: "Provide consistently updated urban heat information uptime assurance, backed by redundant monitoring systems and quality-controlled databases."
  },
  {
    name: "Climate Forecasting Engine",
    title: "Forecast",
    quote: "Monitor 72-hour hyperlocal temperature predictions using API-powered modeling, incorporating terrain data and urban infrastructure variables."
  },
  {
    name: "Thermal Analysis Suite",
    title: "Compare",
    quote: "Enable side-by-side evaluation of City vs. another City forecasted temperatures, urban vs. rural heat patterns and population. Provided with genuine data comparisons."
  }
];

const teamMembers = [
  {
    id: 1,
    name: "Donn Baldoza",
    designation: "Frontend Developer",
    image: "./donn.png",
  },
  {
    id: 2,
    name: "Henrich Lacao",
    designation: "Backend Developer",
    image: "./henrich.jpg",
  },
  {
    id: 3,
    name: "Juliana Mae Ines",
    designation: "Resource Manager",
    image: "./juliana.png",
  },
];

const AboutV2 = () => {
  const [activeMenu, setActiveMenu] = useState(null);

  return (
    <div className="relative overflow-hidden w-full">
      {/* Navbar */}
      <Navbar />

      {/* Meteor effects as background overlay */}
      <Meteors number={30} className="absolute inset-0 z-0" />

      {/* Header Section with ContainerScroll */}
      <ContainerScroll
        titleComponent={
          <TracingBeam>
            <img src="/UB_Logo.png" alt="UBHeat Logo" className="w-80 h-56 inline-block mt-20" />
            <div className="text-4xl md:text-6xl font-bold text-center text-black mb-4">
            <TextGenerateEffect
              words="UBheat: An Extensive Web Application for Simulating Urban Heat Dynamics Across the Philippine Archipelago"
              className="text-8xl text-black mt-2"
              duration={0.1}
            />
            </div>
            
          </TracingBeam>
        }
      >
        <div>
          {/* Heatmap Section inside ContainerScroll */}
          <div className="py-10 bg-blue-50 mt-10">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">
                Activity Heatmap
              </h2>
              <div className="flex justify-center">
                <div className="w-3/4">
                  <Heatmap />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ContainerScroll>

      {/* New Meteor Cards Section */}
      <div className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Card: Our History */}
            <MeteorCard
              title="Our History"
              description="We are a team of third-year students from Technological University of the Philippines – Taguig, dedicated to developing innovative solutions in data visualization. Under the guidance of Prof. Pops Madriaga, we created this heatmap simulation to analyze and predict urban heat distribution, contributing to research on climate and environmental trends."
            />
            {/* Middle Card: Logo with header text and additional description */}
            <MeteorCard
              logo="./UB_Logo_animated.gif"
              headerText="Our Identity"
              description="Our logo represents the heat and dynamic transition of urban heat and emissions data. It symbolizes our commitment to innovation and sustainability."
            />
            {/* Right Card: Who are we? */}
            <MeteorCard
              title="Who are we?"
              description="CO₂ Emissions and Forecasted Heat Temperature: Our simulation leverages real-time data and advanced forecasting to provide insights on CO₂ emissions and projected heat levels, ensuring you stay informed about environmental trends and potential risks."
              customPadding="py-20"
            />
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-center mb-8 text-blue-600 mt-20">
        Mission and Vision
      </h2>

      {/* Infinite Moving Cards Showcasing Key Features */}
      <div className="mt-20 relative z-10">
        <InfiniteMovingCards
          items={aboutItems}
          direction="right"
          speed="slow"
          pauseOnHover={true}
        />
      </div>

      {/* Team Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">
            Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card
              key={teamMembers[0].id}
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md border border-blue-100"
            >
              <img
                src={teamMembers[0].image}
                alt={teamMembers[0].name}
                className="w-56 h-56 rounded-full object-cover mb-4"
              />
              <h3 className="text-outline-blue text-xl font-bold mb-2">
                {teamMembers[0].name}
              </h3>
              <p className="text-red-100">{teamMembers[0].designation}</p>
            </Card>
            <CardHenrich
              key={teamMembers[1].id}
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md border border-blue-100"
            >
              <img
                src={teamMembers[1].image}
                alt={teamMembers[1].name}
                className="w-56 h-56 rounded-full object-cover mb-4"
              />
              <h3 className="text-outline-blue text-xl font-bold mb-2">
                {teamMembers[1].name}
              </h3>
              <p className="text-white">{teamMembers[1].designation}</p>
            </CardHenrich>
            <CardJuliana
              key={teamMembers[2].id}
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md border border-blue-100"
            >
              <img
                src={teamMembers[2].image}
                alt={teamMembers[2].name}
                className="w-56 h-56 rounded-full object-cover mb-4"
              />
              <h3 className="text-outline-blue text-xl font-bold mb-2">
                {teamMembers[2].name}
              </h3>
              <p className="text-white">{teamMembers[2].designation}</p>
            </CardJuliana>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutV2;
