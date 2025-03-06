import React from 'react';
import SideBar from "./contenu/SideBar";
import Navbar from './contenu/navbar';
import  ContenuAccueil  from './contenu/ContenuAccueil';

export function Home() {
    return(
        <div>
            <Navbar/>
            <SideBar/>
            <ContenuAccueil/>
        </div>
    );
}