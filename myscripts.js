$(document).ready(function() {    
    //cache for displaying last value
    var temp = JSON.parse(localStorage.getItem('fill')) || null

    var $miles = $('#miles')
    var $gal = $('#gal')
    var $price = $('#price')
    var $mpg = $('#mpg')
    var $mpd = $('#mpd')
    var $cpm = $('#cpm')
    //if there is no storage don't display values
    if (temp) {
        $mpg.append('<strong>' + Math.round(temp[(temp.length-1)]["mpg"] * 100) / 100 + " </strong> miles")
        $mpd.append('<strong>' + Math.round(temp[(temp.length-1)]["mpd"] * 100) / 100 + ' </strong> miles per $1 spent')
        $cpm.append('<strong>' + Math.round(temp[(temp.length-1)]["cpm"] * 100) / 100 + '</strong>')
    }
    //gets data from local storage and renders chart
    init()
    $('#submit').click(function () {   
        //math for stats
        var mpg = $miles.val() / $gal.val()
        var mpd = $miles.val() / ($price.val() * $gal.val())
        var cpm = $price.val() / mpg
        //preparing stats to be added to local storage 
        var obj = {
            "date" : getDate(),
            "mpg"  : mpg.toString(),
            "mpd"  : mpd.toString(),
            "cpm"  : cpm.toString()
        }
        //add stats to local storage
        pushToFill(obj)
        //get stats from local storage
        getFill()
        //create chart
        render()

        $miles.val('')
        $gal.val('')
        $price.val('')

        location.reload();
    })
    $('#clear').click(function () {
        $('#mpg').text('')
        $('#mpd').text('')
        $('#cpm').text('')
    })
})
function getDate() {
    var now = new Date()
    var month = now.getMonth()
    var day = now.getDate()
    var year = now.getYear()

    return (month + 1) + '/' + day + '/' + (1900 + year)
}
function render () {
    //comes from chartJS
    var ctx = document.getElementById("canvas").getContext("2d")
    var myLine = new Chart(ctx).Line(lineChartData, {
        responsive: false
    })
    document.getElementById('js-legend').innerHTML = myLine.generateLegend();
}
function Push () {
    //gets stats from local storage
    //console.log("Push() ran")
    var fill = getFill()
    //gets color info for chart display
    var lineChartData = getLineData()
    //inputs states for ChartJS to display
    for (x in fill) {

        console.log(Number(fill[x]["mpg"]).toFixed(2))
        lineChartData.labels.push(fill[x]["date"])
        lineChartData.datasets[0].data.push(Number(fill[x]["mpg"]).toFixed(2))
        lineChartData.datasets[1].data.push(Number(fill[x]["mpd"]).toFixed(2))
    }
}
function getFill () {
    //gets local storage values or creates if nonexistent 
    //console.log("getFill() ran")
    if(!localStorage.getItem('fill')) {
        fill = [
        {
            "date" : "1/1/16",
            "mpg"  : "20",
            "mpd"  : "2",
            "cpm"  : ".5"
        },  
        {
            "date" : "1/6/16",
            "mpg"  : "22",
            "mpd"  : "3",
            "cpm"  : ".3"
        } 
    ] 
       localStorage.setItem('fill', JSON.stringify(fill))
       return fill 
    }else{
        store = localStorage.getItem('fill')
        return JSON.parse(store)
    }   
}
function pushToFill(obj) {
    //takes stats just created and moves to chart
    fill = JSON.parse(localStorage.getItem('fill'))
    fill.push(obj)
    
    localStorage.setItem('fill', JSON.stringify(fill))
    console.log(fill)
    console.log('fill added')
    lineChartData.labels.push(obj["date"])
    lineChartData.datasets[0].data.push(obj["mpg"].toFixed(2))
    lineChartData.datasets[1].data.push(obj["mpd"].toFixed(2))
}
function getLineData () {
    //chartJS color scheme 
    return lineChartData = {
        labels : [],     
        datasets : [
        {
            label: "Miles per gallon",
            fillColor : "rgba(0,255,0,0.3)",
            strokeColor : "rgba(0,255,0,.8)",
            pointColor : "rgba(0,255,0,1)",
            pointStrokeColor : "#fff",
            pointHighlightFill : "#fff",
            pointHighlightStroke : "rgba(220,220,220,1)",
            data : []
        },
        {
            label: "Miles per $",
            fillColor : "rgba(0,0,0,0.2)",
            strokeColor : "rgba(0,0,0,1)",
            pointColor : "rgba(0,0,0,1)",
            pointStrokeColor : "#fff",
            pointHighlightFill : "#fff",
            pointHighlightStroke : "rgba(151,187,205,1)",
            data : []
        }
        ]
    }  
}
function init () {
    Push()
    render()
}