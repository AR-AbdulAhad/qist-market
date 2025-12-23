import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function BlogsDetails({ singleBlog, loading }) {
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status" style={{ width: "4rem", height: "4rem" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const baseUrl = "https://www.qistmarket.pk";

  const currentUrl = `${baseUrl}/blogs/${singleBlog?.slug || ""}`;

  const shareTitle = encodeURIComponent(singleBlog?.title || "Check out this blog post");
  const shareDescription = encodeURIComponent(singleBlog?.shortDescription || "Read this interesting blog post");

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${shareTitle}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}&title=${shareTitle}&summary=${shareDescription}`,
    whatsapp: `https://api.whatsapp.com/send?text=${shareTitle}%20${encodeURIComponent(currentUrl)}`,
  };

  return (
    <>
      <div className="tf-sp-1 pb-0">
        <div className="container">
          <ul className="breakcrumbs">
            <li>
              <Link href={`/`} className="body-small link">
                Home
              </Link>
            </li>
            <li className="d-flex align-items-center">
              <i className="icon icon-arrow-right" />
            </li>
            <li>
              <Link href={`/blogs`} className="body-small link">
                Blogs
              </Link>
            </li>
            <li className="d-flex align-items-center">
              <i className="icon icon-arrow-right" />
            </li>
            <li>
              <span className="body-small">
                {singleBlog.title}
              </span>
            </li>
          </ul>
        </div>
      </div>
      {/* Blog Detail */}
      <section className="tf-sp-2">
        <div className="container">
          <div className="s-blog-detail">
            <div className="box-direction sticky content-left">
              <div className="bottom">
                <p className="caption font-2 text-main-2">Share this post:</p>
                <span className="br-line bg-gray-5" />
                <ul className="social-list style-2 justify-content-start flex-wrap">
                  <li>
                    <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
                      <i className="icon-facebook" />
                    </a>
                  </li>
                  <li>
                    <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
                      <i className="icon-x" />
                    </a>
                  </li>
                  <li>
                    <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer">
                      <i className="icon-linkin" />
                    </a>
                  </li>
                  <li>
                    <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer">
                      <i className="icon-whatapp" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="content-blog">
              <div className="main-content">
                <div className="box-title">
                  <h2 className="fw-semibold">
                    {singleBlog.title}
                  </h2>
                  <div className="entry_meta">
                    <div className="tags">
                      <Image
                        alt=""
                        src="/images/favicon/favicon-32x32.png"
                        width={16}
                        height={16}
                      />
                      <p className="caption fw-medium text-secondary font-2">
                        {singleBlog.author}
                      </p>
                    </div>
                    <div className="date">
                      <p className="caption font-2">
                        {(() => {
                          const date = singleBlog?.updatedAt
                            ? new Date(singleBlog.updatedAt).toLocaleDateString('en-US', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })
                            : '';
                          return <span>{date}</span>;
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="entry_image has-sub">
                  <Image
                    src={singleBlog?.thumbnailUrl}
                    alt={singleBlog?.thumbnailAltText || 'Blog Image'}
                    className="lazyload"
                    width={874}
                    height={492}
                  />
                </div>
                <div
                  className="body-text-33"
                  dangerouslySetInnerHTML={{ __html: singleBlog?.longDescription }}
                />
              </div>
            </div>
            <div className="box-direction content-right">
              <div className="bottom d-xxl-block">
                <div className="blog-sidebar sidebar-content-wrap">
                  <div className="sidebar-item type-space-2">
                    <h6 className="sb-title fw-semibold">Tags</h6>
                    <ul className="sb-content sb-tags">
                      {singleBlog?.tags.map((tag, index) => (
                        <li key={index}>
                          <a className="body-text-3">{tag}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}