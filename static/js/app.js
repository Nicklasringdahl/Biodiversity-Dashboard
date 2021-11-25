d3.json("samples.json").then((jsondata) => {
  console.log(jsondata);

  let data = jsondata;

  let Idnumber = data.names;

  Idnumber.forEach((id) => {
    d3.select("#selDataset").append("option").text(id);
  });

  function init() {
    initialdata = data.samples.filter((sample) => sample.id === "940")[0];
    console.log(initialdata);
    samplesdata = initialdata.sample_values;
    OtuId = initialdata.otu_ids;
    Otulabels = initialdata.otu_labels;

    top10sample = samplesdata.slice(0, 10).reverse();
    top10OtuId = OtuId.slice(0, 10).reverse();
    top10label = Otulabels.slice(0, 10).reverse();

    var trace1 = {
      x: top10sample,
      y: top10OtuId.map((outId) => `OTU ${outId}`),
      text: top10label,
      type: "bar",
      orientation: "h",
      marker: {
        color: "RGB(89, 49, 150)",
        opacity: 1,
        line: {
          color: "rgb(8,48,107)",
          width: 1.5,
        },
      },
    };

    var barData = [trace1];

    var layout1 = {
      title: `<b> Test subjects top 10 OTUs</b>`,
      xaxis: { title: "Sample Value" },
      yaxis: { title: "OTU IDs" },
      paper_bgcolor: "rgb(221, 218, 218)",
      plot_bgcolor: "rgb(221, 218, 218))",
      autosize: false,

      width: 440,
      height: 600,
    };

    Plotly.newPlot("bar", barData, layout1);

    var trace2 = {
      x: OtuId,
      y: samplesdata,
      text: Otulabels,
      mode: "markers",
      marker: {
        color: OtuId,
        size: samplesdata,
        colorscale: "Bluered",
      },
    };

    var bubData = [trace2];

    var layout2 = {
      title: "<b>Sample OTUs values of Individual<b>",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Value" },
      showlegend: false,
      paper_bgcolor: "rgb(221, 218, 218)",
      plot_bgcolor: "rgb(221, 218, 218)",
    };

    Plotly.newPlot("bubble", bubData, layout2);

    // Adding the demographic data to card in the html by filtering.
    demographic = data.metadata.filter((sample) => sample.id === 940)[0];

    // Cycle through the data and add to the html
    Object.entries(demographic).forEach(([key, value]) =>
      d3
        .select("#sample-metadata")
        .append("p")
        .text(`${key.toUpperCase()}: ${value}`)
    );
    // Adding a gauge chart - Bonus
    // Storing the wrfeq in a variable
    var wfreqDefault = demographic.wfreq;

    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wfreqDefault,
        title: {
          text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per week",
        },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 9] },
          steps: [
            { range: [0, 1], color: "RGB(241, 227, 255)" },
            { range: [1, 2], color: "RGB(220, 197, 244)" },
            { range: [2, 3], color: "RGB(200, 167, 225)" },
            { range: [3, 4], color: "RGB(181, 137, 214)" },
            { range: [4, 5], color: "RGB(153, 105, 199)" },
            { range: [5, 6], color: "RGB(153, 105, 199)" },
            { range: [6, 7], color: "RGB(128, 79, 179)" },
            { range: [7, 8], color: "RGB(106, 53, 156)" },
            { range: [8, 9], color: "RGB(89, 49, 150)" },
          ],
        },
      },
    ];

    var gaugeLayout = {
      width: 440,
      height: 600,
      margin: { t: 0, b: 0, l: 40 },
      paper_bgcolor: "rgb(221, 218, 218)",
      plot_bgcolor: "rgb(221, 218, 218)",
    };

    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  }

  init();

  d3.selectAll("#selDataset").on("change", updatePlot);

  // Create a function to update plots when values change

  function updatePlot() {
    // Use D3 to select the dropdown menu
    var input = d3.select("#selDataset");

    // Create a variable for the input
    var input = input.property("value");
    console.log(input);

    // Filter the dataset
    dataset = data.samples.filter((sample) => sample.id === input)[0];
    console.log(dataset);

    // create variables for the sample values
    allSampleValues = dataset.sample_values;
    allOtuIds = dataset.otu_ids;
    allOtuLabels = dataset.otu_labels;

    // Slice the dataset to get top 10 values
    top10Values = allSampleValues.slice(0, 10).reverse();
    top10Ids = allOtuIds.slice(0, 10).reverse();
    top10Labels = allOtuLabels.slice(0, 10).reverse();

    // Restyle the bar chart on changing the test subject
    Plotly.restyle("bar", "x", [top10Values]);
    Plotly.restyle("bar", "y", [top10Ids.map((outId) => `OTU ${outId}`)]);
    Plotly.restyle("bar", "text", [top10Labels]);

    // Restyle the bubble chart on changing the test subject
    Plotly.restyle("bubble", "x", [allOtuIds]);
    Plotly.restyle("bubble", "y", [allSampleValues]);
    Plotly.restyle("bubble", "text", [allOtuLabels]);
    Plotly.restyle("bubble", "marker.color", [allOtuIds]);
    Plotly.restyle("bubble", "marker.size", [allSampleValues]);

    // Reprint the demographic info
    demographic1 = data.metadata.filter((sample) => sample.id == input)[0];

    // Clear the space for demo info
    d3.select("#sample-metadata").html("");

    // Display the demographic info
    Object.entries(demographic1).forEach(([key, value]) =>
      d3.select("#sample-metadata").append("p").text(`${key}: ${value}`)
    );
    // Resetting the gauge
    var wfreq = demographic1.wfreq;

    Plotly.restyle("gauge", "value", wfreq);
  }
});
