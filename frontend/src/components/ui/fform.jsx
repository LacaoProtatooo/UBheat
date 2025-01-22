import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { stores, addCartItems, sendCheckoutData } from "../store/checkOutSlices/checkoutSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { resetCartState } from "../store/cardSlices/add2cartSlice";
const ShippingDetails = () => {
  const [address, setAddress] = useState(""); // Default to empty string
  const [payment] = useState("Cash on Delivery");
  const [status] = useState("pending");
  const [shipfee] = useState(20.0);
  const [total, setTotal] = useState(0.0);

  const tot = useSelector((state) => state.cart.total);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setTotal(tot + shipfee);
  }, [tot, shipfee]);

  const formDetails = {
    address,
    payment,
    status,
    shipfee,
    total,
  };

  const handlestoring = async () => {
    if (!address.trim()) {
      return toast.error("Please provide a valid address.");
    }

    try {
      dispatch(stores(formDetails));
      dispatch(addCartItems());

      const result = await dispatch(sendCheckoutData()).unwrap();

      if (result) {
        localStorage.removeItem("cartData");
        dispatch(resetCartState());
        navigate("/"); // Redirect to homepage after success
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error(error || "An error occurred during checkout.");
    }
  };

  return (
    <div className="bg-purple-300 flex items-center justify-center py-4">
      <div className="flex flex-col gap-4 w-full p-6">
        {/* Shipping Address */}
        <input
          type="text"
          name="address"
          placeholder="Shipping Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="border p-2"
        />

        {/* Payment Method */}
        <input
          type="text"
          name="payment"
          value={payment}
          readOnly
          className="border p-2 bg-gray-200"
        />

        {/* Shipping Price */}
        <input
          type="text"
          name="shipfee"
          value={`Shipping fee: $ ${shipfee.toFixed(2)}`}
          readOnly
          className="border p-2 bg-gray-200"
        />

        {/* Total Price */}
        <input
          type="text"
          name="total"
          value={`Overall Total: $ ${total.toFixed(2)}`}
          readOnly
          className="border p-2 bg-gray-200"
        />

        {/* Submit Button */}
        <button
          onClick={handlestoring}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
        >
          Complete Order
        </button>
      </div>
    </div>
  );
};

export default ShippingDetails;
