const filterRoutesByLabel = (routes: any[], allowedLabels: string[]) => {
    return routes.filter(route => !route.label || allowedLabels.includes(route.label));
  };

  export default filterRoutesByLabel;