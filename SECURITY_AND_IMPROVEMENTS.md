# Security & Code Quality Improvements

## Overview

This document outlines all the security enhancements, code optimizations, and best practices that have been implemented in this React frontend project.

---

## 🔒 Security Improvements

### 1. **Secure Token Management** (`src/services/authService.js`)

**What's Fixed:**
- Tokens are now validated for integrity before use
- Hash verification prevents token tampering
- Automatic clearing of invalid tokens
- Token expiration checking

**How to Use:**
```javascript
import { authService } from "./services/authService";

// Store token
authService.setToken(token);

// Retrieve token
const token = authService.getToken();

// Check if valid
if (authService.hasValidToken()) {
  // User is authenticated
}

// Clear token on logout
authService.clearToken();

// Check expiration
if (authService.isTokenExpired()) {
  // Token needs refresh
}
```

### 2. **API Client with Security Interceptors** (`src/services/apiClient.js`)

**Features:**
- Automatic token injection in request headers
- CSRF token handling
- Error handling with 401/403/429 status codes
- Request timeout configuration (30 seconds)
- Automatic redirects on unauthorized access
- Custom event dispatching for components to react to auth errors

**How It Works:**
```javascript
import apiClient from "./services/apiClient";

// All requests automatically include:
// - Authorization Bearer token
// - X-CSRF-Token header
// - Custom headers for API identification

apiClient.get("/api/products").then(res => {
  // Token is automatically injected
});
```

### 3. **Input Validation & Sanitization** (`src/utils/validation.js`)

**Available Functions:**
- `sanitizeInput()` - Removes dangerous HTML
- `sanitizeObject()` - Recursively sanitizes objects
- `validateEmail()` - Email format validation
- `validatePhoneNumber()` - Phone format validation
- `validateURL()` - URL validation
- `validatePasswordStrength()` - Strong password checking
- `validateFormData()` - Schema-based form validation
- `sanitizeAndValidate()` - Combined sanitization and validation

**Usage Example:**
```javascript
import { validateFormData, sanitizeObject } from "./utils/validation";

const schema = {
  email: {
    type: "email",
    required: true,
    label: "Email Address",
  },
  password: {
    minLength: 8,
    required: true,
    label: "Password",
  },
};

const formData = { email: "user@example.com", password: "SecurePass123!" };
const { isValid, errors } = validateFormData(formData, schema);

// Sanitize before sending to API
const sanitized = sanitizeObject(formData);
```

### 4. **Safe localStorage Wrapper** (`src/utils/localStorage.js`)

**Features:**
- Error handling for quota exceeded
- JSON serialization/deserialization
- Optional expiration support
- Automatic cleanup of old data
- Type-safe operations

**Usage:**
```javascript
import { storageManager } from "./utils/localStorage";

// Basic operations
storageManager.setItem("key", { data: "value" });
const data = storageManager.getItem("key");
storageManager.removeItem("key");

// With expiration (1 hour)
storageManager.setItemWithExpiration("tempKey", data, 3600000);
const expiredData = storageManager.getItemWithExpiration("tempKey");

// Get size and keys
const size = storageManager.getSize();
const keys = storageManager.keys();
```

---

## 🔧 Code Optimization

### 1. **Redux Store Improvements**

#### Cart Slice (`src/store/cart.js`)
**Improvements:**
- Better error handling with descriptive messages
- Input validation before operations
- Quantity validation (minimum 1)
- Sync between local and server cart
- Loading states for each operation
- Sanitization of user input

**New Actions:**
```javascript
// Add item with automatic deduplication
dispatch(addToCartAsync(item));

// Update quantity
dispatch(updateCartItemAsync({ productId, color, rom, quantity }));

// Remove item
dispatch(removeFromCartAsync({ productId, color, rom }));

// Clear all items
dispatch(clearCartAsync());

// Clear errors
dispatch(clearError());

// Reset to initial state
dispatch(resetCart());
```

#### Product Slice (`src/store/product.js`)
**Improvements:**
- Helper functions for finding products/ROMs/variants
- Better ROM and variant management
- Improved update logic
- Added remove product action
- Timestamp tracking (lastUpdated)
- Better error messages

**New Actions:**
```javascript
// Add or merge product
dispatch(addProduct(productData));

// Update existing product
dispatch(updateProduct(updateData));

// Remove product by ID
dispatch(removeProduct(productId));

// Reset all products
dispatch(resetProducts());
```

#### User Profile Slice (`src/store/user.js`)
**Improvements:**
- Input sanitization
- Profile validation
- Better error handling
- New merge action for partial updates
- Loading and error states

**New Actions:**
```javascript
// Set profile with sanitization
dispatch(setProfile(userData));

// Update with validation
dispatch(updateProfile(updatedData));

// Merge partial updates
dispatch(mergeProfile(partialData));

// Clear profile on logout
dispatch(clearProfile());
```

#### Pagination Slice (`src/store/pagination.js`)
**New Slice:**
- Centralized pagination state
- Sorting support
- Filter management
- Automatic page reset on filter changes

**Usage:**
```javascript
import { usePaginatedData } from "./hooks/usePaginatedData";

const {
  currentPage,
  totalPages,
  currentData,
  goToPage,
  goToNextPage,
  goToPrevPage,
  updateFilters,
  updateSorting,
} = usePaginatedData(allData);
```

### 2. **Discounted Products Slice** (`src/store/discountedProducts.js`)
**Improvements:**
- New add/remove product actions
- Loading state management
- Error state handling
- Timestamp tracking

### 3. **Best Selling Products Slice** (`src/store/bestSellingProducts.js`)
**Improvements:**
- Better error handling with descriptive messages
- Timestamp tracking
- Clear error action
- Reset products action

---

## 🎯 New Utilities & Helpers

### Common Helpers (`src/utils/helpers.js`)

**Available Functions:**
- `formatCurrency()` - Format numbers as currency
- `formatDate()` - Format dates readably
- `formatDateTime()` - Format dates with time
- `truncateString()` - Truncate with ellipsis
- `capitalize()` - Capitalize first letter
- `toSlug()` - Convert to URL slug
- `deepClone()` - Clone objects deeply
- `deepMerge()` - Merge objects deeply
- `debounce()` - Debounce function calls
- `throttle()` - Throttle function calls
- `groupBy()` - Group array by key
- `unique()` - Get unique values

**Usage Examples:**
```javascript
import {
  formatCurrency,
  debounce,
  groupBy,
} from "./utils/helpers";

// Format price
console.log(formatCurrency(1234.56)); // $1,234.56

// Debounce search
const debouncedSearch = debounce((query) => {
  // Search API call
}, 300);

// Group products by category
const groupedProducts = groupBy(products, "category");
```

### Custom Hooks

#### `useLoadingState` (`src/hooks/useLoadingState.js`)
```javascript
const {
  isLoading,
  error,
  startLoading,
  stopLoading,
  setError,
  clearError,
} = useLoadingState(false, 30000); // 30 second timeout

startLoading();
// ... async operation ...
stopLoading();
```

#### `useAsync` (`src/hooks/useAsync.js`)
```javascript
const {
  execute,
  status,
  data,
  error,
  isLoading,
  isError,
  isSuccess,
} = useAsync(asyncFunction, true); // immediate execution
```

#### `usePaginatedData` (`src/hooks/usePaginatedData.js`)
```javascript
const {
  currentPage,
  totalPages,
  currentData,
  goToPage,
  updateFilters,
  updateSorting,
} = usePaginatedData(allItems);
```

---

## 📋 Configuration Files

### API Configuration (`src/config/api.js`)
- Centralized API endpoints
- HTTP status codes
- Error messages
- Easy to update in one place

### Environment Configuration (`src/config/environment.js`)
- Validates required environment variables
- Provides typed access to env vars
- Fails fast in production if config missing

---

## 🛡️ Component-Level Improvements

### Error Boundary (`src/components/ErrorBoundary.jsx`)
- Catches React component errors
- Displays user-friendly error UI
- Development error details
- Error recovery options

**Usage:**
```javascript
import ErrorBoundary from "./components/ErrorBoundary";

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### App Component (`src/App.jsx`)
**Improvements:**
- Single initialization on mount (prevents duplicate requests)
- Token expiration checking
- Proper error handling
- Event listeners for auth errors
- Only one profile fetch per session

---

## 📝 Best Practices Implemented

### 1. **Error Handling**
- All async operations have error states
- User-friendly error messages
- Detailed logging in development
- Error boundaries for React components

### 2. **Input Validation**
- Sanitization before API calls
- Schema-based form validation
- Type checking
- Length validation

### 3. **State Management**
- Centralized Redux store
- Clear action naming
- Loading and error states
- Timestamp tracking for cache invalidation

### 4. **Security**
- Token validation and expiration
- CSRF token handling
- Input sanitization
- Safe localStorage operations
- Automatic cleanup on auth failure

### 5. **Performance**
- Debounced functions for searches
- Throttled scroll handlers
- Proper pagination
- Memoized selectors
- Lazy component loading

---

## 🚀 Migration Guide

### Updating Existing Components

**Old Way:**
```javascript
const token = localStorage.getItem("token");
axios.get("/api/products", {
  headers: { Authorization: `Bearer ${token}` }
})
```

**New Way:**
```javascript
import apiClient from "./services/apiClient";
apiClient.get("/api/products"); // Token auto-injected
```

### Using Redux Cart

**Old Way:**
```javascript
const cartItems = JSON.parse(localStorage.getItem("cartItems"));
```

**New Way:**
```javascript
import { useSelector } from "react-redux";
const cartItems = useSelector(state => state.cart.items);
```

---

## ✅ Deployment Checklist

- [ ] Set `VITE_API_BASE_URL` environment variable
- [ ] Enable HTTPS in production
- [ ] Configure CORS headers on backend
- [ ] Test token refresh mechanism
- [ ] Verify error boundaries catch errors
- [ ] Test localStorage quota handling
- [ ] Verify CSRF token injection
- [ ] Review error messages (no sensitive data)
- [ ] Test all async operations with network throttling
- [ ] Verify logout clears all sensitive data

---

## 📚 Additional Resources

- [OWASP Top 10 Web Security Risks](https://owasp.org/www-project-top-ten/)
- [React Security Best Practices](https://owasp.org/www-community/attacks/xss/)
- [Redux Best Practices](https://redux.js.org/usage/structuring-reducers/normalizing-state-shape)
- [Secure Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

---

## 🐛 Troubleshooting

### Issue: Token keeps being cleared
**Solution:** Check token expiration: `authService.isTokenExpired()`

### Issue: API requests failing with 401
**Solution:** Ensure token is valid: `authService.hasValidToken()`

### Issue: localStorage quota exceeded
**Solution:** The storage manager automatically clears old cache data

### Issue: Form validation not working
**Solution:** Pass correct schema to `validateFormData()`

---

## 🎓 Next Steps

1. Review all new service files and understand their purpose
2. Update existing components to use new utilities
3. Test all error scenarios
4. Add more validation rules as needed
5. Implement error tracking service (e.g., Sentry) in production
6. Monitor performance metrics
7. Regular security audits

---

**Last Updated:** 2026-04-25
**Version:** 1.0.0
