import React, { useEffect, useState, useContext } from "react";
import { StoreContext } from "../../context/StoreContext.jsx";
import { registerRefreshLogger } from "../../api/api.interceptors.js";

function TokenLifecyclePanel() {
  const { accessToken, user } = useContext(StoreContext);

  const [atExpiry, setATExpiry] = useState(null);
  const [rtExpiry, setRTExpiry] = useState(null);

  const [atCountdown, setATCountdown] = useState(0);
  const [rtCountdown, setRTCountdown] = useState(0);

  const [refreshHistory, setRefreshHistory] = useState([]);

  // --------------------------
  // Decode JWT Expiry
  // --------------------------

  function decodeExpiry(token) {
    try {
      const parts = token.split(".");
      const payload = JSON.parse(atob(parts[1]));
      return payload.exp * 1000;
    } catch {
      return null;
    }
  }

  // --------------------------
  // Update Expiry When Tokens Change
  // --------------------------
  useEffect(() => {
    if (!accessToken) {
      // Reset panel on logout
      setATExpiry(null);
      setRTExpiry(null);
      setATCountdown(0);
      setRTCountdown(0);
      return;
    }

    const atExp = decodeExpiry(accessToken);
    setATExpiry(atExp);

    const rt = localStorage.getItem("refreshToken");
    const rtExp = decodeExpiry(rt);
    setRTExpiry(rtExp);
  }, [accessToken]);

  // --------------------------
  // Countdown Timer
  // --------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      if (atExpiry) {
        const diff = Math.max(0, Math.floor((atExpiry - Date.now()) / 1000));
        setATCountdown(diff);
      }

      if (rtExpiry) {
        const diff = Math.max(0, Math.floor((rtExpiry - Date.now()) / 1000));
        setRTCountdown(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [atExpiry, rtExpiry]);

  // --------------------------
  // Logger for refresh events
  // --------------------------
  function logRefresh(result) {
    setRefreshHistory((prev) => [
      { time: new Date().toLocaleTimeString(), result },
      ...prev,
    ]);
  }

  useEffect(() => {
    registerRefreshLogger(logRefresh);

    return () => {
      // unregister on unmount → prevents stale updates
      registerRefreshLogger(() => {});
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 bg-black text-white p-4 rounded-xl shadow-xl text-xs w-[280px] opacity-90 z-50">
      <h3 className="font-bold text-lg mb-2">Token Debug Panel</h3>

      <div className="space-y-2">
        <p>
          <strong>User:</strong> {user?.name || "Not Logged In"}
        </p>
        <p>
          <strong>Access Token Expires:</strong> {atCountdown}s
        </p>
        <p>
          <strong>Refresh Token Expires:</strong> {rtCountdown}s
        </p>

        <p>
          <strong>AT Expires At:</strong>{" "}
          {atExpiry ? new Date(atExpiry).toLocaleString() : "—"}
        </p>

        <p>
          <strong>RT Expires At:</strong>{" "}
          {rtExpiry ? new Date(rtExpiry).toLocaleString() : "—"}
        </p>
      </div>

      <hr className="my-3 border-gray-600" />

      <div>
        <strong>Refresh Logs:</strong>
        <ul className="mt-1 max-h-24 overflow-y-auto text-yellow-300">
          {refreshHistory.map((entry, i) => (
            <li key={i}>
              {entry.time} — {entry.result}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export { TokenLifecyclePanel };
