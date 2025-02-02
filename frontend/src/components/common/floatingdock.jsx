import React, { useState } from "react";
import { FloatingDock } from "../ui/floating-dock";
import {
  IconBrandGithub,
  IconExchange,
  IconHome,
  IconNewSection,
  IconTerminal2,
} from "@tabler/icons-react";
import { Modal, ModalBody, ModalContent, useModal } from "../ui/animated-modal";

const FloatingDockUBheat = () => {
  const { setOpen } = useModal(); // Use context to open modal
  const [activeCard, setActiveCard] = useState(null);

  const openModal = (card) => {
    setActiveCard(card);
    setOpen(true); // Use the Modal Context state
  };

  const links = [
    { 
      title: "Home", 
      icon: <IconHome className="h-8 w-8 text-neutral-500 dark:text-neutral-300" />, 
      href: "#" 
    },
    { 
      title: "Chatbot", 
      icon: <IconTerminal2 className="h-8 w-8 text-neutral-500 dark:text-neutral-300" />, 
      href: "#" 
    },
    { 
      title: "Components", 
      icon: <IconNewSection className="h-8 w-8 text-neutral-500 dark:text-neutral-300" />, 
      href: "#" 
    },
    {
      title: "UBHeat",
      icon: (
        <button onClick={() => openModal({
          title: "UBHeat",
          description: "UBHeat is an AI-driven chatbot designed to assist users with various queries.",
          
        })}>
          <img src="../../../public/UB_Logo.png" width="32" height="32" alt="UBHeat Logo" />
        </button>
      ),
      href: "#",
    },
    { 
      title: "Changelog", 
      icon: <IconExchange className="h-8 w-8 text-neutral-500 dark:text-neutral-300" />, 
      href: "#" 
    },
    { 
      title: "GitHub", 
      icon: <IconBrandGithub className="h-8 w-8 text-neutral-500 dark:text-neutral-300" />, 
      href: "#" 
    },
  ];

  return (
    <>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <FloatingDock items={links} />
      </div>

      <Modal>
        <ModalBody>
          <ModalContent>
            <button 
              onClick={() => setOpen(false)} 
              className="absolute top-2 right-2 text-gray-600 dark:text-gray-400"
            />
            {activeCard && (
              <div className="text-black dark:text-white">
                <h2 className="text-2xl font-semibold">{activeCard.title}</h2>
                <p className="mt-2">{activeCard.description}</p>
                {activeCard.src && (
                  <img src={activeCard.src} alt={activeCard.title} className="mt-4 w-full h-auto rounded-md" />
                )}
              </div>
            )}
          </ModalContent>
        </ModalBody>
      </Modal>
    </>
  );
};

export default FloatingDockUBheat;
