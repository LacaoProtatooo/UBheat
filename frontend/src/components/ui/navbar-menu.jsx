import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AiOutlineAliwangwang, AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineBarcode, AiOutlineMoneyCollect, AiOutlinePlus, AiOutlineWarning } from "react-icons/ai";
import { Button } from "@mui/material";
import { updateQuantity, removeFromCart, calculateTotal } from "../store/cardSlices/add2cartSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({ setActive, active, item, children, href }) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      
      <Link to={href} className="cursor-pointer text-black hover:opacity-[0.9] dark:text-white">
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-black hover:opacity-[0.9] dark:text-white"
        
      >
        {item}
      </motion.p>
      </Link>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4">
              <motion.div
                transition={transition}
                layoutId="active"
                className="bg-gray-300 dark:bg-black backdrop-blur-sm rounded-2xl overflow-hidden border border-black/[0.2] dark:border-white/[0.2] shadow-xl"
              >
                <motion.div layout className="w-max h-full p-4">
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({ setActive, children }) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="relative rounded-full border border-transparent dark:bg-black dark:border-white/[0.2] bg-gray-300 shadow-input flex justify-center space-x-4 px-8 py-6"
    >
      {children}
    </nav>
  );
};

export const ProductItem = ({ title, description, href, src }) => {
  return (
    <Link to={href} className="flex space-x-2">
  <img
    src={src}
    width={140}
    height={70}
    alt={title}
    className="flex-shrink-0 rounded-md shadow-2xl"
  />
  <div>
    <h4 className="text-xl font-bold mb-1 text-black dark:text-white">
      {title}
    </h4>
    <p className="text-neutral-700 text-sm max-w-[10rem] dark:text-neutral-300 overflow-y-auto max-h-[5rem]">
      {description}
    </p>
  </div>
</Link>

  );
};

export const HoveredLink = ({  href, children, ...rest }) => {
  return (
    <Link
      {...rest}
      to={href}
      className="block max-w-sm p-4 border border-gray-300 dark:border-neutral-700 rounded-lg shadow-md hover:shadow-lg hover:border-gray-500 transition-all duration-200 ease-in-out bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 text-center hover:text-black"
    >
      {children}
    </Link>
  );
};

export const CartItem = ({ id }) => {
  const dispatch = useDispatch();

  // Fetch the current item from Redux
  const item = useSelector((state) =>
    state.cart.cartItems.find((product) => product.id === id)
    
  );
  // console.log(item);
  // If item is not found (e.g., removed), return null
  if (!item) {
    return null;
  }

  const { name, price, href, image , quantity, stock } = item;

  // Handles updating the quantity, ensuring no negative values
  const handleQuantity = (newQuantity) => {
    if (!isNaN(newQuantity)) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
      dispatch(calculateTotal())
    }
  };

  
  
  return (
    <div className="">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }} // Adjust transition as needed
        className="flex items-start space-x-3 p-3 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 shadow-md"
      >
        {/* Product Link */}
        <Link to={href} className="flex space-x-3 flex-grow min-w-0">
          <img
            src ={image}
            width={80}
            height={80}
            alt={name}
            className="flex-shrink-0 rounded-md shadow-md object-cover w-20 h-20"
          />
          <div className="flex-grow min-w-0">
            <h4 className="text-base font-bold mb-1 text-black dark:text-white truncate">
              {name}
            </h4>
            <p className="text-neutral-700 text-sm dark:text-neutral-300 line-clamp-2 break-words">
              ${price} <br/>
              Stocks: {stock}
            </p>
          </div>
        </Link>

        {/* Quantity Controls */}
        <div className="flex flex-col items-end space-y-2 flex-shrink-0">
          <div className="flex items-center space-x-1">
            {/* Decrease Quantity */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if(quantity===1)
                {
                  handleQuantity(0)
                }
                else{
                  handleQuantity(quantity - 1)
                }
                
               }}
              className="w-7 h-7 flex items-center justify-center text-base font-medium rounded-md 
                         bg-gray-300 dark:bg-neutral-700 hover:bg-gray-400 dark:hover:bg-neutral-600
                         text-black dark:text-white border border-gray-300 dark:border-neutral-600"
              
              aria-label="Decrease quantity"
            >
              <AiOutlineArrowLeft />
            </motion.button>

            {/* Quantity Input */}
            <input
              type="number"
             
              value={quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (!isNaN(value)) {
                  handleQuantity(value);
                }
              }}
              className="w-10 text-center rounded-md border border-gray-300 dark:border-neutral-700 
                         px-1 py-0.5 bg-white dark:bg-neutral-800 text-black dark:text-white text-sm"
            />

            {/* Increase Quantity */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuantity(quantity + 1)}
              className="w-7 h-7 flex items-center justify-center text-base font-medium rounded-md 
                         bg-gray-300 dark:bg-neutral-700 hover:bg-gray-400 dark:hover:bg-neutral-600
                         text-black dark:text-white border border-gray-300 dark:border-neutral-600"
              aria-label="Increase quantity"
            >
              <AiOutlineArrowRight />
            </motion.button>
          </div>

          {/* Remove Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              console.log(id)
              handleQuantity(0)}} // Removes the item by setting quantity to 0
            className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
          >
            <AiOutlineWarning className="inline-block mr-1" /> Remove
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export const CheckoutSummary = () => {
  const dispatch = useDispatch(); 

  const total = useSelector((state) => state.cart.total);
  
  return (
    <div className="p-4 border-2 border-dashed border-black mt-4 bg-white">
      <div className="space-y-4">
        {/* Price Summary */}
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Sub-Total <AiOutlineArrowRight className="inline-block mr-1"/> </span>
          <span className="text-xl font-bold">$ {total}</span>
        </div>
        
        {/* Checkout Button */}
        <Button
          sx={{
            width: '100%',
            backgroundColor: 'black',
            color: 'white',
            '&:hover': {
              backgroundColor: '#4b4b4b', // Darker shade of gray, similar to hover:bg-gray-800
            },
            paddingY: 2, // py-2
            paddingX: 4, // px-4
          }}
          onClick={() => console.log('Proceed to checkout')}
          component={Link} // Use React Router's Link component
          to="/user/checkout"
        >
          <AiOutlineBarcode className="inline-block mr-2" /> Proceed to checkout 
        </Button>
      </div>
    </div>
  );
};
