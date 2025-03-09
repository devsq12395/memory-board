import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import supabase from "../lib/supabase";
import Button from '../components/common/Button';

import { processCartItems } from "../services/shopService";

const TransactionResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"success" | "error" | "loading">("loading");
  const startedProcessing = useRef(false);

  useEffect(() => {
    startHandlingItemsProcessing();
  }, []);

  const loadUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
  };

  const returnToMainPage = () => {
    navigate(localStorage.getItem('currentRoute') || '/');
    window.location.reload();
  };

  const startHandlingItemsProcessing = async () => {
    if (startedProcessing.current) return;
    startedProcessing.current = true;

    try {
      const sessionId = searchParams.get("session_id");
      
      if (!sessionId) {
        setStatus("error");
        return;
      }

      // Get user details
      const userId = await loadUserData();

      // Verify the session ID with the backend
      fetch(`${import.meta.env.VITE_API_BASE_URL}/verify-payment?session_id=${sessionId}`)
        .then((res) => res.json())
        .then(async (data) => {
          if (data.success) {
            setStatus("success");
            try {
              await processCartItems(userId || '');
            } catch (error) {
              console.error('Error processing cart items:', error);
            }
          } else {
            setStatus("error");
          }
        })
        .catch(() => setStatus("error"));
    } catch (error) {
      console.error('Error processing cart items:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        {status === "loading" && (
          <div className="text-center">
            <h2 className="text-lg font-semibold">Processing your transaction...</h2>
            <p className="text-gray-500">Please wait a moment.</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-green-600">Payment Successful! 🎉</h2>
            <p className="text-gray-500 mt-2">Thank you for your purchase.</p>
            <div className="mt-4">
              <Button
                type="button"
                text="Back"
                onClick={returnToMainPage}
                className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
              />
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-red-600">Payment Failed! ❌</h2>
            <p className="text-gray-500 mt-2">There was an issue with your transaction.</p>
            <div className="mt-4 space-x-2">
              <Button
                type="button"
                text="Try Again"
                onClick={() => {}}
                className="bg-gray-600 text-white px-4 py-2 rounded-md shadow hover:bg-gray-700 transition"
              />
              <Button
                type="button"
                text="Contact Support"
                onClick={() => navigate("/support")}
                className="bg-red-600 text-white px-4 py-2 rounded-md shadow hover:bg-red-700 transition"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionResult;
