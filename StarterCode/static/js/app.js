// Get the samples endpoint
const samples = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data
d3.json(samples).then(function(dataset) {
    //Bar Chart Initial Graphs
    //Create an array of sample values
    let sample_values = Object.values(dataset.samples[0].sample_values);
    // Create an array of category labels
    let labels = Object.values(dataset.samples[0].otu_ids);
    // Hovertext
    let hovertext = Object.values(dataset.samples[0].otu_labels);
    
    //Populate dropdown menu
    var select = document.getElementById("selDataset"); 
    var options = Object.values(dataset.names);

    for(var i = 0; i < options.length; i++) {
        var opt = options[i];
        var el = document.createElement("option");
        el.text = opt;
        el.value = opt;

        select.add(el);
    }

    // Display the default plot
    function init() {
    
    // Initial Data for Bar Chart
    let data = [{
        x: sample_values.slice(0,10).reverse(),
        y: labels.slice(0,10).reverse().map(x => "OTU" + ' ' + x.toString()),
        text: hovertext.slice(0,10).reverse(),
        type: "bar",
        orientation: 'h'
    }];

    let layout = {
        height: 600,
        width: 600,
        margin: {
            l: 100,
            r: 50,
            b: 100,
            t: 10
        }
    };

    Plotly.newPlot("bar", data, layout);

    //Initial Data for Bubble Chart
    let data1 = [{
        x: labels,
        y: sample_values,
        text: labels.map(x => "OTU" + ' ' + x.toString()),
        mode: 'markers',
        marker: {
            color: labels,
            size: sample_values,
            opacity: 1
        }
    }];

    let layout1 = {
        height: 600,
        width: 1200,
        xaxis: {
            title: {
                text: "OTU ID"
            }
        }
    };

    Plotly.newPlot("bubble", data1, layout1)

    // Initial Data for Demographics
    var metadata_keys = Object.keys(dataset.metadata[0]);
    var metadata_values = Object.values(dataset.metadata[0]);
    
    const div = document.getElementById('sample-metadata')
    for (var i = 0; i < metadata_keys.length; i++) {
        div.insertAdjacentText('beforeend', metadata_keys[i] + ": ");
        div.insertAdjacentText('beforeend', metadata_values[i]);
        div.insertAdjacentHTML('beforeend', `<br>`);
    }

    }

    // On change to the DOM, call getData()
    d3.selectAll("#selDataset").on("change", optionChanged);

    // Function called by DOM changes
    function optionChanged() {
    let dropdownMenu = d3.select("#selDataset");

    // Assign the value of the dropdown menu option to a letiable
    let datam = dropdownMenu.property("value");
    let index = Object.values(dataset.names).findIndex(x => x === datam)
    
    // Update Data for Bar Chart
    let data = [{
        x: [Object.values(dataset.samples[index].sample_values).slice(0,10).reverse()],
        y: [Object.values(dataset.samples[index].otu_ids).slice(0,10).reverse().map(x => "OTU" + ' ' + x.toString())],
        text: [Object.values(dataset.samples[index].otu_labels).slice(0,10).reverse()]
    }];

    // Update Data for Bubble Chart
    let data1 = [{
        x: [Object.values(dataset.samples[index].otu_ids)],
        y: [Object.values(dataset.samples[index].sample_values)],
        text: [Object.values(dataset.samples[index].otu_ids).map(x => "OTU" + ' ' + x.toString())],
        marker: {
            color: Object.values(dataset.samples[index].otu_ids),
            size: Object.values(dataset.samples[index].sample_values),
            opacity: 1
        }
    }];

    // Update Demographic Data
    const div = document.getElementById('sample-metadata')
    let metadata_keys = Object.keys(dataset.metadata[index]);
    let metadata_values = Object.values(dataset.metadata[index]);
    console.log(metadata_values)
    div.textContent = "";

    for (var i = 0; i < metadata_keys.length; i++) {
        div.insertAdjacentText('beforeend', metadata_keys[i] + ": ");
        div.insertAdjacentText('beforeend', metadata_values[i]);
        div.insertAdjacentHTML('beforeend', `<br>`);
    }

    // Call Function to update charts
    updatePlotly(data);
    updatePlotlyBubble(data1);
    }

    // Fnction to update bar chart
    function updatePlotly(newdata) {
    Plotly.restyle("bar", newdata[0], 0);
    }

    //Function to update bubble chart
    function updatePlotlyBubble(newdata) {
        Plotly.restyle("bubble", newdata[0], 0);
    }

    init();
});