import React from "react";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react"

interface LinkButtonProps {
    to: string;
    text?: string;
    buttonClassNames?: string;
    textClassNames?: string;
    Icon?: LucideIcon;
    iconRight?: boolean;
}

const LinkButton: React.FC<LinkButtonProps> = ({ to, text, buttonClassNames, textClassNames, Icon, iconRight }) => {
    return (
        <Link to={to}>
            <div className={`h-9 p-2 rounded-full border border-black justify-center items-center gap-2 inline-flex ${buttonClassNames}`}>
                { Icon && !iconRight ? <Icon size={20} strokeWidth={1.75} absoluteStrokeWidth={true} /> : null }
                { text ? <div className={`text-black font-body leading-tight tracking-tight ${textClassNames}`}>{text}</div> : null }
                { Icon && iconRight ? <Icon size={20} strokeWidth={1.75} absoluteStrokeWidth={true} /> : null }
            </div>
        </Link>
    );
}

export default LinkButton;