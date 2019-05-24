$(document).ready(function(){    
    //init()
    $('#submit').click(function () {   
        var $miles = $('#miles')
        var $gal = $('#gal')
        var $price = $('#price')
        var $mpg = $('#mpg')
        var $mpd = $('#mpd')
        var $cpm = $('#cpm')

        var mpg = $miles.val() / $gal.val()
        var mpd = $miles.val() / ($price.val() * $gal.val())
        var cpm = $price.val() / mpg


        $mpg.append('<strong>' + Math.round(mpg * 100) / 100 + " </strong> miles")
        $mpd.append('<strong>' + Math.round(mpd * 100) / 100 + ' </strong> miles per $1 spent')
        $cpm.append('<strong>' + Math.round(cpm * 100) / 100 + '</strong>')

        var obj = {
            "date" : getDate(),
            "mpg"  : mpg.toString(),
            "mpd"  : mpd.toString(),
            "cpm"  : cpm.toString()
        };
        pushToFill(obj)
        
        getFill()
        
        render()

        $miles.val('')
        $gal.val('')
        $price.val('')

        location.reload();
    })
    $('#clear').click(function (){
        $('#mpg').text('')
        $('#mpd').text('')
        $('#cpm').text('')
    })
});
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