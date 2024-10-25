import React from "react";
import { Link } from "react-router-dom";

interface LinkButtonProps {
    to: string;
    text: string;
    buttonClassNames?: string;
    textClassNames?: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({ to, text, buttonClassNames, textClassNames }) => {
    return (
        <Link to={to}>
            <div className={`h-9 p-2 rounded-full border border-black justify-center items-center gap-2 inline-flex ${buttonClassNames}`}>
                <div className={`text-black font-body leading-tight tracking-tight ${textClassNames}`}>{text}</div>
            </div>
        </Link>
    );
}

export default LinkButton;