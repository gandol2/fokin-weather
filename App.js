import React from "react";
import { Alert } from "react-native";

import * as Location from "expo-location";
import axios from "axios";

import Loading from "./Loading";
import Weather from "./Weather";

const API_KEY_WEATHER = "9fdcb1aabc75ce2b981619f28fcf9c2b";
//http://api.openweathermap.org/data/2.5/weather?lat=35.14685386449702&lon=129.11013901532155&APPID=9fdcb1aabc75ce2b981619f28fcf9c2b
export default class extends React.Component {
  state = {
    isLoading: true
  };

  // get weather from https://openweathermap.org
  getWeather = async (latitude, longitude) => {
    const {
      data: {
        main: { temp },
        weather
      }
    } = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${API_KEY_WEATHER}&units=metric`
    );

    console.log(temp);
    console.log(weather[0].main);

    this.setState({
      isLoading: false,
      temp,
      condition: weather[0].main
    });
    //console.log(data);
  };

  // get Current Location from Device
  getLocation = async () => {
    try {
      //throw Error();  // 강제로 예외 발생
      await Location.requestPermissionsAsync();
      const {
        coords: { latitude, longitude }
      } = await Location.getCurrentPositionAsync();

      this.getWeather(latitude, longitude);
      this.setState({ isLoading: true });
      // TODO : Send to API and get weather
      //console.log(coords.latitude, coords.longitude);
    } catch (error) {
      Alert.alert("위치 정보를 확인 할 수 없습니다.", "So sad");
    }
  };
  componentDidMount() {
    this.getLocation();
  }
  render() {
    const { isLoading, temp, condition } = this.state;
    return isLoading ? (
      <Loading />
    ) : (
      <Weather temp={Math.round(temp)} condition={condition} />
    );
  }
}

/*
export default function App() {
  return <Loading />;
}
*/
