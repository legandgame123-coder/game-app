import { useEffect, useState } from "react";
import { getAdminAccessPages } from "../../services/adminAccessPages";

const AdminTabs = ({ selected, onSelect }) => {
  const [methods, setAccessPages] = useState([]);

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
    <div className="w-full overflow-x-auto">
      <div className="flex space-x-4 border-b border-zinc-700 min-w-max px-4 py-2">
        {methods.map((method, index) => (
          <button
            key={`${method}-${index}`} // Make keys unique since "Games" & "Withdrawals" are repeated
            onClick={() => onSelect(method)}
            className={`whitespace-nowrap py-2 px-4 font-semibold transition ${selected === method
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
