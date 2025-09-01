import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TermsAgreementModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal Box */}
            <motion.div
              className="fixed inset-0 flex justify-center items-center z-50"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full mx-4 p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Terms & Agreement
                </h2>

                {/* Scrollable Content */}
                <div className="h-64 overflow-y-auto space-y-4 text-gray-600 text-sm leading-relaxed pr-2">
                  <p>
                    Welcome! By accessing or using this platform, you agree to
                    abide by the following terms and conditions. Please read
                    them carefully before proceeding.
                  </p>
                  <p>
                    1. <strong>Account Responsibility:</strong> You are
                    responsible for maintaining the confidentiality of your
                    account and password, and for all activities under your
                    account.
                  </p>
                  <p>
                    2. <strong>Acceptable Use:</strong> You agree not to use the
                    platform for unlawful, abusive, or unauthorized purposes.
                    Any violation may result in suspension or termination of
                    your access.
                  </p>
                  <p>
                    3. <strong>Data & Privacy:</strong> We may collect, store,
                    and process your data in line with our Privacy Policy. By
                    using this platform, you consent to such practices.
                  </p>
                  <p>
                    4. <strong>Updates to Terms:</strong> We reserve the right
                    to update or modify these terms at any time. Continued use
                    of the platform constitutes acceptance of the revised terms.
                  </p>
                  <p>
                    If you do not agree with these terms, please discontinue
                    using this application.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
export default TermsAgreementModal;
