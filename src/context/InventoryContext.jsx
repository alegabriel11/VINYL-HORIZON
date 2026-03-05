import React, { createContext, useState } from "react";

export const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [inventory, setInventory] = useState([
    {
      album: "Midnight Melodies",
      sku: "VH-99218",
      artist: "Elias Thorne",
      genre: "Jazz",
      stock: { value: 42, status: "ok" },
      price: "$34.00",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBSyEMMxDoRgYQsbR7BIv3WfS8cf2my-hk35n6-YI44kOY1Z9tU5pnNkmgmCKlW3OZ1g4rNrvLQ5f4pa1tSNwmNtkcvA8Nra19pVtNQ4bmJ4CEQuTMYWYQaNN5WVJHCatuOVdoLyZi7kMbzRxFOoPR0-ujn1d5DJo0-wxgWmW3D11XwVs0PFBEoLlFnvIyE8nfHDq4iT7ZDKj3J_YTNZxa6SxEl6mTQ5x_dptO97V6U67IkBudue5mxp5iGK38cFwtBN6UKiTjBs7bs",
    },
    {
      album: "Urban Echoes",
      sku: "VH-10293",
      artist: "Sarah Key",
      genre: "Rock",
      stock: { value: 3, status: "low" },
      price: "$28.50",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9ck-EJUxjNrF3VRbOCTm5aWlwihjIJiM0NezxunGc_x1WKnOaf9bjtjypUbZf2B9b9Ze2f4jVO58IolBX2r0IeyxuHLiZCecO30A2Fh__hZ3HBfee_3BYZywAsTriBEoQtrAroIRfFWt1W8cxBc2CiMj0XSE6YASaCNsXCWXRoS5CnuNNAYgOiZF_vhbIixNQ9v3PWLJOT4MTal3ak1d_shZzcnlVwRUkSpYEhrZvh9sjrs-sRZD6fLUK8fGje4jtnfXwRH1tPN6i",
    },
    {
      album: "Blue Jazz Nights",
      sku: "VH-44821",
      artist: "Miles Davids",
      genre: "Jazz",
      stock: { value: 18, status: "ok" },
      price: "$42.00",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqC760MfIjduczNxNbVZ1EMVnkPY8-PHc52IaOG0JptO5zHBO90Aw4zzWG8zJ8b3cw-0677vr5OfD0R-EhwDi2adXKj8MyXXsahF7hKFtsrMNx1zX4cydk7F12doMK2HdGKA-Z66lN_Zze-wHVPOoXy0U-Yl1tbzVyCUpO_SzD7otWDtFIPHRV1f3La1uoQmtMkzeL8M4b9goXMyLJRFLIMAJKwN5Rbi-7zaGRxN1-boIRHPifNwTBk1u5tQPc4zpYW_uIqFCVqYGT",
    },
    {
      album: "Neon Drift",
      sku: "VH-00912",
      artist: "Synthwave Collective",
      genre: "Electronic",
      stock: { value: 56, status: "ok" },
      price: "$25.00",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwd5f_2pO3ByFQ6jDL-pOzKP6aBFQDChVOUYsJZrGyCcGWNISaganc1lBZkTdBLkoFk0Mt4T6TeZM4BmBwxWSrXvIqPbi1Jj87dc1AijiO9aS3IaO33IOzQieuwKk8SKQwkK6HwIqrtpBh0p74IEjDBhVwZqLkudPHb6jTomQhrtnogmY-DMmhUc2NI2p5FZoNnMltJ-Q3GS-5FQ-b-IC8Lof0WGTGAkDx8DhRCX3nfAfsj7ZsrSP49WfEObNbgV3Y7SthhB08y1Yp",
    },
  ]);

  const addVinyl = (newVinyl) => {
    setInventory((prev) => [newVinyl, ...prev]);
  };

  return (
    <InventoryContext.Provider value={{ inventory, addVinyl }}>
      {children}
    </InventoryContext.Provider>
  );
};
