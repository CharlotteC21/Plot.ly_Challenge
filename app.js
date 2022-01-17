//init
async function getData() {
    const response = await fetch ("Plotly-Challenge/samples.json");
    data = await response.json();
    console.log(data)
  
    let samples= data.samples
    let metadata= data.metadata
    let names= data.names
  
    //creating dropdowns
    let dropdown=document.getElementById("selDataset");

    for(let i = 0; i < names.length; i++) {
      let id=names[i];
      let info= document.createElement("option");
      info.textContent=id;
      info.value=id;
      dropdown.appendChild(info);
    }

    //demographics
    let firstid= data.names[0]
    let resultArray = metadata.filter(sampleObj => sampleObj.id == firstid);
    let result= resultArray[0]
    console.log(resultArray)

    let panel=document.getElementById("sample-metadata")
    panel.innerHTML=""
    
    for(let [key, value] of Object.entries(result)){
      console.log(`${key.toUpperCase()}: ${value}`);
      panel.append(`${key.toUpperCase()}: ${value} \n`)
    }
    
    //bar chart
    let firstSample= samples[0].sample_values.sort((a,b) => b - a).slice(0,10).reverse();
    let firstOTULabel = samples[0].otu_ids.map(d => `OTU ${d}`).slice(0,10).reverse();
    let firstHoverText= samples[0].otu_labels.slice(0,10).reverse();

    let bartrace= {
        type: 'bar',
        x: firstSample,
        y: firstOTULabel,
        text: firstHoverText,
        orientation: 'h'
    }

    let bardata= [bartrace]

    let barLayout = {
        title: 'Top 10 OTUs',
        yaxis: {autorange: true},
        xaxis: {autorange: true},
      };

      Plotly.newPlot("bar", bardata, barLayout);

      // create bubble chart
      let bubOTUIDs = samples[0].otu_ids
      let bubSampleValues= samples[0].sample_values
      let bubLabels= samples[0].otu_labels
      
      let bubbletrace = {
        x: bubOTUIDs,
        y: bubSampleValues,
        text: bubLabels,
        mode: 'markers',
        marker: {
            size: bubSampleValues,
            color: bubOTUIDs,
            colorscale: "Jet",
        }};
        
        let bubLayout =  {
            xaxis: {title: 'OTU ID'},
            showlegend: false,
            height: 600,
            width: 1200
          };
          
        let bubdata= [bubbletrace];
        Plotly.newPlot("bubble", bubdata, bubLayout);

  }
//new sample details
  async function optionChanged(){
    let select = document.getElementById('selDataset');
    let value = select.options[select.selectedIndex].value;
    // console.log(value); 
    createmetadata(value);
    createcharts(value);
    
  }
// new sample demographics
  function createmetadata(id){
    metadata= data.metadata
    let resultArray = metadata.filter(sampleObj => sampleObj.id == id);
    let result= resultArray[0]

    let panel=document.getElementById("sample-metadata")
    panel.innerHTML=""

    for(let [key, value] of Object.entries(result)){
      console.log(`${key.toUpperCase()}: ${value}`);
      panel.append(`${key.toUpperCase()}: ${value} \n`)
    }};

// new sample charts
    function createcharts(id){
    samples= data.samples
    let sampleFilter= samples.filter(sampleObj => sampleObj.id == id);
    let newSample= sampleFilter[0];
    
    // bar chart
    let barSampleValues= newSample.sample_values.sort((a,b) => b - a).slice(0,10).reverse();
    let barOTULabels = newSample.otu_ids.map(d => `OTU ${d}`).slice(0,10).reverse();
    let barHoverText= newSample.otu_labels.slice(0,10).reverse();

    let bartrace= {
        type: 'bar',
        x: barSampleValues,
        y: barOTULabels,
        text: barHoverText,
        orientation: 'h'
    }

    let bardata= [bartrace]
    let barLayout = {
        title: 'Top 10 OTUs',
        yaxis: {autorange: true},
        xaxis: {autorange: true},
      };

      Plotly.newPlot("bar", bardata, barLayout);

    //bubble chart
      let bubOTUIDs = newSample.otu_ids;
      let bubSampleValues= newSample.sample_values;
      let bubLabels= newSample.otu_labels;
      
      let bubbletrace = {
        x: bubOTUIDs,
        y: bubSampleValues,
        text: bubLabels,
        mode: 'markers',
        marker: {
            size: bubSampleValues,
            color: bubOTUIDs,
            colorscale: "Jet",
        }};
        
        let bubLayout =  {
            xaxis: {title: 'OTU ID'},
            showlegend: false,
            height: 600,
            width: 1200
          };
          
        let bubdata= [bubbletrace];

        Plotly.newPlot("bubble", bubdata, bubLayout);
    }
//retreive
  getData()