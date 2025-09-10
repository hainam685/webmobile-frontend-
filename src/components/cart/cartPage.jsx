import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCartAsync, loadCart } from "../../store/cart.js";
import "../../css/home/cartPage.css";
import { Helmet } from "react-helmet-async";


import axios from "axios";

const CartPage = () => {
    const profile = useSelector(state => state.profile.Profile);
    const cartItems = useSelector((state) => state.cart.items);
    const dispatch = useDispatch();

    useEffect(() => {
         dispatch(loadCart());
    }, [dispatch]);

    const totalPrice = cartItems.reduce((total, item) => {
        const price = item.price * item.quantity;
        return total + price;
    }, 0);

    const handlePayment = async () => {
        if (!profile?.fullName || !profile?.address || !profile?.numberPhone) {
            alert("Vui lòng cập nhật thông tin tài khoản trước khi thanh toán.");
            return;
        }
        const paymentData = {
            amount: totalPrice,
            orderInfo: "payment",
            txnRef: `TXN-${Date.now()}`,
            email: profile?.email,
        };

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/create-payment`, paymentData);
            const { url } = response.data;
            window.location.href = url;
        } catch (error) {
            console.error("Thanh toán thất bại:", error);
            alert("Có lỗi xảy ra khi gửi yêu cầu thanh toán.");
        }
    };

    const handleRemove = (productId, color, rom) => {
       dispatch(removeFromCartAsync({ productId, color, rom }));
    };

    return (
        <>
            <Helmet>
                <title>Giỏ hàng | Hải Nam Mobile</title>
                <meta
                    name="description"
                    content="Xem các sản phẩm bạn đã thêm vào giỏ hàng. Sẵn sàng thanh toán tại Hải Nam Mobile."
                />
            </Helmet>
            <div className="cart-page">
                <h2>Giỏ Hàng Của Bạn</h2>
                {cartItems.length === 0 ? (
                    <p>Không có sản phẩm nào trong giỏ.</p>
                ) : (
                    <>
                        <ul className="cart-list">
                            {cartItems.map((item) => (
                                <li key={item._id} className="cart-item">
                                    <img src={`${import.meta.env.VITE_API_BASE_URL}${item.image}`} alt={item.name} />
                                    <div className="item-info">
                                        <p>{item.name}</p>
                                        <p>Giá: {(item.price).toLocaleString()}đ</p>
                                        <p>Màu: {item.color}</p>
                                        <p>Bộ nhớ: {item.rom}</p>
                                        <p>Số lượng: {item.quantity}</p>
                                        <button onClick={() => handleRemove(item.productId, item.color, item.rom)} >xóa</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="cart-summary">
                            <h3>Tổng cộng: {totalPrice.toLocaleString()}đ</h3>
                            <button onClick={handlePayment}>Thanh toán</button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default CartPage;
