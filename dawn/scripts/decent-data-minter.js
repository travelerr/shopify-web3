import React from "react";
import { createRoot } from "react-dom/client";
import Global from "./Components/Global";

const rootElement = document.getElementById("decent-data-minter");
const root = createRoot(rootElement);
root.render(<Global />);
