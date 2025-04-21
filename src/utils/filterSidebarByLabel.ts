function filterSidebarByLabel(data: any[], allowedLabels: string[]) {
    return data
      .map(item => {
        const newItem = { ...item };
        const isAllowed = !item.label || allowedLabels.includes(item.label);
  
        if (item.submenuItems) {
          newItem.submenuItems = filterSidebarByLabel(item.submenuItems, allowedLabels);
        }
  
        const hasVisibleChildren = newItem.submenuItems && newItem.submenuItems.length > 0;
  
        return (isAllowed || hasVisibleChildren) ? newItem : null;
      })
      .filter(Boolean);
  }
export default filterSidebarByLabel;  