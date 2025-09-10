import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    Profile: null,
};
const ProfileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        setProfile: (state, action) => {
            state.Profile = action.payload;
        },
        addProfile: (state, action) => {
            state.Profile.push(action.payload);
        },

        updateProfile: (state, action) => {
            const updatedData = action.payload;
            const profileIndex = state.Profile.findIndex(profile => profile._id === updatedData._id);
            if (profileIndex !== -1) {
              state.Profile[profileIndex] = { ...state.Profile[profileIndex], ...updatedData };
            } else {
              console.log("Profile with _id not found:", updatedData._id);
            }
          },
    }
});


export const { setProfile, addProfile, updateProfile } = ProfileSlice.actions;

export default ProfileSlice;
