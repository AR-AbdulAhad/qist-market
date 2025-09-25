'use client';
import { useState, useEffect } from 'react';

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
        {isLoading ? (
          <div className="w-100 d-flex justify-content-center align-items-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : returnsRefundsPolicy ? (
          <div dangerouslySetInnerHTML={{ __html: returnsRefundsPolicy.content }} />
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-lg text-gray-600">No Returns and Refunds Policy Content Available</p>
          </div>
        )}
      </div>
    </section>
  );
}