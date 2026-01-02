import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

function MiniNav() {
  const menuItems = [
    { name: 'मुहार', path: '/' },
    { name: 'समाचार', path: '/news' },
    { name: 'समाज', path: '/society' },
    { name: 'स्थानीय', path: '/local' },
    { name: 'खेलखबर', path: '/sports' },
    { name: 'विविध', path: '/more' },
  ];

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sticky top-0 z-[100] bg-blue-950 border-t border-blue-800 shadow-md ">
      <div className="max-w-4xl mx-auto px-4 ">
        {/* Desktop view only (large screens) */}
        <nav className="hidden lg:flex py-6">
          <ul className="
            flex flex-row 
            justify-center 
            items-center 
            gap-20 
            text-2xl 
            font-bold 
            text-white
          ">
            {menuItems.map((item, index) => (
              <li key={index} className="text-center">
                <a
                  href={item.path}
                  className="
                    block 
                    py-2 
                    hover:text-orange-300 
                    transition-colors 
                    duration-300 
                    tracking-wide
                  "
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Hamburger Menu (Mobile + Tablet) */}
        <div className="lg:hidden relative">
          {/* Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-4 text-white focus:outline-none w-full flex justify-end"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X size={32} />
            ) : (
              <Menu size={32} />
            )}
          </button>

          {/* Mobile/Tablet Menu Dropdown */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 bg-blue-950 border-t border-blue-800 z-50 shadow-lg">
              <ul className="flex flex-col items-center py-6 space-y-6 text-lg font-bold text-white">
                {menuItems.map((item, index) => (
                  <li key={index} className="w-full text-center">
                    <a
                      href={item.path}
                      onClick={() => setIsOpen(false)}
                      className="
                        block 
                        py-3 
                        hover:text-orange-300 
                        transition-colors 
                        duration-300 
                        tracking-wide
                      "
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MiniNav;