import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Use Vite environment variable for backend URL
  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Accept: "application/json" 
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        // Try to read server message if available
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Invalid credentials");
      }

      const data = await res.json();

      // Save token and user info in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect based on role
      if (data.user.role === 1) {
        navigate("/admin/dashboard"); // admin → dashboard
      } else {
        navigate("/"); // normal user → homepage
      }

    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-white/10 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Login</h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        {loading ? (
          <div className="flex justify-center my-6">
            <Loading text="Logging in..." />
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-500 bg-white/20 text-white"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-500 bg-white/20 text-white"
              required
            />
            <button
              type="submit"
              className="w-full py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition"
            >
              Login
            </button>
          </form>
        )}

        <p className="text-gray-300 text-sm mt-4 text-center">
          Don’t have an account?{" "}
          <a href="/register" className="text-yellow-400 hover:underline">
            Register
          </a>
        </p>
      </div>
    </section>
  );
};

export default Login;
