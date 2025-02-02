import React from "react";
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";
import { IconClipboardCopy, IconFileBroken } from "@tabler/icons-react";
import { SkeletonOne } from "../ui/bento-grid";

import Heatmap from "./Heatmap";
import FloatingDockUBheat from "../common/floatingdock";

const Main = () => {
  const items = [
    {
      title: "",
      description: (
        <div className="mb-4 overflow-hidden"> 
            <Heatmap />
        </div>
      ),
      header: <SkeletonOne />,
      className: "md:col-span-3 md:row-span-5 p-4",
    },
    {
      title: "Year Select",
      description: <span className="text-sm">Select a year for analysis.</span>,
      header: <SkeletonOne />,
      className: "md:col-span-1 md:row-span-1",
      icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "CO2 Emission Rate",
      description: <span className="text-sm">AI-powered analytics for CO2 emissions.</span>,
      header: <SkeletonOne />,
      className: "md:col-span-1 md:row-span-1",
      icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Good Effects",
      description: <span className="text-sm">Positive environmental impacts.</span>,
      header: <SkeletonOne />,
      className: "md:col-span-2 md:row-span-2",
      icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Bad Effects",
      description: <span className="text-sm">Negative environmental effects.</span>,
      header: <SkeletonOne />,
      className: "md:col-span-2 md:row-span-2",
      icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
    },
  ];

  return (
    <div className="w-screen h-screen flex flex-col items-center p-4">
      <BentoGrid className="md:grid-cols-5 md:grid-rows-5 gap-4 overflow-hidden w-full">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            className={item.className}
            icon={item.icon}
          />
        ))}
      </BentoGrid>

      <FloatingDockUBheat />
    </div>

  );
};

export default Main;
