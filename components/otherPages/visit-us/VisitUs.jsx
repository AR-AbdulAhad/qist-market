"use client";
import React, { useState, useEffect } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function VisitUs() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/active-visit-us`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setBranches(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  if (loading) {
    return (
      <section className="py-5">
        <div className="container">
        <h1 className="display-4 text-center mb-5 fw-medium"><strong>Visit Us</strong></h1>
          <div className="w-100 d-flex justify-content-center align-items-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-5">
        <div className="container">
          <p className="text-center fs-5 text-danger">Error: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-5">
      <div className="container">
        <h1 className="display-4 text-center mb-5 fw-medium"><strong>Visit Us</strong></h1>
        {branches?
        <>
        {branches.map((branch) => (
          <div key={branch.id} className="mb-5">
            <h2 className="h3 text-center pb-2 mb-5 border-bottom">{branch.title}</h2>
            <div className="row row-cols-1 g-4">
              {branch.maps.map((map) => (
                <div key={map.id} className="col">
                  <div className="h-100">
                    <div className="row g-0">
                      <div className="col-md-6">
                        <div className="map-container" style={{ position: "relative", paddingBottom: "75%", height: 0, overflow: "hidden" }}>
                          <iframe
                            src={map.map_embed.match(/src="([^"]+)"/)[1]}
                            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          ></iframe>
                        </div>
                      </div>
                      <div className="col-md-6 mt-4">
                        <div className="card-body">
                          <p className="card-text">{map.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        </>
        :
        <div className="d-flex flex-col align-items-center justify-content-center py-12">
            <p>No Visit Us Content Available</p>
        </div>
        }
      </div>
    </section>
  );
}