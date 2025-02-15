import React, { useState, useEffect } from "react";
import axios from "axios";
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";
import { IconClipboardCopy, IconFileBroken } from "@tabler/icons-react";
import { SkeletonOne } from "../ui/bento-grid";
import Heatmap from "./Heatmap";
import FloatingDockUBheat from "../common/floatingdock";
import SliderSizes from "../ui/custom-slider";
import { useCO2Emissions, CO2EmissionsModal, YearSelectSlider } from "../common/mainlayoutcomponents";
import { GoodEffectsTextField } from "../ui/good-effects-textfield"; // Import the new component
import { BadEffectsTextField } from "../ui/bad-effects-textfield"; // Import the new component

const Main = () => {
  const {
    emissionRate,
    baseMtCO2,
    result,
    handleEmissionRateChange,
    handleBaseMtCO2Change,
  } = useCO2Emissions();

  const [selectedYear, setSelectedYear] = useState(2022); // State for selected year
  const [goodEffects, setGoodEffects] = useState("");
  const [badEffects, setBadEffects] = useState("");

  const fetchChatbotResponse = async (year) => {
    try {
      const response = await axios.post("api/chat", { message: `Good effects in the Philippines for the year ${year}` });
      const botMessage = response.data.reply;
      setGoodEffects(botMessage);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
    }
  };

  const fetchBadEffectsResponse = async (year) => {
    try {
      const response = await axios.post("api/chat", { message: `Bad effects in the Philippines for the year ${year}` });
      const botMessage = response.data.reply;
      setBadEffects(botMessage);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
    }
  };

  const handleYearChange = (newYear) => {
    setSelectedYear(newYear);
    setGoodEffects(""); // Clear the text box
    setBadEffects(""); // Clear the text box
    fetchChatbotResponse(newYear);
    fetchBadEffectsResponse(newYear);
  };

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
      description: (
        <div className="space-y-2 overflow-y-auto text-xs p-3" style={{ maxHeight: '100%' }}>
          <span className="text-xs">Select a year for analysis.</span>
          <YearSelectSlider onYearChange={handleYearChange} />
          <span className="text-sm">Selected Year: {selectedYear}</span>
        </div>
      ),
      header: <SkeletonOne />,
      className: "md:col-span-1 md:row-span-1",
      icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "CO2 Emission Rate",
      description: (
        <div className="space-y-2 overflow-y-auto text-xs" style={{ maxHeight: '100%' }}>
          <span className="text-xs">AI-powered analytics for CO2 emissions.</span>
          <SliderSizes onEmissionRateChange={handleEmissionRateChange} />
          <div className="flex items-center space-x-2">
            <CO2EmissionsModal
              emissionRate={emissionRate}
              baseMtCO2={baseMtCO2}
              result={result}
              handleEmissionRateChange={handleEmissionRateChange}
              handleBaseMtCO2Change={handleBaseMtCO2Change}
            />
            <div className="text-sm">
              <p>Base MtCO₂: {baseMtCO2}</p>
              <p>Result MtCO₂: {result}</p>
            </div>
          </div>
        </div>
      ),
      header: <SkeletonOne />,
      className: "md:col-span-1 md:row-span-1",
      icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Good Effects",
      description: (
        <div className="text-sm h-full">
          <GoodEffectsTextField
            text={goodEffects}
            speed={5} // Adjust typing speed
            label="Positive Environmental Impacts"
            variant="outlined"
            fullWidth
          />
        </div>
      ),
      header: <SkeletonOne />,
      className: "md:col-span-2 md:row-span-2 p-4 overflow-hidden",
      icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Bad Effects",
      description: (
        <div className="text-sm h-full">
          <BadEffectsTextField
            text={badEffects}
            speed={5} // Adjust typing speed
            label="Negative Environmental Impacts"
            variant="outlined"
            fullWidth
          />
        </div>
      ),
      header: <SkeletonOne />,
      className: "md:col-span-2 md:row-span-2 p-4 overflow-hidden",
      icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
    },
  ];

  return (
    <div className="w-screen h-screen flex flex-col items-center p-4">
      <BentoGrid className="md:grid-cols-5 md:grid-rows-5 gap-4 overflow-hidden w-full h-full">
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