import { EthereumProvider } from "@walletconnect/ethereum-provider"; //change from @walletconnect/react-native-dapp to => @walletconnect/ethereum-provider
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { W3mQrCode } from '@web3modal/react'
import { Text, textColor, View } from '../components/Themed';
import { SafeAreaView } from "react-native-safe-area-context";
import { WagmiClient, ethereumClient } from './Wagmi';
import { WagmiConfig } from 'wagmi'
import { Web3Modal } from '@web3modal/react'
import * as config from "./ChainBytesConfig"


// Function to abbreviate address
import truncateEthAddress from 'truncate-eth-address';

/* REPLACED BY TRUNCATE-ETH-ADDRESS ^ Currently not being used
const shortenAddress = (address: string) => {
  global.myAddress = address;
  let ret = `${address.slice(0, 6)}...${address.slice(
    address.length - 4,
    address.length
  )}`;
  return ret;
}
*/

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { disconnect } from '@wagmi/core'


export default function ModalScreen({ navigation }) {
  //const connector = useWalletConnect();
  const { address, isConnected } = useAccount();
  const connector = useConnect({
    connector: new InjectedConnector(),
  })
  const tc = textColor();

  const killSession = React.useCallback(() => {
    disconnect();
    navigation.navigate("Root");
  }, [connector]);

  return (
    <>
      <WagmiConfig client={WagmiClient}>
        <View style={[styles.screen, { borderColor: tc, paddingTop: 20, borderRadius: 10, borderWidth: 2, borderBottomWidth: 0 }]}>
          <Text style={styles.title}>Currently logged in as:</Text>
          <Text style={styles.addressText}>{address}</Text>
          <View style={styles.screen}>
            <SafeAreaView style={styles.container2}>
              <W3mQrCode size={320} imageUrl="url/to/image" uri="data" />
            </SafeAreaView>
            <TouchableOpacity onPress={killSession} style={styles.buttonStyle}>
              <Text style={styles.buttonTextStyle}>Log out</Text>
            </TouchableOpacity>
            <StatusBar style="auto" />
          </View>
          <View>
          </View>
          {/* Use a light status bar on iOS to account for the black space above the modal */}
          <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        </View>
      </WagmiConfig>

      <Web3Modal projectId={config.projectId} ethereumClient={ethereumClient} />
    </>
  );
}


const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 10,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: "HelveticaNeue-Bold"
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  buttonStyle: {
    backgroundColor: "#272727",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#3399FF",
    height: 40,
    width: 300,
    alignItems: "center",
    borderRadius: 30,
    // marginLeft: 35,
    // marginRight: 35,
    marginTop: 20,
    marginBottom: '15%',
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 20,
    fontWeight: "600",
  },
  signInBackground: {
    width: "80%",
    height: "50%",
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  signInButton: {
    width: 200,
    height: 60,
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    padding: 1,
    backgroundColor: "#272727",
    opacity: 0.8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  signInText: {
    color: "white",
    fontFamily: "Helvetica Neue"
  },
  addressText: {
    fontSize: 16,
    padding: 10
  },
  container2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    fontFamily: "Helvetica Neue"
  },
});
