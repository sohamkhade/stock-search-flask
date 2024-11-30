import requests
from flask import Flask, url_for, render_template, request
from markupsafe import escape
import finnhub
from flask import jsonify
from datetime import datetime
from dateutil.relativedelta import *
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

finnhub_client = finnhub.Client(api_key="cmsr4g9r01qpvcptefd0cmsr4g9r01qpvcptefdg")


@app.route('/', methods=["GET"])
def index():
    return app.send_static_file('index.html')


@app.route('/company/<name>', methods=["GET"])
def company_name(name):
    data = {}
    if request.method == "GET":
        data = finnhub_client.company_profile2(symbol=name)
        # print(data)
        if len(data) == 0:
            return jsonify({"no_data": "No data found"})
    return jsonify(data)


@app.route('/company/quote/<name>', methods=["GET"])
def company_quote(name):
    data = None
    if request.method == "GET":
        data = finnhub_client.quote(name)
        sym = finnhub_client.company_profile2(symbol=name)
        data["ticker"] = sym["ticker"]
        if len(data) == 0:
            return jsonify({"no_data": "no data found"})
    return jsonify(data)


@app.route('/company/recommendation-trends/<name>', methods=["GET"])
def company_recommendation_trends(name):
    data = None
    if request.method == "GET":
        data = finnhub_client.recommendation_trends(name)
        print("recommendation trends")
        print(data)
        if len(data) == 0:
            return "no data"
    return jsonify(data)


@app.route("/company/polygon/<name>", methods=["GET"])
def company_polygon(name):
    # print(name)
    ticker = str(name).upper()
    current_date = datetime.now()
    # current_timestamp = int(current_date.timestamp())
    # Format the date as YYYY-MM-DD
    current_date_str = current_date.strftime('%Y-%m-%d')

    # print("Current date in YYYY-MM-DD format:", current_date_str)

    # Convert current date string back to datetime object
    current_date = datetime.strptime(current_date_str, '%Y-%m-%d')

    # Subtract 6 months
    last_six_months = current_date + relativedelta(months=-6, weeks=0, days=-1)
    # Format the date as YYYY-MM-DD
    # last_six_months_timestamp = int(last_six_months.timestamp())
    last_six_months_str = last_six_months.strftime('%Y-%m-%d')

    # print("Date 6 months ago in YYYY-MM-DD format:", last_six_months_str)

    url = "https://api.polygon.io/v2/aggs/ticker/" + ticker + "/range/1/day/" + last_six_months_str + "/" + current_date_str + "?adjusted=true&sort=asc&apiKey=M1FVR6O860wiYHPUvLPRrG_KIChxkfoM"
    response = requests.get(url)
    response = response.json()
    results = response["results"]
    stock_data = []
    volume_data = []
    for i in results:
        date = i["t"]
        price = i["c"]
        vol = i["v"]
        # print(str(date) + "\t" + str(price))
        stock_data.append([date, price])
        volume_data.append([date, vol])
    response['stock_data'] = stock_data
    response['volume_data'] = volume_data
    response["current_date"] = current_date_str
    return jsonify(response)


@app.route('/company/<name>/latest-news')
def company_latest_news(name):
    current_date = datetime.now()
    current_date_str = current_date.strftime('%Y-%m-%d')
    last_30_days = current_date + relativedelta(days=-30)
    last_30_days_str = last_30_days.strftime('%Y-%m-%d')
    data = finnhub_client.company_news(str(name).upper(), _from=last_30_days_str, to=current_date_str)
    l = []
    for a in data:
        if a['image'] != "" and a['url'] != "" and a['headline'] != "" and a['datetime'] != "":
            a['datetime'] = str(datetime.fromtimestamp(a['datetime']).strftime("%d %B, %Y"))
            l.append(a)
        if len(l) == 5:
            return jsonify(l)
    return jsonify(l)


@app.route('/all-data/<name>', methods=["GET"])
def all_data(name):
    data = {}
    if request.method == "GET":
        data['company_data'] = finnhub_client.company_profile2(symbol=name)
        if len(data) == 0:
            return jsonify({"no_data": "No data found"})
        data['summary_data'] = finnhub_client.quote(name)
        data['recommendation_trends'] = finnhub_client.recommendation_trends(name)
        ticker = str(name).upper()
        current_date = datetime.now()
        current_date_str = current_date.strftime('%Y-%m-%d')
        current_date = datetime.strptime(current_date_str, '%Y-%m-%d')
        last_six_months = current_date + relativedelta(months=-6, weeks=0, days=-1)
        last_six_months_str = last_six_months.strftime('%Y-%m-%d')
        url = "https://api.polygon.io/v2/aggs/ticker/" + ticker + "/range/1/day/" + last_six_months_str + "/" + current_date_str + "?adjusted=true&sort=asc&apiKey=M1FVR6O860wiYHPUvLPRrG_KIChxkfoM"
        response = requests.get(url)
        response = response.json()
        results = response["results"]
        stock_data = []
        volume_data = []
        for i in results:
            date = i["t"]
            price = i["c"]
            vol = i["v"]
            stock_data.append([date, price])
            volume_data.append([date, vol])
        response['stock_data'] = stock_data
        response['volume_data'] = volume_data
        response["current_date"] = current_date_str
        data['charts'] = response
        current_date = datetime.now()
        current_date_str = current_date.strftime('%Y-%m-%d')
        last_30_days = current_date + relativedelta(days=-30)
        last_30_days_str = last_30_days.strftime('%Y-%m-%d')
        data_news = finnhub_client.company_news(str(name).upper(), _from=last_30_days_str, to=current_date_str)
        l = []
        for a in data_news:
            if a['image'] != "" and a['url'] != "" and a['headline'] != "" and a['datetime'] != "":
                a['datetime'] = str(datetime.fromtimestamp(a['datetime']).strftime("%d %B, %Y"))
                l.append(a)
            if len(l) == 5:
                data['latest_news'] = l
        data['latest_news'] = l
        return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True, port=5001)
