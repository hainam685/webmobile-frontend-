import { useState } from "react";
import "../../../css/admin/addProduct.css";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { addProduct } from "../../../store/product";
import { toast } from 'react-toastify';


const AddProduct = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();

  const [product, setProduct] = useState({
    name: "",
    category: "",
    description: "",
    roms: [],
  });

  const [romInput, setRomInput] = useState({
    rom: "",
    price: "",
    variants: [],
  });

  const [variantInput, setVariantInput] = useState({
    color: "",
    quantity: "",
    image: null,
  });

  const handleMainChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleRomChange = (e) => {
    const { name, value } = e.target;
    setRomInput(prev => ({ ...prev, [name]: value }));
  };

  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    setVariantInput(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setVariantInput(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const addVariantToRom = () => {
    const { color, quantity, image } = variantInput;
    if (!color || !quantity || !image) {
      alert("Vui lòng nhập đủ thông tin biến thể");
      return;
    }

    setRomInput(prev => ({
      ...prev,
      variants: [...prev.variants, variantInput],
    }));

    setVariantInput(prev => ({ ...prev, quantity: "" }));
  };

  const addRomGroup = () => {
    const { rom, price, variants } = romInput;
    if (!rom || !price || variants.length === 0) {
      alert("Nhập đầy đủ ROM, giá và ít nhất 1 biến thể");
      return;
    }

    setProduct(prev => ({
      ...prev,
      roms: [...prev.roms, romInput],
    }));

    setRomInput({ rom: "", price: "", variants: [] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("name", product.name);
    formData.append("category", product.category);
    formData.append("description", product.description);

    product.roms.forEach((rom, i) => {
      formData.append(`roms[${i}][rom]`, rom.rom);
      formData.append(`roms[${i}][price]`, rom.price);
      formData.append(`roms[${i}][romDescription]`, rom.romDescription);

      rom.variants.forEach((variant, j) => {
        formData.append(`roms[${i}][variants][${j}][color]`, variant.color);
        formData.append(`roms[${i}][variants][${j}][quantity]`, variant.quantity);
        formData.append(`roms[${i}][variants][${j}][image]`, variant.image);
        formData.append(`roms[${i}][variants][${j}][variantDescription]`, variant.variantDescription); // Mô tả màu sắc
      });
    });

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/uploadProduct`, formData);
      const fullProduct = res.data;

      // Lọc ra các rom đã được gửi lên, chỉ gửi các rom đã được thay đổi hoặc thêm mới
      const filteredRoms = fullProduct.roms.filter((rom) => rom.rom === formData.get("roms[0][rom]"));

      const filteredProduct = {
        _id: fullProduct._id,
        name: fullProduct.name,
        category: fullProduct.category,
        description: fullProduct.description,
        roms: filteredRoms,
      };

      dispatch(addProduct(filteredProduct));
      onClose();
      toast.success("Đã thêm sản phẩm thành công!")
    } catch (err) {
      console.error(err);
      toast.error("Thêm sản phẩm thất bại!");
    }
  };


  return (
    <div className="overlay">
      <div className="add-product-container">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Thêm sản phẩm</h2>

        {step === 1 && (
          <div className="input-wrapper">
            <input type="text" name="name" placeholder="Tên sản phẩm" value={product.name} onChange={handleMainChange} required/>
            <select name="category" value={product.category} onChange={handleMainChange} required>
              <option value="">-- Chọn loại sản phẩm --</option>
              <option value="Iphone">Iphone</option>
              <option value="Samsung">Samsung</option>
              <option value="Xiaomi">Xiaomi</option>
              <option value="Oppo">Oppo</option>
              <option value="Realme">Realme</option>
            </select>
            <textarea
              type="text"
              name="description"
              placeholder="Mô tả sản phẩm"
              value={product.description}
              onChange={handleMainChange}
            />
            <button type="button" onClick={() => setStep(2)} className="submit-btn">Tiếp tục</button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="input-wrapper">
            <h4>Thêm biến thể</h4>
            <select name="color" value={variantInput.color} onChange={handleVariantChange}>
              <option value="">-- Chọn màu --</option>
              <option value="Trắng">Trắng</option>
              <option value="Đen">Đen</option>
              <option value="Hồng">Hồng</option>
              <option value="Vàng Gold">Vàng Gold</option>
              <option value="Xanh">Xanh</option>
            </select>
            <input type="number" name="quantity" placeholder="Số lượng" value={variantInput.quantity} onChange={handleVariantChange} />
            <input type="file" name="image" onChange={handleImageChange} />
            <button type="button" onClick={addVariantToRom} className="submit-btn">Thêm biến thể</button>

            <h5>Thêm ROM</h5>
            <select name="rom" value={romInput.rom} onChange={handleRomChange}>
              <option value="">-- Chọn ROM --</option>
              <option value="64GB">64GB</option>
              <option value="128GB">128GB</option>
              <option value="256GB">256GB</option>
              <option value="512GB">512GB</option>
              <option value="1T">1T</option>
            </select>
            <input type="number" name="price" placeholder="Giá" value={romInput.price} onChange={handleRomChange} />
            <ul>
              {romInput.variants.map((v, i) => (
                <li key={i}>{v.color} - SL: {v.quantity}</li>
              ))}
            </ul>

            <button type="button" onClick={addRomGroup} className="submit-btn">Lưu ROM</button>

            <h4>ROM đã thêm</h4>
            <ul>
              {product.roms.map((r, i) => (
                <li key={i}>{r.rom} - {r.price}đ - {r.variants.length} biến thể</li>
              ))}
            </ul>

            <button type="submit" className="submit-btn">Lưu sản phẩm</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddProduct;
