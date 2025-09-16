"use client"; // Add this directive
import React, { useContext } from "react";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";

export default function MyAccount() {
  const { user } = useContext(AuthContext);

  return (
    <div className="my-account-content account-dashboard">
      <div className="mb_60">
        <h3 className="fw-semibold mb-20">Hello {user ? <>{user.firstName} {user.lastName},</> : "loading..."}</h3>
        <p>
          From your account dashboard you can view your{" "}
          <Link
            className="text-secondary link fw-medium"
            href={`/my-account-orders`}
          >
            recent orders
          </Link>
          , manage your {" "}
          <Link
            className="text-secondary link fw-medium"
            href={`/my-account-address`}
          >
            shipping and billing address
          </Link>
          , and {" "}
          <Link
            className="text-secondary link fw-medium"
            href={`/my-account-edit`}
          >
            edit your password and account details
          </Link>
          .
        </p>
      </div>
    </div>
  );
}