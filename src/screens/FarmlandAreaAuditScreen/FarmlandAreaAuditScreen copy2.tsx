import React, { useCallback, useEffect, useState } from "react"
import {
  View,
  Text,
  SafeAreaView,
  Switch,
  FlatList,
  ScrollView,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
} from "react-native"
import { Stack, Box, Center } from "native-base"
import Geolocation from "react-native-geolocation-service"
import AwesomeAlert from "react-native-awesome-alerts"
import BackgroundGeolocation, {
  Location,
  Subscription,
// @ts-expect-error TS(2307): Cannot find module 'react-native-background-geoloc... Remove this comment to see the full error message
} from "react-native-background-geolocation"

import LottieAddButton from "../../components/Buttons/LottieAddButton"
import { Icon } from "@rneui/base"
import CoordinatesItem from "../../components/CoordinatesItem/CoordinatesItem"
import CustomDivider from "../../components/Divider/CustomDivider"
import GeoPin from "../../components/LottieComponents/GeoPin"

import {
  getPosition,
  sortCoordinatesByPositions,

  // @ts-expect-error TS(2305): Module '"../../helpers/updateCoordinates"' has no ... Remove this comment to see the full error message
  updateCoordinates,
} from "../../helpers/updateCoordinates"
import { Farmland } from "../../models/Farmland"

// @ts-expect-error TS(2307): Cannot find module '../../fakedata/positions' or i... Remove this comment to see the full error message
import { positions } from "../../fakedata/positions"

import { realmContext } from "../../models/realmContext"
import COLORS from "../../consts/colors"
import MapModal from "../../components/Modals/MapModal"
import { useFocusEffect } from "@react-navigation/native"

// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { InteractionManager } from "react-native"
import CustomActivityIndicator from "../../components/ActivityIndicator/CustomActivityIndicator"

// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { Pressable } from "react-native"
import { calculatePolygonArea } from "../../helpers/calculatePolygonArea"
const { useRealm, useObject, useQuery } = realmContext

const FarmlandAreaAuditScreen = ({
  route,
  navigation
}: any) => {
  const realm = useRealm()
  const farmlandId = route.params?.farmlandId
  const [confirmGeoAlert, setConfirmGeoAlert] = useState(false)
  const [rejectGeoAlert, setRejectGeoAlert] = useState(false)
  const [failedGeoLocationRequest, setFailedGeoLocationRequest] =
    useState(false)
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [isCalculatedArea, setIsCalculatedArea] = useState(false)
  const [area, setArea] = useState(null)

  const [currentCoordinates, setCurrentCoordinates] = useState({
    latitude: -1,
    longitude: -1,
  })

  const [isMapVisible, setIsMapVisible] = useState(false)
  const [loadingActivitiyIndicator, setLoadingActivityIndicator] =
    useState(false)

  // react-native-background-geolocation
  const [enabled, setEnabled] = useState(false)
  const [location, setLocation] = useState(null)
  const [refreshLocation, setRefreshLocation] = useState(false)


  // @ts-expect-error TS(2769): No overload matches this call.
  const farmland = useObject("Farmland", farmlandId)

  useEffect(() => {
    // if (refreshLocation) {

    // 1. Subscribe to events
    const onLocation = BackgroundGeolocation.onLocation((location: any) => {
      setLocation({

        // @ts-expect-error TS(2345): Argument of type '{ lat: number; lng: number; }' i... Remove this comment to see the full error message
        lat: parseFloat(location.coords.latitude),
        lng: parseFloat(location.coords.longitude),
      })

      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.log("[location]", location)
    })

    const onMotionChange = BackgroundGeolocation.onMotionChange((event: any) => {

      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.log("[onMotionChange]", event)
    })

    const onActivityChange = BackgroundGeolocation.onActivityChange((event: any) => {

      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.log("[onActivityChange]", event)
    })

    const onProviderChange = BackgroundGeolocation.onProviderChange((event: any) => {

      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.log("[onProviderChange]", event)
    })

    // 2.  ready the plugin
    BackgroundGeolocation.ready({
      // Geolocation config
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,

      // Activity Recognition
      stopTimeout: 5,

      // Application config
      debug: true,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false,
      startOnBoot: true,
    }).then((state: any) => {
      setEnabled(state.enabled)

      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.log(
        "- BackgroundGeolocation is configured and ready: ",
        state.enabled,
      )
    })

    return () => {
      // Remove BackgroundGeolocation event-subscribers when the View is removed or refreshed
      // during development live-reload. Without this, event-listeners will accumulate with
      // each refresh during live-reload.
      onLocation.remove()
      onMotionChange.remove()
      onActivityChange.remove()
      onProviderChange.remove()
    }
    // }
  }, [refreshLocation])

  useEffect(() => {
    if (enabled) {
      BackgroundGeolocation.start()
    } else {
      BackgroundGeolocation.stop()
      setLocation(null)
    }
  }, [enabled, refreshLocation])

  // request the permission to use the device position coordinates
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        // PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Geolocalização",
          message: "Pode o ConnectCaju obter accesso a sua localização?",
          buttonNeutral: "Mais tarde",
          buttonNegative: "Cancelar",
          buttonPositive: "OK",
        },
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setPermissionGranted(true)
        setConfirmGeoAlert(true)
        // subscribeLocation();

        // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
        console.log("You can use the app")
      } else {
        setPermissionGranted(false)

        // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
        console.log("Location Permission Denied")
      }
    } catch (err) {

      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.log("not granted:", granted)

      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.warn(err)
      setFailedGeoLocationRequest(true)
    }
  }

  // persist the acquired coordinates
  const saveCoordinates = (farmland: any, point: any) => {
    realm.write(() => {
      farmland.extremeCoordinates?.push(point)
    })
  }

  const subscribeLocation = () => {

    // @ts-expect-error TS(2304): Cannot find name 'watchID'.
    watchID = Geolocation.watchPosition(
      (position) => {
        //Will give you the location on location change

        setCurrentCoordinates({
          latitude: position?.coords.latitude,
          longitude: position?.coords.longitude,
        })
      },
      (error) => {
        Alert.alert("Falha", "Tenta novamente!", {
          cause: error,
        })
      },
      {
        enableHighAccuracy: true,

        // @ts-expect-error TS(2559): Type 'string' has no properties in common with typ... Remove this comment to see the full error message
        accuracy: "high",
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 100,
      },
    )
  }

  const getCurrentPosition = () => {
    if (!permissionGranted) {
      requestLocationPermission()
    } else {
      subscribeLocation()
    }
  }

  // get the current coordinates of device position
  const getGeolocation = async () => {
    if (!permissionGranted) {
      requestLocationPermission()
    } else {
      Geolocation.getCurrentPosition(
        (position) => {
          // get the exact position to the point

          // @ts-expect-error TS(2339): Property 'extremeCoordinates' does not exist on ty... Remove this comment to see the full error message
          const number = getPosition(farmland?.extremeCoordinates)

          saveCoordinates(farmland, {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            position: number,
          })
        },
        (error) => {
          Alert.alert("Falha", "Tenta novamente!", {
            cause: error,
          })
        },
        {
          enableHighAccuracy: true,

          // @ts-expect-error TS(2559): Type 'string' has no properties in common with typ... Remove this comment to see the full error message
          accuracy: "high",
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 100,
        },
      )
    }
  }

  useEffect(() => {
    requestLocationPermission()
    return () => {
      //   Geolocation.clearWatch(watchID);
    }
  }, [navigation])

  const navigateBack = () => {

    // @ts-expect-error TS(2531): Object is possibly 'null'.
    if (farmland.ownerType === "Group") {
      navigation.navigate("Group", {

        // @ts-expect-error TS(2339): Property 'farmerId' does not exist on type 'Object... Remove this comment to see the full error message
        ownerId: farmland?.farmerId,
      })
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    } else if (farmland.ownerType === "Single") {
      navigation.navigate("Farmer", {

        // @ts-expect-error TS(2339): Property 'farmerId' does not exist on type 'Object... Remove this comment to see the full error message
        ownerId: farmland?.farmerId,
      })
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    } else if (farmland.ownerType === "Institution") {
      navigation.navigate("Institution", {

        // @ts-expect-error TS(2339): Property 'farmerId' does not exist on type 'Object... Remove this comment to see the full error message
        ownerId: farmland?.farmerId,
      })
    }
  }

  const keyExtractor = (item: any, index: any) => index.toString()

  useFocusEffect(
    React.useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        setLoadingActivityIndicator(true)
      })
      return () => task.cancel()
    }, []),
  )

  // organize the coordinates point objects
  const handleCalculateArea = () => {

    // @ts-expect-error TS(2531): Object is possibly 'null'.
    let coordinates = farmland.extremeCoordinates


    // @ts-expect-error TS(2304): Cannot find name 'points'.
    points = coordinates?.map((point: any) => {
      return {
        lat: parseFloat(point?.latitude),
        lng: parseFloat(point?.longitude),
      }
    })

    // @ts-expect-error TS(2304): Cannot find name 'points'.
    const area = calculatePolygonArea(points)

    // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
    setArea(Number(area))

    return area
  }

  // save the area that has been calculated
  const saveAuditedArea = (area: any) => {
    realm.write(() => {

      // @ts-expect-error TS(2531): Object is possibly 'null'.
      farmland.auditedArea = parseFloat(area)
    })
  }

  if (loadingActivitiyIndicator) {
    return (
      <CustomActivityIndicator
        loadingActivitiyIndicator={loadingActivitiyIndicator}
        setLoadingActivityIndicator={setLoadingActivityIndicator}
      />
    )
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.ghostwhite,
      }}
    >
      <AwesomeAlert
        show={failedGeoLocationRequest}
        showProgress={false}
        title="Geolocalização"
        message="Não foi possível processar o pedido de acesso à localização do dispositivo. Tente mais tarde!"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={true}
        confirmText="   OK   "
        confirmButtonColor="#DD6B55"
        onConfirmPressed={() => {
          setFailedGeoLocationRequest(false)
        }}
      />

      <AwesomeAlert
        show={isCalculatedArea}
        showProgress={false}
        title="Área"
        message={`${Number(area)} hectares`}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        confirmText=" Confirmar "
        cancelText=" Rejeitar  "
        confirmButtonColor={COLORS.main}
        cancelButtonColor="#DD6B55"
        onConfirmPressed={() => {
          saveAuditedArea(area) // save the auditedarea
          setIsCalculatedArea(false)
          navigateBack()
        }}
        onCancelPressed={() => {
          setIsCalculatedArea(false)
        }}
      />

      <AwesomeAlert
        show={confirmGeoAlert}
        showProgress={false}
        title="Geolocalização"
        message="Este dispositivo aprovou o pedido de permissão deste aplicativo!"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={true}
        confirmText="   OK   "
        confirmButtonColor={COLORS.main}
        onConfirmPressed={() => {
          setConfirmGeoAlert(false)
        }}
      />

      <AwesomeAlert
        show={rejectGeoAlert}
        showProgress={false}
        title="Geolocalização"
        message="O seu dispositivo rejeitou o pedido do ConnectCaju?"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="  Sim  "
        confirmText="  Não  "
        cancelButtonColor="#DD6B55"
        confirmButtonColor={COLORS.main}
        onCancelPressed={() => {
          setRejectGeoAlert(false)
          setPermissionGranted(true)
        }}
        onConfirmPressed={() => {
          // requestLocationPermission();
          setPermissionGranted(true)
          setRejectGeoAlert(false)
        }}
      />

      <Box

        // @ts-expect-error TS(2322): Type '{ children: Element; style: { backgroundColo... Remove this comment to see the full error message
        style={{
          backgroundColor: COLORS.fourth,
          paddingVertical: 20,
        }}
      >
        <Stack direction="row" w="100%" bg="#EBEBE4">
          <Box>
            <Pressable
              onPress={() => {
                navigateBack()
              }}
              style={{
                position: "absolute",
                left: 4,
                top: 4,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Icon name="arrow-back-ios" color={COLORS.main} size={30} />
            </Pressable>
          </Box>
          <Center w="100%">
            <Text
              style={{
                textAlign: "center",
                fontFamily: "JosefinSans-Bold",
                fontSize: 16,
                color: COLORS.main,
              }}
            >
              Geolocalização
            </Text>
          </Center>
        </Stack>
      </Box>

      <Box w="100%" px="3">
        <Stack direction="row" px="3">
          <Box

            // @ts-expect-error TS(2339): Property 'extremeCoordinates' does not exist on ty... Remove this comment to see the full error message
            w={farmland?.extremeCoordinates.length === 0 ? "100%" : "50%"}

            // @ts-expect-error TS(2322): Type '{ children: Element[]; w: "100%" | "50%"; st... Remove this comment to see the full error message
            style={{
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "JosefinSans-Bold",
                fontSize: 14,
                color: COLORS.black,
                lineHeight: 20,
                textAlign:

                  // @ts-expect-error TS(2339): Property 'extremeCoordinates' does not exist on ty... Remove this comment to see the full error message
                  farmland?.extremeCoordinates.length === 0 ? "center" : "left",
                paddingTop: 20,
              }}
            >
              Pontos extremos da área do pomar
            </Text>
            <Switch value={enabled} onValueChange={setEnabled} />
          </Box>

          <Box

            // @ts-expect-error TS(2339): Property 'extremeCoordinates' does not exist on ty... Remove this comment to see the full error message
            w={farmland?.extremeCoordinates.length === 0 ? "0%" : "50%"}
            alignItems={"flex-end"}

            // @ts-expect-error TS(2322): Type '{ children: (string | false | Element)[]; w:... Remove this comment to see the full error message
            style={{
              flex: 1,
              justifyContent: "center",
            }}
          >
            // @ts-expect-error TS(2339): Property 'extremeCoordinates' does not exist on ty... Remove this comment to see the full error message
            // @ts-expect-error TS(2339): Property 'extremeCoordinates' does not exist on ty... Remove this comment to see the full error message
            {farmland?.extremeCoordinates.length > 0 && (
              <TouchableOpacity
                onPress={async () => {
                  await getGeolocation()
                  setRefreshLocation(!refreshLocation)
                }}
              >
                <GeoPin />
              </TouchableOpacity>
            )}
          </Box>
        </Stack>
      </Box>
      <Box

        // @ts-expect-error TS(2322): Type '{ children: Element; style: { width: string;... Remove this comment to see the full error message
        style={{
          width: "100%",
          paddingHorizontal: 10,
        }}
      >
        {/* { extremeLocations?.map(loc=>             */}
        <Text>
          // @ts-expect-error TS(2339): Property 'lat' does not exist on type 'never'.
          // @ts-expect-error TS(2339): Property 'lat' does not exist on type 'never'.
          ponto: {location?.lat}; {location?.lng}
        </Text>
        {/* ) */}
        {/* } */}
      </Box>

      // @ts-expect-error TS(2339): Property 'extremeCoordinates' does not exist on ty... Remove this comment to see the full error message
      // @ts-expect-error TS(2339): Property 'extremeCoordinates' does not exist on ty... Remove this comment to see the full error message
      {farmland?.extremeCoordinates.length === 0 && (

        // @ts-expect-error TS(2322): Type '{ children: Element[]; style: { minHeight: n... Remove this comment to see the full error message
        <Center style={{ minHeight: 300 }}>
          <Box
            // alignItems={"center"}

            // @ts-expect-error TS(2322): Type '{ children: Element; style: { justifyContent... Remove this comment to see the full error message
            style={{
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 100,
              borderWidth: 10,
              borderColor: COLORS.main,
              shadowColor: COLORS.main,
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.5,
              shadowRadius: 1.65,
              elevation: 3,
            }}
          >
            <TouchableOpacity
              onPress={async () => {
                await getGeolocation()
                setRefreshLocation(!refreshLocation)
              }}
            >
              {/* <GeoPin /> */}
              <Icon name="location-pin" size={60} color={COLORS.main} />
            </TouchableOpacity>
          </Box>
          <Box w="100%" alignItems={"center"}>
            <Text
              style={{
                color: COLORS.grey,
                fontSize: 12,
                fontFamily: "JosefinSans-Regular",
                textAlign: "center",
              }}
            >
              Pontos extremos
            </Text>
          </Box>
        </Center>
      )}

      <FlatList

        // @ts-expect-error TS(2339): Property 'extremeCoordinates' does not exist on ty... Remove this comment to see the full error message
        data={sortCoordinatesByPositions(farmland?.extremeCoordinates)}
        keyExtractor={keyExtractor}
        renderItem={({
          item
        }: any) => {

          // @ts-expect-error TS(2786): 'CoordinatesItem' cannot be used as a JSX componen... Remove this comment to see the full error message
          return <CoordinatesItem item={item} farmland={farmland} />
        }}
      />
      <Center

        // @ts-expect-error TS(2322): Type '{ children: (string | false | Element)[]; st... Remove this comment to see the full error message
        style={{
          paddingVertical: 10,
        }}
      >
        // @ts-expect-error TS(2339): Property 'extremeCoordinates' does not exist on ty... Remove this comment to see the full error message
        // @ts-expect-error TS(2339): Property 'extremeCoordinates' does not exist on ty... Remove this comment to see the full error message
        {farmland?.extremeCoordinates.length > 2 && (
          <TouchableOpacity
            onPress={() => {
              // navigation.navigate('FarmlandAreaAudit', {
              //     farmlandId,
              // })
              handleCalculateArea()
              setIsCalculatedArea(true)
            }}
          >
            <Box

              // @ts-expect-error TS(2322): Type '{ children: Element; style: { borderWidth: n... Remove this comment to see the full error message
              style={{
                borderWidth: 1,
                borderColor: COLORS.main,
                borderRadius: 30,
                paddingHorizontal: 20,
                paddingVertical: 10,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "JosefinSans-Bold",
                  color: COLORS.main,
                  textAlign: "center",
                }}
              >
                Calcular Área
              </Text>
            </Box>
          </TouchableOpacity>
        )}
      </Center>
      <MapModal

        // @ts-expect-error TS(2531): Object is possibly 'null'.
        farmlandId={farmland._id}
        isMapVisible={isMapVisible}
        setIsMapVisible={setIsMapVisible}
        getCurrentPosition={getCurrentPosition}
        currentCoordinates={currentCoordinates}
      />
    </SafeAreaView>
  );
}

export default FarmlandAreaAuditScreen
