
import { Button } from "@/components/ui/button";
import { Building2, Menu, User } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-semibold text-gray-900">Emergency Planning MVP</span>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link to="/facilities" className="text-gray-600 hover:text-gray-900 transition-colors">
                Facilities
              </Link>
              <Link to="/emergency-setup" className="text-gray-600 hover:text-gray-900 transition-colors">
                Emergency Setup
              </Link>
              <Link to="/training" className="text-gray-600 hover:text-gray-900 transition-colors">
                Training
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button className="md:hidden" variant="ghost" size="sm">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
