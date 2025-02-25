import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";
import { IconClipboardCopy, IconFileBroken } from "@tabler/icons-react";
import { SkeletonOne } from "../ui/bento-grid";
import Staticheatmap from "./staticheatmap";
import FloatingDockUBheat from "../common/floatingdock";
import SliderSizes from "../ui/custom-slider";
import { useCO2Emissions, CO2EmissionsModal, YearSelectSlider } from "../common/mainlayoutcomponents";
import { GoodEffectsTextField } from "../ui/good-effects-textfield";
import { BadEffectsTextField } from "../ui/bad-effects-textfield";
import regression from 'regression';

// Predictive data model
const usePredictiveModel = () => {
  const historicalData = {
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
    population: [
      105312992, 106735719, 108119693, 109465287, 110804683,
      112081264, 113100950, 113964338, 114891199
    ],
    co2Emissions: [113908720, 122214770, 136583970, 142309430, 148800700, 
                  136678980, 146142190, 155380930, 163150976],
    temperatures: [26.41, 26.47, 26.53, 26.58, 26.63, 26.67, 26.71, 26.74, 26.78]
  };

  const futureData = {
    years: [2024, 2025, 2026, 2027, 2028, 2029, 2030],
    population: [115843670, 116786962, 117729254, 118671546, 
                119613838, 120556130, 121498422]
  };

  const calculatePredictions = () => {
    const mtco2 = historicalData.co2Emissions.map(x => x / 1000000);
    
    const yearTempModel = regression.linear(
      historicalData.years.map((y, i) => [y, historicalData.temperatures[i]])
    );

    const co2TempModel = regression.linear(
      mtco2.map((v, i) => [v, historicalData.temperatures[i]])
    );

    const futureMtCO2 = futureData.population.map((pop, i) => {
      const growthRate = 1.015;
      return mtco2[mtco2.length-1] * Math.pow(growthRate, i+1);
    });

    const futureTemps = futureMtCO2.map((co2, i) => {
      const timeProjection = yearTempModel.predict([futureData.years[i]])?.[1] || 0;
      const co2Projection = co2TempModel.predict([co2])?.[1] || 0;
      return (timeProjection + co2Projection) / 2;
    });

    return {
      allYears: [...historicalData.years, ...futureData.years],
      allTemps: [...historicalData.temperatures, ...futureTemps],
      allMtCO2: [...mtco2, ...futureMtCO2],
    };
  };

  return React.useMemo(() => calculatePredictions(), []);
};

const StaticMain = () => {
  // Initialize state first
  const [selectedYear, setSelectedYear] = useState(2022);
  const [goodEffects, setGoodEffects] = useState("");
  const [badEffects, setBadEffects] = useState("");
  const [currentData, setCurrentData] = useState({ 
    temp: 26.74, 
    co2: 155.38 
  });

  // Then use the state in hook initialization
  const { 
    emissionRate, 
    result, 
    baseMtCO2,
    handleEmissionRateChange,
    updateBase
  } = useCO2Emissions(currentData.co2);

  const { allYears, allTemps, allMtCO2 } = usePredictiveModel();

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

  const fetchAIConclusion = async (type, temp, co2, historicalContext) => {
    const prompt = `Analyze environmental impacts for the Philippines in ${selectedYear} with:
  - Temperature: ${temp.toFixed(2)}°C (${historicalContext.tempTrend})
  - CO2 Emissions: ${co2.toFixed(2)} MtCO2 (${historicalContext.co2Trend})
  - Emission Rate: ${emissionRate}%
  - Baseline: ${baseMtCO2.toFixed(2)} MtCO2
  - Historical Baseline: ${historicalContext.baseTemp.toFixed(2)}°C
  - Linear Trend: 0.5°C/decade

  Provide ${type === 'positive' ? "benefits" : "risks"} considering:
  1. Emission rate impact
  2. Sector impacts
  3. Regional variations
  4. Economic factors
  5. Mitigation strategies
  
  Note that we focus on Urban Heat which is more concentrated in cities and urban areas. rather than climate which is more general and global or weather.`;

    try {
      const response = await axios.post("api/chat", { 
        message: prompt,
        params: {
          temperature: temp,
          co2,
          emissionRate,
          baseMtCO2,
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

  const items = [
    {
      title: "",
      description: (
        <div className="mb-4 overflow-hidden">
          <Staticheatmap />
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
      title: "CO2 Emission Rate",
      description: (
        <div className="space-y-2 overflow-y-auto text-xs" style={{ maxHeight: '100%' }}>
          <span className="text-xs">AI-powered analytics for CO2 emissions.</span>
          <SliderSizes onEmissionRateChange={handleEmissionRateChange} />
          <div className="flex items-center space-x-2">
            <CO2EmissionsModal
              emissionRate={emissionRate}
              baseMtCO2={baseMtCO2}  // Changed from currentData.co2 to use hook's baseMtCO2
              result={result}
              handleEmissionRateChange={handleEmissionRateChange}
              handleBaseMtCO2Change={() => {
                // Add null handler or optional user override
              }}
            />
            <div className="text-sm">
              <p>Predicted MtCO₂: {currentData.co2.toFixed(2)}</p>
              <p>Active MtCO₂: {baseMtCO2.toFixed(2)}</p>
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
            speed={5} // Adjust typing speed
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
            speed={5} // Adjust typing speed
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