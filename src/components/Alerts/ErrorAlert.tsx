import React from "react"
import {
  Alert,
  Collapse,

  VStack,
  HStack,
  IconButton,
  CloseIcon,
  Box,
  Text,

} from "native-base"
import { Pressable } from "react-native"
import COLORS from "../../consts/colors"

const ErrorAlert = ({
  errorAlert,
  setErrorAlert
}: any) => {
  //   const [show, setShow] = React.useState(true);
  return (
    <Box w="100%" alignItems="center">
      <Collapse isOpen={errorAlert}>
        <Alert maxW="400" status="error">
          <VStack space={1} flexShrink={1} w="100%">
            <HStack
              flexShrink={1}
              space={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <HStack flexShrink={1} space={2} alignItems="center">
                <Alert.Icon />
                <Text
                  fontSize="md"
                  fontWeight="medium"
                  _dark={{
                    color: "coolGray.800",
                  }}
                >
                  Alguns dados são obrigatórios!
                </Text>
              </HStack>
              <IconButton
                variant="unstyled"
                _focus={{
                  borderWidth: 0,
                }}
                icon={<CloseIcon size="3" />}
                _icon={{
                  color: "coolGray.600",
                }}

                // @ts-expect-error TS(2322): Type '{ variant: "unstyled"; _focus: { borderWidth... Remove this comment to see the full error message
                onPress={() => setErrorAlert(false)}
              />
            </HStack>
            <Box
              pl="6"
              _dark={{
                _text: {
                  color: "coolGray.600",
                  fontSize: 18,
                },
              }}
            >
              Preencha corretamente todos os dados obrigatórios.
            </Box>
          </VStack>
        </Alert>
      </Collapse>
      <Pressable
        style={{
          paddingVertical: 30,
        }}
        size={"lg"}
        onPress={() => setErrorAlert(false)}
        mt={8}
        mx="auto"
      >
        <Text

          // @ts-expect-error TS(2322): Type '{ children: string; style: { color: string; ... Remove this comment to see the full error message
          style={{
            color: COLORS.main,
            fontSize: 18,
            fontFamily: "JosefinSans-Regular",
            textDecoration: "underline",
          }}
        >
          Voltar
        </Text>
      </Pressable>
    </Box>
  )
}

export default ErrorAlert
