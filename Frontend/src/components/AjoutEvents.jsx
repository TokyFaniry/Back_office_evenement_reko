import React from 'react';
import SideBar from "./contenu/SideBar";
import Navbar from './contenu/navbar';
import { AjoutForm } from './contenu/AjoutForm';


export function AjoutEvents() {
    return(
        <div>
            <Navbar/>
            <SideBar/>
            <AjoutForm/>
        </div>
    );
}