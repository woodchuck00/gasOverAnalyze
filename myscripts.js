$(document).ready(function(){    
    init()
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
            "mpg"  : mpg,
            "mpd"  : mpd,
            "cpm"  : cpm
        };

        fill.push(obj)

        lineChartData.labels.push(obj["date"])
        lineChartData.datasets[0].data.push(obj["mpg"])
        lineChartData.datasets[1].data.push(obj["mpd"])
        render()

        $miles.val('')
        $gal.val('')
        $price.val('')
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
    var ctx = document.getElementById("canvas").getContext("2d")
    var myLine = new Chart(ctx).Line(lineChartData, {
        responsive: true
    })
}
function Push () {
    var fill = getFill()
    var lineChartData = getLineData()
    for (x in fill) {
        lineChartData.labels.push(fill[x]["date"])
        lineChartData.datasets[0].data.push(fill[x]["mpg"])
        lineChartData.datasets[1].data.push(fill[x]["mpd"])
    }
}
function getFill () {
    var fill = [] 
    var items = [];
    var json = $.ajax({
                      url: 'data.json',
                      dataType: 'json',
                      async: false,
                      success: function(data) {
                        $.each( data.fills, function(key, val) {
                            items.push(val)
                        })
                      }
                    })
      return items
 }
function getLineData () {
    return lineChartData = {
        labels : [],     
        datasets : [
        {
            label: "My First dataset",
            fillColor : "rgba(220,220,220,0.2)",
            strokeColor : "rgba(220,220,220,1)",
            pointColor : "rgba(220,220,220,1)",
            pointStrokeColor : "#fff",
            pointHighlightFill : "#fff",
            pointHighlightStroke : "rgba(220,220,220,1)",
            data : []
        },
        {
            label: "My Second dataset",
            fillColor : "rgba(151,187,205,0.2)",
            strokeColor : "rgba(151,187,205,1)",
            pointColor : "rgba(151,187,205,1)",
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
function test() {
$.ajax({url: "data.json"}).done(function(data){
   return $.parseJSON(data);
});

}