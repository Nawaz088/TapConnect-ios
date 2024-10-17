import { createSlice } from "@reduxjs/toolkit";

interface AnalyticState {
  analyticdata: Object | null
  productCount: number | null
}

const initialState: AnalyticState = {
    analyticdata: {},
    productCount: 0
};

const analyticsSlice = createSlice({
  name: 'analyticsData',
  initialState,
  reducers: {
    setAnalyticsData(state:any, action:any) {
      state.analyticdata = action.payload;
    },
    setProductCount(state, action) {
      state.productCount += action.payload
    }
  },
});

export const { setAnalyticsData, setProductCount } = analyticsSlice.actions;
export default analyticsSlice.reducer;
