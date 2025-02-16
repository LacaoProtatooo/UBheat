import React, { Suspense } from 'react';
import { TracingBeam } from '../ui/tracing-beam';
import { TypewriterEffect } from '../ui/typewriter-effect';
import { Vortex } from '../ui/vortex';

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
      name: 'John Doe',
      designation: 'Frontend Developer',
      image: 'https://example.com/john-doe.jpg',
    },
    {
      id: 2,
      name: 'Jane Smith',
      designation: 'Backend Developer',
      image: 'https://example.com/jane-smith.jpg',
    },
  ];

  return (
    <div className="bg-zinc-900 w-full min-h-screen text-white">
      {/* Hero Section */}
      <div className="h-screen flex items-center justify-center relative overflow-hidden">
        <Suspense fallback={<div>Loading...</div>}>
          <Vortex
            backgroundColor="transparent"
            particleCount={500}
            baseHue={200}
            className="w-full h-full"
          />
        </Suspense>
        <div className="z-50 text-center">
          <TypewriterEffect
            words={[
              { text: 'Hello,', className: 'text-white' },
              { text: "I'm", className: 'text-white' },
              { text: 'John', className: 'text-blue-500' },
              { text: 'Doe', className: 'text-blue-500' },
            ]}
            cursorClassName="bg-blue-500"
          />
          <p className="mt-4 text-neutral-300 text-lg">
            A passionate developer building amazing web experiences.
          </p>
        </div>
      </div>

      {/* About Section */}
      <div className="py-20">
        <TracingBeam>
          <div className="max-w-2xl mx-auto p-4">
            <h2 className="text-3xl font-bold mb-4">About Me</h2>
            <p className="text-neutral-300 mb-4">
              I'm a full-stack developer with a passion for creating beautiful and functional web
              applications. I specialize in React, Node.js, and Tailwind CSS, and I love working on
              projects that challenge me to learn and grow.
            </p>
            <p className="text-neutral-300 mb-4">
              I'm a full-stack developer with a passion for creating beautiful and functional web
              applications. I specialize in React, Node.js, and Tailwind CSS, and I love working on
              projects that challenge me to learn and grow.
            </p>
            <p className="text-neutral-300 mb-4">
              I'm a full-stack developer with a passion for creating beautiful and functional web
              applications. I specialize in React, Node.js, and Tailwind CSS, and I love working on
              projects that challenge me to learn and grow.
            </p>
            <p className="text-neutral-300">
              When I'm not coding, you can find me exploring new technologies, contributing to
              open-source projects, or playing video games.
            </p>
          </div>
        </TracingBeam>
      </div>

      {/* Skills Section */}
      <div className="py-20 bg-zinc-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill, index) => (
              <div key={index} className="p-4 bg-white dark:bg-zinc-800 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-2">{skill.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-300">{skill.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Team</h2>
          <div className="flex justify-center gap-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex flex-col items-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <p className="mt-2 text-neutral-300">{member.designation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-20 bg-zinc-800">
        <div className="max-w-2xl mx-auto p-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-neutral-300 mb-4">
            Have a project in mind or just want to say hi? Feel free to reach out!
          </p>
          <a
            href="mailto:john.doe@example.com"
            className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            Contact Me
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;