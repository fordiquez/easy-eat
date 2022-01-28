import { createStore } from 'vuex'
import { alert } from "@/store/alert";
import { account } from "@/store/account";
import { products } from "@/store/product";

export default createStore({
  modules: {
    alert,
    account,
    products
  }
})
