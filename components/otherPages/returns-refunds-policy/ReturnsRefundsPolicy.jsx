'use client';
import { useState, useEffect } from 'react';
import "@/public/css/quill-out.css"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function ReturnsRefundsPolicy() {
  const [returnsRefundsPolicy, setReturnsRefundsPolicy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReturnsRefundsPolicy = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${BACKEND_URL}/api/returns-refunds-policy/active`);
        const data = await res.json();
        setReturnsRefundsPolicy(data);
      } catch (error) {
        console.error('Error fetching Returns and Refunds Policy:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReturnsRefundsPolicy();
  }, []);

  return (
    <section className="tf-sp-2">
      <div className="container">
        <h1 className="display-4 text-center mb-5 fw-medium"><strong>Refund and Returns Policy</strong></h1>
        {isLoading ? (
          <div className="w-100 d-flex justify-content-center align-items-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : returnsRefundsPolicy? (
          <div className="body-text-33" dangerouslySetInnerHTML={{ __html: returnsRefundsPolicy.content }} />
        ) : (
          <div className="d-flex flex-col align-items-center justify-content-center py-12">
            <p>No Returns and Refunds Policy Content Available</p>
          </div>
        )}
      </div>
    </section>
  );
}