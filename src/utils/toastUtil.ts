import store from "../core/data/redux/store";
import { showToast } from "../core/data/redux/toastSlice";


type Variant = 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';

export const toast = (title: string, message: string, variant: Variant = 'light') => {
    console.log("toast util function called");
    
  store.dispatch(showToast({ title, message, variant }));
};



// toast('Error', 'Failed to create user', 'danger');
// toast('Info', 'Logged in successfully!', 'success');