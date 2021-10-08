import { createStore } from "@stencil/store";

const { state } = createStore({
    authenticated: false
});

export default state;
