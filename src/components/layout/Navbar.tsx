import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ProfilePopover from "./ProfilePopover";
import { NotificationsPopover } from "@/components/notifications/NotificationsPopover";

const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-clubhub-blue py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <div className="bg-white p-2 rounded">
              <span className="text-clubhub-blue font-bold text-xl">IIITA</span>
            </div>
            <span className="text-white font-bold text-2xl ml-2">ClubHub</span>
          </Link>
        </div>
        
        <div className="hidden md:flex space-x-8">
          <Link to="/" className="text-white hover:text-gray-200">Home</Link>
          {user && user.user_metadata?.role === "student" && (
            <Link to="/dashboard" className="text-white hover:text-gray-200">Dashboard</Link>
          )}
          {user && user.user_metadata?.role === "organizer" && (
            <Link to="/organizer-dashboard" className="text-white hover:text-gray-200">Organizer Dashboard</Link>
          )}
          {user && (
            <>
              <Link to="/clubs" className="text-white hover:text-gray-200">Clubs</Link>
              <Link to="/events" className="text-white hover:text-gray-200">Events</Link>
            </>
          )}
          <Link to="/about" className="text-white hover:text-gray-200">About</Link>
        </div>
        
        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <NotificationsPopover />
              <Button 
                variant="outline" 
                className="text-clubhub-blue border-white hover:bg-white hover:text-clubhub-blue"
                onClick={() => signOut()}
              >
                Log out
              </Button>
              <ProfilePopover user={user} />
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="text-clubhub-blue border-white hover:bg-white hover:text-clubhub-blue">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-white text-clubhub-blue hover:bg-gray-100">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;