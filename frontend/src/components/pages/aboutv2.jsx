import React from "react";
import { ContainerScroll } from "../ui/container-scroll-animation";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";
import { Meteors } from "../ui/meteor";
import Heatmap from "./Heatmap";
import { Card } from "../ui/card";
import { CardHenrich } from "../ui/CardHenrich";
import { CardJuliana } from "../ui/CardJuliana";

const aboutItems = [
  {
    name: "Temperature Data",
    quote: "Real-time urban heat tracking across Philippine cities.",
    title: "Data Driven",
  },
  {
    name: "Geographical Insights",
    quote: "Detailed simulations showing heat patterns on diverse terrains.",
    title: "Geo Analytics",
  },
  {
    name: "Sustainable Planning",
    quote: "Actionable insights for urban cooling and green solutions.",
    title: "Sustainability",
  },
  {
    name: "Community Engagement",
    quote: "Empowering communities with knowledge and tools.",
    title: "Engagement",
  },
  {
    name: "Innovative Solutions",
    quote: "Cutting-edge technology for urban heat management.",
    title: "Innovation",
  },
  {
    name: "Climate Resilience",
    quote: "Building cities that can withstand climate challenges.",
    title: "Resilience",
  },
  {
    name: "Data Visualization",
    quote: "Intuitive graphics and interactive maps to explore heat data.",
    title: "Visualization",
  },
  {
    name: "Real-time Updates",
    quote: "Live data streaming for immediate urban heat insights.",
    title: "Real-time",
  },
  {
    name: "Research Driven",
    quote: "Collaborations with leading research institutions.",
    title: "Research",
  },
  {
    name: "Predictive Analytics",
    quote: "Forecast future heat trends with advanced algorithms.",
    title: "Predictive",
  },
];

const teamMembers = [
  {
    id: 1,
    name: "Donn Baldoza",
    designation: "Frontend Developer",
    image:
      "https://i.pinimg.com/736x/b2/ae/40/b2ae40091e18730921c79241f25e7cff.jpg",
  },
  {
    id: 2,
    name: "Henrich Lacao",
    designation: "Backend Developer",
    image:
      "https://i.pinimg.com/736x/6d/a0/80/6da080bd51bee5b43437aa47256625c9.jpg",
  },
  {
    id: 3,
    name: "Juliana Mae Ines",
    designation: "Resource Manager",
    image:
      "https://i.pinimg.com/736x/67/28/1b/67281b6fc7082231dc3a62fefb04ad77.jpg",
  },
];

const AboutV2 = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Meteor effects as a background overlay */}
      <Meteors number={30} className="absolute inset-0 z-0" />

      {/* Header Section with ContainerScroll */}
      <ContainerScroll
        titleComponent={
          <div className="text-4xl md:text-6xl font-bold text-center text-black mb-20">
            UBheat Urban Heatmap Simulation
          </div>
        }
      >
        <div className="">
          {/* <p className="text-lg text-gray-800 dark:text-gray-200 text-center">
            Explore dynamic urban heat patterns across the Philippine Islands.
            Our simulation combines real-time data with advanced analytics to deliver
            actionable insights for sustainable urban planning.
          </p> */}

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
                className="w-20 h-20 rounded-full object-cover mb-4"
                style={{ marginBottom: "1rem" }}
              />
              <h3 className="text-xl font-bold mb-2 text-blue-600">
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
                className="w-20 h-20 rounded-full object-cover mb-4"
                style={{ marginBottom: "1rem" }}
              />
              <h3 className="text-xl font-bold mb-2 text-blue-600">
                {teamMembers[1].name}
              </h3>
              <p className="text-red-600">{teamMembers[1].designation}</p>
            </CardHenrich>
            <CardJuliana
              key={teamMembers[2].id}
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md border border-blue-100"
            >
              <img
                src={teamMembers[2].image}
                alt={teamMembers[2].name}
                className="w-20 h-20 rounded-full object-cover mb-4"
                style={{ marginBottom: "1rem" }}
              />
              <h3 className="text-xl font-bold mb-2 text-blue-600">
                {teamMembers[2].name}
              </h3>
              <p className="text-green-600">{teamMembers[2].designation}</p>
            </CardJuliana>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutV2;
