document.addEventListener("DOMContentLoaded", function() {
    // Your script code here
  
    // Form submission handler
    const form = document.getElementById("petitionForm");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const formData = {
        email: document.getElementById("email").value.trim(),
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        country: document.getElementById("country").value.trim(),
        postalCode: document.getElementById("postalCode").value.trim(),
      };
  
      try {
        const response = await fetch("http://localhost:3000/api/add-petition", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
  
        const result = await response.json();
        alert(result.message);
  
        if (response.ok && result.message === "User registered successfully!") {
          fetchRegisteredUserCount(); // Update the user count
        }
      } catch (err) {
        console.error("Error occurred:", err);
        alert("An error occurred. Please try again.");
      }
    });
  
    // Fetch and display the registered user count
    async function fetchRegisteredUserCount() {
      try {
        const response = await fetch("http://localhost:3000/api/registered-users");
        const data = await response.json();
  
        // Update the count on the page
        const countElement = document.getElementById("userCount");
        countElement.textContent = `People already signed: ${data.count}`;
      } catch (err) {
        console.error("Error fetching registered users count:", err);
      }
    }
  
    // Call this function on page load to set initial count
    fetchRegisteredUserCount();
  });
  