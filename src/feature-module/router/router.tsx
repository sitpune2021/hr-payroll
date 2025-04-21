import React from "react";
import {  Navigate, Route, Routes } from "react-router";
import { authRoutes, publicRoutes } from "./router.link";
import Feature from "../feature";
import AuthFeature from "../authFeature";
import { useSelector } from "react-redux";
import { RootState } from "../../core/data/redux/store";
import filterRoutesByLabel from "../../utils/filterRoutesByLabel";

const ALLRoutes: React.FC = () => {


  const userAllowedLabels  = useSelector((state: RootState) => state.feature.allowedFeatures);
  const filteredLabels = userAllowedLabels .map((feature: any) => feature.name);
  const staticLabels = ["login"];
  const allowedLabels = [...staticLabels, ...filteredLabels];
  console.log("allowed labels",allowedLabels);
  

  const filteredPublicRoutes = filterRoutesByLabel(publicRoutes, allowedLabels);

  return (
    <>
      <Routes>
        <Route element={<Feature allowedLabels={allowedLabels} />}>
          {filteredPublicRoutes.map((route, idx) => (
            <Route path={route.path} element={route.element} key={idx} />
          ))}
        </Route>

        <Route element={<AuthFeature />}>
          {authRoutes.map((route, idx) => (
            <Route path={route.path} element={route.element} key={idx} />
          ))}
        </Route>

        <Route path="*" element={<Navigate to="/not-allowed" />} />
      </Routes>
    </>
  );
};

export default ALLRoutes;
