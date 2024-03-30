import { createStore } from "redux";
import blocksReducer from "./blocksReducer";

const store = createStore(blocksReducer);

export default store;
