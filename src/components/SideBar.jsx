import React, { useState, useEffect } from 'react';

const Sidebar = ({ onSelectTab, selectedTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Detect screen size changes
  useEffect(() => {
    // Set initial state based on screen size
    setIsCollapsed(window.innerWidth < 1024);
    
    const handleResize = () => {
      // Close mobile menu on resize
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleTabClick = (tab) => {
    onSelectTab(tab);
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
  };

  const menuItems = [
    {
      name: 'Organizations',
      id: 'organizations',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7V4a2 2 0 012-2h14a2 2 0 012 2v3M4 7h16M4 17h16M4 13h16M5 7V4a2 2 0 011-1.732A2 2 0 016 3h12a2 2 0 011.732.268A2 2 0 0117 4v3M4 17v3a2 2 0 002 2h12a2 2 0 002-2v-3"
          />
        </svg>
      )
    },
    {
      name: 'Meetings',
      id: 'meetings',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 10l-7 5-7-5V4a2 2 0 012-2h12a2 2 0 012 2v6z"
          />
        </svg>
      )
    },
    {
      name: 'Tasks',
      id: 'tasks',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 4H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM5 6h14M5 10h14M5 14h14"
          />
        </svg>
      )
    }
  ];

  // Desktop sidebar (medium screens and up)
  const desktopSidebar = (
    <div
      className={`hidden md:block h-screen bg-black text-white fixed top-20 left-0 transition-all duration-300 z-20 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex justify-end p-2">
        <button
          onClick={toggleCollapse}
          className="text-white p-1 rounded hover:bg-gray-800"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          )}
        </button>
      </div>

      <div className="flex flex-col py-6">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`flex items-center p-2 py-4 mx-2 rounded-lg hover:opacity-75 hover:bg-gray-800 hover:cursor-pointer transition-all ${
              selectedTab === item.id ? 'bg-white text-black' : ''
            }`}
            onClick={() => handleTabClick(item.id)}
          >
            <div className="flex items-center justify-center">
              {item.icon}
            </div>
            {!isCollapsed && <span className="ml-2">{item.name}</span>}
          </div>
        ))}
      </div>
    </div>
  );

  // Mobile menu button and dropdown
  const mobileMenu = (
    <div className="md:hidden">
      <button
        onClick={toggleMobileMenu}
        className="fixed top-24 left-4 bg-black text-white p-2 rounded-md z-50"
        aria-label="Toggle mobile menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleMobileMenu}>
          <div 
            className="w-64 h-screen bg-black text-white pt-16 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col py-4">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center p-2 py-4 mx-2 rounded-lg hover:opacity-75 hover:bg-gray-800 hover:cursor-pointer ${
                    selectedTab === item.id ? 'bg-white text-black' : ''
                  }`}
                  onClick={() => handleTabClick(item.id)}
                >
                  <div className="flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="ml-2">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {desktopSidebar}
      {mobileMenu}
    </>
  );
};

export default Sidebar;