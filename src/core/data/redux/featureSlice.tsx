import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Feature {
  id: number;
  name: string;
  description: string;
}

interface FeatureState {
  allFeatures: Feature[];
  allowedFeatures: Feature[]; 
}

const initialState: FeatureState = {
  allFeatures: [],
  allowedFeatures: [],
};

const featureSlice = createSlice({
  name: "feature",
  initialState,
  reducers: {
    setAllFeatures: (state, action: PayloadAction<Feature[]>) => {
      state.allFeatures = action.payload;
    },
    setAllowedFeatures: (state, action: PayloadAction<Feature[]>) => {
      state.allowedFeatures = action.payload;
    },
    resetFeatures: (state) => { 
      state.allFeatures = [];
      state.allowedFeatures = [];
    },
  },
});

export const { setAllFeatures, setAllowedFeatures, resetFeatures } = featureSlice.actions;

export default featureSlice.reducer;
