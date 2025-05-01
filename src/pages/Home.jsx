import React, { useState } from "react";
import Sidebar from "../components/SideBar";
import Tasks from "../components/Tasks";
import Meetings from "../components/Meetings";
import Organizations from "../components/Organizations";

const Home = () => {
  const [selectedTab, setSelectedTab] = useState('organizations');

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="h-20"></div>
      
      <div className="flex flex-grow relative">
        <Sidebar onSelectTab={setSelectedTab} selectedTab={selectedTab} />
        
        <div className="w-full md:ml-16 lg:ml-64 px-4 md:px-8 transition-all duration-300"> 
          {selectedTab === "organizations" && <Organizations />}
          {selectedTab === "tasks" && <Tasks />}
          {selectedTab === "meetings" && <Meetings />}
        </div>
      </div>
    </div>
  );
};

export default Home;