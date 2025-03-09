import React, { useState, useEffect } from "react";
import { FloatingDock } from "../ui/floating-dock";
import {
  IconBrandGithub,
  IconExchange,
  IconHome,
  IconNewSection,
  IconTerminal2,
} from "@tabler/icons-react";
import { Modal, ModalBody, ModalContent, useModal } from "../ui/animated-modal";
import { ChatbotComponent, UBHeatComponent, PredictionComponent } from "./floatingdockcomponents";
import { GrCompare } from "react-icons/gr";
import { FaUserGear } from "react-icons/fa6";
import { BsClipboard2DataFill } from "react-icons/bs";
import { checkAuthStatus } from "../../utils/userauth"; 

const FloatingDockUBheat = () => {
  const { setOpen } = useModal(); // Use context to open modal
  const [ActiveComponent, setActiveComponent] = useState(null); // Store component reference
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status on mount
    const storedAuth = checkAuthStatus(); // should return true/false
    setIsAuthenticated(storedAuth);
  }, []);

  const openModal = (Component) => {
    setActiveComponent(() => Component); // Store component reference
    setOpen(true);
  };

  const links = [
    { 
      title: "Home", 
      icon: <IconHome className="h-8 w-8 text-neutral-500 dark:text-neutral-300" />, 
      href: "/" 
    },
    { 
      title: "Chatbot", 
      icon: (
        <button onClick={() => openModal(ChatbotComponent)}>
          <IconTerminal2 className="h-8 w-8 text-neutral-500 dark:text-neutral-300" />
        </button>
      ), 
      href: "#" 
    },
    { 
      title: "Prediction", 
      icon: (
        <button onClick={() => openModal(PredictionComponent)}>
          <IconNewSection className="h-8 w-8 text-neutral-500 dark:text-neutral-300" />
        </button>
      ), 
      href: "#" 
    },
    {
      title: "UBHeat",
      icon: (
        <button onClick={() => openModal(UBHeatComponent)}>
          <img src="/UB_Logo.png" width="32" height="32" alt="UBHeat Logo" />
        </button>
      ),
      href: "#",
    },
    { 
      title: "Comparison", 
      icon: <GrCompare className="h-8 w-8 text-neutral-500 dark:text-neutral-300" />,
      href: "/comparison" 
    },
    { 
      title: "Information", 
      icon: <BsClipboard2DataFill className="h-8 w-8 text-neutral-500 dark:text-neutral-300" />,
      href: "/information" 
    },
    { 
      title: "About UBheat", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-neutral-500 dark:text-neutral-300">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm0 9h-1l-.117 .007a1 1 0 0 0 0 1.986l.117 .007v3l.007 .117a1 1 0 0 0 .876 .876l.117 .007h1l.117 -.007a1 1 0 0 0 .876 -.876l.007 -.117l-.007 -.117a1 1 0 0 0 -.764 -.857l-.112 -.02l-.117 -.006v-3l-.007 -.117a1 1 0 0 0 -.876 -.876l-.117 -.007zm.01 -3l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z" />
        </svg>
      ), 
      href: "/about" 
    },
    // Conditionally include the Profile button if the user is authenticated
    ...(isAuthenticated
      ? [
          { 
            title: "Profile", 
            icon: <FaUserGear className="h-8 w-8 text-neutral-500 dark:text-neutral-300" />,
            href: "/profilev2" 
          },
          { 
            title: "V2 Map", 
            icon: <IconExchange className="h-8 w-8 text-neutral-500 dark:text-neutral-300" />, 
            href: "/v2" 
          },
        ]
      : []),
  ];

  return (
    <>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <FloatingDock items={links} />
      </div>

      <Modal>
        <ModalBody>
          <ModalContent className="overflow-auto max-h-full" style={{ zIndex: 10 }}>
            <button 
              onClick={() => setOpen(false)} 
              className="absolute top-2 right-2 text-gray-600 dark:text-gray-400"
            />
            {ActiveComponent && <ActiveComponent />} 
          </ModalContent>
        </ModalBody>
      </Modal>
    </>
  );
};

export default FloatingDockUBheat;
