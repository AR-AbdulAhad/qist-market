'use client';
import { useState, useEffect } from 'react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function DeliveryPolicy() {
  const [deliveryPolicy, setDeliveryPolicy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDeliveryPolicy = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${BACKEND_URL}/api/delivery-policy/active`);
        const data = await res.json();
        setDeliveryPolicy(data);
      } catch (error) {
        console.error('Error fetching Delivery Policy:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDeliveryPolicy();
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
        ) : deliveryPolicy ? (
          <div dangerouslySetInnerHTML={{ __html: deliveryPolicy.content }} />
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-lg text-gray-600">No Delivery Policy Content Available</p>
          </div>
        )}
      </div>
    </section>
  );
}