import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SideBar from '../../sidebar/sideBar.jsx';
import usePagination from '../../../hook/usePagination.js';
import OrderDetails from '../order/OrderDetails.jsx';
import "../../../css/admin/showOrderAdmin.css";
import { toast } from 'react-toastify';

const AdminOrdersByUser = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const navigate = useNavigate();
    const itemsPerPage = 5;
    const [orderIdFilter, setOrderIdFilter] = useState('');
    const [accountFilter, setAccountFilter] = useState('');


    const menuItems = [
        { label: "Tài khoản", path: "/admin/dashboard", icon: "person" },
        { label: "Sản phẩm", path: "/admin/products", icon: "inventory_2" },
        { label: "Đơn hàng", path: "/admin/orders", icon: "receipt_long" },
        { label: "Khuyến mãi", path: "/admin/promotions", icon: "local_offer" },
        { label: "Bình luận", path: "/admin/comments", icon: "chat" },
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/admin-login");
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/getOrdersGroupedByUser`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const allOrders = [];
                Object.entries(res.data).forEach(([userId, userData]) => {
                    userData.orders.forEach(order => {
                        allOrders.push({
                            ...order,
                            user: userData.user,
                            userId
                        });
                    });
                });

                setOrders(allOrders);
            } catch (error) {
                console.error("Lỗi khi lấy đơn hàng:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const filteredOrders = orders.filter((order) =>
        (order.orderId || "").toLowerCase().includes(orderIdFilter.toLowerCase()) &&
        (
            order?.user?.fullName.toLowerCase().includes(accountFilter.toLowerCase()) ||
            order?.user?.email.toLowerCase().includes(accountFilter.toLowerCase())
        )
    );


    const {
        currentPage,
        totalPages,
        setCurrentPage,
        currentData
    } = usePagination(filteredOrders, itemsPerPage)

    const handleStatusChange = async (userId, orderId, newOrderStatus) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/orders/${orderId}/status`, {
                orderStatus: newOrderStatus
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const updatedOrder = res.data.order;

            setOrders(prev =>
                prev.map(order =>
                    order._id === updatedOrder._id
                        ? { ...updatedOrder, user: order.user }
                        : order
                )
            );
            toast.success("Đã cập nhật trạng thái đơn hàng thành công!")
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
            toast.error("Thất bại khi cập nhật trạng thái đơn hàng!")
        }
    };

    const handleOpenDetails = (orderId) => {
        setExpandedOrderId(orderId);
    };

    const handleCloseDetails = () => {
        setExpandedOrderId(null);
    };

    if (loading) return <p className="text-center">Đang tải dữ liệu...</p>;

    return (
        <>
            <SideBar menuItems={menuItems} onLogout={handleLogout} />
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
            <div className='showOrders'>
                <h2>Danh sách tất cả đơn hàng</h2>
                <table className="tableShowOrders" style={{ width: '100%', marginTop: 20 }}>
                    <thead>
                        <tr>
                            <th>
                                <div className="column-header">
                                    <span>Tài khoản</span>
                                    <input
                                        type="text"
                                        placeholder="Lọc theo tên hoặc email..."
                                        value={accountFilter}
                                        onChange={(e) => setAccountFilter(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="column-header">
                                    <span>Mã đơn</span>
                                    <input
                                        type="text"
                                        placeholder="Lọc theo mã đơn..."
                                        value={orderIdFilter}
                                        onChange={(e) => setOrderIdFilter(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>Tổng tiền</th>
                            <th>Ngày đặt</th>
                            <th>Trạng thái đơn hàng</th>
                            <th><span className="material-icons">settings</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map(order => (
                            <tr key={order._id}>
                                <td>{order.user.fullName} ({order.user.email})</td>
                                <td>{order.orderId}</td>
                                <td>{order.totalAmount.toLocaleString()}đ</td>
                                <td>{new Date(order.createdAt).toLocaleString()}</td>
                                <td>
                                    <select
                                        value={order.orderStatus}
                                        onChange={(e) => handleStatusChange(order.userId, order._id, e.target.value)}
                                    >
                                        <option value="Chờ xác nhận">Chờ xác nhận</option>
                                        <option value="Đang giao">Đang giao</option>
                                        <option value="Đã giao">Đã giao</option>
                                    </select>
                                </td>
                                <td>
                                    <button className="btnToggleDetails" onClick={() => handleOpenDetails(order._id)}>
                                        Xem chi tiết
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="paginationAdmin" style={{ marginTop: 20 }}>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={currentPage === i + 1 ? "active-page" : ""}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            {expandedOrderId && (
                <div className="modalOverlay">
                    <div className="modalContent">
                        {(() => {
                            const foundOrder = orders.find(o => o._id === expandedOrderId);
                            return foundOrder ? (
                                <OrderDetails
                                    items={foundOrder.items}
                                    fullName={foundOrder.user.fullName}
                                    email={foundOrder.user.email}
                                    onClose={handleCloseDetails}
                                />
                            ) : null;
                        })()}

                    </div>
                </div>
            )}
        </>
    );
};

export default AdminOrdersByUser;
