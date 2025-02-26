import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";
import { IconClipboardCopy, IconFileBroken } from "@tabler/icons-react";
import { SkeletonOne } from "../ui/bento-grid";
import Staticheatmap from "./staticheatmap";
import FloatingDockUBheat from "../common/floatingdock";
import SliderSizes from "../ui/custom-slider";
import { useCO2Emissions, CO2EmissionsModal, YearSelectSlider, usePredictiveModel } from "../common/mainlayoutcomponents";
import { GoodEffectsTextField } from "../ui/good-effects-textfield";
import { BadEffectsTextField } from "../ui/bad-effects-textfield";

const StaticMain = () => {
  // State for selected year and current data (predicted from regression)
  const [selectedYear, setSelectedYear] = useState(2022);
  const [goodEffects, setGoodEffects] = useState("");
  const [badEffects, setBadEffects] = useState("");
  const [currentData, setCurrentData] = useState({ 
    temp: 26.74, 
    co2: 155.38 
  });

  // CO₂ emissions hook using current CO₂ (predicted from regression) as initial base
  const { 
    emissionRate, 
    result, 
    baseMtCO2,
    handleEmissionRateChange,
    handleBaseMtCO2Change,
    updateBase
  } = useCO2Emissions(currentData.co2);

  // Pass the current emissionRate to the predictive model hook
  const { allYears, allTemps, allMtCO2 } = usePredictiveModel(emissionRate);

  useEffect(() => {
    updateBase(currentData.co2);
  }, [currentData.co2, updateBase]);

  const yearIndex = allYears.indexOf(selectedYear);

  useEffect(() => {
    if (yearIndex !== -1) {
      setCurrentData({
        temp: allTemps[yearIndex],
        co2: allMtCO2[yearIndex]
      });
    }
  }, [selectedYear, yearIndex, allTemps, allMtCO2]);

  // Compute active CO₂ (rate value)
  const activeCO2 = baseMtCO2 * (emissionRate / 100);

  const fetchAIConclusion = async (type, temp, co2, historicalContext) => {
    const additionalMtCO2Line = emissionRate !== 0 
      ? `- Adjusted MtCO₂: ${result} MtCO₂` 
      : "";
    
    const prompt = `Analyze environmental impacts for the Philippines in ${selectedYear} with:
  - Temperature: ${temp.toFixed(2)}°C (${historicalContext.tempTrend})
  - CO2 Emissions: ${co2.toFixed(2)} MtCO₂ (${historicalContext.co2Trend})
  - Emission Rate: ${emissionRate}%
  - Baseline: ${baseMtCO2.toFixed(2)} MtCO₂
  ${additionalMtCO2Line}
  - Historical Baseline: ${historicalContext.baseTemp.toFixed(2)}°C
  - Linear Trend: 0.5°C/decade

  Provide ${type === 'positive' ? "benefits" : "risks"} considering:
  1. Emission rate impact
  2. Sector impacts
  3. Regional variations
  4. Economic factors
  5. Mitigation strategies
  
  Note that we focus on Urban Heat which is more concentrated in cities and urban areas rather than global climate.`;
  
    try {
      const response = await axios.post("api/chat", { 
        message: prompt,
        params: {
          temperature: temp,
          co2,
          emissionRate,
          baseMtCO2,
          adjustedMtCO2: result,
          historicalTrend: historicalContext
        }
      });
      return response.data.reply;
    } catch (error) {
      console.error("Error fetching AI response:", error);
      return "Analysis unavailable";
    }
  };

  const handleYearChange = useCallback(debounce(async (newYear) => {
    const yearIndex = allYears.indexOf(newYear);
    if (yearIndex === -1) return;

    const temp = allTemps[yearIndex];
    const co2 = allMtCO2[yearIndex];
    
    const baseYears = allYears.filter(y => y >= 2015 && y <= 2020);
    const baseTemp = baseYears.reduce((acc, y) => {
      const idx = allYears.indexOf(y);
      return acc + allTemps[idx];
    }, 0) / baseYears.length;

    const tempTrend = temp > allTemps[yearIndex - 1] 
      ? `${((temp - allTemps[yearIndex - 1])*100).toFixed(1)}% increase`
      : "stable";

    const co2Trend = co2 > allMtCO2[yearIndex - 1]
      ? `${((co2/allMtCO2[yearIndex - 1]-1)*100).toFixed(1)}% growth`
      : "stable";

    setSelectedYear(newYear);
    setCurrentData({ temp, co2 });

    setGoodEffects("Loading...");
    setBadEffects("Loading...");

    try {
      const [good, bad] = await Promise.all([
        fetchAIConclusion('positive', temp, co2, {baseTemp, tempTrend, co2Trend}),
        fetchAIConclusion('negative', temp, co2, {baseTemp, tempTrend, co2Trend})
      ]);
      
      setGoodEffects(good);
      setBadEffects(bad);
    } catch (error) {
      setGoodEffects("Error loading analysis");
      setBadEffects("Error loading analysis");
    }
  }, 500), [allYears, allTemps, allMtCO2, baseMtCO2, emissionRate]);

  // Embed the Staticheatmap into the grid so only one map renders.
  // We now pass additional props: adjustedTemp and activeCO2.
  const items = [
    {
      title: "",
      description: (
        <div className="mb-4 overflow-hidden">
          <Staticheatmap 
            emissionRate={emissionRate}
            resultMtCO2={result}
            adjustedTemp={currentData.temp}
            activeCO2={activeCO2}
          />
        </div>
      ),
      header: <SkeletonOne />,
      className: "md:col-span-3 md:row-span-8 p-4",
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
      className: "md:col-span-1 md:row-span-2",
      icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "CO₂ Emission Rate",
      description: (
        <div className="space-y-2 overflow-y-auto text-xs" style={{ maxHeight: '100%' }}>
          <span className="text-xs">AI-powered analytics for CO₂ emissions.</span>
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
              <p>Predicted MtCO₂: {currentData.co2.toFixed(2)}</p>
              <p>Active MtCO₂: {activeCO2.toFixed(2)}</p>
              <p>Result MtCO₂: {result}</p>
            </div>
          </div>
        </div>
      ),
      header: <SkeletonOne />,
      className: "md:col-span-1 md:row-span-2",
      icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Good Effects",
      description: (
        <div className="text-sm h-full">
          <GoodEffectsTextField
            text={goodEffects}
            speed={5}
            label="Positive Environmental Impacts"
            variant="outlined"
            fullWidth
          />
        </div>
      ),
      header: <SkeletonOne />,
      className: "md:col-span-2 md:row-span-3 p-4 overflow-hidden",
      icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Bad Effects",
      description: (
        <div className="text-sm h-full">
          <BadEffectsTextField
            text={badEffects}
            speed={5}
            label="Negative Environmental Impacts"
            variant="outlined"
            fullWidth
          />
        </div>
      ),
      header: <SkeletonOne />,
      className: "md:col-span-2 md:row-span-3 p-4 overflow-hidden",
      icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
    },
  ];

  return (
    <div className="w-screen h-screen flex flex-col items-center p-4">
      <BentoGrid className="md:grid-cols-5 md:grid-rows-8 gap-4 overflow-hidden w-full h-full">
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

export default StaticMain;
