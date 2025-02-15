import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TextGenerateEffect } from '../ui/text-generate'; // Import the TextGenerateEffect component
import { MacbookScroll } from '../ui/macbook-scroll'; // Import the MacbookScroll component

const World = React.lazy(() => import('../ui/globe').then((m) => ({ default: m.World, ssr: false })));
const Vortex = React.lazy(() => import('../ui/vortex').then((m) => ({ default: m.Vortex, ssr: false })));
const TracingBeam = React.lazy(() => import('../ui/tracing-beam').then((m) => ({ default: m.TracingBeam, ssr: false })));

function About() {
  return (
    <div className='bg-zinc-900 w-full'>
      <Suspense fallback={<div>Loading tracing beam...</div>}>
        <TracingBeam>
          <div className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-black">
            {/* <MainNavbar /> */}
          </div>

          {/* HERO SECTION */}
          <div className="h-screen flex items-center justify-center relative overflow-hidden">
            {/* Vortex as a background effect */}
            <Suspense fallback={<div>Loading vortex...</div>}>
              <div className="absolute inset-0 z-0">
                <Vortex
                  backgroundColor="transparent"
                  particleCount={500}
                  baseHue={200} // Adjust the hue for the desired color
                  className="w-full h-full"
                />
              </div>
            </Suspense>

            {/* Content */}
            <motion.div
              initial={{
                opacity: 0,
                y: -80,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
              }}
              className="z-50 flex flex-col justify-center items-center"
            >
              <motion.p className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
                Welcome to UBheat
              </motion.p>
              <Link to="/">
                <button className="px-4 py-2 backdrop-blur-sm border bg-emerald-300/10 border-emerald-500/20 text-white mx-auto text-center rounded-full relative mt-4">
                  <span>Explore →</span>
                  <div className="absolute inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-emerald-500 to-transparent" />
                </button>
              </Link>
            </motion.div>
          </div>

          {/* GLOBE SECTION */}
          <div className="flex flex-row items-center justify-center py-20 h-screen md:h-auto bg-transparent dark:bg-black relative w-full">
            <div className="max-w-7xl mx-auto w-full relative overflow-hidden h-full md:h-[40rem] px-4">
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 1,
                }}
              >
                <h2 className="text-center text-xl md:text-4xl font-bold text-white dark:text-white">
                  We Operate Worldwide
                </h2>
                <p className="text-center text-base md:text-lg font-normal text-neutral-200 dark:text-neutral-200 max-w-md mt-2 mx-auto">
                  Ubheat is a global platform dedicated to bringing you the best in [your niche].
                </p>
              </motion.div>
              <div className="absolute w-full bottom-0 inset-x-0 h-40 bg-gradient-to-b pointer-events-none select-none from-transparent to-zinc-900" />
              <div className="absolute w-full -bottom-20 h-72 md:h-full z-10">
                <Suspense fallback={<div>Loading globe...</div>}>
                  <World data={sampleArcs} globeConfig={globeConfig} />
                </Suspense>
              </div>
            </div>
          </div>

          {/* TRACING BEAM SECTION */}
          <div className="flex flex-row items-center justify-start py-20 h-screen md:h-auto bg-transparent dark:bg-black relative w-full">
            <div className="max-w-7xl mx-auto w-full relative overflow-hidden h-full md:h-[40rem] px-4">
              {/* History of UBheat */}
              <div className="max-w-2xl mx-auto p-4">
                <h2 className="text-3xl font-bold text-white mb-4">Our Story</h2>
                <TextGenerateEffect className="text-neutral-200 mb-4" words="We are a group of students from TUP Taguig who are passionate about leveraging technology to solve real-world problems. UBheat was born out of our desire to create a tool that could help people visualize and understand data in a more intuitive way." />
                <TextGenerateEffect className="text-neutral-200 mb-4" words="Our journey began with a simple idea: to build a heatmap that could be used by everyone, regardless of their technical expertise. We wanted to make data visualization accessible, interactive, and impactful. After months of hard work, collaboration, and learning, we are proud to present UBheat to the world." />
                <TextGenerateEffect className="text-neutral-200 mb-4" words="UBheat is more than just a project for us—it's a testament to the power of teamwork, innovation, and perseverance. We hope that our platform will inspire others to explore the possibilities of data and technology." />
              </div>
            </div>
          </div>

          {/* MACBOOK SCROLL SECTION */}
          <div className="py-20">
            <MacbookScroll
              src="https://assets.pinterest.com/ext/embed.html?id=1010706341372473758"
              showGradient={true}
              title="Explore UBheat on Laptop"
              badge={<span className="text-white">New</span>}
            />
          </div>

          {/* FOOTER */}
          {/* <ResponsiveFooter /> */}
        </TracingBeam>
      </Suspense>
    </div>
  );
}

const globeConfig = {
  pointSize: 4,
  globeColor: "#062056",
  showAtmosphere: true,
  atmosphereColor: "#FFFFFF",
  atmosphereAltitude: 0.1,
  emissive: "#062056",
  emissiveIntensity: 0.1,
  shininess: 0.9,
  polygonColor: "rgba(255,255,255,0.7)",
  ambientLight: "#38bdf8",
  directionalLeftLight: "#ffffff",
  directionalTopLight: "#ffffff",
  pointLight: "#ffffff",
  arcTime: 1000,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
  initialPosition: { lat: 22.3193, lng: 114.1694 },
  autoRotate: true,
  autoRotateSpeed: 0.5,
};

const colors = ["#06b6d4", "#3b82f6", "#6366f1"];
const sampleArcs = [
  {
    startLat: -19.885592,
    startLng: -43.951191,
    endLat: -22.9068,
    endLng: -43.1729,
    arcAlt: 0.1,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    startLat: 28.6139,
    startLng: 77.209,
    endLat: 3.139,
    endLng: 101.6869,
    arcAlt: 0.2,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  // Add more arcs as needed
];

export default About;