import React, { useEffect, useState } from "react";
import axios from "axios";

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const NEWS_API_KEY = "934c0580d10f4bb393731591d07b3515"; // Replace with your NewsAPI key

  const fetchWeatherNews = async () => {
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=weather+Philippines&apiKey=${NEWS_API_KEY}`
      );
      setNews(response.data.articles.slice(0, 5)); // Get top 5 articles
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  useEffect(() => {
    fetchWeatherNews();
  }, []);

  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <h4 className="text-lg font-semibold mb-2">Latest Weather News</h4>
      <div className="space-y-4">
        {news.map((article, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-md">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:underline"
            >
              {article.title}
            </a>
            <p className="text-sm text-gray-600">{article.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsSection;