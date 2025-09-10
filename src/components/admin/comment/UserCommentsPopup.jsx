import React from "react";
import "../../../css/admin/UserCommentsPopup.css";
const UserCommentsPopup = ({ userData, onClose, onDelete }) => {
    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h3>Bình luận của {userData.user.fullName} ({userData.user.email})</h3>
                <table className="popup-table">
                    <thead>
                        <tr>
                            <th>Sản phẩm</th>
                            <th>Màu</th>
                            <th>Bộ nhớ</th>
                            <th>Nội dung</th>
                            <th>Ngày tạo</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userData.comments.map(comment => (
                            <tr key={comment._id}>
                                <td>{comment.product?.name || "Không xác định"}</td>
                                <td>{comment.color}</td>
                                <td>{comment.rom}</td>
                                <td>{comment.content}</td>
                                <td>{new Date(comment.createdAt).toLocaleString()}</td>
                                <td>
                                    <button className="btn-delete" onClick={() => onDelete(comment._id)}>Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button className="btn-close" onClick={onClose}>Đóng</button>
            </div>
        </div>
    );
};

export default UserCommentsPopup;
