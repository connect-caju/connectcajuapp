import { useNavigation } from "@react-navigation/native"
import { Center, Alert, Stack, Box } from "native-base"
import React, { useState, useCallback, useEffect, useRef } from "react"
import { Overlay } from "@rneui/base"

import { Icon, CheckBox } from "@rneui/themed"
import {
  Button,
  Text,
  View,
  Modal,
  Pressable,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Linking,
  StyleSheet,

} from "react-native"
import { launchCamera, launchImageLibrary } from "react-native-image-picker"

import COLORS from "../../consts/colors"

import { useUser } from "@realm/react"
import { roles } from "../../consts/roles"

function PhotoModal({
  realm,
  photoOwner,
  photoOwnerType,
  isPhotoModalVisible,
  setIsPhotoModalVisible,
  updateUserImage,
  userRole,
  setLoadingActivityIndicator,
  loadingActivitiyIndicator,
  launchNativeImageLibrary
}: any) {
  const navigation = useNavigation()
  const user = useUser()
  const customUserData = user?.customData
  // console.log('userId: ', user.id);

  // const camera = useRef(null);
  // const [imageSource, setImageSource] = useState('');
  // const [showCamera, setShowCamera] = useState(false);

  const launchNativeCamera = () => {
    let options = {
      includeBase64: true,
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    }

    // @ts-expect-error TS(2345): Argument of type '{ includeBase64: boolean; storag... Remove this comment to see the full error message
    launchCamera(options, (response) => {
      //   console.log('Response = ', response);

      if (response.didCancel) {
        console.log("User cancelled image picker")
      } else if (response.errorCode) {
        console.log("ImagePicker Error: ", response.errorMessage)
      } else {

        // @ts-expect-error TS(2339): Property 'uri' does not exist on type 'ImagePicker... Remove this comment to see the full error message
        const source = { uri: response.uri }
        const imageString =

          // @ts-expect-error TS(2532): Object is possibly 'undefined'.
          "data:image/jpeg;base64," + response.assets[0].base64

        if (photoOwnerType !== "Usuário") {
          realm.write(() => {
            // photoOwner.image = 'data:image/jpeg;base64,' + response.assets[0].base64;
            photoOwner.image = imageString
          })
        } else {
          updateUserImage(customUserData.userId, imageString)
        }
        setIsPhotoModalVisible(false)

        if (photoOwnerType === "Grupo") {

          // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
          navigation.navigate("Group", {
            ownerId: photoOwner?._id,
          })
        } else if (photoOwnerType === "Indivíduo") {

          // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
          navigation.navigate("Farmer", {
            ownerId: photoOwner?._id,
          })
        } else if (photoOwnerType === "Instituição") {

          // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
          navigation.navigate("Institution", {
            ownerId: photoOwner?._id,
          })
        } else if (photoOwnerType === "Usuário") {
          // taking user photo
          // navigation.goBack();
        }
      }
    })
  }

  const deletePhoto = useCallback(
    (photoOwner: any, realm: any) => {
      realm.write(() => {
        photoOwner.image = ""
      })

      if (photoOwnerType === "Grupo") {

        // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
        navigation.navigate("Group", {
          ownerId: photoOwner?._id,
        })
      } else if (photoOwnerType === "Indivíduo") {

        // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
        navigation.navigate("Farmer", {
          ownerId: photoOwner?._id,
        })
      } else if (photoOwnerType === "Instituição") {

        // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
        navigation.navigate("Institution", {
          ownerId: photoOwner?._id,
        })
      } else if (photoOwnerType === "Usuário") {
        // taking user photo
        // navigation.goBack();
      }

      setIsPhotoModalVisible(false)
    },
    [photoOwner],
  )

  

  return (
    <Overlay
      animationType="slide"
      onBackdropPress={() => setIsPhotoModalVisible(false)}
      isVisible={isPhotoModalVisible}
      style={{
        backgroundColor: COLORS.black,
        // opacity: .6,
      }}
  
    >
      <View
        style={{
          flex: 1,
          // marginTop: 40,
          alignItems: "center",
  
        }}
      >
        <Box

          // @ts-expect-error TS(2322): Type '{ children: Element; style: { position: stri... Remove this comment to see the full error message
          style={{
            position: "absolute",
            top: -20,
            left: 0,
            zIndex: 1,
          }}
        >
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={() => {
              setIsPhotoModalVisible(false)
              if (photoOwnerType === "Grupo") {

                // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
                navigation.navigate("Group", {
                  ownerId: photoOwner?._id,
                })
              } else if (photoOwnerType === "Indivíduo") {

                // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
                navigation.navigate("Farmer", {
                  ownerId: photoOwner?._id,
                })
              } else if (photoOwnerType === "Instituição") {

                // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
                navigation.navigate("Institution", {
                  ownerId: photoOwner?._id,
                })
              }
            }}
          >
            <Icon name="close" color={COLORS.ghostwhite} size={30} />
          </TouchableOpacity>
        </Box>
  

        <Box

          // @ts-expect-error TS(2322): Type '{ children: Element; style: { flex: number; ... Remove this comment to see the full error message
          style={{
            flex: 1,
            height: "50%",
            marginTop: 10,
          }}
        >
          {photoOwner?.image ? (
            <Image
              source={{ uri: photoOwner?.image }}
              style={{
                width: "100%",
                height: "auto",
                aspectRatio: 9 / 16,
              }}
            />
          ) : (
            <Icon
              style={{
                minWidth: 400,
                minHeight: 300,
              }}
              name="account-circle"
              size={200}
              color={COLORS.grey}
            />
          )}
        </Box>

        <View>
          <Stack
            direction="column"
            space={4}
            // py="6"

            // @ts-expect-error TS(2322): Type '{ children: Element; direction: "column"; sp... Remove this comment to see the full error message
            mh="5"
            w="100%"
            style={{
  
              
              position: "absolute",
              bottom: 5,
              alignSelf: "center",
            }}
          >
            
            <Box w="100%" alignItems={"center"}>
              <Stack direction="row" w="100%">
                <Box w="33%">
                  <TouchableOpacity
                    onPress={() => {
            
                      // @ts-expect-error TS(2304): Cannot find name 'setShowCamera'.
                      setShowCamera(true)
                    }}
                    disabled={
                      userRole === roles.coopManager ||
                      userRole === roles.provincialManager
                    }
                  >
                    <Icon
                      name="photo-camera"
                      size={30}
                      color={
                        userRole === roles.coopManager ||
                        userRole === roles.provincialManager
                          ? COLORS.lightgrey
                          : COLORS.grey
                      }
                    />
                  </TouchableOpacity>
          
                </Box>
                <Box w="33%">
                  <TouchableOpacity
                    onPress={() => {
                      launchNativeImageLibrary()
                    }}
                    disabled={
                      userRole === roles.coopManager ||
                      userRole === roles.provincialManager
                    }
                  >
                    <Icon
                      name="photo-library"
                      size={30}
                      color={
                        userRole === roles.coopManager ||
                        userRole === roles.provincialManager
                          ? COLORS.lightgrey
                          : COLORS.grey
                      }
                    />
                  </TouchableOpacity>
        
                </Box>
                <Box w="33%">
                  <TouchableOpacity
                    onPress={() => {
                      deletePhoto(photoOwner, realm)
                    }}
                    disabled={
                      !photoOwner?.image ||
                      userRole === roles.coopManager ||
                      userRole === roles.provincialManager
                    }
                  >
                    <Icon
                      name="delete"
                      size={30}
                      color={
                        !photoOwner?.image ||
                        userRole === roles.coopManager ||
                        userRole === roles.provincialManager
                          ? COLORS.lightgrey
                          : COLORS.grey
                      }
                    />
                  </TouchableOpacity>
      
                </Box>
              </Stack>
            </Box>
          </Stack>
        </View>
      </View>
    </Overlay>
  )
}

export default PhotoModal
