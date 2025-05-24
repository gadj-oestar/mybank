import './css/App.css';
import NavBar from './page/nav-bar';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OperationCard from './page/OperationCard';
import EditOperation from './page/EditOperation';


function App() {
;
  return (
    <div className="App">
        <header className="sidebar">
          <NavBar/>
        </header>
      <main>
       <div className="content">
         <h2>Welcome to myBank</h2>
         <EditOperation />
        
      
     
        </div>
       
      </main>
    </div>
  );
}

export default App;
