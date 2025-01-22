import React from "react";
import { Box } from "@mui/material";
import { AiOutlineDelete, AiOutlineMinus, AiOutlineNumber, AiOutlinePlus } from "react-icons/ai";
import { updateQuantity, removeFromCart, calculateTotal } from "../store/cardSlices/add2cartSlice";
import { useDispatch } from "react-redux";
const FigurineHolder = ({figurine}) => {

  const dispatch = useDispatch();
  const id = figurine.id;
  const handleQuantity = (newQuantity) => {
    if (!isNaN(newQuantity)) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
      dispatch(calculateTotal());
    }
  };
  return (
    <Box sx={{ border: '2px black' }} className="flex items-center bg-purple-300 p-5 rounded-lg shadow-md w-full mt-2 mb-2  ">
  
  {/* Figurine Image */}
  <img
    src={figurine.image}
    alt="Figurine"
    className="h-24 w-40 object-cover rounded-lg"
  />

  {/* Figurine Details */}
  <div className="flex flex-col ml-4 w-max">
  <h1 className="text-black text-m mb-1">{figurine.name}</h1>
  <h1 className="text-black text-m mb-1">{figurine.origin}</h1>
</div>


{/* figurine.price * figurine.quantity */}
  {/* Quantity Controller and Play Button */}
  
  <div className="flex items-center ml-auto space-x-4">
  <div className="flex flex-col mr-auto min-w-max">
    <h3 className="text-black text-m mb-1">Price: ${figurine.price}</h3>
    <h1 className="text-black font-semibold text-m mb-1">Sub-Total: ${figurine.price * figurine.quantity}</h1>
  </div>

  <div className="flex flex-col items-center space-y-2 mr-5">
    {/* Quantity Label */}
    <span className="text-md text-black">
      <AiOutlineNumber className="inline-block mr-2" />
      Quantity
    </span>

    {/* Quantity Controller */}
    <div className="flex items-center space-x-2">
      <button className="px-2 py-1 bg-gray-700 text-white rounded-lg text-xs"
      onClick={() => handleQuantity(figurine.quantity - 1)}>
        <AiOutlineMinus />
      </button>
      <input
        type="number"
        value={figurine.quantity}
        min="1"
        className="text-center w-16 bg-gray-700 text-white rounded-lg"
      />
      <button className="px-2 py-1 bg-gray-700 text-white rounded-lg text-xs"
      onClick={() => handleQuantity(figurine.quantity + 1)}>
        <AiOutlinePlus />
      </button>
    </div>
  </div>

  {/* Delete Button */}
  <button 
  className="px-4 py-2 bg-white text-black rounded-lg text-sm flex items-center ml-4"
  onClick={() => dispatch(removeFromCart(figurine.id))}
  >
    
    <AiOutlineDelete className="mr-2" />
    Remove
  </button>
</div>



                                  
</Box>
  );
};

export default FigurineHolder;
