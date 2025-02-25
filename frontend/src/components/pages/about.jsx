import React, { Suspense } from 'react';
import { TracingBeam } from '../ui/tracing-beam';
import { TypewriterEffect } from '../ui/typewriter-effect';
import { Vortex } from '../ui/vortex';
import { Card } from '../ui/card'; // Import the Card component
import { CardHenrich } from '../ui/CardHenrich'; // Import the CardHenrich component
import { CardJuliana } from '../ui/CardJuliana'; // Import the CardJuliana component
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Heatmap from './Heatmap'; // Import the Heatmap component

const ProfilePage = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  // Sample data for skills and team members
  const skills = [
    { title: 'Accurate', description: 'Provide accurate data' },
    { title: 'Reliable', description: 'Assure Realiable information' },
    { title: 'Awareness', description: 'Make you safe from heat' },
    { title: 'Forecast', description: 'Forecast temperature on your screen' },
    { title: 'Plan', description: 'Help you plan your day' },
    { title: 'Compare', description: 'Compare following temperature or the next day' },
  ];

  const teamMembers = [
    {
      id: 1,
      name: 'Donn Baldoza',
      designation: 'Frontend Developer',
      image: 'https://pin.it/2PuZ1QY5v',
    },
    {
      id: 2,
      name: 'Henrich Lacao',
      designation: 'Backend Developer',
      image: 'https://example.com/henrich-lacao.jpg',
    },
    {
      id: 3,
      name: 'Juliana Mae Ines',
      designation: 'Resource Manager',
      image: 'https://example.com/juliana-mae-ines.jpg',
    },
  ];

  return (
    <div className="bg-white w-full min-h-screen text-zinc-900"> {/* Changed background to white and text to dark */}
      {/* Hero Section */}
      <div className="h-screen flex items-center justify-center relative overflow-hidden">
        <Suspense fallback={<div>Loading...</div>}>
          <Vortex
            backgroundColor="transparent"
            particleCount={500}
            baseHue={200} // Blue hue
            className="w-full h-full"
          />
        </Suspense>
        <div className="z-50 text-center">
          <TypewriterEffect
            words={[
              { text: 'Hello,', className: 'text-blue-600' }, // Changed to blue
              { text: "We're", className: 'text-blue-600' }, // Changed to blue
              { text: 'The', className: 'text-blue-600' }, // Changed to blue
              { text: 'UBheat', className: 'text-blue-600' }, // Changed to blue
            ]}
            cursorClassName="bg-blue-600" // Changed cursor color to blue
          />
          <p className="mt-4 text-zinc-600 text-lg"> {/* Changed text color to dark gray */}
            We created heatmap simulation.
          </p>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')} // Navigate to the root route
            sx={{ mt: 2 }}
          >
            Go to Main Page
          </Button>
        </div>
      </div>

      {/* About Section */}
      <div className="py-20">
        <TracingBeam>
          <div className="max-w-2xl mx-auto p-4">
            <h2 className="text-3xl font-bold mb-4 text-blue-600">Who are we?</h2> {/* Changed to blue */}
            <p className="text-zinc-600 mb-4"> {/* Changed text color to dark gray */}
              Welcome to Heat Index Weather Forecast! Our mission is to provide you with accurate and reliable information about the heat index in your area, helping you stay informed about the potential risks posed by high temperatures.
            </p>
            <p className="text-zinc-600 mb-4"> {/* Changed text color to dark gray */}
              The heat index, often referred to as the “apparent temperature,” is a measure of how hot it feels when humidity is factored in with the actual air temperature. This is important because high humidity can make it feel much hotter than it really is, potentially increasing the risk of heat-related illnesses like heat exhaustion or heat stroke.
            </p>
            <p className="text-zinc-600 mb-4"> {/* Changed text color to dark gray */}
              Heat index values are crucial in preventing health emergencies related to extreme heat. When the heat index reaches dangerous levels, it is important to take proper precautions to protect yourself and those around you. This includes staying hydrated, limiting outdoor activities, wearing appropriate clothing, and seeking shade or air-conditioned spaces whenever possible.
            </p>
            <p className="text-zinc-600"> {/* Changed text color to dark gray */}
              Stay ahead of the heat and take the necessary precautions to protect your health. Explore our website for daily heat index reports, safety guidelines, and more resources to help you stay cool.
            </p>
          </div>

          <div className="max-w-2xl mx-auto p-4">
            <h2 className="text-3xl font-bold mb-4 text-blue-600">Our History</h2> {/* Changed to blue */}

            <p className="text-zinc-600">
              We are a team of third-year students from Technological University of the Philippines – Taguig, dedicated to developing innovative solutions in data visualization. Under the guidance of Prof. Pops Madriaga, we created this heatmap simulation to analyze and predict urban heat distribution, contributing to research on climate and environmental trends.
            </p>
          </div>


        </TracingBeam>
      </div>

      {/* Heatmap Section */}
      <div className="py-10 bg-blue-50"> {/* Changed background to light blue */}
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">Activity Heatmap</h2> {/* Changed to blue */}
          <div className="flex justify-center">
            <div className="w-3/4"> {/* Adjust the width of the heatmap */}
              <Heatmap />
            </div>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="py-20 bg-blue-50"> {/* Changed background to light blue */}
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">Mission & Vision</h2> {/* Changed to blue */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill, index) => (
              <div key={index} className="p-4 bg-white rounded-lg shadow-md border border-blue-100"> {/* Added blue border */}
                <h3 className="text-xl font-bold mb-2 text-blue-600">{skill.title}</h3> {/* Changed to blue */}
                <p className="text-zinc-600">{skill.description}</p> {/* Changed text color to dark gray */}
              </div>
            ))}
            
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">Team</h2> {/* Changed to blue */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card key={teamMembers[0].id} className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md border border-blue-100"> {/* Added blue border */}
              <img
                src='https://i.pinimg.com/736x/b2/ae/40/b2ae40091e18730921c79241f25e7cff.jpg'
                alt={teamMembers[0].name}
                className="w-20 h-20 rounded-full object-cover mb-4"
                style={{ marginBottom: '1rem' }} // Add margin to separate the images
              />
              <h3 className="text-xl font-bold mb-2 text-blue-600">{teamMembers[0].name}</h3> {/* Changed to blue */}
              <p className="text-red-100">{teamMembers[0].designation}</p> {/* Changed text color to dark gray */}
            </Card>
            <CardHenrich key={teamMembers[1].id} className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md border border-blue-100"> {/* Added blue border */}
              <img
                src='https://i.pinimg.com/736x/6d/a0/80/6da080bd51bee5b43437aa47256625c9.jpg'
                alt={teamMembers[1].name}
                className="w-20 h-20 rounded-full object-cover mb-4"
                style={{ marginBottom: '1rem' }} // Add margin to separate the images
              />
              <h3 className="text-xl font-bold mb-2 text-blue-600">{teamMembers[1].name}</h3> {/* Changed to blue */}
              <p className="text-red-600">{teamMembers[1].designation}</p> {/* Changed text color to dark gray */}
            </CardHenrich>
            <CardJuliana key={teamMembers[2].id} className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md border border-blue-100"> {/* Added blue border */}
              <img
                src='https://i.pinimg.com/736x/67/28/1b/67281b6fc7082231dc3a62fefb04ad77.jpg'
                alt={teamMembers[2].name}
                className="w-20 h-20 rounded-full object-cover mb-4"
                style={{ marginBottom: '1rem' }} // Add margin to separate the images
              />
              <h3 className="text-xl font-bold mb-2 text-blue-600">{teamMembers[2].name}</h3> {/* Changed to blue */}
              <p className="text-green-600">{teamMembers[2].designation}</p> {/* Changed text color to dark gray */}
            </CardJuliana>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-20 bg-blue-50"> {/* Changed background to light blue */}
        <div className="max-w-2xl mx-auto p-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-600">Get in Touch</h2> {/* Changed to blue */}
          <p className="text-zinc-600 mb-4"> {/* Changed text color to dark gray */}
            Have a project in mind or just want to say hi? Feel free to reach out!
          </p>
          <a
            href="mailto:ubheatsim@gmail.com"
            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors" // Changed button color to blue
          >
            Contact Me
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;