import {
  Button,
  ButtonGroup,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  SkeletonText,
} from "@chakra-ui/react";
import { FaTimes, FaMapMarkerAlt, FaCircle, FaPlus, FaMinus, FaPlusCircle, FaMinusCircle } from "react-icons/fa";

import {} from "react-icons";
import "./main.css";
import {
  useJsApiLoader,
  GoogleMap,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useRef, useState } from "react";
const center = { lat: 21, lng: 78 };
function Main() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: `${process.env.REACT_APP_API_KEY}`,
    libraries: ["places"],
    region: "IN",
  });

  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [originVal, setOriginVal] = useState("");
  const [destinationVal, setDestinationVal] = useState("");
  const [inputs, setInputs] = useState([]);
  const waypointsInputRefs = useRef([]);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [stop1,setStop1]=useState([]);
  let errorObj = {};
  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destinationRef = useRef();
  const stopsRef = useRef();
  if (!isLoaded) {
    return <SkeletonText />;
  }
  const handleOriginChange = (event) => {
    setOriginVal(originRef.current.value);
  };
  const handleInputChange = (event, index) => {
    const newInputs = [...inputs];
    newInputs[index] = event.target.value;
    console.log(newInputs);
    setInputs(newInputs);
    console.log(newInputs);
  };
  function addInput(e) {
    e.preventDefault();
    setInputs([...inputs, ""]);
    console.log(inputs);
  }
  const handleStopChange=(e)=>{
    setInputs(e.target.value)
  }
  function removeInput(index) {
    const newInputs = [...inputs];
    newInputs.splice(index, 1);
    setInputs(newInputs);
    console.log(newInputs);
  }
  async function calculateRoute() {
    try {
      setError(false);
      const origin = originRef.current.value;
      const destination = destinationRef.current.value;
      // const stop=stopsRef.current.value;
      // setStop(stop);
      const originName = origin.split(",")[0];
      const destinationName = destination.split(",")[0];
      setOriginVal(originName);
      setDestinationVal(destinationName);
      if (
        originRef.current.value === "" &&
        destinationRef.current.value === ""
      ) {
        errorObj.originError = true;
        errorObj.destinationError = true;
        setFormErrors(errorObj);
      } else if (destinationRef.current.value === "") {
        errorObj.destinationError = true;
        setFormErrors(errorObj);
      } else if (originRef.current.value === "") {
        errorObj.originError = true;
        setFormErrors(errorObj);
      } else {
        errorObj.originError = false;
        errorObj.destinationError = false;
        setFormErrors(errorObj);
      }
      const waypoints = inputs.map((stop) => ({
        location: stop,
        stopover: true,
      }));
      // eslint-disable-next-line no-undef
      const directionsService = new google.maps.DirectionsService();
      const results = await directionsService.route({
        origin: originRef.current.value,
        destination: destinationRef.current.value,
        waypoints: waypoints,
        // eslint-disable-next-line no-undef
        travelMode: google.maps.TravelMode.DRIVING,
      });
      let totalDistance = 0;
      for (let i = 0; i < results.routes[0].legs.length; i++) {
        totalDistance += results.routes[0].legs[i].distance.value;
      }
      const durationInSeconds = results.routes.reduce(
        (totalDuration, route) =>
          totalDuration +
          route.legs.reduce(
            (duration, leg) => duration + leg.duration.value,
            0
          ),
        0
      );
      if (results.status === "NOT_FOUND") {
        alert(" You chose a location that is not suggested by google ");
        setError(true);
        return;
      }
      const days = Math.floor(durationInSeconds / 86400);
      const hours = Math.floor((durationInSeconds % 86400) / 3600);
      setDuration(`${days} days ${hours} hours`);
      setDirectionsResponse(results);
      setDistance(`${(totalDistance / 1000).toFixed(0)} km`);
    } catch (error) {
      alert(
        " You chose a location that is not suggested by google or the fields are empty"
      );
      // alert(error);
      setError(true);
    }
  }
  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    setInputs([]);
    originRef.current.value = "";
    destinationRef.current.value = "";
    stopsRef.current.value = "";
  }
  return (
    <>
      <div className="main-container">
        <div className="text">
          Let's calculate <b>distance</b> from Google maps
        </div>
        <div className="main">
          <div className="left">
            <div className="entries">
              <div className="left-1">
                {/* <div className="fields"> */}
                <Heading as="h6" size="xs" className="heading">
                  Origin
                </Heading>
                <div className="field">
                  <Autocomplete>
                    <InputGroup>
                      <Input
                        type="text"
                        background={"#FFFF"}
                        style={{
                          border: `${
                            formErrors.originError ? "5px solid red" : "none"
                          }`,
                        }}
                        placeholder="Origin"
                        ref={originRef}
                        onChange={(e) => handleOriginChange(e)}
                      />
                      <InputLeftElement
                        pointerEvents="none"
                        children={<FaCircle size={15} color="green" />}
                      />
                    </InputGroup>
                  </Autocomplete>
                </div>
                <Heading as="h6" size="xs" className="heading">
                  Stops
                </Heading>
                <div className="field" >
                  <Autocomplete>
                    <InputGroup>
                      <Input
                        className="stop-field"
                        type="text"
                        background={"#FFFF"}
                        placeholder="Stops"

                        ref={
                          waypointsInputRefs
                        }
                      />
                      <InputLeftElement
                        pointerEvents="none"
                        children={<FaCircle size={15} color="black" />}
                      />
                    </InputGroup>
                  </Autocomplete>
                  {inputs.map((input, index) => (
                    <div key={index} className="stop-field">
                      <Autocomplete>
                        <InputGroup>
                          <Input
                            type="text"
                            background={"#FFFF"}
                            placeholder="Stops"
                            value={input}
                            onClick={e=>handleInputChange(e)}
                            // ref={(element) =>
                            //   waypointsInputRefs.current.push(element)
                            // }
                            onChange={(e) => {
                              handleInputChange(e, index);
                            }}
                          />
                          <InputLeftElement
                            pointerEvents="none"
                            children={<FaCircle size={15} color="black" />}
                          />
                        </InputGroup>
                      </Autocomplete>
                    </div>
                  ))}
                  <div className="buttons" style={{display:"flex",justifyContent:"center"}}>
                  <button type="click" onClick={addInput} id="addButton">
                    <FaPlusCircle size={10} /> Add another stop
                  </button>
                  <button type="click" onClick={removeInput} id="addButton">
                    <FaMinusCircle size={10} /> Remove 
                  </button>
                  </div>
                </div>
                <Heading as="h6" size="xs" className="heading" >
                  Destination
                </Heading>
                <div className="field">
                  <Autocomplete>
                    <InputGroup>
                      <Input
                        type="text"
                        background={"#FFFF"}
                        placeholder="Destination"
                        ref={destinationRef}
                        style={{
                          border: `${
                            formErrors.destinationError
                              ? "5px solid red"
                              : "none"
                          }`,
                        }}
                      />
                      <InputLeftElement
                        pointerEvents="none"
                        children={<FaMapMarkerAlt />}
                      />
                    </InputGroup>
                  </Autocomplete>
                </div>
              </div>
              {/* <div className="left-2"> */}
              <div className="calcButton">
                <ButtonGroup>
                  <div className="calcButton-1">
                    <Button
                      colorScheme="#1B31A8"
                      type="submit"
                      onClick={calculateRoute}
                    >
                      Calculate
                      {formErrors === "{}" ? alert("An error occured") : ""}
                    </Button>
                  </div>
                  <div
                    className="calcButton-2"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <IconButton
                      aria-label="center back"
                      borderRadius={"50%"}
                      background={"#1b31a8"}
                      alignItems={"center"}
                      // position={"relative"}
                      icon={<FaTimes color="white" />}
                      onClick={clearRoute}
                    />
                  </div>
                </ButtonGroup>
              </div>
            </div>
            <div className="distance">
              <div className="distance-number">
                <div className="text-distance">
                  <h1 style={{ fontWeight: "800", fontSize: "1.5rem" }}>
                    Distance
                  </h1>
                </div>
                <div className="distance-km">
                  <h1
                    style={{
                      color: " #0079FF",
                      fontSize: "3rem",
                      fontWeight: "900",
                    }}
                    id="distance-heading"
                  >
                    {distance ? `${distance}s` : ""}
                  </h1>
                </div>
              </div>
              <div className="distance-sentence">
                {distance ? (
                  `The distance between ${originVal} and ${destinationVal} via the seleted route is ${distance}s and the approximate time of shipping is ${duration}.`
                ) : (
                  <>
                    <strong>***</strong>
                    <b>Use the cross to clear the entries</b>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="right">
            <div className="maps">
              {/* Google Map Box */}
              <GoogleMap
                center={center}
                zoom={5}
                mapContainerStyle={{ width: "100%", height: "100%" }}
                options={{
                  zoomControl: false,
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
                }}
                onLoad={(map) => setMap(map)}
              >
                {/* <Marker position={center} /> */}
                {directionsResponse && (
                  <DirectionsRenderer
                    directions={directionsResponse}
                    zoom={8}
                  />
                )}
              </GoogleMap>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
