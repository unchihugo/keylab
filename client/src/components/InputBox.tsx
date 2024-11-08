import React from "react";

export default function InputBox() {
  return (
    <div>
        <input
          type="text"
          className="border border-black rounded-lg mt-8 px-4 py-2"
          placeholder="Enter here"
        />
        <button className="px-4 py-2 ml-5 bg-sky-400 text-white rounded-lg">Apply</button>
    </div>
  );
}
