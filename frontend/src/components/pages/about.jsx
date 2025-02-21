import React, { Suspense } from 'react';
import { TracingBeam } from '../ui/tracing-beam';
import { TypewriterEffect } from '../ui/typewriter-effect';
import { Vortex } from '../ui/vortex';
import { Card } from '../ui/card'; // Import the Card component
import { CardHenrich } from '../ui/CardHenrich'; // Import the CardHenrich component
import { CardJuliana } from '../ui/CardJuliana'; // Import the CardJuliana component

const ProfilePage = () => {
  // Sample data for skills and team members
  const skills = [
    { title: 'React', description: 'Building interactive UIs with React.' },
    { title: 'Node.js', description: 'Developing scalable backend systems.' },
    { title: 'Tailwind CSS', description: 'Creating beautiful, responsive designs.' },
    { title: 'Figma', description: 'Designing user-friendly interfaces.' },
    { title: 'Python', description: 'Data analysis and automation.' },
    { title: 'MongoDB', description: 'NoSQL database management.' },
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
            A passionate developer building amazing web experiences.
          </p>
        </div>
      </div>

      {/* About Section */}
      <div className="py-20">
        <TracingBeam>
          <div className="max-w-2xl mx-auto p-4">
            <h2 className="text-3xl font-bold mb-4 text-blue-600">About Me</h2> {/* Changed to blue */}
            <p className="text-zinc-600 mb-4"> {/* Changed text color to dark gray */}
              I'm a full-stack developer with a passion for creating beautiful and functional web
              applications. I specialize in React, Node.js, and Tailwind CSS, and I love working on
              projects that challenge me to learn and grow.
            </p>
            <p className="text-zinc-600 mb-4"> {/* Changed text color to dark gray */}
              I'm a full-stack developer with a passion for creating beautiful and functional web
              applications. I specialize in React, Node.js, and Tailwind CSS, and I love working on
              projects that challenge me to learn and grow.
            </p>
            <p className="text-zinc-600 mb-4"> {/* Changed text color to dark gray */}
              I'm a full-stack developer with a passion for creating beautiful and functional web
              applications. I specialize in React, Node.js, and Tailwind CSS, and I love working on
              projects that challenge me to learn and grow.
            </p>
            <p className="text-zinc-600"> {/* Changed text color to dark gray */}
              When I'm not coding, you can find me exploring new technologies, contributing to
              open-source projects, or playing video games.
            </p>
          </div>
        </TracingBeam>
      </div>

      {/* Skills Section */}
      <div className="py-20 bg-blue-50"> {/* Changed background to light blue */}
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">Skills</h2> {/* Changed to blue */}
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
            href="mailto:john.doe@example.com"
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