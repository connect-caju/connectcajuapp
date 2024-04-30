/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import {
  Text,
  SafeAreaView,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
  Pressable,
} from "react-native";
import { Stack, Box, Center } from "native-base";
import Geolocation from "react-native-geolocation-service";
import AwesomeAlert from "react-native-awesome-alerts";

import { Icon } from "@rneui/base";
import GeoPin from "../../components/LottieComponents/GeoPin";
import { realmContext } from "../../models/realmContext";
import COLORS from "../../consts/colors";
import { useFocusEffect } from "@react-navigation/native";
import { InteractionManager } from "react-native";
import CustomActivityIndicator from "../../components/ActivityIndicator/CustomActivityIndicator";
import { SuccessLottie } from "../../components/LottieComponents/SuccessLottie";
import { farmerTypes } from "../../consts/farmerTypes";
import { resourceTypes } from "../../consts/resourceTypes";
import { resourceValidation } from "../../consts/resourceValidation";
import { backgroundStyle } from "../../styles/globals";
const { useRealm, useObject, useQuery } = realmContext;

const GeolocationScreen = ({ route, navigation }) => {
  const realm = useRealm();

  const resourceName = route.params?.resourceName;
  const resourceId = route.params?.resourceId;
  const farmersIDs = route.params?.farmersIDs || [];
  let resource;
  let farmerType;
  let ownerType; // farmland ownertype (single, group, institution)
  const [areCoordinatesConfirmed, setAreCoordinatesConfirmed] = useState(false);

  if (resourceName === "Farmer") {
    resource = useObject("Actor", resourceId);
    farmerType = farmerTypes.farmer;
  }

  if (resourceName === "Group") {
    resource = useObject("Group", resourceId);
    farmerType = farmerTypes.group;
  }

  if (resourceName === "Institution") {
    resource = useObject("Institution", resourceId);
    farmerType = farmerTypes.institution;
  }

  if (resourceName === "Farmland") {
    resource = useObject("Farmland", resourceId);

    // identity the farmland ownertype (single, group, institution)
    ownerType = route.params?.ownerType;
  }

  const [confirmGeoAlert, setConfirmGeoAlert] = useState(false);
  const [rejectGeoAlert, setRejectGeoAlert] = useState(false);
  const [failedGeoLocationRequest, setFailedGeoLocationRequest] =
    useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const [areCoordinatesPicked, setAreCoordinatesPicked] = useState(false);
  const [coordaintes, setCoordinates] = useState({
    latitude: -1,
    longitude: -1,
    position: 0,
  });

  const [currentCoordinates, setCurrentCoordinates] = useState({
    latitude: -1,
    longitude: -1,
  });

  // const [isMapVisible, setIsMapVisible] = useState(false);
  const [loadingActivitiyIndicator, setLoadingActivityIndicator] =
    useState(false);
  const [successLottieVisibile, setSuccessLottieVisible] = useState(false); // controlling the success toast component

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
        // setConfirmGeoAlert(true);
        subscribeLocation();
        console.log("You can use the app");
      } else {
        setPermissionGranted(false);
        setRejectGeoAlert(true);
        console.log("Location Permission Denied");
      }
    } catch (err) {
      console.log("not granted:", granted);
      console.warn(err);
      setFailedGeoLocationRequest(true);
    }
  };

  // persist the acquired coordinates
  const saveCoordinates = (resource, coordinates) => {
    realm.write(() => {
      resource.geolocation = coordinates;
      resource.status = resourceValidation.status.pending;
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

    // Geolocation.clearWatch(watchID);
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
          // save the captured coordinates
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            position: 0,
          });
          setAreCoordinatesPicked(true);
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
    setPermissionGranted(false);
  };

  const navigateBack = () => {
    if (
      resourceName === "Farmer" ||
      resourceName === "Group" ||
      resourceName === "Institution"
    ) {
      navigation.navigate("Profile", {
        ownerId: resource?._id,
        farmerType: farmerType,
        farmersIDs: [],
      });
    } else if (resourceName === resourceTypes.farmland) {
      navigation.navigate("Profile", {
        ownerId: resource?.farmerId,
        farmerType:
          ownerType === "Single"
            ? farmerTypes.farmer
            : ownerType === "Group"
              ? farmerTypes.group
              : ownerType === "Institution"
                ? farmerTypes.institution
                : "",
        farmersIDs: [],
      });
    }
  };

  useEffect(() => {
    // if true, the SuccessLottie Overlay should show up and
    // the AwesomeAlert should disappear
    if (areCoordinatesConfirmed) {
      setAreCoordinatesConfirmed(false);
      setSuccessLottieVisible(true);
    }

    // The SuccessLottie Overlay should show up for 2 seconds
    // And disappear by its own
    if (successLottieVisibile && !areCoordinatesConfirmed) {
      setTimeout(() => {
        navigateBack();
        setSuccessLottieVisible(false);
      }, 3000);
    }
  }, [successLottieVisibile, areCoordinatesConfirmed]);

  useEffect(() => {
    requestLocationPermission();
    return () => {
      Geolocation.clearWatch(watchID);
    };
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        setLoadingActivityIndicator(true);
      });
      return () => task.cancel();
    }, []),
  );

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
        confirmText="   OK!   "
        confirmButtonColor="#DD6B55"
        onConfirmPressed={() => {
          setFailedGeoLocationRequest(false);
        }}
      />

      <AwesomeAlert
        show={areCoordinatesPicked}
        showProgress={false}
        title="Coordenadas"
        message={`${coordaintes.latitude}; ${coordaintes.longitude}`}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="Cancelar"
        confirmText="Confirmar"
        confirmButtonColor={COLORS.main}
        cancelButtonColor={COLORS.danger}
        onConfirmPressed={() => {
          saveCoordinates(resource, {
            latitude: coordaintes.latitude,
            longitude: coordaintes.longitude,
            position: coordaintes.position,
          });

          // call off the AwesomeAlert
          setAreCoordinatesPicked(false);

          // activate the SuccessLottie Overlay
          setAreCoordinatesConfirmed(true);
        }}
        onCancelPressed={() => {
          setAreCoordinatesPicked(false);
          setCoordinates({
            latitude: -1,
            longitude: -1,
            position: 0,
          });
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
        confirmText="   OK!   "
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
        cancelText="Sim"
        confirmText="Não"
        cancelButtonColor="#DD6B55"
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
          paddingBottom: 15,
        }}
      >
        <Stack
          direction="row"
          w="100%"
          pt="3"
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
              Geolocalização
            </Text>
          </Center>
        </Stack>
      </Box>

      <Center
        style={{
          // minHeight: 300,
          flex: 1,
        }}
      >
        <TouchableOpacity onPress={async () => await getGeolocation()}>
          <GeoPin />
        </TouchableOpacity>

        <Text
          style={{
            color: COLORS.grey,
            fontSize: 15,
            fontFamily: "JosefinSans-Regular",
            textAlign: "center",
            backgroundColor: COLORS.lightestgrey,
            paddingHorizontal: 20,
            paddingVertical: 5,
          }}
        >
          Capturar das coordenadas
        </Text>
      </Center>

    </SafeAreaView>
  );
};

export default GeolocationScreen;
