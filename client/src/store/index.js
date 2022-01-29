import { createStore } from 'vuex'
import { account } from "@/store/account";
import { alert } from "@/store/alert";
import { products } from "@/store/product";

export default createStore({
  modules: {
    account,
    alert,
    products
  }
})
