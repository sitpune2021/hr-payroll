import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { base_path } from "./environment";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../src/style/css/feather.css";
import "../src/index.scss";
import store from "./core/data/redux/store";
import { Provider } from "react-redux";
import "../src/style/icon/boxicons/boxicons/css/boxicons.min.css";
import "../src/style/icon/weather/weathericons.css";
import "../src/style/icon/typicons/typicons.css";
import "../node_modules/@fortawesome/fontawesome-free/css/fontawesome.min.css";
import "../node_modules/@fortawesome/fontawesome-free/css/all.min.css";
import "../src/style/icon/ionic/ionicons.css";
import "../src/style/icon/tabler-icons/webfont/tabler-icons.css";
import ALLRoutes from "./feature-module/router/router";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import AppInitializer from "./initlizer/AppInitializer";
import GlobalToast from "./utils/GlobalToast";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

const AppWrapper = () => {
  const [ready, setReady] = useState(false); 

  return (
    <Provider store={store}>
      <GlobalToast />
      <BrowserRouter basename={base_path}>
        <AppInitializer onReady={() => setReady(true)} />
        {ready ? <ALLRoutes /> : <div>Loading...</div>}
      </BrowserRouter>
    </Provider>
  );
};

root.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
