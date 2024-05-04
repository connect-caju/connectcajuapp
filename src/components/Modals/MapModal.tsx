import {
  View,
  Text,
  InteractionManager,
  Dimensions,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native"
import React, { useCallback, useState, useEffect, useRef } from "react"
import { Box, Stack, Center } from "native-base"
import { Icon, Overlay } from "@rneui/themed"
import { useFocusEffect } from "@react-navigation/native"
import COLORS from "../../consts/colors"
import CustomActivityIndicator from "../../components/ActivityIndicator/CustomActivityIndicator"
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"

import { useUser, useApp } from "@realm/react"
import { realmContext } from "../../models/realmContext"
const { useRealm, useQuery, useObject } = realmContext

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
})

const mapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#242f3e",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#746855",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#242f3e",
      },
    ],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#263c3f",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#6b9a76",
      },
    ],
  },
  {
    featureType: "road",
    stylers: [
      {
        saturation: -100,
      },
      {
        visibility: "simplified",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#38414e",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#212a37",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9ca5b3",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#746855",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#1f2835",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#f3d19c",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [
      {
        color: "#2f3948",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#17263c",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#515c6d",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#17263c",
      },
    ],
  },
]

export default function MapModal({
  farmlandId,
  isMapVisible,
  setIsMapVisible,
  currentCoordinates
}: any) {
  // const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const realm = useRealm()
  const mapRef = useRef()



  const [loadingActivitiyIndicator, setLoadingActivityIndicator] =
    useState(false)

  const [marker, setMarker] = useState()
  const [address, setAddress] = useState()
  const [region, setRegion] = useState({
    latitude: -25.94394, // initial latitude
    longitude: 32.573218, // initial longitude
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  })

  // Geocoder.init(secrets.googleAPIKey);

  const toggleOverlay = () => {
    setIsMapVisible(!isMapVisible)
  }

  useEffect(() => {

    setMarker(currentCoordinates)
  }, [currentCoordinates])

  useFocusEffect(
    React.useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        setLoadingActivityIndicator(true)
      })
      return () => task.cancel()
    }, []),
  )

  if (loadingActivitiyIndicator) {
    return (
      <CustomActivityIndicator
        loadingActivitiyIndicator={loadingActivitiyIndicator}
        setLoadingActivityIndicator={setLoadingActivityIndicator}
      />
    )
  }

  return (
    <Overlay
      overlayStyle={{
        backgroundColor: "ghostwhite",
        width: "100%",
        height: "100%",
        paddingTop: 10,
      }}
      isVisible={isMapVisible}
      onBackdropPress={toggleOverlay}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.ghostwhite,
          height: "100%",
          width: "100%",
        }}
      >
        <View
          style={{
            paddingBottom: 20,
            width: "100%",
          }}
        >
          <Box w="10%">
            <Icon
              name="arrow-back-ios"
              color={COLORS.main}
              size={30}
              onPress={() => {
                setIsMapVisible(false)
              }}
            />
          </Box>
          <Box w="90%"></Box>
        </View>
        <View style={styles.container}>
          <MapView

            // @ts-expect-error TS(2322): Type 'MutableRefObject<undefined>' is not assignab... Remove this comment to see the full error message
            ref={mapRef}
            zoomControlEnabled={true}
            showsMyLocationButton={true}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            customMapStyle={mapStyle}
            region={{
              latitude: currentCoordinates?.latitude
                ? currentCoordinates?.latitude
                : -25.94394, // initial latitude
              longitude: currentCoordinates?.longitude
                ? currentCoordinates?.longitude
                : 32.573218, // initial longitude
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}
            onPress={(e: any) => {
              // console.log('e.nativeEvent: ', e.nativeEvent)
              setMarker(e.nativeEvent.coordinate)
            }}
          >
            {marker !== undefined ? <Marker coordinate={marker} /> : null}
          </MapView>
          <View
            style={{
              padding: 15,
              backgroundColor: COLORS.ghostwhite,
              marginVertical: 15,
              marginHorizontal: 5,
              borderRadius: 20,
              // flexDirection: 'row',
            }}
          >
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: COLORS.main,
                    fontSize: 18,
                    fontFamily: "JosefinSans-Bold",
                  }}
                >
                  Selecciona uma localização
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setIsMapVisible(false)
                    setMarker(undefined)
                  }}
                >
                  <Icon name="close" color={COLORS.grey} size={25} />
                </TouchableOpacity>
              </View>
              {address && (
                <Text
                  style={{
                    marginTop: 10,
                    color: COLORS.danger,
                  }}
                >
                  {address}
                </Text>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: 5,
              left: Dimensions.get("window").width / 2 - 70,
            }}
            onPress={() => {
              // marker, address,
            }}
          >
            <View
              style={{
                backgroundColor: COLORS.main,
                paddingVertical: 10,
                paddingHorizontal: 5,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  color: COLORS.ghostwhite,
                  fontWeight: "bold",
                }}
              >
                Confirma localização
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Overlay>
  );
}
