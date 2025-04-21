export const formatDate = (date:string | Date | undefined | null) => {
    if (!date) return '';
  
    try {
      return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch (error) {
      console.error("Invalid date:", date);
      return '';
    }
  };