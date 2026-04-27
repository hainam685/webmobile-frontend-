/**
 * User Profile Slice - Refactored
 * Improved with input sanitization, validation, and better error handling
 */

import { createSlice } from '@reduxjs/toolkit';
import { sanitizeObject, validateEmail, validatePhoneNumber } from '../utils/validation';

// Helper function to validate profile data
const validateProfileData = (profile) => {
  const errors = [];

  if (!profile._id) {
    errors.push('Profile ID is required');
  }

  if (profile.email && !validateEmail(profile.email)) {
    errors.push('Invalid email format');
  }

  if (profile.numberPhone && !validatePhoneNumber(profile.numberPhone)) {
    errors.push('Invalid phone number format');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Helper function to sanitize profile
const sanitizeProfile = (profile) => {
  const sanitized = sanitizeObject(profile);
  return {
    _id: sanitized._id,
    fullName: sanitized.fullName || '',
    email: sanitized.email || '',
    numberPhone: sanitized.numberPhone || '',
    address: sanitized.address || '',
    avatar: sanitized.avatar || '',
    createdAt: sanitized.createdAt,
    updatedAt: new Date().toISOString(),
  };
};

// Initial State
const initialState = {
  Profile: null,
  loading: false,
  error: null,
  success: false,
};

// Slice
const ProfileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    /**
     * Set profile (replace entire profile)
     */
    setProfile: (state, action) => {
      try {
        if (!action.payload) {
          state.Profile = null;
          state.error = null;
          return;
        }

        const validation = validateProfileData(action.payload);
        if (!validation.isValid) {
          state.error = validation.errors.join(', ');
          return;
        }

        const sanitized = sanitizeProfile(action.payload);
        state.Profile = sanitized;
        state.error = null;
        state.success = true;
      } catch (error) {
        state.error = error.message || 'Error setting profile';
        state.Profile = null;
      }
    },

    /**
     * Update existing profile (merge with existing data)
     */
    updateProfile: (state, action) => {
      try {
        if (!state.Profile) {
          state.error = 'No profile to update';
          return;
        }

        const updatedData = action.payload;

        if (!updatedData._id || updatedData._id !== state.Profile._id) {
          state.error = 'Profile ID mismatch';
          return;
        }

        // Validate updated data
        const validation = validateProfileData(updatedData);
        if (!validation.isValid) {
          state.error = validation.errors.join(', ');
          return;
        }

        const sanitized = sanitizeProfile(updatedData);
        state.Profile = {
          ...state.Profile,
          ...sanitized,
        };
        state.error = null;
        state.success = true;
      } catch (error) {
        state.error = error.message || 'Error updating profile';
      }
    },

    /**
     * Merge partial profile updates
     */
    mergeProfile: (state, action) => {
      try {
        if (!state.Profile) {
          state.error = 'No profile to merge';
          return;
        }

        const partialData = action.payload;

        // Validate only provided fields
        if (partialData.email && !validateEmail(partialData.email)) {
          state.error = 'Invalid email format';
          return;
        }

        if (partialData.numberPhone && !validatePhoneNumber(partialData.numberPhone)) {
          state.error = 'Invalid phone number format';
          return;
        }

        const sanitized = sanitizeObject(partialData);
        state.Profile = {
          ...state.Profile,
          ...sanitized,
          updatedAt: new Date().toISOString(),
        };
        state.error = null;
        state.success = true;
      } catch (error) {
        state.error = error.message || 'Error merging profile';
      }
    },

    /**
     * Update specific profile field
     */
    updateProfileField: (state, action) => {
      try {
        if (!state.Profile) {
          state.error = 'No profile to update';
          return;
        }

        const { field, value } = action.payload;

        // Validate field if it requires validation
        if (field === 'email' && value && !validateEmail(value)) {
          state.error = 'Invalid email format';
          return;
        }

        if (field === 'numberPhone' && value && !validatePhoneNumber(value)) {
          state.error = 'Invalid phone number format';
          return;
        }

        state.Profile[field] = value;
        state.Profile.updatedAt = new Date().toISOString();
        state.error = null;
        state.success = true;
      } catch (error) {
        state.error = error.message || 'Error updating profile field';
      }
    },

    /**
     * Clear profile on logout
     */
    clearProfile: (state) => {
      state.Profile = null;
      state.error = null;
      state.loading = false;
      state.success = false;
    },

    /**
     * Set loading state
     */
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    /**
     * Clear error
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Clear success flag
     */
    clearSuccess: (state) => {
      state.success = false;
    },

    /**
     * Reset profile state
     */
    resetProfile: (state) => {
      state.Profile = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
});

export const {
  setProfile,
  updateProfile,
  mergeProfile,
  updateProfileField,
  clearProfile,
  setLoading,
  clearError,
  clearSuccess,
  resetProfile,
} = ProfileSlice.actions;

export default ProfileSlice;
