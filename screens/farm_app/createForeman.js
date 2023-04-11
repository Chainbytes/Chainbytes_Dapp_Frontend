import { NavigationContainer, useRoute } from "@react-navigation/native";
 import React, { useState } from "react";
 import {
   StyleSheet,
   TextInput,
   TouchableOpacity,
   Pressable,
 } from "react-native";
 import moment from "moment";
 import { ethers } from "ethers";
 import WalletConnectProvider from "@walletconnect/web3-provider";
 import { useWalletConnect } from "@walletconnect/react-native-dapp";
 import * as config from "../ChainBytesConfig.js";
 import Ionicons from "react-native-vector-icons/Ionicons";
 import { View, Text, textColor, backgroundColor } from "../../components/Themed"
 

 let created = 0;

 const setCreated = (num) => {
   created += num;
 };



 const checkInFailed = () => {
   Alert.alert(
     "ERROR CREATING FOREMAN",
     "The Batch Check-In operation has Failed",
     [
       {
         text: "Dismiss",
         style: "Cancel",
       },
     ],
     { cancelable: true }
   );
 };

 // For connecting to the contract
 const provider = new ethers.providers.JsonRpcProvider(config.providerUrl);
 let contract = new ethers.Contract(
   config.contractAddress,
   config.contractAbi,
   provider
 );

 export default function CreateForeman({ navigation }) {
   const [newForemanAddress, onChangeText] = React.useState(null);
   const [loading, setLoading] = useState(false);
   const tc = textColor();
   const bg = backgroundColor();
   const route = useRoute();
  
   //https://docs.walletconnect.com/1.0/quick-start/dapps/web3-provider
   const createForeman = React.useCallback(
     async (_newForemanAddress) => {
       var date = moment().utcOffset("-04:00").format("YYYY-MM-DD hh:mm:ss a");
       var foreman2 = [];
       for(const foreman of _newForemanAddress){
         foreman2.push(foreman.text);
       }
       console.log(foreman2)

       const provider = new WalletConnectProvider({
         rpc: {
           5: config.providerUrl,
         },
         chainId: 5,
         NetworkCheckTimeout: 10000,
         connector: connector,
         qrcode: false
       });
       await provider.enable();
       const ethers_provider = new ethers.providers.Web3Provider(provider);
       const signer = ethers_provider.getSigner();
       let contract = new ethers.Contract(
         config.contractAddress,
         config.contractAbi,
         signer
       );

       //ADDING THIS CODE TO FIX ERROR
       // if (typeof web3 !== 'undefined' && typeof contractAddress !== 'undefined' && typeof abi !== 'undefined') {
       //   web3 = new Web3(web3.currentProvider);
       //   contract = new web3.eth.Contract(abi, contractAddress);
       // } else {
       //   console.log('Some variables are not defined.');
       // }

       try {
         setLoading(true);
         await contract.setCreated(foreman2, date).then((result) =>{
           console.log("Foreman created at " + date);
           setCreated(foreman2.length);
           console.log("Num Foreman created: " + created);
           setLoading(false);
         });
       } catch (e) {
         console.error(e);
         checkInFailed();
         setLoading(false);
       }


       },


     [connector]
   );


};

   if(loading){
     return(

       <View style={[styles.screen, { backgroundColor: bg }]}>
         <Text style={[styles.text, { color: tc }]}>Creating Foreman...</Text>
       </View>
     )
   }
   return (
     <NavigationContainer independent={true}>
       <View style={[styles.screen, { backgroundColor: bg }]}>
          <Text style={[styles.mainText, { color: tc }]}>Create Foreman</Text>
       </View>
     </NavigationContainer>
   );



 }

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start"
  },
  mainText: {
    fontSize: 20,
    color: "black",
    paddingBottom: 5,
    paddingTop: 0,
    marginTop: 0,
  },
  input: {
    height: 50,
    width: '95%',
    margin: 12,
    marginVertical: 0,
    borderWidth: 1,
    padding: 10,
    paddingVertical: 0

  },
  bottom: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 40,
    width: '100%',
  },
  buttonStyle: {
    backgroundColor: "#8B8B8B",
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
    bottom: '7%',
    width: '95%'
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    fontWeight: "600",
  },
});
