import React from "react";
import { createRoot } from "react-dom/client";
import CartIcon from "./Components/CartIcon";

const rootElement = document.getElementById("react-icon-cart");
const root = createRoot(rootElement);
root.render(<CartIcon />);
