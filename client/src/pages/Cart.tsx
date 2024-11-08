import React from "react";
import Divider from "../components/Divider";
import InputBox from "../components/InputBox";

export default function Cart() {
    return (
        <div className="flex flex-col pr-10 items-end justify-center h-screen bg-primary">
          
            <div className="px-8 py-8 pb-40 mt-20 bg-white drop-shadow-cartoon rounded-lg border border-black">

              <div className="text-4xl font-display">Order Summary</div>
              <Divider />
              <div className="p-4 mt-9 font-display border-t border-b border-black">Total:</div>
              
              <div className="text-2xl font-display mt-3 ml-9">Do you have a code?</div>
              <InputBox />

              <div className="flex justify-center">
              <button className="px-10 py-5 bg-sky-400 text-white rounded-lg absolute bottom-5">Checkout</button>
              </div>

            </div>
       </div>

    );
}

