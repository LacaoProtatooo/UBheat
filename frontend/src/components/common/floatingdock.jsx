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
import { ChatbotComponent, UBHeatComponent } from "./floatingdockcomponents";

const FloatingDockUBheat = () => {
  const { setOpen } = useModal(); // Use context to open modal
  const [ActiveComponent, setActiveComponent] = useState(null); // Use uppercase for components

  const openModal = (Component) => {
    setActiveComponent(() => Component); // Store component reference
    setOpen(true);
  };

  const links = [
    { 
      title: "Home", 
      icon: <IconHome className="h-8 w-8 text-neutral-500 dark:text-neutral-300" />, 
      href: "#" 
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
      title: "Components", 
      icon: <IconNewSection className="h-8 w-8 text-neutral-500 dark:text-neutral-300" />, 
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
            {ActiveComponent && <ActiveComponent />} 
          </ModalContent>
        </ModalBody>
      </Modal>
    </>
  );
};

export default FloatingDockUBheat;
