import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-blue-950 text-white">
      {/* Top Section: Logo + Contact + Addresses */}
      <div className="bg-blue-900 py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          {/* Logo & Contact */}
          <div className="flex flex-col items-center md:items-start">
            <div className="bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg px-6 py-3 mb-4">
              <h2 className="text-2xl font-bold text-purple-900">खुलासा नेपाल</h2>
              <p className="text-red-600 text-center font-medium">Khulasanepal.com</p>
            </div>
            <div className="space-y-2 text-center md:text-left">
              <p className="flex items-center justify-center md:justify-start gap-2">
                <span>📞</span> +977-9852680900
              </p>
              <p className="flex items-center justify-center md:justify-start gap-2">
                <span>✉️</span> info@khulasanepal.com
              </p>
            </div>
          </div>

          {/* Column 2 */}
          <div className="text-center md:text-left">
            <p>अध्यक्ष/प्रधान सम्पादक: लवदेव ढुंगाना</p>
            <p>सूचना प्रविधि सम्पादक: सुमन सुवेदी</p>
            <p>कानूनी सल्लाहकार: अधिवक्ता शान्ति रिजाल</p>
            <p>सल्लाहकार: राधेश्याम पौडेल</p>
            <p>सह-सम्पादक: राधा पौडेल</p>
          </div>

          {/* Column 3 */}
          <div className="text-center md:text-left">
            <p>सम्पादक मिडिया प्रा.लि.</p>
            <p>सदनमार्ग, ग्वार्को</p>
            <p>कैलाश प्रेस नेपाल</p>
          </div>

          {/* Column 4 */}
          <div className="text-center md:text-left">
            <p>सूचना विभाग दर्ता नं.</p>
            <p>८९६/२०८/८९</p>
            <p>प्रेस काउन्सिल नेपाल सूचीकरण नं.</p>
            <p>८९६/२०८/८९</p>
          </div>
        </div>
      </div>

      {/* Middle Section: उपयोगी लिङ्कहरू */}
      <div className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-red-600 text-center mb-8">
            उपयोगी लिङ्कहरू
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            {/* Left Column */}
            <ul className="space-y-2 text-center md:text-left">
              <li>• गृह मन्त्रालय</li>
              <li>• हेलो सरकार</li>
              <li>• अधिवक्ता दुर्व्यसनी अनुसन्धान आयोग</li>
              <li>• नेपाल प्रहरी</li>
              <li>• सम्पत्ति शुद्धिकरण विभाग</li>
              <li>• राजस्व अनुसन्धान विभाग</li>
            </ul>

            {/* Center Column */}
            <ul className="space-y-2 text-center">
              <li>• राष्ट्रिय अनुसन्धान विभाग</li>
              <li>• सूचना तथा प्रसारण विभाग</li>
              <li>• प्रेस काउन्सिल नेपाल</li>
              <li>• राष्ट्रिय सूचना आयोग</li>
              <li>• सशस्त्र प्रहरी बलको वेभसाइट बागमती</li>
              <li>• नेपाल पत्रकार महासंघ</li>
            </ul>

            {/* Right Column */}
            <ul className="space-y-2 text-center md:text-right">
              <li>• लोकतान्त्रिक केन्द्र</li>
              <li>• नेपाल प्रेस इन्स्टिच्युट</li>
              <li>• सामुदायिक रेडियो प्रसारक नेपाल संघ</li>
              <li>• वान</li>
              <li>• वातावरण पत्रकार समूह</li>
              <li>• शिक्षा पत्रकार समूह</li>
              <li>• NIMJN</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section: Team + Advertisement + Social + Copyright */}
      <div className="border-t border-blue-800 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm gap-4">
          <button className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-blue-950 transition">
            Our Team
          </button>

          <div className="text-center">
            <p>For advertisement contact</p>
            <p>+977-9852680900</p>
          </div>

          <div className="flex items-center gap-6">
            <p>Follow Us</p>
            <div className="flex gap-4 text-2xl">
              <span>Facebook</span> {/* Facebook */}
              <span>x</span> {/* Twitter/X */}
              <span>WhatsApp</span> {/* WhatsApp or Messenger */}
            </div>
          </div>
        </div>

        <p className="text-center mt-6 text-xs opacity-80">
          © 2025 Khulasa Nepal. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;