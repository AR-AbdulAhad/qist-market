import React from "react";

export default function LoaderSpinner() {
  return (
    <div className="spinner-border spinner-border-sm text-white" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );
}