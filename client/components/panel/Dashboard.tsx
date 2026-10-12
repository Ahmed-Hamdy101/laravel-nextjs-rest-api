"use client"
import React, { useState, useEffect } from "react";
import {Sidebar} from "@/components/panel/ui/SideBar"
import {Content} from "@/components/panel/ui/Content";

export const Dashboard = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    return (
        <div className={`flex min-h-screen w-full ${isDark ? 'dark' : ''}`}>
            <div className="flex w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
                <Sidebar />
                <Content isDark={isDark} setIsDark={setIsDark} />
            </div>
        </div>
    );
};



export default Dashboard;