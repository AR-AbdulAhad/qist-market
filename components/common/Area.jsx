"use client";
import { useState, useEffect } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const Area = ({ cityName, value, onChange, disabled }) => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cityName) {
      setAreas([]);
      return;
    }

    setLoading(true);
    fetch(`${BACKEND_URL}/api/public/cities-areas`)
      .then(res => res.json())
      .then(data => {
        const cityAreas = data[cityName] || [];
        setAreas(cityAreas);
      })
      .catch(() => setAreas([]))
      .finally(() => setLoading(false));
  }, [cityName]);

  return (
    <div className="tf-select">
      <select
        name="Area"
        id="Area"
        value={value}
        onChange={onChange}
        disabled={disabled || !cityName || loading || areas.length === 0}
        required
        className="def"
      >
        <option value="" disabled>
          {loading ? "Loading areas..." : "Select Area"}
        </option>
        {areas.map(area => (
          <option key={area} value={area}>
            {area}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Area;