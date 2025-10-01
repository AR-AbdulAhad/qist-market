"use client";
import React, { useState, useEffect } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Agreement() {
  const [agreementData, setAgreementData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgreementData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/agreement`);
        if (!response.ok) {
          throw new Error("Failed to fetch agreement data");
        }
        const data = await response.json();
        setAgreementData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAgreementData();
  }, []);

  if (loading) {
    return (
      <section className="py-5">
        <div className="container">
        <h1 className="display-4 text-center mb-5 fw-medium"><strong>Agreement</strong></h1>
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
        <div className="container mx-auto px-4">
          <h1 className="display-4 text-center mb-5 font-medium">
            <strong>Agreement</strong>
          </h1>
          <p className="text-center text-red-500">Error: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-5">
      <div className="container mx-auto px-4">
        <h1 className="display-4 text-center mb-5 fw-medium">
          <strong>Agreement</strong>
        </h1>
        <div className="flex flex-col space-y-4 gap-4">
        {agreementData?.images?
          <>
            {agreementData?.images?.map((image) => (
                <div key={image.id} className="w-full max-w-md d-flex align-items-center justify-content-center">
                <img
                    src={image.image_url}
                    alt={`Agreement image ${image.id}`}
                    className="w-full h-auto rounded-lg shadow-md object-cover"
                />
                </div>
            ))}
          </>
          :
          <div className="d-flex flex-col align-items-center justify-content-center py-12">
            <p>No Agreement Content Available</p>
          </div>
        }
        </div>
      </div>
    </section>
  );
}