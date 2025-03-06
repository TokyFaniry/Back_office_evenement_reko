import React from 'react';
import SideBar from "./contenu/SideBar.jsx";
import Navbar from './contenu/navbar';

export function Home() {
    return(
        <div>
            <Navbar/>
            <SideBar/>
        </div>
    );
}