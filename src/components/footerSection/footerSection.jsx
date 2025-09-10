import React from "react";
import "../../css/footerSection/footerSection.css";

const FooterSection = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-logo">
                    <img src="/logo.png" alt="Logo" />
                    <p>© {new Date().getFullYear()} Cửa hàng điện thoại hải nam mobile</p>
                </div>

                <div className="footer-links">
                    <h4>Liên kết</h4>
                    <ul>
                        <li><a href="/">Trang chủ</a></li>
                        <li><a href="/products">Sản phẩm</a></li>
                        <li><a href="/about">Giới thiệu</a></li>
                        <li><a href="/contact">Liên hệ</a></li>
                    </ul>
                </div>

                <div className="footer-contact">
                    <h4>Thông tin liên hệ</h4>
                    <p>Email: support@cuahang.com</p>
                    <p>Hotline: </p>
                    <p>Địa chỉ: </p>
                </div>
            </div>
        </footer>
    );
};

export default FooterSection;
