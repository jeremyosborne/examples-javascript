YUI().use("charts", "yql", "array-extras", function(Y) {
    
    var draw = function(data) {
        var mychart = new Y.Chart({
            dataProvider: data,
            render: ".chart-container",
            type: "column",
            categoryKey: "category",
            valueKey: "count",
            styles: {
                axes: { 
                    category: { 
                        label: {
                            rotation: -45
                        }
                    }
                }
            }
        });
    };
    
    
    
    Y.YQL('select Categories.Category from local.search where query="restaurant" and location="san francisco, ca"', function(data) {
        var counts = {}, chartData = [], chartDatum, i;
        
        // Take a look at the raw results.
        Y.log(data);

        // Grab the non-diagnostic data.
        data = data.query.count && data.query.results.Result;
        if (!data || (data && !data.length)) {
            alert("The YQL query failed to return results. Please try again.");
        }
        else {
            // Scrape the categories we have.
            data = Y.Array.map(data, function(schema) {
                try {
                    return schema.Categories.Category.content;
                }
                catch(e) {
                    return "unknown";
                }
            });
            // Count.
            for (i = 0; i < data.length; i++) {
                if (counts[data[i]]) {
                    counts[data[i]] += 1;
                }
                else {
                    counts[data[i]] = 1;
                }
            }
            // Form into an array.
            for (i in counts) {
                chartDatum = {};
                chartDatum.category = i;
                chartDatum.count = counts[i];
                chartData.push(chartDatum);
            }
            
            // Chart.
            draw(chartData);
        }
    });
});
