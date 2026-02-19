import { useState, useEffect } from "react";
import { api, setOpenPopupCallback } from "../axios/axiosClient";
import { globalNavigate } from "../App";

export const SessionPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setOpenPopupCallback(() => setIsOpen(true));
  }, []);

  if (!isOpen) return null;

  const handleContinue = async () => {
    try {
      const res = await api.post("/token/refresh");
      const accessToken = res.data.data.accessToken;

      if (accessToken) {
        localStorage.setItem("token", accessToken);
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      } else {
        localStorage.removeItem("token");
        delete api.defaults.headers.common.Authorization;
      }
      setIsOpen(false);
    } catch {
      handleLogout();
    }
  };

  const handleLogout = () => {
    setIsOpen(false);
    globalNavigate("/");
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60">
      <div className="bg-white p-8 rounded-lg shadow-2xl">
        <p className="text-lg font-semibold">Your session has expired.</p>
        <div className="mt-4 flex gap-4">
          <button
            onClick={handleContinue}
            className="px-2 py-2 bg-blue-500 text-white rounded"
          >
            Continue
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
