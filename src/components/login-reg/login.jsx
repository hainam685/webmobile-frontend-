import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../css/login-reg/login.css";
import { setProfile } from "../../store/user.js";
import { useDispatch } from "react-redux";
import { toast } from 'react-toastify';


export default function LoginForm({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handRegFormOpen = () => {
    onClose();    
    navigate("/register");
  };

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      const userRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/user`, {
        headers: { Authorization: `Bearer ${res.data.token}` }
      });

      const userData = userRes.data;
      dispatch(setProfile(userData));
      localStorage.setItem("userProfile", JSON.stringify(userData));
      navigate("/");
      const localCartData = JSON.parse(localStorage.getItem("cartItems"));
      if (localCartData && Array.isArray(localCartData) && localCartData.length > 0) {
        const totalAmount = localCartData.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const formattedItems = localCartData.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        }));
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/saveCart`, {
          items: formattedItems,
          totalAmount,
          userInfo: {
            fullName: userData.fullName,
            email: userData.email,
            numberPhone: userData.numberPhone,
            address: userData.address
          }
        }, {
          headers: {
            Authorization: `Bearer ${res.data.token}`
          }
        });

        localStorage.removeItem("cartItems");
      }

      onClose();

    } catch (err) {
      console.error("Error from server:", err.response ? err.response.data : err);
      setError(err.response ? err.response.data.message : "Lỗi không xác định");
    }
  };




  return (
    <div className="login-overlay">
      <div className="login-container">
        <h2 className="login-title">ĐĂNG NHẬP TÀI KHOẢN</h2>
        <p className="login-subtitle">Nhập email và mật khẩu của bạn:</p>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="login-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="login-input"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-button">ĐĂNG NHẬP</button>
        </form>
        <div className="login-links">
          <button onClick={handRegFormOpen}>Tạo tài khoản</button>
          <a href="#">Khôi phục mật khẩu</a>
        </div>
      </div>
    </div>
  );
}
