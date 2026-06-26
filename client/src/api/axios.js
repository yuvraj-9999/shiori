import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

/**
 * authHandlers is populated once by the top-level App via
 * `setupAuthInterceptor`. Keeping it as a plain object avoids
 * circular-dependency issues with React context.
 */
export const authHandlers = {
    forceLogout: null,
    navigate: null,
};

export const setupAuthInterceptor = ({ forceLogout, navigate }) => {
    authHandlers.forceLogout = forceLogout;
    authHandlers.navigate = navigate;
};

// ── Request interceptor — attach JWT ─────────────────────────────────────────
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        console.error("Request error", error);
        return Promise.reject(error);
    }
);

// ── Response interceptor — session expiration handling ───────────────────────
const AUTH_ERROR_CODES = new Set(["TOKEN_EXPIRED", "INVALID_TOKEN", "AUTH_REQUIRED"]);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const errorCode = error?.response?.data?.error;

        // Only act on 401s that carry a recognised auth-error code.
        if (status === 401 && AUTH_ERROR_CODES.has(errorCode)) {
            const didLogout = authHandlers.forceLogout?.();

            if (didLogout) {
                // Avoid importing toast here to keep the api module pure;
                // the toast is fired by the component that consumes the
                // AuthContext event — see AuthContext's forceLogout handler.
                // Fire navigation after the current call stack clears.
                setTimeout(() => {
                    authHandlers.navigate?.("/login");
                }, 0);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
