import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "../../css/order/order.css";
import { Helmet } from "react-helmet-async";


const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const userId = useSelector((state) => state.profile?.Profile?._id);
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/getOdersByUserId/${userId}`);
                setOrders(res.data);
            } catch (err) {
                setError("Không thể lấy đơn hàng");
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchOrders();
    }, [userId]);

    if (loading) return <p>Đang tải đơn hàng...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            <Helmet>
                <title>Lịch sử đơn hàng | Hải Nam Mobile</title>
                <meta
                    name="description"
                    content="Xem lại các đơn hàng đã đặt tại Hải Nam Mobile, bao gồm trạng thái thanh toán và chi tiết sản phẩm."
                />
            </Helmet>
            <div className="order-page">
                <h2 className="order-title">Đơn hàng của bạn</h2>
                {orders.length === 0 ? (
                    <p>Bạn chưa có đơn hàng nào.</p>
                ) : (
                    <ul className="order-list">
                        {orders.map((order) => (
                            <li key={order._id} className="order-card">
                                <h3 className="order-id-title">Đơn hàng: {order.orderId}</h3>
                                <div className="order-info-row">
                                    <p><strong>Tổng tiền:</strong> {order.totalAmount.toLocaleString()}₫</p>
                                    <p><strong>Trạng thái thanh toán:</strong> <span className={order.paymentStatus === 'success' ? 'text-success' : 'text-fail'}>{order.paymentStatus}</span></p>
                                    <p><strong> Trạng thái đơn hàng: {order.orderStatus}</strong></p>
                                    <p><strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                                </div>
                                <div className="product-list-order">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="product-item-order">
                                            <img src={`${import.meta.env.VITE_API_BASE_URL}${item.image}`} alt={item.name} className="product-image-order" />
                                            <div className="product-details-order">
                                                <p className="product-name-order">{item.name}</p>
                                                <p>Số lượng: {item.quantity}</p>
                                                <p>Giá: {item.price.toLocaleString()}₫</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ul>

                )}
            </div>
        </>
    );
};

export default OrderList;
