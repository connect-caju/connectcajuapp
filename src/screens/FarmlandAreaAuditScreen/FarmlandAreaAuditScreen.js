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
import { InteractionManager } from "react-native";
import CustomActivityIndicator from "../../components/ActivityIndicator/CustomActivityIndicator";
import { Pressable } from "react-native";
import { calculatePolygonArea } from "../../helpers/calculatePolygonArea";
import { SuccessLottie } from "../../components/LottieComponents/SuccessLottie";
import { farmerTypes } from "../../consts/farmerTypes";
import { resourceValidation } from "../../consts/resourceValidation";
const { useRealm, useObject, useQuery } = realmContext;

const FarmlandAreaAuditScreen = ({ route, navigation }) => {
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
        console.log("You can use the app");
      } else {
        setPermissionGranted(false);
        // setRejectGeoAlert(true);
        console.log("Location Permission Denied");
      }
    } catch (err) {
      console.log("not granted:", granted);
      console.warn(err);
      setFailedGeoLocationRequest(true);
    }
  };

  // persist the acquired coordinates
  const saveCoordinates = (farmland, point) => {
    realm.write(() => {
      farmland.extremeCoordinates?.push(point);
      farmland.status = resourceValidation.status.pending;
    });
  };

  const subscribeLocation = () => {
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
      Geolocation.clearWatch(watchID);
    };
  }, [navigation]);

  const navigateBack = () => {
    navigation.navigate("Profile", {
      ownerId: farmland?.farmerId,
      farmerType:
        farmland.ownerType === "Single"
          ? farmerTypes.farmer
          : farmland.ownerType === "Group"
            ? farmerTypes.group
            : farmland.ownerType === "Institution"
              ? farmerTypes.institution
              : "",
      farmersIDs: [],
    });

  };

  const keyExtractor = (item, index) => index.toString();

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
    let coordinates = farmland.extremeCoordinates;

    points = coordinates?.map((point) => {
      return {
        lat: parseFloat(point?.latitude),
        lng: parseFloat(point?.longitude),
      };
    });
    const area = calculatePolygonArea(points);
    setArea(Number(area));
    return area;
  };

  // save the area that has been calculated
  const saveAuditedArea = (area) => {
    realm.write(() => {
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

      <Box
        style={{
          backgroundColor: COLORS.fourth,
          paddingTop: 20,
          paddingBottom: 10,
        }}
      >
        <Stack
          direction="row"
          w="100%"
          // pt="3"
          bg={COLORS.fourth}
        >
          <Box>
            <Pressable
              onPress={() => {
                navigateBack();
              }}
              style={{
                position: "absolute",
                left: 4,
                top: 4,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Icon name="arrow-back" color={COLORS.black} size={30} />
            </Pressable>
          </Box>
          <Center w="100%">
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
          </Center>
        </Stack>
        <View>
          {farmland?.extremeCoordinates.length > 0 && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginHorizontal: 10,
                marginTop: 10,
              }}
              >
              <View
                style={{
                  // marginRight: 10,
                  width: "65%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: COLORS.grey,
                    fontFamily: "Roboto-Regular",
                    fontSize: 14,
                    textAlign: "center",
                  }}
                >
                  Pontos extremos da área do pomar.
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  alignItems: "flex-end",
                  marginLeft: 10,
                  width: "35%",
                }}
                onPress={async () => await getGeolocation()}
              >
                <GeoPin />
              </TouchableOpacity>
            </View>
          )}

        </View>
      </Box>




      {farmland?.extremeCoordinates.length === 0 && (
        <Center style={{ minHeight: "100%" }}>
          <Box
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
            <TouchableOpacity onPress={async () => await getGeolocation()}>
              <Icon name="location-pin" size={60} color={COLORS.main} />
            </TouchableOpacity>
          </Box>
          <Box
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
        data={sortCoordinatesByPositions(farmland?.extremeCoordinates)}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => {
          return <CoordinatesItem item={item} farmland={farmland} />;
        }}
      />
      {farmland?.extremeCoordinates.length > 2 && (
        <TouchableOpacity
          onPress={() => {
            handleCalculateArea();
            setIsCalculatedArea(true);
          }}
          style={{
            backgroundColor: COLORS.main,
            borderRadius: 10,
            paddingHorizontal: 10,
            paddingVertical: 10,
            margin: 10,
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
