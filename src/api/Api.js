// Assuming the api.js file is set up to make API requests
export const payment = {
    updatePayment: async ({ id }) => {
      try {
        const response = await fetch(`http://localhost:8080/api/payment/update-payment/${id}`, {
          method: 'POST', // Use POST or PUT depending on your backend
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        const data = await response.json();
        return data; // Assuming the API returns a JSON object with `code` and `message`
      } catch (error) {
        console.error('Error updating payment:', error);
        return { code: 500, message: 'Internal server error' };
      }
    }
  };
  