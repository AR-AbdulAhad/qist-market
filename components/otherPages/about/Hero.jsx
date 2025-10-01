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
    <section className="py-5">
      <div className="container">
        <h1 className="display-4 text-center mb-5 fw-medium"><strong>About Us</strong></h1>
        {isLoading ? (
          <div className="w-100 d-flex justify-content-center align-items-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
      ) : about? (
        <div dangerouslySetInnerHTML={{ __html: about.content }} />
      ) : (
        <div className="d-flex flex-col align-items-center justify-content-center py-12">
          <p>No About Content Available</p>
        </div>
      )}
      </div>
    </section>
  );
}
