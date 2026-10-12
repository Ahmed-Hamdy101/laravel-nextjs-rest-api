import React from "react";
import {LucideIcon} from "lucide-react";

export interface ToggleCloseProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface OptionProps{
    Icon :LucideIcon;
    title: string;
    selected: string;
    setSelected:React.Dispatch<React.SetStateAction<string>>;
    open:boolean;
    notifs?:number
}

// types file
export interface ContentProps {
    isDark: boolean;
    setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
}