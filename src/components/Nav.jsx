import React from 'react';

function Nav() {
  return (
    <div className="bg-gradient-to-b from-blue-900 to-blue-950">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-0">
          {/* Logo and Info Section */}
          <div className="text-center md:text-left">
            {/* Logo */}
            <div className="bg-gray-100 px-8 py-4 rounded-lg shadow-md inline-block">
              <h1 className="text-4xl font-bold">
                <span className="text-purple-600">खुलासा</span>{' '}
                <span className="text-red-500">नेपाल</span>
              </h1>
              <p className="text-sm text-gray-700 mt-1">Khulasanepal.com</p>
            </div>

            {/* Date, Time & Weather - Below the Logo */}
            <div className="mt-4 text-white">
              <p className="text-base font-medium">पुस १ बुधबार, ५:०५ अपराह्न</p>
              <p className="text-sm opacity-90">काठमाडौं: १६.७ °C</p>
              <p className="text-sm opacity-90">विदेश: १२.७ °C</p>
            </div>
          </div>

          {/* Optional: Empty div for spacing on larger screens if needed */}
          <div className="hidden md:block"></div>
        </div>
      </div>
    </div>
  );
}

export default Nav;