import React, { useState, useEffect } from 'react';
import { FaFacebook, FaWhatsapp, FaTwitter, FaInstagram, FaYoutube, FaPhone, FaEnvelope } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
function Footer() {
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/footer/public');
      if (!response.ok) throw new Error(`Failed: ${response.status}`);
      const data = await response.json();
      if (data.success && data.footer) {
        let parsed = { ...data.footer };
        if (typeof data.footer.usefulLinks === 'string') {
          try { parsed.usefulLinks = JSON.parse(data.footer.usefulLinks); }
          catch { parsed.usefulLinks = []; }
        }
        setFooterData(parsed);
      } else {
        setError(data.message || 'No footer found');
      }
    } catch (err) {
      setError('Unable to load footer.');
    } finally {
      setLoading(false);
    }
  };

  const splitLinksIntoColumns = (links) => {
    if (!links || links.length === 0) return [[], [], []];
    const perColumn = Math.ceil(links.length / 3);
    return Array.from({ length: 3 }, (_, i) =>
      links.slice(i * perColumn, (i + 1) * perColumn)
    );
  };

  if (loading) return <footer className="bg-[#0a2540] text-white py-12 text-center text-lg">Loading...</footer>;
  if (error) return <footer className="bg-[#0a2540] text-white py-12 text-center text-red-400 text-lg">{error}</footer>;

  const linkColumns = splitLinksIntoColumns(footerData.usefulLinks || []);

  return (
    <footer className="bg-gradient-to-b from-[#0a2540] to-blue-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Top Dark Bar */}
        <div className="bg-[#0a2540]/80 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
            {/* Logo + Contact */}
            <div className="text-center md:text-left">
              {footerData.logoUrl && (
                <div className="mb-4 inline-block bg-white rounded-lg px-4 py-2 shadow-lg">
                  <img src={footerData.logoUrl} alt="Logo" className="h-20 w-30 object-cover" />
                </div>
              )}
              <div className="space-y-3 mt-4">
                {footerData.phone && (
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <FaPhone className="text-blue-300 text-lg" />
                    <span className="text-base">{footerData.phone}</span>
                  </div>
                )}
                {footerData.email && (
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <FaEnvelope className="text-blue-300 text-lg" />
                    <span className="text-base">{footerData.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Team Info */}
            <div className="text-center md:text-left space-y-1 text-base">
              {footerData.chairman && <p>अध्यक्ष/प्रधान सम्पादक: <strong>{footerData.chairman}</strong></p>}
              {footerData.itEditor && <p>सूचना प्रविधि सम्पादक: <strong>{footerData.itEditor}</strong></p>}
              {footerData.legalAdvisor && <p>कानूनी सल्लाहकार: <strong>{footerData.legalAdvisor}</strong></p>}
              {footerData.advisor && <p>सल्लाहकार: <strong>{footerData.advisor}</strong></p>}
              {footerData.coEditor && <p>सह-सम्पादक: <strong>{footerData.coEditor}</strong></p>}
            </div>

            {/* Company Info */}
            <div className="text-center space-y-1 text-base">
              {footerData.companyName && <p className="font-bold">{footerData.companyName}</p>}
              {footerData.address && <p>ठेगाना: {footerData.address}</p>}
              {footerData.pressName && <p>प्रिन्ट: {footerData.pressName}</p>}
            </div>

            {/* Registration Numbers */}
            <div className="text-center md:text-right space-y-1 text-base">
              {footerData.departmentRegNo && <p>सूचना विभाग दर्ता नं.<br /><strong>{footerData.departmentRegNo}</strong></p>}
              {footerData.pressCouncilNo && <p>प्रेस काउन्सिल नेपाल सूचीकरण नं.<br /><strong>{footerData.pressCouncilNo}</strong></p>}
            </div>
          </div>
        </div>

        {/* Useful Links Section */}
        {footerData.usefulLinks && footerData.usefulLinks.length > 0 && (
          <div className="py-8 border-y border-gray-700">
            <h3 className="text-3xl font-bold text-center mb-8 text-red-500">उपयोगी लिङ्कहरू</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {linkColumns.map((column, i) => (
                <ul key={i} className="space-y-2 text-center">
                  {column.map((link, j) => (
                    <li key={j} className="text-blue-200 hover:text-white transition text-base">
                      <a href={link.url || '#'} target="_blank" rel="noopener noreferrer">
                        • {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-4">
            {/* Our Team Button - NOW NAVIGATES */}
            <button 
              onClick={() => window.location.href = '/ourteam'}
              className="bg-white text-[#0a2540] px-8 py-3 rounded-full font-bold shadow-lg hover:bg-gray-100 transition cursor-pointer text-base"
            >
              Our Team
            </button>

            {footerData.phone && (
              <div className="text-center">
                <p className="text-base text-gray-400">For advertisement contact</p>
                <p className="text-lg font-bold">{footerData.phone}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;