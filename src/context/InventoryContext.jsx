import React, { createContext, useState } from "react";

export const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVinyls = async () => {
    try {
      const res = await fetch('/api/vinyls');
      if (!res.ok) throw new Error('Failed to fetch vinyls');
      const data = await res.json();

      // Map DB fields to what frontend expects
      const formattedData = data.map(v => ({
        album: v.title || "Untitled",
        sku: v.sku || (v.id ? v.id.slice(0, 8) : "VH-XXXXX"),
        artist: v.artist || "Unknown Artist",
        genre: v.description || "Unknown",
        stock: {
          value: parseInt(v.stock) || 0,
          status: parseInt(v.stock) < 10 ? "low" : "ok"
        },
        price: v.price ? `$${parseFloat(v.price).toFixed(2)}` : "$0.00",
        img: v.cover_image_url || "https://images.unsplash.com/photo-1603048588665-791ca8aea617?fit=crop&q=80&w=200&h=200"
      }));

      setInventory(formattedData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchVinyls();
  }, []);

  const addVinyl = (newVinyl) => {
    setInventory((prev) => [newVinyl, ...prev]);
  };

  const deleteVinyl = async (sku) => {
    try {
      const res = await fetch(`/api/vinyls/${sku}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Failed to delete vinyl");

      setInventory((prev) => prev.filter((v) => v.sku !== sku));
    } catch (err) {
      console.error(err);
      alert("Error deleting vinyl");
    }
  };

  const updateVinyl = async (sku, updatedVinyl) => {
    try {
      const res = await fetch(`/api/vinyls/${sku}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedVinyl)
      });
      if (!res.ok) throw new Error("Failed to update vinyl");

      // Refetch everything to keep things simple and ensure DB sync
      fetchVinyls();
    } catch (err) {
      console.error(err);
      alert("Error updating vinyl");
    }
  };

  return (
    <InventoryContext.Provider value={{ inventory, addVinyl, fetchVinyls, deleteVinyl, updateVinyl }}>
      {children}
    </InventoryContext.Provider>
  );
};
