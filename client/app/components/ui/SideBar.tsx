import React, {useState} from "react";
import {BarChart3, DollarSign, HelpCircle, Home, Monitor, Settings, ShoppingCart, Tag, Users} from "lucide-react";
import {TitleSection} from "@/app/components/ui/TitleSection";
import {ToggleClose} from "./ToggleClose"
import {Option} from  "./Option"
export const Sidebar = () => {
    const [open, setOpen] = useState(true);
    const [selected, setSelected] = useState("Dashboard");

    return (
        <nav className={`sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out ${
            open ? 'w-64' : 'w-16'
        } border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 shadow-sm`}>
            <TitleSection open={open} />

            <div className="space-y-1 mb-8">
                <Option
                    Icon={Home}
                    title="Dashboard"
                    selected={selected}
                    setSelected={setSelected}
                    open={open}
                />
                <Option
                    Icon={DollarSign}
                    title="Sales"
                    selected={selected}
                    setSelected={setSelected}
                    open={open}
                    notifs={3}
                />
                <Option
                    Icon={Monitor}
                    title="View Site"
                    selected={selected}
                    setSelected={setSelected}
                    open={open}
                />
                <Option
                    Icon={ShoppingCart}
                    title="Products"
                    selected={selected}
                    setSelected={setSelected}
                    open={open}
                />
                <Option
                    Icon={Tag}
                    title="Tags"
                    selected={selected}
                    setSelected={setSelected}
                    open={open}
                />
                <Option
                    Icon={BarChart3}
                    title="Analytics"
                    selected={selected}
                    setSelected={setSelected}
                    open={open}
                />
                <Option
                    Icon={Users}
                    title="Members"
                    selected={selected}
                    setSelected={setSelected}
                    open={open}
                    notifs={12}
                />
            </div>

            {open && (<div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-1">
                <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Account
                </div>
                <Option
                    Icon={Settings}
                    title="Settings"
                    selected={selected}
                    setSelected={setSelected}
                    open={open}
                />
                <Option
                    Icon={HelpCircle}
                    title="Help & Support"
                    selected={selected}
                    setSelected={setSelected}
                    open={open}
                />
            </div>)}

            <ToggleClose open={open} setOpen={setOpen} />
        </nav>
    );
};