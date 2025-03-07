import React, { useEffect, useState } from "react";
import { ExternalLink, Clock, CloudRain } from "lucide-react";

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const NEWS_API_KEY = "934c0580d10f4bb393731591d07b3515"; // Replace with your NewsAPI key

  const fetchWeatherNews = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=weather+Philippines&apiKey=${NEWS_API_KEY}`
      );
      const data = await response.json();
      setNews(data.articles.slice(0, 5)); // Get top 5 articles
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherNews();
  }, []);

  // Format publication date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Latest Weather News</h2>
          <CloudRain className="text-white" size={24} />
        </div>
        <p className="text-blue-100 text-sm mt-1">Stay updated with weather news from the Philippines</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-pulse flex space-x-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {news.map((article, index) => (
            <div key={index} className="p-4 hover:bg-blue-50 transition-colors duration-200">
              <div className="flex gap-4">
                {/* {article.urlToImage ? (
                  <div className="flex-shrink-0">
                    <img 
                      src="/api/placeholder/120/80" 
                      alt={article.title}
                      className="w-24 h-16 object-cover rounded-md"
                    />
                  </div>
                ) : null} */}
                
                <div className="flex-grow">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-gray-800 hover:text-blue-600 block mb-1 group"
                  >
                    <div className="flex items-start">
                      <span className="flex-grow">{article.title}</span>
                      <ExternalLink size={16} className="ml-1 flex-shrink-0 text-gray-400 group-hover:text-blue-500" />
                    </div>
                  </a>
                  
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <Clock size={14} className="mr-1" />
                    <span>{article.publishedAt ? formatDate(article.publishedAt) : "Recent"}</span>
                    {article.source?.name && (
                      <>
                        <span className="mx-1">•</span>
                        <span>{article.source.name}</span>
                      </>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2">{article.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="bg-gray-50 px-4 py-3">
        <button 
          onClick={fetchWeatherNews}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
        >
          Refresh News
        </button>
      </div>
    </div>
  );
};

export default NewsSection;