/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from "@expo/vector-icons";
import {
  NavigationContainer
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { EthereumProvider } from "@walletconnect/ethereum-provider"; //change from @walletconnect/react-native-dapp to => @walletconnect/ethereum-provider
import * as React from "react";
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";



import ModalScreen from "../screens/ModalScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import roleNavigation from "../screens/roleNavigation";
import LinkingConfiguration from "./LinkingConfiguration";


global.myAddress = "";

export default function Navigation({ colorScheme } = ColorSchemeName) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
    // theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator();

export function RootNavigator() {
  const connector = useWalletConnect();

  // Based on whether the user is connected or not will determine if they can access certain screens.
  // This follows the protected routes practice defined: https://reactnavigation.org/docs/auth-flow/
  return connector.connected == false ? (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name="Root"
          component={LogInScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NotFound"
          component={NotFoundScreen}
          options={{ title: "Oops!" }}
        />
      </Stack.Navigator>
    </>
  ) : (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name="Main Menu"
          component={roleNavigation}
          options={({ navigation }) => ({
            headerShown: false,
            gestureEnabled: false,
            headerBackVisible: false,
            headerRight: () => (
              <Pressable
                onPress={() => navigation.navigate("Modal")}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.5 : 1,
                })}
              >
                <FontAwesome
                  name="info-circle"
                  size={25}
                  style={{ marginRight: 15 }}
                />
              </Pressable>
            ),
          })}
        />
        <Stack.Screen
          name="Root"
          component={LogInScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NotFound"
          component={NotFoundScreen}
          options={{ title: "Oops!" }}
        />
        <Stack.Group
          screenOptions={{ presentation: "modal", headerShown: false }}
        >
          <Stack.Screen name="Modal" component={ModalScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

function LogInScreen({ navigation }) {
  const connector = useWalletConnect();

  const connectWallet = React.useCallback(() => {
    return connector.connect();
  }, [connector]);

  return (
    <>
      {!!connector.connected &&
        navigation.navigate("Main Menu", {
          navigation: { navigation },
        })}
      {!connector.connected && (
        <NavigationContainer independent={true}>
          <View style={styles.container}>
            <Text style={styles.title}>ChainBytes Coffee Project</Text>
            <View
              style={styles.separator}
              lightColor="#eee"
              darkColor="rgba(255,255,255,0.1)"
            />

            <TouchableOpacity
              onPress={connectWallet}
              style={styles.buttonStyle}
            >
              <Text style={styles.buttonTextStyle}>Connect a Wallet</Text>
            </TouchableOpacity>
          </View>
        </NavigationContainer>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  buttonStyle: {
    backgroundColor: "#3399FF",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#3399FF",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    fontWeight: "600",
  },
});
