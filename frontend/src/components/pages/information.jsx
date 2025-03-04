import React from "react";
import { Timeline } from "../ui/timeline";
import { TextHoverEffect } from '../ui/text-hover-effect';
import FloatingDockUBheat from "../common/floatingdock";

const Information = () => {
  const data = [
    {
      title: "January 2025",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Built and launched UBheat project with the goal of providing a comprehensive analysis of urban heat in the Philippines.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://drive.google.com/thumbnail?id=1LrS9B529CKpjNCIgE6G4L9Nqy7VJDS8A"
              alt="startup template"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://drive.google.com/thumbnail?id=12KbB5FmPpjhRltUw1HiI94o_F5zv4JrX"
              alt="startup template"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "February 2025",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Main Page is under development and will be finished soon.
          </p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Admin Dashboard is under development and will be finished soon.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://drive.google.com/thumbnail?id=1uWUNYazy0PQ5FfO3ALcfP3oB6UFngis6"
              alt="UBheat Image"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://drive.google.com/thumbnail?id=1xSAmAAh7T7U4rvWbgTKGC76I91dYXz3F"
              alt="hero template"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Information on Predictive Analysis",
      content: (
        <div>
          <h2 className="text-lg font-bold mb-4">
            Predictive Analysis of Urban Heat in the Philippines
          </h2>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-2">
            <strong>Plan:</strong> To create a Linear Regression Model for Predictive Analysis of urban heat based on major cities across the Philippine archipelago.
          </p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-2">
            <strong>Analysis Range:</strong> 2022 - 2030
          </p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-2">
            <strong>Linear Regression Variables:</strong> Main Indicator: CO₂ Emission per year (MtCO₂) | Dependent Variable: Urban Heat (Degrees Celsius)
          </p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-2">
            <strong>Indicators:</strong> MtCO₂: Metric Tons Carbon Emission Rate (for the whole country) | Degrees Celsius: Existing Heat Rate for the Current Weather
          </p>
          
          <h3 className="text-md font-semibold mt-4">CO₂ Emission Data</h3>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-2">
            <strong>Emissions per capita:</strong> 1.37 Tons per person (based on the population of 113,964,338 in 2022)
          </p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-2">
            <strong>Philippine Population Data:</strong> Available up to 2025 and below
          </p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-2">
            <strong>Philippine CO₂ Emissions Data:</strong> Available up to 2022 and below
          </p>
          
          <h3 className="text-md font-semibold mt-4">
            Observed Annual Average Mean Surface Air Temperature (°C)
          </h3>
          <div className="mb-8">
            <table className="mt-2 w-full text-xs md:text-sm text-neutral-800 dark:text-neutral-200 border-collapse border border-black">
              <thead>
                <tr>
                  <th className="border border-black px-2 py-1">Year</th>
                  <th className="border border-black px-2 py-1">Annual Mean</th>
                  <th className="border border-black px-2 py-1">5-Year Smooth</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black px-2 py-1">2015</td>
                  <td className="border border-black px-2 py-1">26.45</td>
                  <td className="border border-black px-2 py-1">26.41</td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-1">2016</td>
                  <td className="border border-black px-2 py-1">26.8</td>
                  <td className="border border-black px-2 py-1">26.47</td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-1">2017</td>
                  <td className="border border-black px-2 py-1">26.35</td>
                  <td className="border border-black px-2 py-1">26.53</td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-1">2018</td>
                  <td className="border border-black px-2 py-1">26.54</td>
                  <td className="border border-black px-2 py-1">26.58</td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-1">2019</td>
                  <td className="border border-black px-2 py-1">26.6</td>
                  <td className="border border-black px-2 py-1">26.63</td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-1">2020</td>
                  <td className="border border-black px-2 py-1">26.71</td>
                  <td className="border border-black px-2 py-1">26.67</td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-1">2021</td>
                  <td className="border border-black px-2 py-1">26.68</td>
                  <td className="border border-black px-2 py-1">26.71</td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-1">2022</td>
                  <td className="border border-black px-2 py-1">26.61</td>
                  <td className="border border-black px-2 py-1">26.74</td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-1">2023</td>
                  <td className="border border-black px-2 py-1">26.91</td>
                  <td className="border border-black px-2 py-1">26.78</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <h3 className="text-md font-semibold mt-4">Philippine Population Data (2015 - 2025)</h3>
          <div className="mb-8">
            <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mt-2">
              Key data points include:<br />
              2025: 116,786,962 (0.81% growth),<br />
              2024: 115,843,670,<br />
              2023: 114,891,199,<br />
              2022: 113,964,338,<br />
              2020: 112,081,264,<br />
              2015: 105,312,992.
            </p>
          </div>
          
          <h3 className="text-md font-semibold mt-4">
            Fossil Carbon Dioxide (CO₂) Emissions of the Philippines
          </h3>
          <div className="mb-8">
            <table className="mt-2 w-full text-xs md:text-sm text-neutral-800 dark:text-neutral-200 border-collapse border border-black">
              <thead>
                <tr>
                  <th className="border border-black px-2 py-1">Year</th>
                  <th className="border border-black px-2 py-1">Fossil CO₂ Emissions (tons)</th>
                  <th className="border border-black px-2 py-1">CO₂ Emissions Change</th>
                  <th className="border border-black px-2 py-1">CO₂ Emissions per Capita</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black px-2 py-1">2022</td>
                  <td className="border border-black px-2 py-1">155,380,930</td>
                  <td className="border border-black px-2 py-1">6.32%</td>
                  <td className="border border-black px-2 py-1">1.36</td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-1">2021</td>
                  <td className="border border-black px-2 py-1">146,142,190</td>
                  <td className="border border-black px-2 py-1">6.92%</td>
                  <td className="border border-black px-2 py-1">1.29</td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-1">2020</td>
                  <td className="border border-black px-2 py-1">136,678,980</td>
                  <td className="border border-black px-2 py-1">-8.15%</td>
                  <td className="border border-black px-2 py-1">1.22</td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-1">2019</td>
                  <td className="border border-black px-2 py-1">148,800,700</td>
                  <td className="border border-black px-2 py-1">4.56%</td>
                  <td className="border border-black px-2 py-1">1.34</td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-1">2018</td>
                  <td className="border border-black px-2 py-1">142,309,430</td>
                  <td className="border border-black px-2 py-1">4.19%</td>
                  <td className="border border-black px-2 py-1">1.30</td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-1">2017</td>
                  <td className="border border-black px-2 py-1">136,583,970</td>
                  <td className="border border-black px-2 py-1">11.76%</td>
                  <td className="border border-black px-2 py-1">1.26</td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-1">2016</td>
                  <td className="border border-black px-2 py-1">122,214,770</td>
                  <td className="border border-black px-2 py-1">7.29%</td>
                  <td className="border border-black px-2 py-1">1.15</td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-1">2015</td>
                  <td className="border border-black px-2 py-1">113,908,720</td>
                  <td className="border border-black px-2 py-1">8.71%</td>
                  <td className="border border-black px-2 py-1">1.08</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 border-t border-gray-300 pt-4">
            <h4 className="text-md font-semibold">Sources</h4>
            <ul className="list-disc list-inside text-xs md:text-sm text-neutral-800 dark:text-neutral-200">
              <li>
                <a
                  href="https://en.wikipedia.org/wiki/List_of_cities_in_the_Philippines#:~:text=There%20are%20149%20cities%20of,CC)%20of%20their%20respective%20provinces."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Wikipedia - List of Cities in the Philippines
                </a>
              </li>
              <li>
                <a
                  href="https://www.worldometers.info/co2-emissions/philippines-co2-emissions/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Worldometers - Philippines CO₂ Emissions
                </a>
              </li>
              <li>
                <a
                  href="https://learn.arcgis.com/en/projects/map-and-analyze-the-urban-heat-island-effect/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  ArcGIS - Urban Heat Island Effect
                </a>
              </li>
              <li>
                <a
                  href="https://www.worldometers.info/world-population/philippines-population/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Worldometers - Philippines Population
                </a>
              </li>
              <li>
                <a
                  href="https://worldpopulationreview.com/cities/philippines"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Worldpopulationreview - Philippines Population Per Cities
                </a>
              </li>
              <li>
                <a
                  href="https://www.macrotrends.net/global-metrics/countries/PHL/philippines/fertility-rate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Macrotrends - Philippines Population Growth Rate
                </a>
              </li>
            </ul>
          </div>
          
          <div className="mt-4">
            <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal">
              <strong>Description:</strong> This predictive analysis provides insights into urban heat trends across the Philippines using a linear regression model. It combines key indicators such as CO₂ emissions, population data, and observed temperature trends to forecast future urban heat patterns from 2022 to 2030.
            </p>
          </div>
          
        </div>
      ),
    },
  ];

  return (
    <div className="w-full mx-auto p-4 border border-gray-300 rounded-md bg-transparent shadow-md">
      <Timeline data={data} />

      {/* TEXT HOVER EFFECT */}
      <div className="h-[40rem] flex items-center justify-center">
        <TextHoverEffect text="UBHEAT" />
      </div> 
      <FloatingDockUBheat />
    </div>
  );
};

export default Information;
