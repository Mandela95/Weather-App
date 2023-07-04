/* eslint-disable react-hooks/exhaustive-deps */
import "./App.css";
import { useEffect, useState } from "react";

// MUI
import Container from "@mui/material/Container";
import CloudIcon from "@mui/icons-material/Cloud";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";

// External
import axios from "axios";
import moment from "moment";
import "moment/min/locales";
import { useTranslation } from "react-i18next";
moment.locale("en");

let cancelAxios = null;

function App() {
  // States
  const { t, i18n } = useTranslation();
  const [dateAndTime, setDateAndTime] = useState("");
  const [temp, setTemp] = useState({
    cityTemp: null,
    min: null,
    max: null,
    description: "",
    icon: null,
  });
  const [locale, setLocale] = useState("en");

  const direction = locale === "ar" ? "rtl" : "ltr";

  const [cityName, setCityName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Event Handlers
  function handleLanguageClick() {
    if (locale === "en") {
      setLocale("ar");
      i18n.changeLanguage("ar");
      moment.locale("ar");
    } else {
      setLocale("en");
      i18n.changeLanguage("en");
      moment.locale("en");
    }
    setDateAndTime(moment().format("LL"));
  }

  useEffect(() => {
    i18n.changeLanguage(locale);
  }, []);

  // window.addEventListener("keyup", (e) => {
  //   if (e.keyCode === 13) {
  //     handleClick();
  //   }
  // });

  function handleClick() {
    if (cityName !== "") {
      setDateAndTime(moment().format("LL"));
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=5da3f8da79c20ad46caaf006ea89b14f&units=metric`,
          {
            cancelToken: new axios.CancelToken((c) => {
              cancelAxios = c;
            }),
          }
        )
        .then(function (response) {
          const cityTemp = Math.round(response.data.main.temp) + "°C";
          const min = Math.round(response.data.main.temp_min) + "°c";
          const max = Math.round(response.data.main.temp_max) + "°c";
          const description = response.data.weather[0].description;
          const responseIcon = response.data.weather[0].icon;

          setTemp({
            ...temp,
            cityTemp,
            min,
            max,
            description,
            icon: `https://openweathermap.org/img/wn/${responseIcon}@2x.png`,
          });

          setErrorMsg("");
        })
        .catch(function (error) {
          if (error.response.status === 404) {
            setErrorMsg("Invalid City Name");
          } else {
            setErrorMsg("");
          }
        });

      // useEffect clean up
      return () => {
        cancelAxios();
      };
    } else {
      setErrorMsg("Write City Name");
    }
  }

  return (
    <div className="App">
      <Container maxWidth="sm" className="container">
        <div className="card">
          <div className="input">
            <input
              className="search"
              type="search"
              placeholder="Enter City Name"
              onChange={(e) => {
                setCityName(e.target.value.trim().toLowerCase());
              }}
            />
            <div className="icon">
              <SearchIcon
                titleAccess="Get Full Weather Informations"
                onClick={handleClick}
              />
            </div>
          </div>
          <div className="errorMsg">
            <h3 className="errorMsg">{errorMsg}</h3>
          </div>
          <div className="cityAndDate" dir={direction}>
            <h2 className="city">{t(cityName)}</h2>
            <h3>{t(dateAndTime)}</h3>
          </div>
          <hr />
          <div className="content" dir={direction}>
            <div>
              <div className="tempIcon">
                <h1 className="temp">{temp.cityTemp}</h1>
                <img
                  src={temp.icon}
                  alt={temp.icon !== "" ? "" : "weatherCondition"}
                />
              </div>

              <h5>{t(temp.description)}</h5>
              <div className="description" dir={direction}>
                <h5>
                  {t("min")}: {temp.min}
                </h5>
                <p>|</p>
                <h5>
                  {t("max")}: {temp.max}
                </h5>
              </div>
            </div>
            <CloudIcon className="cloud" />
          </div>
        </div>
        <Button
          className="langBtn"
          dir={direction}
          onClick={handleLanguageClick}
        >
          {locale === "en" ? "Arabic" : "English"}
        </Button>
      </Container>
    </div>
  );
}

export default App;
