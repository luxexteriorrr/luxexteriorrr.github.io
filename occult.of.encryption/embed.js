const apiKey = "1a1082b6-ca4c-4010-bc7d-a808c01453c4"; // Replace with your actual API key

async function fetchData() {
    try {
        const response = await fetch(`https://haveibeentrained.com/api/endpoint?key=${apiKey}`);
        const data = await response.json();
        console.log(data); // Debugging: See what the API returns

        // Assuming data contains an image or text:
        document.querySelector(".output").innerHTML = `
            <h2>Results:</h2>
            <p>${data.someText}</p>
            <img src="${data.imageUrl}" alt="API Data">
        `;
    } catch (error) {
        console.error("Error fetching API data:", error);
    }
}

// Call function to fetch data
fetchData();
