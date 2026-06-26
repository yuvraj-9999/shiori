import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { loginUser } from "../services/auth.service.js";
import { useAuth } from "../context/AuthContext.jsx";
import loginLogo from "../assets/logos/loginicon.png";

/* ── Shared animation variants ─────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1], delay },
});

/* ── Spinner ────────────────────────────────────────── */
const Spinner = () => (
  <svg
    className="animate-spin"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
    <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);

/* ── Input field ────────────────────────────────────── */
const Field = ({ id, label, type = "text", value, onChange, placeholder, autoComplete, required, minLength, suffix }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        style={{
          fontSize: 15,
          fontWeight: 500,
          color: "#181614",
          letterSpacing: "-0.01em",
        }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            height: 56,
            padding: suffix ? "0 52px 0 18px" : "0 18px",
            fontSize: 16,
            fontFamily: "inherit",
            color: "#181614",
            background: "#FFFFFF",
            border: focused ? "1.5px solid #C1623F" : "1.5px solid #E6DDD5",
            borderRadius: 16,
            outline: "none",
            boxShadow: focused
              ? "0 0 0 3px rgba(193,98,63,0.08)"
              : "none",
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            caretColor: "#C1623F",
          }}
        />
        {suffix && (
          <div
            className="absolute right-0 top-0 h-full flex items-center pr-4"
            style={{ pointerEvents: "auto" }}
          >
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      login(data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100svh",
        background: "#F7F3ED",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* ── Logo ──────────────────────────────────────── */}
        <motion.div
          {...fadeUp(0)}
          style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}
        >
          <img
            src={loginLogo}
            alt="Shiori"
            style={{
              width: "auto",
              maxWidth: 150,
              height: "auto",
              objectFit: "contain",
              display: "block",
            }}
          />
        </motion.div>

        {/* ── Brand name ────────────────────────────────── */}
        <motion.h1
          {...fadeUp(0.07)}
          style={{
            fontSize: 42,
            fontWeight: 700,
            color: "#181614",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            textAlign: "center",
            margin: "0 0 6px",
          }}
        >
          Shiori
        </motion.h1>

        {/* ── Tagline ───────────────────────────────────── */}
        <motion.p
          {...fadeUp(0.12)}
          style={{
            fontSize: 17,
            fontWeight: 400,
            color: "#6F675F",
            textAlign: "center",
            margin: "0 0 36px",
            letterSpacing: "-0.01em",
          }}
        >
          Your AI Research Workspace
        </motion.p>

        {/* ── Error ─────────────────────────────────────── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ marginBottom: 20, overflow: "hidden" }}
            >
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  color: "#B91C1C",
                  fontSize: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#B91C1C",
                    flexShrink: 0,
                  }}
                />
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Form ──────────────────────────────────────── */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Email */}
            <motion.div {...fadeUp(0.17)}>
              <Field
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </motion.div>

            {/* Password */}
            <motion.div {...fadeUp(0.22)}>
              <div className="flex flex-col gap-2">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <label
                    htmlFor="password"
                    style={{
                      fontSize: 15,
                      fontWeight: 500,
                      color: "#181614",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Password
                  </label>
                </div>
                <Field
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  suffix={
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        color: "#A09890",
                        display: "flex",
                        alignItems: "center",
                        lineHeight: 0,
                        transition: "color 0.15s ease",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = "#6F675F"}
                      onMouseLeave={(e) => e.currentTarget.style.color = "#A09890"}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <HiOutlineEyeOff style={{ width: 18, height: 18 }} />
                      ) : (
                        <HiOutlineEye style={{ width: 18, height: 18 }} />
                      )}
                    </button>
                  }
                />
              </div>
            </motion.div>

            {/* Continue button */}
            <motion.div {...fadeUp(0.27)} style={{ marginTop: 8 }}>
              <motion.button
                id="login-btn"
                type="submit"
                disabled={loading}
                whileHover={loading ? {} : { y: -1, boxShadow: "0 4px 16px rgba(24,22,20,0.18)" }}
                whileTap={loading ? {} : { scale: 0.99 }}
                style={{
                  width: "100%",
                  height: 56,
                  background: "#181614",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: 16,
                  fontSize: 16,
                  fontWeight: 600,
                  fontFamily: "inherit",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  letterSpacing: "-0.01em",
                  transition: "opacity 0.2s ease",
                }}
              >
                {loading ? (
                  <>
                    <Spinner />
                    Signing in…
                  </>
                ) : (
                  "Continue"
                )}
              </motion.button>
            </motion.div>
          </div>
        </form>

        {/* ── Divider ───────────────────────────────────── */}
        <motion.div
          {...fadeUp(0.32)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            margin: "32px 0 28px",
          }}
        >
          <div style={{ flex: 1, height: 1, background: "#E6DDD5" }} />
        </motion.div>

        {/* ── Sign up link ───────────────────────────────── */}
        <motion.p
          {...fadeUp(0.35)}
          style={{
            textAlign: "center",
            fontSize: 15,
            color: "#6F675F",
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#181614",
              fontWeight: 600,
              textDecoration: "none",
              transition: "color 0.15s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#C1623F"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#181614"}
          >
            Create account
          </Link>
        </motion.p>

      </div>
    </div>
  );
};

export default Login;