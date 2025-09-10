import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../css/home/home.css";
import GetBestSellingProducts from "./getBestSellingProducts/getBestSellingProducts.jsx";
import DiscountedProducts from "./discountedProducts/discountedProducts.jsx";
import axios from "axios";
import { loadCart } from "../store/cart.js";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Helmet } from 'react-helmet-async';

export default function HomePage() {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(loadCart());
  }, [dispatch]);

  const categories = ["Iphone", "Samsung", "Xiaomi", "Oppo", "Realme"];

  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`);
  };



  return (
    <>
      <Helmet>
        <title>Trang chủ | Hải Nam Mobile</title>
        <meta name="description" content="Website bán điện thoại chính hãng, hỗ trợ thanh toán VNPay, giao hàng toàn quốc." />
      </Helmet>
      <div className="container">
        <div className="content">
          <aside className="sideBar">
            <h3>DANH MỤC SẢN PHẨM</h3>
            <ul>
              {categories.map((category, index) => (
                <li key={index} onClick={() => handleCategoryClick(category)}>
                  📱 {category}
                </li>
              ))}
            </ul>
          </aside>
          <section className="banner-section">
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={true}
              spaceBetween={0}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
            >
              <SwiperSlide>
                <img src="/banner.jpg" alt="Banner 1" className="banner" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/banner2.jpg" alt="Banner 2" className="banner" />
              </SwiperSlide>
            </Swiper>
          </section>
        </div>
        <section className="product-list">
          <GetBestSellingProducts />
          <DiscountedProducts />
        </section>
      </div>
    </>
  );
}
