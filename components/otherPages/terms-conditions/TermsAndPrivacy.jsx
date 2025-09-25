'use client';
import { useState, useEffect } from 'react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function TermsAndPrivacy() {
  const [termsAndPrivacy, setTermsAndPrivacy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTermsAndPrivacy = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${BACKEND_URL}/api/terms-and-privacy/active`);
        const data = await res.json();
        setTermsAndPrivacy(data);
      } catch (error) {
        console.error('Error fetching Terms and Privacy:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTermsAndPrivacy();
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
        ) : termsAndPrivacy ? (
          <div dangerouslySetInnerHTML={{ __html: termsAndPrivacy.content }} />
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-lg text-gray-600">No Terms and Privacy Content Available</p>
          </div>
        )}
      </div>
    </section>
  );
}