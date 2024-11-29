import React from "react";
import { ChangeEvent } from "react";

interface InputBoxProps {
  placeholder: string;
  onChange: (value: string) => void;
}

const InputBox: React.FC<InputBoxProps> = ({placeholder = "Enter here", onChange }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
};


  return (
    <div>
        <input className="border border-black rounded-lg mt-8 px-4 py-2"
          placeholder={placeholder}
          onChange={handleChange}
        />
        <button className="px-4 py-2 ml-5 bg-sky-400 text-white rounded-lg">Apply</button>
    </div>
  ); 
}

export default InputBox;