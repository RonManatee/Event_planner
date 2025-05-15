import { createSlice } from "@reduxjs/toolkit";// toolkit
import venueReducer from './venueSlice';//reducer from ./venueSlice
import avReducer from './avSlice';//reducer from ./avSlice
export default configureStore({//moving reducers to configureStore
  reducer: {
    venue: venueReducer,
    av: avReducer,
  },
});

export const avSlice = createSlice({
  name: "av",
  initialState: [
        {
        img: "https://pixabay.com/images/download/business-20031_640.jpg",
        name: "Projectors",
        cost: 200,
        quantity: 0,
    },
    {
        img: "https://pixabay.com/images/download/speakers-4109274_640.jpg",
        name: "Speaker",
        cost: 35,
        quantity: 0,
    },
    {
        img: "https://pixabay.com/images/download/public-speaking-3926344_640.jpg",
        name: "Microphones",
        cost: 45,
        quantity: 0,
    },
    {
        img: "https://pixabay.com/images/download/whiteboard-2903269_640.png",
        name: "Whiteboards",
        cost: 80,
        quantity: 0,
    },

    {
        img: "https://pixabay.com/images/download/signpost-235079_640.jpg",
        name: "Signage",
        cost: 80,
        quantity: 0,
    },

  ],


  reducers: {
    incrementAvQuantity: (state, action) => { 
      // increments the quanitity of a specif item in the state, takes two parameters "state" and "action"
      const item = state[action.payload]; 
      //"payload" object contains the identifier of the item to increment.
      // reducer retrieves the item from the state using "action.payload"
      // if item exists, it increments quantity by 1
      if (item) {
        item.quantity++;
    }, // reduce the quantity by 1, similar to above, needs "state" and "action" to function
    decrementAvQuantity: (state, action) => {
     const item = state[action.payload];
      if (item && item.quantity > 0) {
        item.quantity--;
        //if item exists and quantity is greater than 0, reduces quantity by 1, ensuring quantity does not drop below 0
    },
  },
});

export const { incrementAvQuantity, decrementAvQuantity } = avSlice.actions;

export default avSlice.reducer;
