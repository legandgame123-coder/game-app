import { useEffect, useState } from "react";
import { getAdminAccessPages } from "../../services/adminAccessPages";
import { Menu, X } from "lucide-react";

const AdminTabs = ({ selected, onSelect }) => {
  const [methods, setAccessPages] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchAccess = async () => {
      try {
        const pages = await getAdminAccessPages();
        setAccessPages(pages);
      } catch (error) {
        // Optional: handle error
      }
    };

    fetchAccess();
  }, []);

  return (
    <div className="w-full">
      {/* Mobile Menu Icon */}
      <div className="flex items-center justify-between px-4 py-2 md:hidden border-b border-zinc-700">
        <h2 className="text-white font-semibold">Admin</h2>
        <button onClick={() => setIsMenuOpen(true)} className="text-white">
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-br from-gray-900 via-gray-800 to-black transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700">
          <h2 className="text-white font-semibold">Menu</h2>
          <button onClick={() => setIsMenuOpen(false)} className="text-white">
            <X size={24} />
          </button>
        </div>
        <nav className="flex flex-col px-4 py-2 space-y-2">
          {methods.map((method, index) => (
            <button
              key={`${method}-${index}`}
              onClick={() => {
                onSelect(method);
                setIsMenuOpen(false); // Close menu on selection
              }}
              className={`text-left py-2 px-2 rounded font-semibold transition ${
                selected === method
                  ? "bg-white text-black"
                  : "text-zinc-300 hover:bg-zinc-700 hover:text-white"
              }`}
            >
              {method}
            </button>
          ))}
        </nav>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden md:flex space-x-4 border-b border-zinc-700 min-w-max px-4 py-2 overflow-x-auto">
        {methods.map((method, index) => (
          <button
            key={`${method}-${index}`}
            onClick={() => onSelect(method)}
            className={`whitespace-nowrap py-2 px-4 font-semibold transition ${
              selected === method
                ? "border-b-2 border-white text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {method}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminTabs;
