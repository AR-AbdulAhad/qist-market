"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Blogs() {
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentType, setCurrentType] = useState('');
  const [hasPress, setHasPress] = useState(false);
  const [hasBlogs, setHasBlogs] = useState(false);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    async function initialize() {
      try {
        const pressResponse = await fetch(`${BACKEND_URL}/api/type-blogs?type=PRESS&countOnly=true`);
        const pressData = await pressResponse.json();
        const hasP = pressData.total > 0;

        const blogResponse = await fetch(`${BACKEND_URL}/api/type-blogs?type=BLOG&countOnly=true`);
        const blogData = await blogResponse.json();
        const hasB = blogData.total > 0;

        setHasPress(hasP);
        setHasBlogs(hasB);

        if (!hasP && !hasB) {
          setNoData(true);
          setLoading(false);
          return;
        }

        const initialType = hasP ? 'PRESS' : 'BLOG';
        setCurrentType(initialType);
      } catch (error) {
        console.error('Failed to fetch counts:', error);
        setLoading(false);
      }
    }

    initialize();
  }, []);

  useEffect(() => {
    if (currentType) {
      fetchData(currentType, 1);
    }
  }, [currentType]);

  const fetchData = async (type, page) => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/type-blogs?type=${type}&page=${page}&limit=9`);
      const data = await response.json();
      setItems(data.items || []);
      setTotalPages(data.pages || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchData(currentType, page);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageElements = [];
    pageElements.push(
      <li key="prev">
        <a
          onClick={() => handlePageChange(currentPage - 1)}
          className="link"
          style={{ cursor: currentPage > 1 ? 'pointer' : 'not-allowed' }}
          aria-disabled={currentPage === 1}
        >
          <i className="icon-arrow-left-lg" />
        </a>
      </li>
    );

    const maxVisible = 4;
    if (totalPages <= maxVisible + 1) {
      for (let p = 1; p <= totalPages; p++) {
        pageElements.push(
          <li key={p} className={p === currentPage ? 'active' : ''}>
            <a onClick={() => handlePageChange(p)} className="title-normal link" style={{ cursor: 'pointer' }}>
              {p}
            </a>
          </li>
        );
      }
    } else {
      if (currentPage <= 3) {
        for (let p = 1; p <= maxVisible; p++) {
          pageElements.push(
            <li key={p} className={p === currentPage ? 'active' : ''}>
              <a onClick={() => handlePageChange(p)} className="title-normal link" style={{ cursor: 'pointer' }}>
                {p}
              </a>
            </li>
          );
        }
        pageElements.push(<li key="dots"><span className="title-normal">...</span></li>);
        pageElements.push(
          <li key={totalPages}>
            <a onClick={() => handlePageChange(totalPages)} className="title-normal link" style={{ cursor: 'pointer' }}>
              {totalPages}
            </a>
          </li>
        );
      } else if (currentPage >= totalPages - 2) {
        pageElements.push(
          <li key={1}>
            <a onClick={() => handlePageChange(1)} className="title-normal link" style={{ cursor: 'pointer' }}>
              1
            </a>
          </li>
        );
        pageElements.push(<li key="dots"><span className="title-normal">...</span></li>);
        for (let p = totalPages - maxVisible + 1; p <= totalPages; p++) {
          pageElements.push(
            <li key={p} className={p === currentPage ? 'active' : ''}>
              <a onClick={() => handlePageChange(p)} className="title-normal link" style={{ cursor: 'pointer' }}>
                {p}
              </a>
            </li>
          );
        }
      } else {
        pageElements.push(
          <li key={1}>
            <a onClick={() => handlePageChange(1)} className="title-normal link" style={{ cursor: 'pointer' }}>
              1
            </a>
          </li>
        );
        pageElements.push(<li key="dots1"><span className="title-normal">...</span></li>);
        for (let p = currentPage - 1; p <= currentPage + 1; p++) {
          pageElements.push(
            <li key={p} className={p === currentPage ? 'active' : ''}>
              <a onClick={() => handlePageChange(p)} className="title-normal link" style={{ cursor: 'pointer' }}>
                {p}
              </a>
            </li>
          );
        }
        pageElements.push(<li key="dots2"><span className="title-normal">...</span></li>);
        pageElements.push(
          <li key={totalPages}>
            <a onClick={() => handlePageChange(totalPages)} className="title-normal link" style={{ cursor: 'pointer' }}>
              {totalPages}
            </a>
          </li>
        );
      }
    }

    pageElements.push(
      <li key="next">
        <a
          onClick={() => handlePageChange(currentPage + 1)}
          className="link"
          style={{ cursor: currentPage < totalPages ? 'pointer' : 'not-allowed' }}
          aria-disabled={currentPage === totalPages}
        >
          <i className="icon-arrow-right-lg" />
        </a>
      </li>
    );

    return <ul className="wg-pagination wd-load mt-xl--10 d-flex justify-content-center flex-wrap gap-2">{pageElements}</ul>;
  };

  if (loading) {
    return (
      <div className="loading-cs d-flex justify-content-center align-items-center min-vh-50">
        <div className="spinner-border spinner-border-sm text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (noData) {
    return (
      <div className="text-center py-5 my-5">
        <h4 className="text-primary mb-3">No Content Available</h4>
        <p className="text-muted fs-6">
          There are currently no active blog posts or press releases to display.
          Please check back later for new content.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="container pt-5 pb-2">
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold mb-4">Our Press & Blogs</h1>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            {hasPress && (
              <button
                type="button"
                onClick={() => setCurrentType('PRESS')}
                className={`btn px-4 py-2 fw-semibold position-relative ${
                  currentType === 'PRESS'
                    ? 'bg-primary text-white'
                    : 'text-primary border border-danger'
                }`}
                style={{
                  borderRadius: hasBlogs ? '8px 0 0 8px' : '8px',
                  boxShadow: currentType === 'PRESS' ? '0 4px 12px rgba(244, 89, 23, 0.25)' : 'none',
                  transition: 'all 0.3s ease',
                  minWidth: '120px'
                }}
              >
                Press
                {currentType === 'PRESS' && (
                  <span
                    className="position-absolute start-0 end-0 bottom-0 bg-white opacity-25"
                    style={{ height: '4px' }}
                  />
                )}
              </button>
            )}
            {hasBlogs && (
              <button
                type="button"
                onClick={() => setCurrentType('BLOG')}
                className={`btn px-4 py-2 fw-semibold position-relative ${
                  currentType === 'BLOG'
                    ? 'bg-primary text-white'
                    : 'text-primary border border-danger'
                }`}
                style={{
                  borderRadius: hasPress ? '0 8px 8px 0' : '8px',
                  boxShadow: currentType === 'BLOG' ? '0 4px 12px rgba(244, 89, 23, 0.25)' : 'none',
                  transition: 'all 0.3s ease',
                  minWidth: '120px'
                }}
              >
                Blogs
                {currentType === 'BLOG' && (
                  <span
                    className="position-absolute start-0 end-0 bottom-0 bg-white opacity-25"
                    style={{ height: '4px' }}
                  />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <section className="pb-5">
        <div className="container">
          <div className="row g-4">
            {items.map((item) => {
              const imgSrc = item.thumbnailUrl || "/images/banner/qist-market-banner.jpg";
              const date = new Date(item.updatedAt).toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              });

              return (
                <div className="col-12 col-sm-6 col-lg-4" key={item.id}>
                  <div className="news-item hover-img h-100 d-flex flex-column">
                    <div className="entry_image img-style position-relative overflow-hidden">
                      {item.type === 'BLOG' ? (
                        <Link href={`/blogs/${item.slug}`} className="d-block">
                          <Image
                            src={imgSrc}
                            alt={item.thumbnailAltText || 'Blog Thumbnail'}
                            width={555}
                            height={312}
                            className="lazyload w-100 h-100 object-fit-cover"
                            style={{ transition: 'transform 0.4s ease' }}
                          />
                        </Link>
                      ) : (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="d-block">
                          <Image
                            src={imgSrc}
                            alt={item.thumbnailAltText || 'Press Thumbnail'}
                            width={555}
                            height={312}
                            className="lazyload w-100 h-100 object-fit-cover"
                            style={{ transition: 'transform 0.4s ease' }}
                          />
                        </a>
                      )}
                    </div>
                    <div className="content px-4 pb-4 flex-grow-1 d-flex flex-column">
                      <div className="entry_meta d-flex justify-content-between align-items-center mb-2">
                        <div className="tags d-flex align-items-center gap-2">
                          <Image
                            alt="Qist Market Logo"
                            src="/images/favicon/favicon-32x32.png"
                            width={16}
                            height={16}
                          />
                          <p className="caption fw-medium text-secondary font-2 mb-0">
                            {item.author || 'Qist Market'}
                          </p>
                        </div>
                        <div className="date">
                          <p className="caption font-2 mb-0">{date}</p>
                        </div>
                      </div>
                      <div className="entry_infor_news">
                        <h6 className="mb-2">
                          {item.type === 'BLOG' ? (
                            <Link href={`/blogs/${item.slug}`} className="link fw-semibold text-decoration-none">
                              {item.title}
                            </Link>
                          ) : (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="link fw-semibold text-decoration-none"
                            >
                              {item.title}
                            </a>
                          )}
                        </h6>
                        <p className="subs body-text-3 text-muted mb-0">{item.shortDescription}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="mt-5">
              {renderPagination()}
            </div>
          )}
        </div>
      </section>
    </>
  );
}