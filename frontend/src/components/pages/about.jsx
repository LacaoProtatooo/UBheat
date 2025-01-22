import React, { Suspense } from 'react';

import { HeroParallax } from '../ui/hero-parallax';
import { TextHoverEffect } from '../ui/text-hover-effect';
import { motion } from 'framer-motion';
import { ImagesSlider } from '../ui/images-slider';
// import MainNavbar from '../common/navbar';
// import ResponsiveFooter from '../common/footer';
import { Link } from 'react-router-dom';

const World = React.lazy(() => import('../ui/globe').then((m) => ({ default: m.World, ssr: false })));

function About() {
  return (
    <div className='bg-zinc-900 w-full'>
       <div className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-black">
        {/* <MainNavbar /> */}
      </div>
        {/* PARALLAX */}
        <HeroParallax products={products} />;  

        <div className="h-screen flex items-center justify-center">
          <ImagesSlider className="h-[40rem] w-full max-w-[80rem]" images={images}>
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
                Having an Interest ? <br /> Check out our store.
              </motion.p>
              <Link to ="/">
              <button className="px-4 py-2 backdrop-blur-sm border bg-emerald-300/10 border-emerald-500/20 text-white mx-auto text-center rounded-full relative mt-4">
                <span>Join now →</span>
                <div className="absolute inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-emerald-500 to-transparent" />
              </button>
              </Link>
            </motion.div>
          </ImagesSlider>
        </div>


        {/* GLOBE */}
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
              className="div"
            >
              <h2 className="text-center text-xl md:text-4xl font-bold text-white dark:text-white">
                We sell Figurines worldwide
              </h2>
              <p className="text-center text-base md:text-lg font-normal text-neutral-200 dark:text-neutral-200 max-w-md mt-2 mx-auto">
                Too Far away from our store? No worries, we ship worldwide.
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

        {/* TEXT HOVER EFFECT */}
        <div className="h-[40rem] flex items-center justify-center">
            <TextHoverEffect text="ACSTP" />
        </div> 

        

        {/* MACBOOK SCROLL */}
        {/* <div className="overflow-hidden dark:bg-[#0B0B0F] bg-black w-full">
            <MacbookScroll
                title={
                <span>
                    Your ActionStop Shop for Figurines <br /> No kidding.
                </span>
                }
                showGradient={false}
            />
        </div> */}

        {/* SPARKLES */}
        {/* <div className="h-[40rem] w-full bg-transparent flex flex-col items-center justify-center overflow-hidden rounded-md">
            <h1 className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-white relative z-20">
                ActionStop Figurines
            </h1>
            <div className="w-full h-40 relative">
                
                <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
                <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
                <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
                <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

                <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={1200}
                className="h-full"
                particleColor="#FFFFFF"
                />

                <div className="absolute inset-0 w-full h-full bg-transparent [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
            </div>
        </div> */}

{/* <ResponsiveFooter /> */}
    </div>

  );
}

const images = [
  "https://cdn.donmai.us/sample/a5/d7/__usami_renko_and_maribel_hearn_touhou_drawn_by_nani_kore_wjstpwls4__sample-a5d7bbbe4909d040225056c3df1f8fc7.jpg",
  "https://cdn.donmai.us/sample/b7/23/__hakurei_reimu_touhou_drawn_by_syuri22__sample-b723d4b83caa2e4b178cf7e941d03e3f.jpg",
  "https://cdn.donmai.us/sample/4c/18/__hakurei_reimu_touhou_drawn_by_akyuun__sample-4c18613ba94c9b8a2bde91bbc97d792c.jpg",
];


export const products = [
    {
      title: "Waifuuuuuu",
      thumbnail:
        "https://m.media-amazon.com/images/I/51iJ8XsUFdL._AC_SL1000_.jpg",
    },
    {
        title: "Hitori Goto",
        thumbnail:
          "https://store.aniplexusa.com/bocchi-the-rock/hitori-figure-1-7/images/1.jpg",
      },
      {
        title: "Misaka Mikoto",
        thumbnail:
          "https://i.pinimg.com/originals/9d/90/37/9d903788b61c8291660d07c2d3560f64.png",
      },
      {
        title: "Saberrrr",
        thumbnail:
          "https://ae01.alicdn.com/kf/HTB15v9LLXXXXXbEXpXXq6xXFXXXB/Free-shipping-Japanese-Anime-Figures-Fate-stay-night-Saber-Lily-Doll-the-Sword-of-Victory-Aciton.jpg",
      },
      {
        title: "Shark",
        thumbnail:
          "https://i.pinimg.com/originals/90/04/23/900423388cc0f48db718e8bb3b5be0ba.jpg",
      },
      {
        title: "Yukino Yukinoshita",
        thumbnail:
          "https://ae01.alicdn.com/kf/HTB1YviiXfjsK1Rjy1Xaq6zispXal/15cm-Action-Figure-Yukino-Yukinoshita-Kimono-Style-Sexy-Girl-Model-Cartoon-Doll-PVC-Japanese-Figurine-World.jpg",
      },
      {
        title: "Cordelia",
        thumbnail:
          "https://resize.cdn.otakumode.com/full/shop/product/3b1270f41e554c11bc31c5a27b815430.jpg",
      },
      {
        title: "Kirito & Asuna",
        thumbnail:
          "https://i.pinimg.com/736x/b5/e2/7a/b5e27a561d368c0d3f59920ab97da115--sao-merch-sword-art-online-figures.jpg",
      },
      {
        title: "Sinon",
        thumbnail:
          "https://th.bing.com/th/id/OIP.h6uHlLDFokW1qCttZJzocgDMEy?rs=1&pid=ImgDetMain",
      },
      {
        title: "Reimu Hakurei",
        thumbnail:
          "https://i.pinimg.com/originals/c3/fc/9d/c3fc9dc4392323ca156ca3dd9c724017.jpg",
      },
      {
        title: "Ran & Yukari",
        thumbnail:
          "https://i.pinimg.com/originals/e4/fb/72/e4fb72b93bb1dbaf7be23ebb09b3544a.jpg",
      },
      {
        title: "Ram & Rem",
        thumbnail:
          "https://i.pinimg.com/originals/ea/ce/e1/eacee19f1fc0348babbe568496e37219.jpg",
      },
      {
        title: "Akari Mizunashi",
        thumbnail:
          "https://i.pinimg.com/originals/ef/3c/da/ef3cda1ba35c70fb8978a7536ab2660c.png",
      },
      {
        title: "Lala Satalin Deviluke",
        thumbnail:
          "https://th.bing.com/th/id/OIP.hTv5PxyQC-Y2RJli27t5WgHaKx?w=550&h=800&rs=1&pid=ImgDetMain",
      },
      {
        title: "Ako nee",
        thumbnail:
          "https://th.bing.com/th/id/OIP.S4vclYsFFJ5zzmj-Zhef-wAAAA?rs=1&pid=ImgDetMain",
      },
  ];

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
      order: 1,
      startLat: -19.885592,
      startLng: -43.951191,
      endLat: -22.9068,
      endLng: -43.1729,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 1,
      startLat: 28.6139,
      startLng: 77.209,
      endLat: 3.139,
      endLng: 101.6869,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 1,
      startLat: -19.885592,
      startLng: -43.951191,
      endLat: -1.303396,
      endLng: 36.852443,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 2,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: 35.6762,
      endLng: 139.6503,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 2,
      startLat: 51.5072,
      startLng: -0.1276,
      endLat: 3.139,
      endLng: 101.6869,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 2,
      startLat: -15.785493,
      startLng: -47.909029,
      endLat: 36.162809,
      endLng: -115.119411,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 3,
      startLat: -33.8688,
      startLng: 151.2093,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 3,
      startLat: 21.3099,
      startLng: -157.8581,
      endLat: 40.7128,
      endLng: -74.006,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 3,
      startLat: -6.2088,
      startLng: 106.8456,
      endLat: 51.5072,
      endLng: -0.1276,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 4,
      startLat: 11.986597,
      startLng: 8.571831,
      endLat: -15.595412,
      endLng: -56.05918,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 4,
      startLat: -34.6037,
      startLng: -58.3816,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.7,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 4,
      startLat: 51.5072,
      startLng: -0.1276,
      endLat: 48.8566,
      endLng: -2.3522,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 5,
      startLat: 14.5995,
      startLng: 120.9842,
      endLat: 51.5072,
      endLng: -0.1276,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 5,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: -33.8688,
      endLng: 151.2093,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 5,
      startLat: 34.0522,
      startLng: -118.2437,
      endLat: 48.8566,
      endLng: -2.3522,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 6,
      startLat: -15.432563,
      startLng: 28.315853,
      endLat: 1.094136,
      endLng: -63.34546,
      arcAlt: 0.7,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 6,
      startLat: 37.5665,
      startLng: 126.978,
      endLat: 35.6762,
      endLng: 139.6503,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 6,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: 51.5072,
      endLng: -0.1276,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 7,
      startLat: -19.885592,
      startLng: -43.951191,
      endLat: -15.595412,
      endLng: -56.05918,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 7,
      startLat: 48.8566,
      startLng: -2.3522,
      endLat: 52.52,
      endLng: 13.405,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 7,
      startLat: 52.52,
      startLng: 13.405,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 8,
      startLat: -8.833221,
      startLng: 13.264837,
      endLat: -33.936138,
      endLng: 18.436529,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 8,
      startLat: 49.2827,
      startLng: -123.1207,
      endLat: 52.3676,
      endLng: 4.9041,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 8,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: 40.7128,
      endLng: -74.006,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 9,
      startLat: 51.5072,
      startLng: -0.1276,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 9,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: -22.9068,
      endLng: -43.1729,
      arcAlt: 0.7,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 9,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: -34.6037,
      endLng: -58.3816,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 10,
      startLat: -22.9068,
      startLng: -43.1729,
      endLat: 28.6139,
      endLng: 77.209,
      arcAlt: 0.7,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 10,
      startLat: 34.0522,
      startLng: -118.2437,
      endLat: 31.2304,
      endLng: 121.4737,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 10,
      startLat: -6.2088,
      startLng: 106.8456,
      endLat: 52.3676,
      endLng: 4.9041,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 11,
      startLat: 41.9028,
      startLng: 12.4964,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 11,
      startLat: -6.2088,
      startLng: 106.8456,
      endLat: 31.2304,
      endLng: 121.4737,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 11,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: 1.3521,
      endLng: 103.8198,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 12,
      startLat: 34.0522,
      startLng: -118.2437,
      endLat: 37.7749,
      endLng: -122.4194,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 12,
      startLat: 35.6762,
      startLng: 139.6503,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 12,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 13,
      startLat: 52.52,
      startLng: 13.405,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 13,
      startLat: 11.986597,
      startLng: 8.571831,
      endLat: 35.6762,
      endLng: 139.6503,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 13,
      startLat: -22.9068,
      startLng: -43.1729,
      endLat: -34.6037,
      endLng: -58.3816,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 14,
      startLat: -33.936138,
      startLng: 18.436529,
      endLat: 21.395643,
      endLng: 39.883798,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
  ];


  // const World = dynamic(() => import("./ui/globe").then((m) => m.World), {
  //   ssr: false,
  // });
   
  

export default About;