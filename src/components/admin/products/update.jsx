import { useState, useEffect } from "react";
import "../../../css/admin/addProduct.css";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { updateProduct } from "../../../store/product";
import { toast } from 'react-toastify';


const UpdateProduct = ({ onClose, productData }) => {
    const [product, setProduct] = useState(productData || []);
    useEffect(() => {
        if (productData) {
            setProduct({
                ...productData,
                color: productData?.color || "",
                price: productData?.price || 0,
                rom: productData?.rom || "",
                quantity: productData?.quantity || "",
            });
        }
    }, [productData]);
    const dispatch = useDispatch();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (event) => {
        setProduct({
            ...product,
            image: event.target.files[0],
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("name", product.name);
        formData.append("category", product.category);
        formData.append("price", product.price);
        formData.append("rom", product.rom);
        formData.append("quantity", product.quantity);
        if (product.image) {
            formData.append("image", product.image);
        }
        formData.append("color", product.color);

        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/api/updateProduct/${productData._id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            dispatch(updateProduct(response.data));
            onClose();
            toast.success("Sửa sản phẩm thành công!");
        } catch (error) {
            console.error("Lỗi khi cập nhật sản phẩm:", error);
            toast.error("Có lỗi xảy ra khi cập nhật sản phẩm.", error);
        }
    };

    return (
        <div className="overlay">
            <div className="add-product-container">
                <button className="close-btn" onClick={onClose}>×</button>
                <h2>Cập nhật sản phẩm</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Tên sản phẩm"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        required
                    />
                    <select
                        name="category"
                        value={product.category || ""}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Chọn loại sản phẩm --</option>
                        <option value="Iphone">IPhone</option>
                        <option value="Samsung">Samsung</option>
                        <option value="Xiaomi">Xiaomi</option>
                        <option value="Oppo">Oppo</option>
                        <option value="Realme">Realme</option>
                    </select>
                    <input
                        type="file"
                        name="image"
                        onChange={handleImageChange}
                    />
                    <input
                        type="number"
                        placeholder="Giá"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        required
                    />
                    <select
                        name="category"
                        value={product.rom || ""}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Chọn Bộ Nhớ --</option>
                        <option value="64GB">64GB</option>
                        <option value="128GB">128GB</option>
                        <option value="256GB">256GB</option>
                        <option value="512GB">512GB</option>
                        <option value="1T">1T</option>
                    </select>
                    <input
                        type="number"
                        placeholder="Số lượng"
                        name="quantity"
                        value={product.quantity}
                        onChange={handleChange}
                        required
                    />
                    <select
                        name="color"
                        value={product.color || ""}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Chọn màu --</option>
                        <option value="Trắng">Trắng</option>
                        <option value="Đen">Đen</option>
                        <option value="Hồng">Hồng</option>
                        <option value="Vàng Gold">Vàng Gold</option>
                        <option value="Xanh">Xanh</option>
                    </select>
                    <button type="submit" className="submit-btn">Cập nhật</button>
                </form>
            </div>
        </div>
    );
};

export default UpdateProduct;
