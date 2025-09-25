'use client';
import { useState, useEffect } from 'react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Hero() {
    const [about, setAbout] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${BACKEND_URL}/api/abouts/active`);
        const data = await res.json(); 
        setAbout(data);
      } catch (error) {
        console.error('Error fetching About:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAbout();
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
      ) : about? (
        <div dangerouslySetInnerHTML={{ __html: about.content }} />
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-lg text-gray-600">No About Content Available</p>
        </div>
      )}
      </div>
    </section>
  );
}
