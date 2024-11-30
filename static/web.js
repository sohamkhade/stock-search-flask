async function getCompanyAPI() {
    const x = document.getElementById("search-input").value;
    let company = {stock_ticker_symbol: ""};
    fetch('/company/' + `${x}`)
        .then(response => response.json())
        .then(data => {
            if (data.no_data === "No data found") {
                document.getElementsByClassName("data-tab")[0].style.display = "none";
                console.log("Empty Data");
                document.getElementById("no-data").style.display = "block";
            } else {
                company.stock_ticker_symbol = data.ticker;
                document.getElementById("no-data").style.display = "none";
                document.getElementsByClassName("data-tab")[0].style.display = "block";
                console.log("Company data");
                document.getElementById("defaultOpen").click();
                document.getElementsByClassName("navbar")[0].style.display = "block";
                document.getElementById("company-icon").src = data.logo;
                document.getElementById("company-name").innerText = data.name;
                document.getElementById("stock-ticker-symbol").innerText = data.ticker;
                document.getElementById("stock-exchange-code").innerText = data.exchange;
                document.getElementById("company-start-date").innerText = data.ipo;
                document.getElementById("category").innerText = data.finnhubIndustry;
                summary(x);
                trends(x);
                highcharts(x);
                get_news(x);
            }

        })
        .catch(err => {
                console.log(err);
                console.log("error while fetching");
            }
        );
}
function summary(x){
    fetch('/company/quote/' + `${x}`)
        .then(response => response.json())
        .then(data => {
            if (data.no_data === "no data found") {
                document.getElementsByClassName("data-tab")[0].style.display = "none";
                console.log("Empty Data");
                document.getElementById("no-data").style.display = "block";
            } else {
                const months = [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December"
                ];
                console.log(" Summary");
                let date = new Date(data.t);
                const d = date.getDate() + " " + months[date.getMonth()] + ", " + date.getFullYear();
                document.getElementById("no-data").style.display = "none";
                document.getElementsByClassName("data-tab")[0].style.display = "block";
                document.getElementsByClassName("navbar")[0].style.display = "block";
                document.getElementById("summary-symbol").innerText = data.ticker;
                document.getElementById("summary-day").innerText = d;
                document.getElementById("summary-closing-price").innerText = data.pc;
                document.getElementById("summary-opening-price").innerText = data.o;
                document.getElementById("summary-high-price").innerText = data.h;
                document.getElementById("summary-low-price").innerText = data.l;
                document.getElementById("summary-change-text").innerText = data.d;
                document.getElementById("summary-change-percent-text").innerText = data.dp;
                if (data.d > 0) {
                    document.getElementById("summary-change-img").src = '/static/GreenArrowUp.png';
                } else {
                    document.getElementById("summary-change-img").src = '/static/RedArrowDown.png';
                }
                if (data.dp > 0) {
                    document.getElementById("summary-change-percent-img").src = '/static/GreenArrowUp.png';
                } else {
                    document.getElementById("summary-change-percent-img").src = '/static/RedArrowDown.png';
                }
            }
        })
        .catch(err => {
                console.log(err);
                console.log("error while fetching");
            }
        );
}
function trends(x){
    fetch('/company/recommendation-trends/' + `${x}`)
        .then(response => response.json())
        .then(data => {
            console.log("Recommendation Trends");
            document.getElementById("recommendation-1").innerText = data[0].strongSell;
            document.getElementById("recommendation-2").innerText = data[0].sell;
            document.getElementById("recommendation-3").innerText = data[0].hold;
            document.getElementById("recommendation-4").innerText = data[0].buy;
            document.getElementById("recommendation-5").innerText = data[0].strongBuy;

        })
        .catch(err => {
                console.log(err);
                console.log("error while fetching");
            }
        );
}
function clearInput() {
    console.log("clear");
    document.getElementById("search-input").value = "";
    var arr = document.getElementsByClassName("data-tab");
    arr[0].style.display = "none";
    document.getElementById("no-data").style.display = "none ";
}

function openContentData(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("content-data");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("navlinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Get the element with id="defaultOpen" and click on it


// function highcharts(name) {
//
//     let stock = [];
//     let volume = [];
//     let curr_date = "";
//     console.log(name);
//     fetch('/company/polygon/' + `${name}`)
//         .then(response => response.json())
//         .then(data => {
//             console.log(data);
//             stock = data.stock_data;
//             volume = data.volume_data;
//             curr_date = data.current_date;
//         });
//
//
//     try {
//         // Fetch data from API
//         fetch('https://demo-live-data.highcharts.com/aapl-c.json')
//             .then(response => response.json())
//             .then(data => {
//                 console.log("HighCharts Data");
//                 console.log(data);
//                 // Create the chart after data is fetched
//                 Highcharts.stockChart('container', {
//                     rangeSelector: {
//                         selected: 1,
//                         buttons: [
//                             // {
//                             //     type: 'day',
//                             //     count: 1,
//                             //     text: '1d'
//                             // },
//                             {
//                                 type: 'day',
//                                 count: 7,
//                                 text: '7d'
//                             }, {
//                                 type: 'day',
//                                 count: 15,
//                                 text: '15d'
//                             }, {
//                                 type: 'month',
//                                 count: 1,
//                                 text: '1m',
//                             }, {
//                                 type: 'month',
//                                 count: 3,
//                                 text: '3m'
//                             }, {
//                                 type: 'month',
//                                 count: 6,
//                                 text: '6m'
//                             }]
//                     },
//                     title: {
//                         text: 'Stock Price ' + `${name}`.toUpperCase() + ' ' + `${curr_date}`
//                     },
//                     navigator: {
//                         series: {
//                             accessibility: {
//                                 exposeAsGroupOnly: true
//                             }
//                         }
//                     },
//                     series: [{
//                         name: 'AAPL Stock Price',
//                         data: stock,
//                         type: 'area',
//                         threshold: null,
//                         tooltip: {
//                             valueDecimals: 2
//                         },
//                         fillColor:
//                             {
//                                 linearGradient: {
//                                     x1: 0,
//                                     y1:
//                                         0,
//                                     x2:
//                                         0,
//                                     y2:
//                                         1
//                                 }
//                                 ,
//                                 stops: [
//                                     [0, Highcharts.getOptions().colors[0]],
//                                     [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
//                                 ]
//                             }
//                     },
//                         //     {
//                         //     type: 'column',
//                         //     id: 'aapl-volume',
//                         //     name: 'AAPL Volume',
//                         //     data: volume,
//                         //     yAxis: 1
//                         // }
//                     ]
//                 })
//                 ;
//             });
//
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }


function highcharts(name) {

    let stock = [];
    let volume = [];
    let curr_date = "";
    console.log(name);
    fetch('/company/polygon/' + `${name}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            stock = data.stock_data;
            volume = data.volume_data;
            curr_date = data.current_date;
            const stockRange = Math.max(...stock) - Math.min(...stock);
            const volumeRange = Math.max(...volume) - Math.min(...volume);
            const stockMin = Math.min(...stock);
// Determine the common range for both series
            const commonRange = Math.max(stockRange, volumeRange);
            Highcharts.stockChart('charts-container', {
                chart: {
                    alignThresholds: true,
                    height: 500,
                },
                rangeSelector: {
                    inputEnabled: false,
                    selected: 0,
                    buttons: [
                        {
                            type: 'day',
                            count: 7,
                            text: '7d'
                        }, {
                            type: 'day',
                            count: 15,
                            text: '15d'
                        }, {
                            type: 'month',
                            count: 1,
                            text: '1m',
                        }, {
                            type: 'month',
                            count: 3,
                            text: '3m'
                        }, {
                            type: 'month',
                            count: 6,
                            text: '6m'
                        }]
                },
                title: {
                    text: 'Stock Price ' + `${name}`.toUpperCase() + ' ' + `${curr_date}`
                },
                subtitle: {
                    text: '<a style="color: blue; text-decoration: underline;" href="https://polygon.io">Source: Polygon.io</a>' // Specify your subtitle text with hyperlink here
                },
                navigator: {
                    series: {
                        accessibility: {
                            exposeAsGroupOnly: true
                        }
                    }
                },
                yAxis: [{
                    labels: {
                        align: 'center'
                    },
                    // height: '80%',
                    // resize: {
                    //     enabled: true
                    // },
                    title: {
                        text: 'Stock Price'
                    },
                    opposite: false,
                    alignTicks: true,
                    tickAmount: 6
                }, {
                    // Configuration for the right y-axis (for volume)
                    labels: {
                        align: 'center'
                    },
                    height: '100%',
                    // top: '20%',
                    // offset: 0,
                    title: {
                        text: 'Volume'
                    },
                    opposite: true,// Set this to true to position the axis on the right side
                    // gridLineWidth: 0,
                    alignTicks: true,
                    tickAmount: 6
                }],
                series: [{
                    name: 'Stock Price',
                    data: stock,
                    type: 'area',
                    threshold: null,
                    tooltip: {
                        valueDecimals: 2
                    },
                    fillColor:
                        {
                            linearGradient: {
                                x1: 0,
                                y1:
                                    0,
                                x2:
                                    0,
                                y2:
                                    1
                            }
                            ,
                            stops: [
                                [0, Highcharts.getOptions().colors[0]],
                                [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                            ]
                        }
                }, {
                    type: 'column',
                    id: 'volume',
                    name: 'Volume',
                    data: volume,
                    yAxis: 1,
                    color: 'black',
                    pointWidth: 4,
                }],
                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 800
                        },
                        chartOptions: {
                            rangeSelector: {
                                inputEnabled: false,

                            }
                        }
                    }]
                },
                exporting: {
                    buttons: {
                        contextButton: {
                            menuItems: [
                                'viewFullscreen',
                                'printChart',
                                'separator',
                                'downloadPNG',
                                'downloadJPEG',
                                'downloadPDF',
                                'downloadSVG'
                            ]
                        }
                    }
                }
            })
            ;
        });
}


function get_news(name) {
    fetch('/company/' + `${name}` + '/latest-news')
        .then(response => response.json())
        .then(data => {
            console.log("Latest News");
            console.log(data);
            // for(var i = 0; i < data.length; i++)
            //     document.getElementById("news-container").innerHTML += <div>{data[i].headline}</div>
            document.getElementById("news-container").innerHTML = "";
            for (var l = 0; l < 5; l++) {
                console.log(data[l]);
                document.getElementById("news-container").innerHTML += `<div style="display: flex;flex-direction: row; padding: 1.5%; margin: 3% 0 3% 0; background-color:#f1f1f1 "> 
                                                                                    <div><img src =${data[l].image} height="100px" width="100px" style="float: left; margin-right: 10px;"/></div>
                                                                                    <div style="display: flex; flex-direction: column; padding-left: 1%;" >
                                                                                        <p style="margin: 0"><b>${data[l].headline}</b></p>
                                                                                        <p style="margin: 0">${data[l].datetime}</p>
                                                                                        <p style="margin: 0"><a href=${data[l].url} target="_blank">See Original Post</a></p>
                                                                                    </div>
                                                                                  </div>`;
            }
        });
}