import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import { setupAuthInterceptor } from "../api/axios.js";

/**
 * AuthInterceptor
 *
 * Renders nothing visible. Its sole purpose is to register the
 * forceLogout + navigate callbacks with the Axios response interceptor
 * so that session-expiry events can trigger a proper logout flow from
 * inside the React component tree.
 *
 * Must be rendered inside both <BrowserRouter> and <AuthProvider>.
 */
const AuthInterceptor = () => {
    const { forceLogout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        setupAuthInterceptor({
            forceLogout: () => {
                const didLogout = forceLogout();

                if (didLogout) {
                    toast.error("Your session has expired. Please sign in again.", {
                        id: "session-expired",        // deduplicate concurrent toasts
                        duration: 4000,
                        style: {
                            borderRadius: "12px",
                            background: "#1C1A18",
                            color: "#F7F3ED",
                            fontSize: "14px",
                            fontWeight: 500,
                            padding: "12px 16px",
                            boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
                        },
                        iconTheme: {
                            primary: "#C1623F",
                            secondary: "#F7F3ED",
                        },
                    });
                }

                return didLogout;
            },
            navigate,
        });
    // forceLogout and navigate are stable references — this effect runs once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
};

export default AuthInterceptor;
