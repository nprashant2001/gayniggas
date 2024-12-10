// Fetch the JSON data and create the chart
async function getData() {
    const response = await fetch('./largefile.json'); // Adjust the path if necessary
    return await response.json();
}

getData().then(data => {
    // Convert the JSON object into an array
    const dataArray = Object.values(data);
    console.log(dataArray);

    // Group data by cluster
    const clusters = {};
    dataArray.forEach(elm => {
        if (!clusters[elm.cluster]) {
            clusters[elm.cluster] = [];
        }
        clusters[elm.cluster].push([elm.UMAP1, elm.UMAP2]);
    });

    console.log(clusters);
    // Generate series dynamically
    const series = Object.keys(clusters).map((cluster, index) => ({
        name: `Cluster ${cluster}`,
        id: cluster,
        data: clusters[cluster],
        marker: {
            symbol: 'circle'
        }
    }));

    // Dynamically generate colors
    const colors = series.map((_, index) =>
        `hsl(${(index * 360) / series.length}, 100%, 50%)`
    );

    Highcharts.setOptions({
        colors: colors
    });

    Highcharts.chart('container', {
        chart: {
            type: 'scatter',
            zooming: {
                type: 'xy'
            },
            boost: {
                enabled: true,
                useGPUTranslations: true,
                seriesThreshold: 1
            }
        },
        title: {
            text: 'Clustering of Cells'
        },
        xAxis: {
            title: {
                text: 'UMAP1'
            },
            gridLineWidth: 0,
            labels: {
                enabled: false
            },
            tickLength: 0,
            lineWidth: 1
        },
        yAxis: {
            title: {
                text: 'UMAP2'
            },
            gridLineWidth: 0,
            labels: {
                enabled: false
            },
            tickLength: 0,
            lineWidth: 1
        },
        legend: {
            enabled: true
        },
        plotOptions: {
            series: {
                turboThreshold: 10000 // Disable threshold to allow large datasets
            },
            scatter: {
                marker: {
                    fillOpacity: 1,
                    radius: 2.5,
                    symbol: 'circle',
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: true
                        }
                    }
                }
            }
        },
        tooltip: {
            formatter: function () {
                return this.series.name; // Show only the cluster name
            }
        },
        series
    });
});
