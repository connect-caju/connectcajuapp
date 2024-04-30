/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  ScrollView,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
} from "react-native";
import { Stack, Box, Center } from "native-base";
import Geolocation from "react-native-geolocation-service";
import AwesomeAlert from "react-native-awesome-alerts";
import { Icon } from "@rneui/base";
import CoordinatesItem from "../../components/CoordinatesItem/CoordinatesItem";
import GeoPin from "../../components/LottieComponents/GeoPin";

import {
  getPosition,
  sortCoordinatesByPositions,
} from "../../helpers/updateCoordinates";

import { realmContext } from "../../models/realmContext";
import COLORS from "../../consts/colors";
import MapModal from "../../components/Modals/MapModal";
import { useFocusEffect } from "@react-navigation/native";

// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { InteractionManager } from "react-native";
import CustomActivityIndicator from "../../components/ActivityIndicator/CustomActivityIndicator";

// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { Pressable } from "react-native";
import { calculateArea, calculatePolygonArea } from "../../helpers/calculatePolygonArea";
import { SuccessLottie } from "../../components/LottieComponents/SuccessLottie";
import { farmerTypes } from "../../consts/farmerTypes";
import { resourceValidation } from "../../consts/resourceValidation";
import { backgroundStyle } from "../../styles/globals";
const { useRealm, useObject, useQuery } = realmContext;

const FarmlandAreaAuditScreen = ({
  route,
  navigation
}: any) => {
  const realm = useRealm();
  const farmlandId = route.params?.farmlandId;
  const [confirmGeoAlert, setConfirmGeoAlert] = useState(false);
  const [rejectGeoAlert, setRejectGeoAlert] = useState(false);
  const [failedGeoLocationRequest, setFailedGeoLocationRequest] =
    useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isCalculatedArea, setIsCalculatedArea] = useState(false);
  const [area, setArea] = useState(null);

  const [currentCoordinates, setCurrentCoordinates] = useState({
    latitude: -1,
    longitude: -1,
  });

  const [isMapVisible, setIsMapVisible] = useState(false);
  const [loadingActivitiyIndicator, setLoadingActivityIndicator] =
    useState(false);
  const [successLottieVisibile, setSuccessLottieVisible] = useState(false); // controlling the success toast component
  const [isCalculatedAreaConfirmed, setIsCalculatedAreaConfirmed] =
    useState(false);


  // @ts-expect-error TS(2769): No overload matches this call.
  const farmland = useObject("Farmland", farmlandId);

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
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setPermissionGranted(true);
        setConfirmGeoAlert(true);
        subscribeLocation();

        // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
        console.log("You can use the app");
      } else {
        setPermissionGranted(false);
        // setRejectGeoAlert(true);

        // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
        console.log("Location Permission Denied");
      }
    } catch (err) {

      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.log("not granted:", granted);

      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.warn(err);
      setFailedGeoLocationRequest(true);
    }
  };

  // persist the acquired coordinates
  const saveCoordinates = (farmland: any, point: any) => {
    realm.write(() => {
      farmland.extremeCoordinates?.push(point);
      farmland.status = resourceValidation.status.pending;
    });
  };

  const subscribeLocation = () => {

    // @ts-expect-error TS(2304): Cannot find name 'watchID'.
    watchID = Geolocation.watchPosition(
      (position) => {
        //Will give you the location on location change

        setCurrentCoordinates({
          latitude: position?.coords.latitude,
          longitude: position?.coords.longitude,
        });
      },
      (error) => {
        Alert.alert("Falha", "Tenta novamente!", {
          cause: error,
        });
      },
      {
        enableHighAccuracy: true,

        // @ts-expect-error TS(2559): Type 'string' has no properties in common with typ... Remove this comment to see the full error message
        accuracy: "high",
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 100,
      },
    );
  };

  const getCurrentPosition = () => {
    if (!permissionGranted) {
      requestLocationPermission();
    } else {
      subscribeLocation();
    }
  };

  // get the current coordinates of device position
  const getGeolocation = async () => {
    if (!permissionGranted) {
      requestLocationPermission();
    } else {
      Geolocation.getCurrentPosition(
        (position) => {
          // get the exact position to the point

          // @ts-expect-error TS(2339): Property 'extremeCoordinates' does not exist on ty... Remove this comment to see the full error message
          const number = getPosition(farmland?.extremeCoordinates);

          saveCoordinates(farmland, {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            position: number,
          });
        },
        (error) => {
          Alert.alert("Falha", "Tenta novamente!", {
            cause: error,
          });
        },
        {
          enableHighAccuracy: true,

          // @ts-expect-error TS(2559): Type 'string' has no properties in common with typ... Remove this comment to see the full error message
          accuracy: "high",
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 100,
        },
      );
    }
  };

  useEffect(() => {
    requestLocationPermission();
    return () => {

      // @ts-expect-error TS(2304): Cannot find name 'watchID'.
      Geolocation.clearWatch(watchID);
    };
  }, [navigation]);

  const navigateBack = () => {
    navigation.navigate("Profile", {

      // @ts-expect-error TS(2339): Property 'farmerId' does not exist on type 'Object... Remove this comment to see the full error message
      ownerId: farmland?.farmerId,
      farmerType:

        // @ts-expect-error TS(2531): Object is possibly 'null'.
        farmland.ownerType === "Single"
          ? farmerTypes.farmer

          // @ts-expect-error TS(2531): Object is possibly 'null'.
          : farmland.ownerType === "Group"
            ? farmerTypes.group

            // @ts-expect-error TS(2531): Object is possibly 'null'.
            : farmland.ownerType === "Institution"
              ? farmerTypes.institution
              : "",
      farmersIDs: [],
    });

  };

  const keyExtractor = (item: any, index: any) => index.toString();

  useFocusEffect(
    React.useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        setLoadingActivityIndicator(true);
      });
      return () => task.cancel();
    }, []),
  );

  // organize the coordinates point objects
  const handleCalculateArea = () => {

    // @ts-expect-error TS(2531): Object is possibly 'null'.
    let coordinates = farmland.extremeCoordinates;


    // @ts-expect-error TS(2304): Cannot find name 'points'.
    points = coordinates?.map((point: any) => {
      return {
        lat: parseFloat(point?.latitude),
        lng: parseFloat(point?.longitude),
      };
    });

    // @ts-expect-error TS(2304): Cannot find name 'points'.
    points.push(points[0]);

    // @ts-expect-error TS(2304): Cannot find name 'points'.
    const area = calculateArea(points);

    // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
    setArea(Number(area));

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log("area:", area);
    return area;
  };

  // save the area that has been calculated
  const saveAuditedArea = (area: any) => {
    realm.write(() => {

      // @ts-expect-error TS(2531): Object is possibly 'null'.
      farmland.auditedArea = parseFloat(area);
    });
  };

  useEffect(() => {
    // if true, the SuccessLottie Overlay should show up and
    // the AwesomeAlert should disappear
    if (isCalculatedAreaConfirmed) {
      setIsCalculatedAreaConfirmed(false);
      setSuccessLottieVisible(true);
      // navigateBack();
    }

    // The SuccessLottie Overlay should show up for 2 seconds
    // And disappear by its own
    if (successLottieVisibile && !isCalculatedAreaConfirmed) {

      // @ts-expect-error TS(2304): Cannot find name 'setTimeout'.
      setTimeout(() => {
        navigateBack();
        setSuccessLottieVisible(false);
      }, 2000);
    }
  }, [successLottieVisibile, isCalculatedAreaConfirmed]);

  if (loadingActivitiyIndicator) {
    return (
      <CustomActivityIndicator
        loadingActivitiyIndicator={loadingActivitiyIndicator}
        setLoadingActivityIndicator={setLoadingActivityIndicator}
      />
    );
  }

  return (
    <SafeAreaView
      className={`flex flex-1 ${backgroundStyle}`}
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
        confirmButtonColor={COLORS.danger}
        onConfirmPressed={() => {
          setFailedGeoLocationRequest(false);
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
        cancelButtonColor={COLORS.danger}
        onConfirmPressed={() => {
          saveAuditedArea(area); // save the auditedarea
          setIsCalculatedArea(false);
          setIsCalculatedAreaConfirmed(true);
          // navigateBack();
        }}
        onCancelPressed={() => {
          setIsCalculatedArea(false);
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
          setConfirmGeoAlert(false);
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
        cancelButtonColor={COLORS.danger}
        confirmButtonColor={COLORS.main}
        onCancelPressed={() => {
          setRejectGeoAlert(false);
          setPermissionGranted(true);
        }}
        onConfirmPressed={() => {
          // requestLocationPermission();
          setPermissionGranted(true);
          setRejectGeoAlert(false);
        }}
      />

      {successLottieVisibile && (
        <SuccessLottie
          successLottieVisible={successLottieVisibile}
          setSuccessLottieVisible={setSuccessLottieVisible}
        />
      )}

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingBottom: 10,
          backgroundColor: COLORS.fourth,
        }}
      >
        <View
          style={{

            width: "10%",
            marginLeft: 5,
          }}
        >
          <Pressable
            onPress={() => {
              navigateBack();
            }}
            style={{
              position: "absolute",
              left: 4,
              top: 4,
              alignItems: "center",
            }}
          >
            <Icon name="arrow-back" color={COLORS.black} size={30} />
          </Pressable>
        </View>
        <View
          style={{
            paddingTop: 5,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontFamily: "JosefinSans-Bold",
              fontSize: 18,
              color: COLORS.black,
            }}
          >
            Pontos Extremos
          </Text>
        </View>
        <View >
          // @ts-expect-error TS(2339): Property 'extremeCoordinates' does not exist on ty... Remove this comment to see the full error message
          // @ts-expect-error TS(2339): Property 'extremeCoordinates' does not exist on ty... Remove this comment to see the full error message
          {farmland?.extremeCoordinates.length > 0 && (
            <TouchableOpacity
              onPress={async () => await getGeolocation()}
            >
              <GeoPin />
            </TouchableOpacity>
          )}
        </View>
      </View>



      // @ts-expect-error TS(2339): Property 'extremeCoordinates' does not exist on ty... Remove this comment to see the full error message
      // @ts-expect-error TS(2339): Property 'extremeCoordinates' does not exist on ty... Remove this comment to see the full error message
      {farmland?.extremeCoordinates.length === 0 && (

        // @ts-expect-error TS(2322): Type '{ children: Element[]; style: { minHeight: s... Remove this comment to see the full error message
        <Center style={{ minHeight: "100%" }}>
          <TouchableOpacity onPress={async () => await getGeolocation()}>
            <GeoPin />
          </TouchableOpacity>
          <Box

            // @ts-expect-error TS(2322): Type '{ children: Element; style: { backgroundColo... Remove this comment to see the full error message
            style={{
              backgroundColor: COLORS.lightestgrey,
              alignSelf: "center",
              justifyContent: "center",
              width: 200,
              height: 50,
              marginTop: 30,
            }}
          >
            <Text
              style={{
                color: COLORS.grey,
                fontSize: 14,
                fontFamily: "JosefinSans-Regular",
                textAlign: "center",
              }}
            >
              Pontos extremos da área do pomar
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
          return <CoordinatesItem item={item} farmland={farmland} />;
        }}
      />
      // @ts-expect-error TS(2339): Property 'extremeCoordinates' does not exist on ty... Remove this comment to see the full error message
      // @ts-expect-error TS(2339): Property 'extremeCoordinates' does not exist on ty... Remove this comment to see the full error message
      {farmland?.extremeCoordinates.length > 2 && (
        <TouchableOpacity
          onPress={() => {
            handleCalculateArea();
            setIsCalculatedArea(true);
          }}
          style={{
            backgroundColor: COLORS.main,
            borderRadius: 10,
            padding: 10,
            margin: 10,
            height: 50,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontFamily: "Roboto-Regular",
              color: COLORS.ghostwhite,
              textAlign: "center",
            }}
          >
            Calcular Área
          </Text>
        </TouchableOpacity>
      )}
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
};

export default FarmlandAreaAuditScreen;
