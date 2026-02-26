import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: undefined,      // undefined = still checking auth
    isAuthChecked: false      // prevents redirect flicker
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload
      state.isAuthChecked = true
    },
    resetAuthState: (state) => {
      state.userData = null
      state.isAuthChecked = true
    }
  }
})

export const { setUserData, resetAuthState } = userSlice.actions
export default userSlice.reducer