"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function TopCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // for mobile swipe
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/top/categories`);
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // custom swipe handlers
  const startDrag = (e) => {
    setIsDragging(true);
    setStartX(e.pageX || e.touches[0].pageX);
    setScrollLeft(sliderRef.current.scrollLeft);
  };
  const onDrag = (e) => {
    if (!isDragging) return;
    const x = e.pageX || e.touches[0].pageX;
    const walk = (x - startX) * 1; // speed factor
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };
  const stopDrag = () => setIsDragging(false);

  if (loading) return <p className="text-center py-5"></p>;
  if (categories.length === 0) return null;

  return (
    <section className="pt-5">
      <div className="container">
        <h5 className="fw-semibold mb-4">Top Categories</h5>

        {/* Desktop Grid */}
        <div className="d-none d-lg-block py-4">
          <div className="custom-grid">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/category/${cat.slugName}`}>
                <div className="cat-card">
                  <div
                    dangerouslySetInnerHTML={{ __html: cat.icon }}
                    className="icon"
                  />
                  <p>{cat.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile/Tablet slider */}
        <div
          className="d-lg-none cat-slider p-4"
          ref={sliderRef}
          onMouseDown={startDrag}
          onMouseMove={onDrag}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          onTouchStart={startDrag}
          onTouchMove={onDrag}
          onTouchEnd={stopDrag}
        >
          {categories.map((cat) => (
            <Link key={cat.id} href={`/category/${cat.slugName}`}>
              <div className="cat-card">
                <div
                  dangerouslySetInnerHTML={{ __html: cat.icon }}
                  className="icon"
                />
                <p>{cat.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <style jsx>{`
        .custom-grid {
          display: grid;
          grid-template-columns: repeat(9, 1fr);
          gap: 1rem;
          justify-items: center;
        }
        .cat-slider {
          display: flex;
          gap: 0.75rem;
          overflow-x: auto;
          scroll-behavior: smooth;
          padding-bottom: 0.5rem;
        }
        .cat-slider::-webkit-scrollbar {
          display: none;
        }
        .cat-card {
          width: clamp(70px, 18vw, 110px);
          aspect-ratio: 1/1;
          background: #fff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .cat-card:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }
        .cat-card .icon {
          width: 24px;
          height: 24px;
          margin-bottom: 0.5rem;
          flex-shrink: 0;
        }
        .cat-card p {
          font-size: 12px;
          text-align: center;
          color: #555;
          margin: 0;
          word-break: break-word;
        }
        @media (max-width: 991px) {
          .custom-grid {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
