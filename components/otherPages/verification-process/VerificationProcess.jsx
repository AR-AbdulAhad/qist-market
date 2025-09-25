'use client';
import { useState, useEffect } from 'react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function VerificationProcess() {
  const [verificationProcess, setVerificationProcess] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVerificationProcess = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${BACKEND_URL}/api/verification-process/active`);
        const data = await res.json();
        setVerificationProcess(data);
      } catch (error) {
        console.error('Error fetching Verification Process:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVerificationProcess();
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
        ) : verificationProcess ? (
          <div dangerouslySetInnerHTML={{ __html: verificationProcess.content }} />
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-lg text-gray-600">No Verification Process Content Available</p>
          </div>
        )}
      </div>
    </section>
  );
}