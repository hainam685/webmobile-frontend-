/**
 * Home Page Component - Refactored
 * Improved with better error handling and performance optimization
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { loadCart } from '../store/cart.js';
import GetBestSellingProducts from './getBestSellingProducts/getBestSellingProducts.jsx';
import DiscountedProducts from './discountedProducts/discountedProducts.jsx';
import '../css/home/home.css';

// Constants
const CATEGORIES = ['Iphone', 'Samsung', 'Xiaomi', 'Oppo', 'Realme'];
const BANNERS = [
  { id: 1, src: '/banner.jpg', alt: 'Banner 1' },
  { id: 2, src: '/banner2.jpg', alt: 'Banner 2' },
];

/**
 * Home Page Component
 */
const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const initializationRef = useCallback(() => null, []);

  // Memoize categories to prevent unnecessary re-renders
  const categories = useMemo(() => CATEGORIES, []);
  const banners = useMemo(() => BANNERS, []);

  // Initialize cart on component mount
  useEffect(() => {
    const initializeCart = async () => {
      try {
        dispatch(loadCart());
      } catch (err) {
        console.error('Error loading cart:', err);
        setError('Failed to load cart');
      }
    };

    initializeCart();
  }, [dispatch]);

  // Handle category click
  const handleCategoryClick = useCallback(
    (category) => {
      if (!category || typeof category !== 'string') {
        console.error('Invalid category:', category);
        return;
      }

      try {
        navigate(`/category/${encodeURIComponent(category)}`);
      } catch (err) {
        console.error('Navigation error:', err);
        setError('Failed to navigate to category');
      }
    },
    [navigate]
  );

  // Handle search
  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();

      if (!search.trim()) {
        setError('Please enter a search term');
        return;
      }

      try {
        navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to search');
      }
    },
    [search, navigate]
  );

  return (
    <>
      <Helmet>
        <title>Trang chủ | Hải Nam Mobile</title>
        <meta
          name="description"
          content="Website bán điện thoại chính hãng, hỗ trợ thanh toán VNPay, giao hàng toàn quốc."
        />
        <meta name="keywords" content="điện thoại, mobile, iphone, samsung" />
      </Helmet>

      <div className="container">
        {error && (
          <div className="error-banner" role="alert">
            {error}
            <button
              className="error-close"
              onClick={() => setError(null)}
              aria-label="Close error"
            >
              ✕
            </button>
          </div>
        )}

        <div className="content">
          <aside className="sideBar" role="complementary" aria-label="Product categories">
            <h3>DANH MỤC SẢN PHẨM</h3>
            <ul>
              {categories.map((category) => (
                <li
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleCategoryClick(category);
                    }
                  }}
                  className="category-item"
                >
                  📱 {category}
                </li>
              ))}
            </ul>
          </aside>

          <section className="banner-section" aria-label="Product banners">
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              loop={true}
              spaceBetween={0}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              aria-label="Banner carousel"
            >
              {banners.map((banner) => (
                <SwiperSlide key={banner.id}>
                  <img
                    src={banner.src}
                    alt={banner.alt}
                    className="banner"
                    loading="lazy"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
        </div>

        <section className="product-list" aria-label="Featured products">
          <GetBestSellingProducts />
          <DiscountedProducts />
        </section>
      </div>
    </>
  );
};

export default HomePage;
