async function fetchTotalDonated() {
    try {
      const response = await fetch("http://localhost:3000/total-donated");
      if (!response.ok) {
        throw new Error("Error fetching total donations");
      }
      const data = await response.json();
      document.getElementById("total-donated").innerText = `Total Donations: $${data.total.toFixed(2)}`;
    } catch (error) {
      console.error("Error fetching total donations:", error);
    }
  }
  
  async function submitDonation() {
    const amount = document.getElementById("donation-amount").value;
  
    try {
      const response = await fetch("http://localhost:3000/donate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: parseFloat(amount) }), // Send amount as JSON
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert(data.message);
        fetchTotalDonated(); // Refresh total donations after a successful donation
      } else {
        alert(data.message); // Show error message from server
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to donate. Please try again.");
    }
  }
  
  // Fetch total donations on page load
  fetchTotalDonated();