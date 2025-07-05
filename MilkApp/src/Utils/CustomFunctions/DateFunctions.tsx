export const formatDate = (date: string) => {
    if (!date) return ""; // Handle empty values gracefully
    
    const parsedDate = new Date(date); // Convert string to Date object
  
    if (isNaN(parsedDate.getTime())) {
      console.error("Invalid date:", date); // Debugging output
      return ""; // Return an empty string for invalid dates
    }
  
    // Format the date
    const month = parsedDate.toLocaleString("en-US", { month: "short" });
    const day = parsedDate.getDate();
    const year = parsedDate.getFullYear();
  
    return `${day}-${month}-${year}`;
  };
  
    
    export function dateFormatter(dateString: string) {
      const inputDate = new Date(dateString);
    
      if (isNaN(inputDate.getTime())) {
        return "Invalid Date";
      }
    
      const year = inputDate.getFullYear();
      const month = String(inputDate.getMonth() + 1).padStart(2, "0");
      const day = String(inputDate.getDate()).padStart(2, "0");
    
      const formattedDate = `${year}-${month}-${day}`;
      return formattedDate;
    }