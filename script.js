// Function to create bar chart comparing sales between PS4 and Xbox One
const createSalesComparisonChart = (data) => {
    // Define chart dimensions
    const margin = { top: 50, right: 50, bottom: 70, left: 70 };
    const width = 1000 - margin.left - margin.right;
    const height = 700 - margin.top - margin.bottom;

    // Define SVG container
    const svg = d3.select("#salesComparisonChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Define scales and axes
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.title))
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => Math.max(d.ps4Sales, d.xboxOneSales))])
        .range([height, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Append axes to SVG
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    svg.append("g")
        .call(yAxis);

    // Add titles to axes
    svg.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
        .style("text-anchor", "middle")
        .text("Game Titles");

    svg.append("text")
        .attr("transform", `rotate(-90) translate(-${height / 2}, -40)`)
        .style("text-anchor", "middle")
        .text("Sales (Millions)");

    // Create bars for PS4 sales
    svg.selectAll(".ps4Bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "ps4Bar")
        .attr("x", d => xScale(d.title))
        .attr("y", d => yScale(d.ps4Sales))
        .attr("width", xScale.bandwidth() / 2)
        .attr("height", d => height - yScale(d.ps4Sales))
        .attr("fill", "steelblue")
        .on("mouseover", function(event, d) {
            d3.select(this)
                .attr("fill", "lightsteelblue")
                .attr("opacity", 0.7);
            // Show tooltip
            tooltip.html(`<strong>Title:</strong> ${d.title}<br><strong>Console:</strong> PS4<br><strong>Year:</strong> ${d.year}<br><strong>Sales:</strong> ${d.ps4Sales} million`)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px")
                .style("opacity", 1);
        })
        .on("mouseout", function() {
            d3.select(this)
                .attr("fill", "steelblue")
                .attr("opacity", 1);
            // Hide tooltip
            tooltip.style("opacity", 0);
        });

    // Create bars for Xbox One sales
    svg.selectAll(".xboxOneBar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "xboxOneBar")
        .attr("x", d => xScale(d.title) + xScale.bandwidth() / 2)
        .attr("y", d => yScale(d.xboxOneSales))
        .attr("width", xScale.bandwidth() / 2)
        .attr("height", d => height - yScale(d.xboxOneSales))
        .attr("fill", "orange")
        .on("mouseover", function(event, d) {
            d3.select(this)
                .attr("fill", "lightsalmon")
                .attr("opacity", 0.7);
            // Show tooltip
            tooltip.html(`<strong>Title:</strong> ${d.title}<br><strong>Console:</strong> Xbox One<br><strong>Year:</strong> ${d.year}<br><strong>Sales:</strong> ${d.xboxOneSales} million`)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px")
                .style("opacity", 1);
        })
        .on("mouseout", function() {
            d3.select(this)
                .attr("fill", "orange")
                .attr("opacity", 1);
            // Hide tooltip
            tooltip.style("opacity", 0);
        });

    // Tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
};

// Function to filter data based on genre selection
const filterDataByGenre = (genre, data) => {
    if (genre === "All") {
        return data;
    } else {
        return data.filter(d => d.genre === genre);
    }
};

// Function to populate dropdown with unique genres
const populateDropdown = (data) => {
    const genres = ["All", ...new Set(data.map(d => d.genre))];
    const dropdown = d3.select("#dropdown");
    dropdown.selectAll("option")
        .data(genres)
        .enter()
        .append("option")
        .text(d => d);
    dropdown.on("change", function() {
        const selectedGenre = this.value;
        const filteredData = filterDataByGenre(selectedGenre, data);
        d3.selectAll("svg").remove();
        createSalesComparisonChart(filteredData);
    });
};

// Sample video game sales data
const data = [
    { title: "Grand Theft Auto V", genre: "Action", publisher: "Rockstar Games", year: 2014, ps4Sales: 600, xboxOneSales: 872 },
    { title: "Call of Duty: Black Ops 3", genre: "Shooter", publisher: "Activision", year: 2015, ps4Sales: 463, xboxOneSales: 204 },
    { title: "Red Dead Redemption 2", genre: "Action-Adventure", publisher: "Rockstar Games", year: 2018, ps4Sales: 376, xboxOneSales: 147 },
    { title: "FIFA 18", genre: "Sports", publisher: "EA Sports", year: 2017, ps4Sales: 127, xboxOneSales: 864 },
    { title: "Uncharted", genre: "Action", publisher: "Sony Interactive Entertainment", year: 2016, ps4Sales: 449, xboxOneSales: 393 },
    // Additional games
    { title: "Minecraft", genre: "Misc", publisher: "Microsoft Studios", year: 2014, ps4Sales: 323, xboxOneSales: 171 },
    { title: "FIFA 17", genre: "Sports", publisher: "Electronic Arts", year: 2016, ps4Sales: 178, xboxOneSales: 109 },
    { title: "Star Wars Battlefront", genre: "Shooter", publisher: "Electronic Arts", year: 2015, ps4Sales: 143, xboxOneSales: 104 },
    { title: "Assassin's Creed: Unity", genre: "Action-Adventure", publisher: "Ubisoft", year: 2014, ps4Sales: 73, xboxOneSales: 43 },
    { title: "Titanfall 2", genre: "Shooter", publisher: "Electronic Arts", year: 2016, ps4Sales: 94, xboxOneSales: 62 },
    { title: "Horizon Zero Dawn", genre: "Action", publisher: "Sony Interactive Entertainment", year: 2017, ps4Sales: 123, xboxOneSales: 158 }
];

// Call function to populate dropdown
populateDropdown(data);
