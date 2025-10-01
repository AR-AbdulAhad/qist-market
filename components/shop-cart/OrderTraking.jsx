"use client"
import { useState } from "react"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export default function OrderTracking() {
  const [formData, setFormData] = useState({
    tokenOrId: "",
    phone: "",
  })
  const [orderData, setOrderData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setOrderData(null)

    try {
      const response = await fetch(`${BACKEND_URL}/api/order/track-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to track order")
      }

      const data = await response.json()
      setOrderData(data)
    } catch (err) {
      setError(err.message || "An error occurred while tracking the order")
    } finally {
      setLoading(false)
    }
  }

  const statusOrder = ["Pending", "Confirmed", "Shipped", "Delivered"]
  const statusIcons = {
    Pending: "fa-clock",
    Confirmed: "fa-check-circle",
    Shipped: "fa-truck",
    Delivered: "fa-box",
    Rejected: "fa-times-circle",
    Cancelled: "fa-ban",
  }

  const getStatusIndex = (status) => {
    if (["Rejected", "Cancelled"].includes(status)) {
      return { isException: true, status }
    }
    const index = statusOrder.indexOf(status)
    return { isException: false, index: index >= 0 ? index : 0 }
  }

  return (
    <section className="tf-sp-2">
      <div className="container">
        <div className="d-flex flex-column justify-content-center align-items-center">
          {!orderData && (
            <>
              <div className="box-title d-flex flex-column justify-content-center align-items-center">
                <h1 className="display-4 text-center fw-medium mb-3"><strong>Track Your Order</strong></h1>
                <p className="body-text-3 mb-2 text-center">
                  To track your order, please enter your Order Number or Tracking Number and phone Number below, then press the
                  "Track" button.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="form-trackorder def border p-4 rounded mt-4">
                <fieldset>
                  <label className="fw-medium">Order No or Tracking No</label>
                  <input
                    className="def"
                    type="text"
                    name="tokenOrId"
                    placeholder="Enter Order No or Tracking No"
                    value={formData.tokenOrId}
                    onChange={handleInputChange}
                    required
                  />
                </fieldset>
                <fieldset>
                  <label className="fw-medium">Phone Number</label>
                  <input
                    className="def"
                    type="tel"
                    name="phone"
                    placeholder="Phone number used during checkout"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </fieldset>
                <div className="box-btn">
                  <button type="submit" className="tf-btn w-100" disabled={loading}>
                    <span className="text-white">{loading ? "Tracking..." : "Track"}</span>
                  </button>
                </div>
                {error && <p className="text-danger text-center mt-2">{error}</p>}
              </form>
            </>
          )}
          {orderData && (
            <div className="tf-order-detail mt-4">
              <div className="order-status-stepper pt-0">
                <div className="modern-stepper-wrap">
                  <div className="stepper-progress-line"></div>
                  {statusOrder.map((status, index) => {
                    const { isException, index: currentIndex } = getStatusIndex(orderData.status)
                    const isActive = !isException && index <= currentIndex
                    const isCompleted = !isException && index < currentIndex

                    return (
                      <div
                        key={status}
                        className={`modern-stepper-item ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""} ${
                          isException && orderData.status !== status ? "inactive" : ""
                        }`}
                      >
                        <div className="stepper-icon-wrapper">
                          {status === "Pending" && (
                            <svg
                              className="stepper-svg-icon"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                              <polyline
                                points="12,6 12,12 16,14"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                          {status === "Confirmed" && (
                            <svg
                              className="stepper-svg-icon"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <polyline
                                points="22,4 12,14.01 9,11.01"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                          {status === "Shipped" && (
                            <svg
                              className="stepper-svg-icon"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                x="1"
                                y="3"
                                width="15"
                                height="13"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <polygon
                                points="16,8 20,8 23,11 23,16 16,16 16,8"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <circle
                                cx="5.5"
                                cy="18.5"
                                r="2.5"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <circle
                                cx="18.5"
                                cy="18.5"
                                r="2.5"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                          {status === "Delivered" && (
                            <svg
                              className="stepper-svg-icon"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <polyline
                                points="7.5,12 10.5,15 16.5,9"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                        <span className="stepper-label">{status}</span>
                      </div>
                    )
                  })}
                  {getStatusIndex(orderData.status).isException && (
                    <div className="modern-stepper-item exception">
                      <div className="stepper-icon-wrapper">
                        {orderData.status === "Rejected" && (
                          <svg
                            className="stepper-svg-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <line
                              x1="15"
                              y1="9"
                              x2="9"
                              y2="15"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <line
                              x1="9"
                              y1="9"
                              x2="15"
                              y2="15"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        )}
                        {orderData.status === "Cancelled" && (
                          <svg
                            className="stepper-svg-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <path
                              d="M4.93 4.93l14.14 14.14"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="stepper-label">{orderData.status}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="order-notice">
                <span className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={30}
                    height={30}
                    fill="#ffffff"
                    viewBox="0 0 256 256"
                  >
                    <path d="M225.86,102.82c-3.77-3.94-7.67-8-9.14-11.57-1.36-3.27-1.44-8.69-1.52-13.94-.15-9.76-.31-20.82-8-28.51s-18.75-7.85-28.51-8c-5.25-.08-10.67-.16-13.94-1.52-3.56-1.47-7.63-5.37-11.57-9.14C146.28,23.51,138.44,16,128,16s-18.27,7.51-25.18,14.14c-3.94,3.77-8,7.67-11.57,9.14C88,40.64,82.56,40.72,77.31,40.8c-9.76.15-20.82.31-28.51,8S41,67.55,40.8,77.31c-.08,5.25-.16,10.67-1.52,13.94-1.47,3.56-5.37,7.63-9.14,11.57C23.51,109.72,16,117.56,16,128s7.51,18.27,14.14,25.18c3.77,3.94,7.67,8,9.14,11.57,1.36,3.27,1.44,8.69,1.52,13.94.15,9.76.31,20.82,8,28.51s18.75,7.85,28.51,8c5.25.08,10.67.16,13.94,1.52,3.56,1.47,7.63,5.37,11.57,9.14C109.72,232.49,117.56,240,128,240s18.27-7.51,25.18-14.14c3.94-3.77,8-7.67,11.57-9.14,3.27-1.36,8.69-1.44,13.94-1.52,9.76-.15,20.82-.31,28.51-8s7.85-18.75,8-28.51c.08-5.25.16-10.67,1.52-13.94,1.47-3.56,5.37-7.63,9.14-11.57C232.49,146.28,240,138.44,240,128S232.49,109.73,225.86,102.82Zm-11.55,39.29c-4.79,5-9.75,10.17-12.38,16.52-2.52,6.1-2.63,13.07-2.73,19.82-.1,7-.21,14.33-3.32,17.43s-10.39,3.22-17.43,3.32c-6.75.1-13.72.21-19.82,2.73-6.35,2.63-11.52,7.59-16.52,12.38S132,224,128,224s-9.15-4.92-14.11-9.69-10.17-9.75-16.52-12.38c-6.1-2.52-13.07-2.63-19.82-2.73-7-.1-14.33-.21-17.43-3.32s-3.22-10.39-3.32-17.43c-.1-6.75-.21-13.72-2.73-19.82-2.63-6.35-7.59-11.52-12.38-16.52S32,132,32,128s4.92-9.15,9.69-14.11,9.75-10.17,12.38-16.52c2.52-6.1,2.63-13.07,2.73-19.82.1-7,.21-14.33,3.32-17.43S70.51,56.9,77.55,56.8c6.75-.1,13.72-.21,19.82-2.73,6.35-2.63,11.52-7.59,16.52-12.38S124,32,128,32s9.15,4.92,14.11,9.69,10.17,9.75,16.52,12.38c6.1,2.52,13.07,2.63,19.82,2.73,7,.1,14.33.21,17.43,3.32s3.22,10.39,3.32,17.43c.1,6.75.21,13.72,2.73,19.82,2.63,6.35,7.59,11.52,12.38,16.52S224,124,224,128,219.08,137.15,214.31,142.11ZM173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34Z" />
                  </svg>
                </span>
                <p>Order track successfully.</p>
              </div>
              <ul className="order-overview-list">
                <li>
                  Order number: <strong>{orderData.id}</strong>
                </li>
                <li>
                  Tracking Number: <strong>{orderData.tokenNumber}</strong>
                </li>
                <li>
                  Date: <strong>{new Date(orderData.createdAt).toLocaleDateString()}</strong>
                </li>
                <li>
                  Status: <strong style={{
                      color:
                        orderData.status === 'Pending'
                          ? '#894b00'
                          : orderData.status === 'Confirmed'
                          ? '#106dd1'
                          : orderData.status === 'Shipped'
                          ? '#9009f3'
                          : orderData.status === 'Delivered'
                          ? '#22a940'
                          : orderData.status === 'Cancelled'
                          ? '#ff0018'
                          : orderData.status === 'Rejected'
                          ? '#ff0018'
                          : '#333333',
                    }}>{orderData.status}</strong> 
                </li>
                {orderData.rejectionReason && orderData.status === "Rejected" &&
                <li>
                  Rejection Reason: <strong style={{
                      color: '#ff0018'}}>{orderData.rejectionReason}</strong> 
                </li>
                }
                <li>
                  Advance: <strong>Rs. {Number(orderData.advanceAmount).toLocaleString()}</strong>
                </li>
                <li>
                  Payment method: <strong>{orderData.paymentMethod}</strong>
                </li>
              </ul>
              <div className="order-detail-wrap">
                <h5 className="fw-bold">Order details</h5>
                <table className="tf-table-order-detail">
                  <thead>
                    <tr>
                      <td>
                        <h6 className="fw-semibold">Product</h6>
                      </td>
                      <td>
                        <h6 className="fw-semibold">Total Advance</h6>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="tf-order-item">
                      <td className="tf-order-item_product">
                        {orderData.productName} <span className="text-black"></span>
                      </td>
                      <td>
                        <span className="fw-medium">Rs. {Number(orderData.advanceAmount).toLocaleString()}</span>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <th>
                        <span>Payment method:</span>
                      </th>
                      <td>
                        <span>{orderData.paymentMethod}</span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
                <table className="tf-table-order-detail">
                  <thead>
                    <tr>
                      <td>
                        <h6 className="fw-semibold">Advance Amount</h6>
                      </td>
                      <td>
                        <h6 className="fw-semibold">Installment Amount</h6>
                      </td>
                      <td>
                        <h6 className="fw-semibold">Months Plan</h6>
                      </td>
                      <td>
                        <h6 className="fw-semibold">Total Deal Value</h6>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="tf-order-item">
                      <td>
                        <span className="fw-medium">Rs. {Number(orderData.advanceAmount).toLocaleString()}</span>
                      </td>
                      <td>
                        <span className="fw-medium">Rs. {Number(orderData.monthlyAmount).toLocaleString()}</span>
                      </td>
                      <td>
                        <span className="fw-medium">Months: {orderData.months}</span>
                      </td>
                      <td>
                        <span className="fw-medium">Rs. {Number(orderData.totalDealValue).toLocaleString()}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="row gap-30 gap-sm-0">
                <div>
                  <div className="order-detail-wrap">
                    <h5 className="fw-bold">Billing Address</h5>
                    <table className="tf-table-order-detail">
                      <tbody>
                        <tr className="tf-order-item">
                          <td>
                            <span className="fw-medium">Customer Name:</span>
                          </td>
                          <td>
                            <span className="fw-medium">
                              {orderData.firstName} {orderData.lastName}
                            </span>
                          </td>
                        </tr>
                        <tr className="tf-order-item">
                          <td>
                            <span className="fw-medium">Phone:</span>
                          </td>
                          <td>
                            <span className="fw-medium">{orderData.phone}</span>
                          </td>
                        </tr>
                        <tr className="tf-order-item">
                          <td>
                            <span className="fw-medium">Email:</span>
                          </td>
                          <td>
                            <span className="fw-medium">{orderData.email}</span>
                          </td>
                        </tr>
                        <tr className="tf-order-item">
                          <td>
                            <span className="fw-medium">Address:</span>
                          </td>
                          <td>
                            <span className="fw-medium">{orderData.address}</span>
                          </td>
                        </tr>
                        <tr className="tf-order-item">
                          <td>
                            <span className="fw-medium">City</span>
                          </td>
                          <td>
                            <span className="fw-medium">
                              {orderData.city}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {orderData.orderNotes && (
                <div className="order-detail-wrap">
                  <h5 className="fw-bold">Order Notes</h5>
                  <p>{orderData.orderNotes}</p>
                </div>
              )}
              <div className="box-btn mt-4">
                <button
                  type="button"
                  className="tf-btn w-100"
                  onClick={() => {
                    setOrderData(null)
                    setFormData({ tokenOrId: "", phone: "" })
                  }}
                >
                  <span className="text-white">Track Another Order</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
