
# Dependencies
import datetime as dt

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, render_template

# Database
# create engine using the `city.sqlite` database file 
engine = create_engine('sqlite:///data/city.sqlite')

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(engine, reflect=True)

# create an instance of the Flask class 
app = Flask(__name__)


# Flask Routes
@app.route("/")
def homepage():
    # create a session from Python to the database
    session = Session(engine)

    # read city name from input
    city_name = "Chicago"

    base_img_path = "static/icons"
    # get weather data for the city_name
    weather_data = [
        {"day": "25", "img": f"{base_img_path}/01d.svg", "temp":"43.4"},
        {"day": "26", "img": "img/good.svg", "temp":"45.4"},
        {"day": "27", "img": "img/bad.svg", "temp":"41.4"},
        {"day": "28", "img": "img/cry.svg", "temp":"50.4"},
        {"day": "29", "img": "img/good.svg", "temp":"68.4"},
        
        ]

    return render_template('weather.html', city=city_name, 
        weather=weather_data)
        


if __name__ == "__main__":
    app.run(port=8080,debug=True)