"use client";

import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { Pencil, Trash, ZoomIn, ZoomOut, RotateCcw, RotateCw, RefreshCw } from "lucide-react";
import "@/public/css/quill-out.css";
import { useContextElement } from "@/context/Context";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Description({ singleProduct, loading }) {
  const { user, token } = useContext(AuthContext);
  const [faqs, setFaqs] = useState([]);
  const [faqLoading, setFaqLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [newReview, setNewReview] = useState({ comment: "", rating: 0, medias: [] });
  const [editingReview, setEditingReview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [removedMedias, setRemovedMedias] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const descriptionRef = useRef(null);
  const { openModal } = useContextElement();
  const fileInputRef = useRef(null);
  const imageModalRef = useRef(null);
  const deleteModalRef = useRef(null);
  const editModalRef = useRef(null);
  const [imageModalInstance, setImageModalInstance] = useState(null);
  const [deleteModalInstance, setDeleteModalInstance] = useState(null);
  const [editModalInstance, setEditModalInstance] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [deleteReviewId, setDeleteReviewId] = useState(null);
  const imageRef = useRef(null);
  const allBlobUrls = useRef(new Set());

  const productID = loading ? null : singleProduct?.id;
  const MAX_HEIGHT = 150;

  const playSound = (isLike) => {
    if (typeof window !== "undefined") {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      const frequency = isLike ? 800 : 400;
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("bootstrap").then((bootstrap) => {
        if (imageModalRef.current) {
          setImageModalInstance(new bootstrap.Modal(imageModalRef.current));
        }
        if (deleteModalRef.current) {
          setDeleteModalInstance(new bootstrap.Modal(deleteModalRef.current));
        }
        if (editModalRef.current) {
          setEditModalInstance(new bootstrap.Modal(editModalRef.current));
        }
      });
    }
  }, []);

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom((prev) => Math.max(0.1, prev + delta));
    };

    const handleMouseDown = (e) => {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX - posX, y: e.clientY - posY });
    };

    const handleMouseMove = (e) => {
      if (isDragging) {
        setPosX(e.clientX - dragStart.x);
        setPosY(e.clientY - dragStart.y);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const modalBody = imageModalRef.current?.querySelector(".modal-body");
    if (modalBody) {
      modalBody.addEventListener("wheel", handleWheel);
      modalBody.addEventListener("mousedown", handleMouseDown);
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      if (modalBody) {
        modalBody.removeEventListener("wheel", handleWheel);
        modalBody.removeEventListener("mousedown", handleMouseDown);
      }
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragStart, posX, posY, imageModalInstance]);

  useEffect(() => {
    if (!productID) return;
    setFaqLoading(true);
    axios
      .get(`${BACKEND_URL}/api/faqs/product/${productID}`)
      .then((res) => {
        setFaqs(res.data);
        setFaqLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching FAQs:", error);
        setFaqs([]);
        setFaqLoading(false);
      });
  }, [productID]);

  useEffect(() => {
    if (descriptionRef.current && !loading && singleProduct?.long_description) {
      const contentHeight = descriptionRef.current.scrollHeight;
      setIsTruncated(contentHeight > MAX_HEIGHT);
    }
  }, [loading, singleProduct]);

  useEffect(() => {
    if (!productID) return;
    setReviewLoading(true);
    Promise.all([
      axios.get(`${BACKEND_URL}/api/reviews/product/${productID}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      user && token
        ? axios.get(`${BACKEND_URL}/api/reviews/user/${productID}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        : Promise.resolve({ data: { userReviews: [] } }),
    ])
      .then(([allReviewsRes, userReviewsRes]) => {
        setReviews(allReviewsRes.data.data);
        setUserReviews(userReviewsRes.data.userReviews || []);
        setReviewLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
        setReviews([]);
        setUserReviews([]);
        setReviewLoading(false);
        toast.error(error.response?.data?.error || "Failed to load reviews");
      });
  }, [productID, user, token]);

  useEffect(() => {
    if (!productID || !user || !token) return;
    axios
      .get(`${BACKEND_URL}/api/orders/delivered/${productID}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCanReview(res.data.canReview);
      })
      .catch((error) => {
        console.error("Error checking review eligibility:", error);
        setCanReview(false);
      });
  }, [productID, user, token]);

  useEffect(() => {
    return () => {
      allBlobUrls.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const resizeImage = (file, maxWidth, maxHeight) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      reader.onerror = () => reject(new Error("Failed to read file"));

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        // Set canvas size to 600x600
        canvas.width = maxWidth;
        canvas.height = maxHeight;

        // Center the image on the canvas
        const offsetX = (maxWidth - width) / 2;
        const offsetY = (maxHeight - height) / 2;

        // Draw image with transparent background
        ctx.clearRect(0, 0, maxWidth, maxHeight);
        ctx.drawImage(img, offsetX, offsetY, width, height);

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: file.type }));
            } else {
              reject(new Error("Failed to create blob"));
            }
          },
          file.type,
          0.9 // Quality for JPEG
        );
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      reader.readAsDataURL(file);
    });
  };

  const addFiles = async (files) => {
    const validFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const resizedFiles = await Promise.all(
      validFiles.slice(0, 5 - newReview.medias.length).map(async (file) => {
        try {
          const resizedFile = await resizeImage(file, 600, 600);
          const preview = URL.createObjectURL(resizedFile);
          allBlobUrls.current.add(preview);
          return { preview, file: resizedFile, type: "new" };
        } catch (error) {
          console.error("Error resizing image:", error);
          toast.error("Failed to process one or more images");
          return null;
        }
      })
    );

    const newMedias = resizedFiles.filter((m) => m !== null);
    setNewReview({ ...newReview, medias: [...newReview.medias, ...newMedias] });
  };

  const removeImage = (index) => {
    setNewReview((prev) => {
      const media = prev.medias[index];
      if (media.type === "existing") {
        setRemovedMedias((prevRemoved) => [...prevRemoved, media.preview]);
      }
      if (media.type === "new") {
        URL.revokeObjectURL(media.preview);
        allBlobUrls.current.delete(media.preview);
      }
      const updatedMedias = prev.medias.filter((_, i) => i !== index);
      return { ...prev, medias: updatedMedias };
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    addFiles(e.target.files);
    e.target.value = null;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user || !token) {
      toast.error("Please login to submit a review");
      return;
    }
    if (!newReview.comment || newReview.rating < 1 || newReview.rating > 5) {
      toast.error("Comment and rating (1-5) are required");
      return;
    }
    if (newReview.comment.length > 500) {
      toast.error("Comment cannot exceed 500 characters");
      return;
    }

    if (editingReview) {
      editModalInstance?.show();
      return;
    }

    await proceedSubmitReview();
  };

  const proceedSubmitReview = async () => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("productId", productID);
    formData.append("comment", newReview.comment);
    formData.append("rating", newReview.rating);
    newReview.medias
      .filter((m) => m.type === "new")
      .forEach((m) => formData.append("media", m.file));
    if (editingReview) {
      removedMedias.forEach((url) => formData.append("removedMedia[]", url));
    }

    try {
      if (editingReview) {
        await axios.put(`${BACKEND_URL}/api/reviews/${editingReview.id}`, formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
        toast.success("Review updated successfully! Awaiting approval.");
      } else {
        await axios.post(`${BACKEND_URL}/api/reviews`, formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
        toast.success("Review submitted successfully! Awaiting approval.");
      }
      // Revoke blob URLs for submitted new medias
      newReview.medias.forEach((m) => {
        if (m.type === "new") {
          URL.revokeObjectURL(m.preview);
          allBlobUrls.current.delete(m.preview);
        }
      });
      setNewReview({ comment: "", rating: 0, medias: [] });
      setEditingReview(null);
      setRemovedMedias([]);
      const [allReviewsRes, userReviewsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/reviews/product/${productID}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BACKEND_URL}/api/reviews/user/${productID}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setReviews(allReviewsRes.data.data);
      setUserReviews(userReviewsRes.data.userReviews || []);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.response?.data?.error || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setNewReview({
      comment: review.comment,
      rating: review.rating,
      medias: review.mediaUrls.map((url) => ({ preview: url, type: "existing" })),
    });
    setRemovedMedias([]);
  };

  const showDeleteConfirm = (reviewId) => {
    setDeleteReviewId(reviewId);
    deleteModalInstance?.show();
  };

  const handleDeleteReview = async () => {
    if (!user || !token) {
      toast.error("Please login to delete a review");
      return;
    }
    setIsDeleting(true);
    try {
      await axios.delete(`${BACKEND_URL}/api/reviews/${deleteReviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Review deleted successfully!");
      const [allReviewsRes, userReviewsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/reviews/product/${productID}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BACKEND_URL}/api/reviews/user/${productID}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setReviews(allReviewsRes.data.data);
      setUserReviews(userReviewsRes.data.userReviews || []);
      deleteModalInstance?.hide();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error(error.response?.data?.error || "Failed to delete review");
    } finally {
      setIsDeleting(false);
      setDeleteReviewId(null);
    }
  };

  const handleLikeDislike = async (reviewId, isLike) => {
    if (!user || !token) {
      openModal("log");
      return;
    }
    try {
      await axios.post(
        `${BACKEND_URL}/api/reviews/${reviewId}/${isLike ? "like" : "dislike"}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const res = await axios.get(`${BACKEND_URL}/api/reviews/product/${productID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(res.data.data);
      playSound(isLike);
    } catch (error) {
      console.error(`Error ${isLike ? "liking" : "disliking"} review:`, error);
      toast.error(error.response?.data?.error || `Failed to ${isLike ? "like" : "dislike"} review`);
    }
  };

  const openImageModal = (url) => {
    setCurrentImage(url);
    setZoom(1);
    setRotation(0);
    setPosX(0);
    setPosY(0);
    if (imageModalInstance) {
      imageModalInstance.show();
    }
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <section className="tf-sp-4 py-8">
      <div className="container mx-auto px-4">
        <div className="flat-animate-tab flat-title-tab-product-des">
          <div className="flat-title-tab text-center mb-6">
            <ul className="menu-tab-line flex justify-center space-x-4" role="tablist">
              <li className="nav-tab-item" role="presentation">
                <a
                  href="#prd-des"
                  className="tab-link product-title font-semibold text-lg active"
                  data-bs-toggle="tab"
                >
                  Description
                </a>
              </li>
              <li className="nav-tab-item" role="presentation">
                <a
                  href="#prd-review"
                  className="tab-link product-title font-semibold text-lg"
                  data-bs-toggle="tab"
                >
                  Reviews ({reviews.length})
                </a>
              </li>
              <li className="nav-tab-item" role="presentation">
                <a
                  href="#prd-faq"
                  className="tab-link product-title font-semibold text-lg"
                  data-bs-toggle="tab"
                >
                  FAQs
                </a>
              </li>
            </ul>
          </div>
          <div className="tab-content">
            {/* Description Tab */}
            <div className="tab-pane active show" id="prd-des" role="tabpanel">
              <div className="tab-main">
                {loading ? (
                  <div className="d-flex justify-content-center align-items-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className="position-relative">
                    <div
                      ref={descriptionRef}
                      className={`body-text-33 ${isTruncated && !showFullDescription ? "description-truncated" : ""}`}
                      style={{
                        maxHeight: isTruncated && !showFullDescription ? `${MAX_HEIGHT}px` : "none",
                        overflow: isTruncated && !showFullDescription ? "hidden" : "visible",
                        position: "relative",
                        transition: "max-height 0.3s ease",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: singleProduct?.long_description || "Data Not Found!",
                      }}
                    />
                    {isTruncated && singleProduct?.long_description && (
                      <div className="text-center mt-4">
                        <button
                          className="check-btn text-primary font-medium hover:underline"
                          onClick={toggleDescription}
                        >
                          {showFullDescription ? "Show Less" : "Show More"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* FAQs Tab */}
            <div className="tab-pane" id="prd-faq" role="tabpanel">
              <div className="tab-main tab-info">
                <div className="faq-wrap" id="accordionMyAcc">
                  {faqLoading ? (
                    <div className="d-flex justify-content-center align-items-center">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : faqs.length === 0 ? (
                    <p className="text-gray-500 text-center">No FAQs available.</p>
                  ) : (
                    faqs.map((faq, index) => (
                      <div className="widget-accordion" key={faq.id || index} id={`heading${index}`}>
                        <div
                          className="accordion-title collapsed"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapseMyAcc-${index}`}
                          aria-expanded="false"
                          aria-controls={`collapseMyAcc-${index}`}
                          role="button"
                        >
                          <span className="title-sidebar font-medium">{`${index + 1}. ${faq.question}`}</span>
                          <span className="icon" />
                        </div>
                        <div
                          id={`collapseMyAcc-${index}`}
                          className="accordion-collapse collapse"
                          aria-labelledby={`heading${index}`}
                          data-bs-parent="#accordionMyAcc"
                        >
                          <div className="accordion-body widget-material">
                            <p className="text-gray-700">{faq.answer}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Reviews Tab */}
            <div className="tab-pane" id="prd-review" role="tabpanel">
              <div className="tab-main tab-info py-5" id="reviews-section">
                {reviewLoading ? (
                  <div className="d-flex justify-content-center align-items-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className="row g-4">
                    {/* Submit Review and Your Reviews Section */}
                    <div className="col-md-6">
                      <div className="faq-wrap" id="accordionReview">
                        <div className="widget-accordion" id="headingReview">
                          <div
                            className="accordion-title collapsed"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseReview"
                            aria-expanded="false"
                            aria-controls="collapseReview"
                            role="button"
                          >
                            <h5 className="fw-semibold">
                              {editingReview ? "Edit Your Review" : "Submit a Review"}
                            </h5>
                            <span className="icon" />
                          </div>
                          <div
                            id="collapseReview"
                            className="accordion-collapse collapse"
                            aria-labelledby="headingReview"
                            data-bs-parent="#accordionReview"
                          >
                            <div className="accordion-body widget-material">
                              <div className="card-body">
                                {user && canReview ? (
                                  <form onSubmit={handleSubmitReview} className="vstack gap-3">
                                    {/* Rating */}
                                    <div>
                                      <label className="form-label fw-medium">Rating</label>
                                      <div className="d-flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <svg
                                            key={star}
                                            onClick={() =>
                                              setNewReview({ ...newReview, rating: star })
                                            }
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="22"
                                            height="22"
                                            fill={star <= newReview.rating ? "#f59e0b" : "none"}
                                            stroke={star <= newReview.rating ? "#f59e0b" : "#d1d5db"}
                                            strokeWidth="1.5"
                                            className="cursor-pointer"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.346l5.518.444a.562.562 0 01.312.986l-4.19 3.67a.563.563 0 00-.182.557l1.24 5.385a.562.562 0 01-.84.61l-4.725-2.86a.563.563 0 00-.586 0l-4.725 2.86a.562.562 0 01-.84-.61l1.24-5.386a.563.563 0 00-.182-.556l-4.19-3.67a.562.562 0 01.312-.986l5.518-.444a.563.563 0 00.475-.346L11.48 3.5z"
                                            />
                                          </svg>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Comment */}
                                    <div>
                                      <label className="form-label fw-medium">Comment</label>
                                      <textarea
                                        className={`form-control ${newReview.comment.length > 500 ? 'is-invalid' : ''}`}
                                        rows="3"
                                        value={newReview.comment}
                                        onChange={(e) => {
                                          const value = e.target.value.slice(0, 500);
                                          setNewReview({ ...newReview, comment: value });
                                        }}
                                        required
                                      />
                                      <div className="d-flex justify-content-between mt-1">
                                        <small className="text-muted">{newReview.comment.length}/500</small>
                                        {newReview.comment.length > 500 && (
                                          <div className="invalid-feedback d-block">
                                            Comment cannot exceed 500 characters.
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Media */}
                                    <div>
                                      <label className="form-label fw-medium">Media (Optional, up to 5)</label>
                                      <div className="d-flex flex-wrap gap-2">
                                        {newReview.medias.map((media, index) => (
                                          <div key={media.preview} className="position-relative">
                                            <img
                                              src={media.preview}
                                              alt={`preview-${index}`}
                                              className="img-thumbnail cursor-pointer"
                                              style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                              onClick={() => openImageModal(media.preview)}
                                            />
                                            <button
                                              type="button"
                                              className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                              onClick={() => {
                                                removeImage(index);
                                              }}
                                            >
                                              x
                                            </button>
                                          </div>
                                        ))}
                                        {newReview.medias.length < 5 && (
                                          <div
                                            className="border rounded d-flex justify-content-center align-items-center"
                                            style={{ width: "80px", height: "80px", cursor: "pointer" }}
                                            onClick={handleUploadClick}
                                            onDragOver={handleDragOver}
                                            onDrop={handleDrop}
                                          >
                                            <span className="fs-1">+</span>
                                          </div>
                                        )}
                                      </div>
                                      <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        ref={fileInputRef}
                                        style={{ display: "none" }}
                                        onChange={handleFileChange}
                                      />
                                    </div>

                                    {/* Buttons */}
                                    <div className="d-flex gap-2">
                                      <button
                                        type="submit"
                                        className="tf-btn mt-2 text-white"
                                        disabled={isSubmitting}
                                      >
                                        {isSubmitting
                                          ? "Submitting..."
                                          : editingReview
                                          ? "Update Review"
                                          : "Submit Review"}
                                      </button>
                                      {editingReview && (
                                        <button
                                          type="button"
                                          className="tf-btn btn-gray mt-2 text-white"
                                          onClick={() => {
                                            // Revoke any new medias added during edit if cancelling
                                            newReview.medias.forEach((m) => {
                                              if (m.type === "new") {
                                                URL.revokeObjectURL(m.preview);
                                                allBlobUrls.current.delete(m.preview);
                                              }
                                            });
                                            setEditingReview(null);
                                            setNewReview({ comment: "", rating: 0, medias: [] });
                                            setRemovedMedias([]);
                                          }}
                                        >
                                          Cancel
                                        </button>
                                      )}
                                    </div>
                                  </form>
                                ) : (
                                  <p className="text-muted small mt-2">
                                    {user
                                      ? "You can only submit a review after your order has been delivered."
                                      : "Please login to submit a review."}
                                  </p>
                                )}

                                {/* User's Reviews */}
                                {user && userReviews.length > 0 && (
                                  <div className="mt-4">
                                    <h6 className="fw-semibold mb-3">Your Reviews</h6>
                                    {userReviews.map((review) => (
                                      <div
                                        key={review.id}
                                        className="border-top border-bottom p-3"
                                      >
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                          <div className="d-flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                              <svg
                                                key={star}
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="18"
                                                height="18"
                                                fill={star <= review.rating ? "#f59e0b" : "none"}
                                                stroke={
                                                  star <= review.rating ? "#f59e0b" : "#d1d5db"
                                                }
                                                strokeWidth="1.5"
                                                viewBox="0 0 24 24"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.346l5.518.444a.562.562 0 01.312.986l-4.19 3.67a.563.563 0 00-.182.557l1.24 5.385a.562.562 0 01-.84.61l-4.725-2.86a.563.563 0 00-.586 0l-4.725 2.86a.562.562 0 01-.84-.61l1.24-5.386a.563.563 0 00-.182-.556l-4.19-3.67a.562.562 0 01.312-.986l5.518-.444a.563.563 0 00.475-.346L11.48 3.5z"
                                                />
                                              </svg>
                                            ))}
                                          </div>
                                          <span
                                            className={`badge ${
                                              review.status === "APPROVED"
                                                ? "bg-success-subtle text-success"
                                                : "bg-warning-subtle text-warning"
                                            }`}
                                          >
                                            {review.status}
                                          </span>
                                        </div>
                                        <p className="mb-2 text-dark">{review.comment}</p>
                                        {review.mediaUrls?.length > 0 && (
                                          <div className="d-flex gap-2 flex-wrap mb-2">
                                            {review.mediaUrls.map((url, i) => (
                                              <img
                                                key={i}
                                                src={url}
                                                alt="Review Media"
                                                className="rounded mb-2 review-img cursor-pointer border"
                                                onClick={() => openImageModal(url)}
                                              />
                                            ))}
                                          </div>
                                        )}
                                        <div className="d-flex justify-content-between align-items-center">
                                          <div className="d-flex gap-3">
                                            <button
                                              className="d-flex align-items-center gap-1 text-secondary check-btn"
                                              onClick={() => handleEditReview(review)}
                                              disabled={isSubmitting || isDeleting}
                                            >
                                              <Pencil size={18} />
                                              Edit
                                            </button>
                                            <button
                                              className="d-flex align-items-center gap-1 text-primary check-btn"
                                              onClick={() => showDeleteConfirm(review.id)}
                                              disabled={isSubmitting || isDeleting}
                                            >
                                              <Trash size={18} />
                                              Delete
                                            </button>
                                          </div>
                                          <p className="text-muted small mb-2">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* All Reviews Section */}
                    <div className="col-md-6">
                      <div>
                        <div className="card-body">
                          <h5 className="fw-semibold mb-4 mt-1">Customer Reviews</h5>
                          <div className="overflow-auto" style={{ maxHeight: "680px" }}>
                            {reviews.length === 0 ? (
                              <p className="text-muted">No reviews available for this product.</p>
                            ) : (
                              reviews.map((review) => (
                                <div
                                  key={review.id}
                                  className="border-top border-bottom p-3 mb-3"
                                >
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex gap-1 mb-2">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <svg
                                          key={star}
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="18"
                                          height="18"
                                          fill={star <= review.rating ? "#f59e0b" : "none"}
                                          stroke={
                                            star <= review.rating ? "#f59e0b" : "#d1d5db"
                                          }
                                          strokeWidth="1.5"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.346l5.518.444a.562.562 0 01.312.986l-4.19 3.67a.563.563 0 00-.182.557l1.24 5.385a.562.562 0 01-.84.61l-4.725-2.86a.563.563 0 00-.586 0l-4.725 2.86a.562.562 0 01-.84-.61l1.24-5.386a.563.563 0 00-.182-.556l-4.19-3.67a.562.562 0 01.312-.986l5.518-.444a.563.563 0 00.475-.346L11.48 3.5z"
                                          />
                                        </svg>
                                      ))}
                                    </div>
                                    <div>
                                      <p className="text-muted small">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                  <p className="text-muted small mb-2 d-flex align-items-center gap-2">
                                    <strong>{review.customer.fullName}</strong>
                                    <span>
                                      {review.status === "APPROVED" ? (
                                        <span className="d-flex align-items-center gap-1 text-success">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-shield-check-icon lucide-shield-check"
                                          >
                                            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                                            <path d="m9 12 2 2 4-4" />
                                          </svg>
                                          {" "}
                                          <span>Verified Purchase</span>
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </span>
                                  </p>
                                  <p className="mb-2 text-dark">{review.comment}</p>
                                  {review.mediaUrls?.length > 0 && (
                                    <div className="d-flex gap-2 flex-wrap mb-2">
                                      {review.mediaUrls.map((url, i) => (
                                        <img
                                          key={i}
                                          src={url}
                                          alt="Review Media"
                                          className="rounded mb-2 review-img cursor-pointer border"
                                          onClick={() => openImageModal(url)}
                                        />
                                      ))}
                                    </div>
                                  )}
                                  <div className="d-flex gap-3 align-items-center">
                                    <div className="d-flex gap-1 align-items-center">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#ff3d3d"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="cursor-pointer"
                                        onClick={() => handleLikeDislike(review.id, true)}
                                      >
                                        <path d="M7 10v12" />
                                        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
                                      </svg>
                                      <small>{review.likes}</small>
                                    </div>
                                    <div className="d-flex gap-1 align-items-center">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#ff3d3d"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="cursor-pointer"
                                        onClick={() => handleLikeDislike(review.id, false)}
                                      >
                                        <path d="M17 14V2" />
                                        <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
                                      </svg>
                                      <small>{review.dislikes}</small>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      <div className="modal fade" ref={imageModalRef} tabIndex="-1" id="imagePreviewModal">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content p-2">
            <div className="modal-header">
              <h5 className="modal-title">Image Preview</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div
              className="modal-body d-flex justify-content-center align-items-center"
              style={{
                overflow: "hidden",
                cursor: isDragging ? "grabbing" : "grab",
              }}
            >
              {currentImage && (
                <img
                  ref={imageRef}
                  src={currentImage}
                  alt="preview"
                  style={{
                    transform: `translate(${posX}px, ${posY}px) scale(${zoom}) rotate(${rotation}deg)`,
                    transition: "transform 0.3s ease",
                    maxWidth: "none",
                    maxHeight: "none",
                  }}
                />
              )}
            </div>
            <div className="modal-footer d-flex justify-content-center gap-3">
              <button className="btn btn-icon" onClick={() => setZoom((z) => z + 0.2)}>
                <ZoomIn size={24} />
              </button>
              <button className="btn btn-icon" onClick={() => setZoom((z) => Math.max(0.2, z - 0.2))}>
                <ZoomOut size={24} />
              </button>
              <button className="btn btn-icon" onClick={() => setRotation((r) => r - 90)}>
                <RotateCcw size={24} />
              </button>
              <button className="btn btn-icon" onClick={() => setRotation((r) => r + 90)}>
                <RotateCw size={24} />
              </button>
              <button
                className="btn btn-icon"
                onClick={() => {
                  setZoom(1);
                  setRotation(0);
                  setPosX(0);
                  setPosY(0);
                }}
              >
                <RefreshCw size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <div className="modal fade" ref={deleteModalRef} tabIndex="-1" id="deleteConfirmModal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-2">
            <div className="modal-header border-0">
              <h5 className="modal-title">Confirm Deletion</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {isDeleting ? (
                <div className="d-flex justify-content-center align-items-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Deleting...</span>
                  </div>
                  <span className="ms-2">Deleting...</span>
                </div>
              ) : (
                <p>Are you sure you want to delete this review?</p>
              )}
            </div>
            {!isDeleting && (
              <div className="modal-footer border-0">
                <button type="button" className="tf-btn btn-gray text-white" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button
                  type="button"
                  className="tf-btn text-white"
                  onClick={handleDeleteReview}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Confirmation Modal */}
      <div className="modal fade" ref={editModalRef} tabIndex="-1" id="editConfirmModal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-2">
            <div className="modal-header border-0">
              <h5 className="modal-title">Confirm Update</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>If you edit this review, it will be sent back for approval.</p>
            </div>
            <div className="modal-footer border-0">
              <button type="button" className="tf-btn btn-gray text-white" data-bs-dismiss="modal">
                Cancel
              </button>
              <button
                type="button"
                className="tf-btn text-white"
                onClick={() => {
                  proceedSubmitReview();
                  editModalInstance?.hide();
                }}
                data-bs-dismiss="modal"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}