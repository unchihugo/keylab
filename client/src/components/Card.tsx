import React from "react";

interface CardProps {
  title: string;
  value: string | number;
}

const CardComponent: React.FC<CardProps> = ({ title, value }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl">{value}</p>
    </div>
  );
};

export default CardComponent;