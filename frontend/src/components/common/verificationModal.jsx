import React, { useState } from "react";
import {
  ModalBody,
  ModalContent,
  ModalFooter,
  useModal,
} from "../ui/animated-modal";

const VerificationModal = ({ onVerify }) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Track loading state
  const { setOpen } = useModal();

  const handleVerify = async () => {
    // Basic validation
    if (!/^\d{6}$/.test(verificationCode)) {
      setError("Please enter a valid 6-digit numeric code.");
      return;
    }
    setLoading(true);
    try {
      await onVerify(verificationCode);
    } catch (err) {
      setError(err.message || "Verification failed. Please try again.");
      toast.error("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBody>
      <ModalContent>
        <h2 className="text-xl font-semibold text-center mb-4">Verify Your Email</h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter the 6-digit verification code sent to your email.
        </p>
        <input
          type="text"
          maxLength={6}
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-center text-lg tracking-widest"
          placeholder="123456"
          disabled={loading}
        />
        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
      </ModalContent>
      <ModalFooter>
        <button
          onClick={handleVerify}
          className={`bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition ${
            loading && "opacity-50 pointer-events-none"
          }`}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </ModalFooter>
    </ModalBody>
  );
};

export default VerificationModal;
