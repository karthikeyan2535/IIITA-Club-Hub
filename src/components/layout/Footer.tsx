
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-clubhub-blue text-white py-8 mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">IIITA ClubHub</h3>
            <p className="text-sm text-gray-300">
              Connecting students with clubs and activities at IIITA.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link to="/clubs" className="text-gray-300 hover:text-white">Clubs</Link></li>
              <li><Link to="/events" className="text-gray-300 hover:text-white">Events</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white">About</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/clubs?category=technical" className="text-gray-300 hover:text-white">Technical</Link></li>
              <li><Link to="/clubs?category=cultural" className="text-gray-300 hover:text-white">Cultural</Link></li>
              <li><Link to="/clubs?category=sports" className="text-gray-300 hover:text-white">Sports</Link></li>
              <li><Link to="/clubs?category=academic" className="text-gray-300 hover:text-white">Academic</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <address className="text-sm text-gray-300 not-italic">
              Indian Institute of Information Technology Allahabad<br />
              Devghat, Jhalwa, Prayagraj<br />
              Uttar Pradesh, India 211015
            </address>
            <div className="mt-4 text-sm text-gray-300">
              <p>Email: clubhub@iiita.ac.in</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} IIITA ClubHub. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm text-gray-400 hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-gray-400 hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
