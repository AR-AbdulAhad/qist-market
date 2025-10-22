// components/otherPages/about/Hero.jsx
'use client';
import { useState, useEffect } from 'react';

export default function DynamicPagesComp({ page }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <section className="py-5">
      <div className="container">
        <h1 className="display-4 text-center mb-5 fw-medium">
          <strong>{page?.title || 'Page'}</strong>
        </h1>
        {isLoading ? (
          <div className="w-100 d-flex justify-content-center align-items-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : page ? (
          <div
            className="body-text-33"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        ) : (
          <div className="d-flex flex-col align-items-center justify-content-center py-12">
            <p>No Content Available</p>
          </div>
        )}
      </div>
    </section>
  );
}