import { useState } from "react";
import axios from "axios";
import "../../css/login-reg/reg.css";
import { Helmet } from "react-helmet-async";
import { toast } from 'react-toastify';



export default function RegisterForm({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
        email,
        password,
        address: "",
        numberPhone: "",
        fullName: ""
      });
      toast.success("Đăng ký tài khoản thành công!");
    } catch (err) {
      setError("Email đã tồn tại hoặc có lỗi xảy ra");
      toast.error("Đăng ký tài khoản thất bại!");
    }
  };

  return (
    <>
      <Helmet>
        <title>Đăng ký tài khoản | Hải Nam Mobile</title>
        <meta
          name="description"
          content="Tạo tài khoản để mua hàng, lưu giỏ hàng và theo dõi đơn hàng tại Hải Nam Mobile."
        />
      </Helmet>
      <div className="register-overlay">
        <div className="register-container">
          <h2 className="register-title">TẠO TÀI KHOẢN</h2>
          <p className="register-subtitle">Nhập email và mật khẩu của bạn:</p>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              className="register-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="register-input"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="register-button">ĐĂNG KÝ</button>
          </form>
        </div>
      </div>
    </>
  );
}
