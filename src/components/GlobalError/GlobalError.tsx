import { useEffect, useState } from "react";

export function GlobalError() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleError = (event: CustomEvent<string>) => {
      setError(event.detail);
      setTimeout(() => setError(null), 5000);
    };

    window.addEventListener("api-error" as any, handleError);

    return () => {
      window.removeEventListener("api-error" as any, handleError);
    };
  }, []);

  if (!error) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        backgroundColor: "#ff4444",
        color: "white",
        padding: "12px 20px",
        borderRadius: 8,
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        zIndex: 10000,
        maxWidth: 400,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
      }}
    >
      <span>{error}</span>
      <button
        onClick={() => setError(null)}
        style={{
          background: "transparent",
          border: "none",
          color: "white",
          cursor: "pointer",
          fontSize: 20,
          padding: 0,
          width: 24,
          height: 24,
        }}
      >
      </button>
    </div>
  );
}

export function showGlobalError(message: string) {
  const event = new CustomEvent("api-error", { detail: message });
  window.dispatchEvent(event);
}

