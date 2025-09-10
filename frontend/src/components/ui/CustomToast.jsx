// src/components/CustomToaster.jsx
import { Toaster } from "react-hot-toast";
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from "react-icons/fa";

const CustomToaster = () => {
    return (
        <Toaster
            position="top-center"
            gutter={8}
            containerStyle={{
                top: "10px",
                bottom: "10px",
                left: "var(--spacing)",
                right: "var(--spacing)",
            }}
            toastOptions={{
                style: {
                    padding: "var(--spacing-xs) var(--spacing)",
                    borderRadius: "var(--border-radius-full)",
                    fontSize: "var(--font-size-s)",
                    width: "400px",
                    maxWidth: "var(--spacing-9xl)",
                    display: "flex",
                    alignItems: "center",
                    textAlign: "center",
                },
                success: {
                    style: {
                        color: "var(--color-primary-text)",
                        background: "var(--color-primary-bg)",
                    },
                    icon: <FaCheckCircle size={18} />,
                },
                error: {
                    style: {
                        color: "var(--color-error-text)",
                        background: "var(--color-error-muted)",
                    },
                    icon: <FaTimesCircle size={18} />,
                    duration: Infinity, // Stays until closed
                },
                blank: {
                    style: {
                        color: "var(--color-warning-text)",
                        background: "var(--color-warning-muted)",
                    },
                    icon: <FaExclamationTriangle size={18} />,
                },
            }}
        />
    );
};

export default CustomToaster;
