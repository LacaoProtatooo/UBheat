import { useState } from "react";
import { useDispatch } from "react-redux";
import { filterPush, filterReset } from "../store/figurineSlice";
import { useSelector } from "react-redux";
const FilterPanel = () => {
  const dispatch = useDispatch();

  const fil = useSelector((state) => state.figurines.filters);

  // State for filters with direct keys (date, rating, classification, price, popularity)
  const [filters, setFilters] = useState({
    date: null,
    rating: null,
    classification: null,
    price: null,
    popularity: null,
  });

  const handleFilterChange = (filterType, value) => {
    // Update the filters state directly
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value, // Directly set the filter type to the value
    }));
  
    // Dispatch the filter change with the correct shape
    dispatch(filterPush({ key: filterType, value: value }));
    console.log(fil);
  };
  

  const clearFilters = () => {
    setFilters({
      date: null,
      rating: null,
      classification: null,
      price: null,
      popularity: null,
    });
    // Dispatch the filter reset action to clear filters in Redux store
    dispatch(filterReset());
  };

  return (
    <div className="text-sm grid grid-cols-3 gap-6 p-4">
      {/* Date Filter Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 font-medium text-gray-700">
          <span>Date</span>
        </div>
        <div className="space-y-2">
          {["today", "old", "month"].map((option) => (
            <label key={option} className="flex items-center w-full px-2 py-1 rounded hover:bg-gray-100 transition-colors cursor-pointer">
              <input
                type="radio"
                name="date"
                value={option}
                checked={fil.date === option}
                onChange={() => handleFilterChange("date", option)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="ml-2">{option.charAt(0).toUpperCase() + option.slice(1)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating Filter Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 font-medium text-gray-700">
          <span>Rating</span>
        </div>
        <div className="space-y-2">
          {[5, 4, 3].map((rating) => (
            <label key={rating} className="flex items-center w-full px-2 py-1 rounded hover:bg-gray-100 transition-colors cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={fil.rating === rating}
                onChange={() => handleFilterChange("rating", rating)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="ml-2">{"★".repeat(rating)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Classification Filter Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 font-medium text-gray-700">
          <span>Classification</span>
        </div>
        <div className="space-y-2">
          {["Western", "Anime", "Manga", "Fantasy", "Other"].map((classification) => (
            <label key={classification} className="flex items-center w-full px-2 py-1 rounded hover:bg-gray-100 transition-colors cursor-pointer">
              <input
                type="radio"
                name="classification"
                value={classification}
                checked={fil.classification === classification}
                onChange={() => handleFilterChange("classification", classification)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="ml-2">{classification.charAt(0).toUpperCase() + classification.slice(1)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 font-medium text-gray-700">
          <span>Price</span>
        </div>
        <div className="space-y-2">
          {["50<", "50-200", "200-500", "500>"].map((price) => (
            <label key={price} className="flex items-center w-full px-2 py-1 rounded hover:bg-gray-100 transition-colors cursor-pointer">
              <input
                type="radio"
                name="price"
                value={price}
                checked={fil.price === price}
                onChange={() => handleFilterChange("price", price)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="ml-2">{price}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Popularity Filter Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 font-medium text-gray-700">
          <span>Popularity</span>
        </div>
        <div className="space-y-2">
          {["most", "lo-hi", "hi-lo"].map((popularity) => (
            <label key={popularity} className="flex items-center w-full px-2 py-1 rounded hover:bg-gray-100 transition-colors cursor-pointer">
              <input
                type="radio"
                name="popularity"
                value={popularity}
                checked={fil.popularity === popularity}
                onChange={() => handleFilterChange("popularity", popularity)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="ml-2">{popularity.charAt(0).toUpperCase() + popularity.slice(1)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters Button */}
      <div className="col-span-3 text-center mt-4">
        <button
          onClick={clearFilters}
          className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
