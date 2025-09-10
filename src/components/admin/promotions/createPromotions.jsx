import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../css/admin/createPromotions.css";
import { toast } from 'react-toastify';


const CreatePromotion = ({ onClose }) => {
  const [promotion, setPromotion] = useState({
    name: "",
    discountPercent: "",
    applicableCategories: [],
    startDate: "",
    endDate: "",
  });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/getCategory")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Lỗi khi tải sản phẩm:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromotion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategorySelect = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setPromotion((prev) => ({
      ...prev,
      applicableCategories: selected,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/createPromotion`, promotion);
      onClose();
      toast.success("Đã tạo chương trình khuyến mãi thành công!");
    } catch (error) {
      console.error("Lỗi tạo khuyến mãi:", error);
      toast.error("Tạo khuyến mãi thất bại!");
    }
  };

  return (
    <div className="overlay">
      <div className="create-promotion-container">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Tạo chương trình khuyến mãi</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Tên chương trình"
            value={promotion.name}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="discountPercent"
            placeholder="Giảm giá (%)"
            value={promotion.discountPercent}
            onChange={handleChange}
            min={1}
            max={100}
            required
          />
          <label>Chọn sản phẩm áp dụng:</label>
          <select
            multiple
            name="applicableProducts"
            value={promotion.applicableCategories}
            onChange={handleCategorySelect}
            required
          >
            {products.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>

          <label>Ngày bắt đầu:</label>
          <input
            type="datetime-local"
            name="startDate"
            value={promotion.startDate}
            onChange={handleChange}
            required
          />

          <label>Ngày kết thúc:</label>
          <input
            type="datetime-local"
            name="endDate"
            value={promotion.endDate}
            onChange={handleChange}
            required
          />

          <button type="submit" className="submit-btn">Tạo khuyến mãi</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePromotion;
