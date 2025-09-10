import React from 'react';
import PropTypes from 'prop-types';
import "../../../css/admin/showOrderAdmin.css";

const OrderDetails = ({ items, fullName, email, onClose }) => {
    return (
        <>
            <div>
                Đơn hàng của {fullName}({email})
            </div>
            <table className="orderDetailsTable">
                <thead>
                    <tr>
                        <th>Ảnh</th>
                        <th>Tên sản phẩm</th>
                        <th>ROM</th>
                        <th>Số lượng</th>
                        <th>Giá</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index} className="orderItemRow">
                            <td>
                                <img
                                    src={`${import.meta.env.VITE_API_BASE_URL}${item.image}`}
                                    alt={item.name}
                                    className="orderItemImage"
                                />
                            </td>
                            <td>{item.name}</td>
                            <td>{item.rom}</td>
                            <td>{item.quantity}</td>
                            <td>{item.price.toLocaleString()}đ</td>
                        </tr>
                    ))}
                </tbody>
            </table>
                <button className="btn-close" onClick={onClose}>
                    Đóng
                </button>
        </>
    );
};

OrderDetails.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        image: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        rom: PropTypes.string,
        quantity: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
    })).isRequired,
};

export default OrderDetails;
