import { useWalletConnect } from "@walletconnect/react-native-dapp";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { StyleSheet, FlatList, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from "react-native";
import { View, Text, TextInput, textColor } from "../../components/Themed";
import React, { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import * as config from "../ChainBytesConfig";
import WorkerItem, {
  WorkerCheckinItem,
} from "../foreman_app/screens/Extra/workerItem";
import { useQuery } from "@apollo/client";
import * as query from "../../query";
import moment from "moment";
import Spinner from "react-native-loading-spinner-overlay";

export default function BatchPay() {
  //Rate is bound to change depending on how much the workers should be paid (amount in Wei)
  const [rate, setRate] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(10000);
  const [workers, setWorkers] = useState([]);
  const [balance, setBalance] = useState(0);
  const tc = textColor();
  var numWorkersUnpaid = 1;

  function textChange(input) {
    if (input.trim() === '') {
      setRate(0);
      return;
    }
    if (!isNaN(input)) {
      setRate(Math.ceil(input));
    }
    return;
  }

  // This is to update the balance anytime the workers or rate is changed
  useEffect(() => {
    let _balance = 0;
    for (let worker of workers) {
      if (worker.daysUnpaid != 0) {
        _balance += worker.daysUnpaid * rate;
        numWorkersUnpaid += 1; //added 
      }
    }
    setBalance(_balance);
  }, [rate, workers]);



  // Function to get current rate of ETH for USD
  async function getPrice(setExchangeRate) {
    await fetch(
      "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
    )
      .then((response) => response.json())
      .then((data) => {
        // Change ETH per USD to WEI per USD so that users can input USD amount and then
        // the program knows how much wei to actually send to the contract with the function call.
        var WEIPerETH = ethers.BigNumber.from("10").pow(18);
        var USDperETH = ethers.BigNumber.from(Math.ceil(data["USD"]));
        var exchangeRate = ethers.BigNumber.from(WEIPerETH).div(USDperETH);
        setExchangeRate(exchangeRate);
      });
  }
  getPrice(setExchangeRate);

  const handleRefresh = () => {
    // manually refetch data
    refetch();
  };

  // Querying theGraph to get all of the workers, and displaying daysUnpaid, etc.
  const { loading, error, data, refetch } = useQuery(query.GET_CHECKINS, {
    onCompleted: () => {
      setWorkers(() => {
        return data.workers
      });
      setWorkers((workers) => {
        return workers.map(el => ({ ...el, selected: false }))
      })
    },
    notifyOnNetworkStatusChange: true,
  });

  // This function is called whenever a row is selected from the FlatList, and highlights it.
  // The highlighted workers will be sent to the contract function call as a parameter based on 'selected' field
  const highlightWorker = (key) => {
    if (workers.filter((worker) => worker.id == key.id)[0].selected === true) {
      workers.filter((worker) => worker.id == key.id)[0].selected = false
    } else {
      workers.filter((worker) => worker.id == key.id)[0].selected = true
    }
  }

  const connector = useWalletConnect();

  // Function that calls the batchPay function on the Ethereum contract
  const batchPay = React.useCallback(
    async (rate, workers) => {
      try {
        var date = moment().utcOffset("-04:00").format("YYYY-MM-DD hh:mm:ss a");
        const provider = new WalletConnectProvider({
          rpc: {
            5: config.providerUrl,
          },
          chainId: 5,
          connector: connector,
          qrcode: false,
        });

        await provider.enable();
        const ethers_provider = new ethers.providers.Web3Provider(provider);
        const signer = ethers_provider.getSigner();
        let contract = new ethers.Contract(
          config.contractAddress,
          config.contractAbi,
          signer
        );
        let addresses = [];
        let balances = [];
        let balance = 0;
        for (let i = 0; i < workers.length; i++) {
          if (workers[i].daysUnpaid != 0) {
            addresses.push(workers[i].id);
            let _balance = ethers.BigNumber.from(exchangeRate)
              .mul(workers[i].daysUnpaid)
              .mul(rate);
            balances.push(_balance);
            balance = ethers.BigNumber.from(balance).add(_balance);
          }
        }
        // Override to allow a custom value to be added when calling contract
        let overrides = {
          value: balance.toString(), // ether in this case MUST be a string
        };
        await contract
          .payWorkers(addresses, balances, date, overrides)
          .then((result) => console.log(result));
      } catch (e) {
        console.error(e);
      }
    },
    [connector]
  );

  return (
    <>
      {loading && (
        <View style={styles.container}>
          <Spinner
            visible={loading}
            textContent={"Loading..."}
            textStyle={styles.spinnerTextStyle}
          />
        </View>
      )}
      {error && <Text>Error: {error.message}</Text>}
      {/* When query is done loading, there are no errors, but there are also no workers.... */}
      {!loading && !error && workers.length === 0 && (
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.list}>
              <WorkerItem
                item={{ text: "No workers to pay yet!" }}
                pressHandler={() => { }}
              ></WorkerItem>
            </View>
          </View>
          <View style={styles.bottom}>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => handleRefresh()}
            >
              <Text style={styles.buttonTextStyle}> Refresh List </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* When query is done loading, there are no errors, and there are workers.... */}
      {!loading && !error && workers.length != 0 && (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>
            <View style={styles.content}>
              <View style={styles.list}>
                {/* Header for the list of content */}
                <View style={{
                  flexDirection: "row",
                  alignItems: "baseline"
                }}>
                  <Text style={{ flex: 1, textAlign: "left" }}>
                    Address
                  </Text>
                  <Text style={{ flex: 1, textAlign: "center" }}>
                    Days Unpaid
                  </Text>
                  <Text style={{ flex: 1, textAlign: "right" }}>
                    Balance
                  </Text>
                </View>
                {/* List of WorkerCheckinItems that will display a worker's address and daysUnpaid.
                    Their relative balance is also calculated and displayed */}
                <FlatList
                  data={workers}
                  renderItem={({ item }) => (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "baseline"
                      }}
                    >
                      <View style={{ flex: 1, flexGrow: 3 }}>
                        <WorkerCheckinItem
                          style={{
                            position: "relative",
                          }}
                          item={{
                            id: item.id,
                            daysUnpaid: item.daysUnpaid,
                            selected: item.selected
                          }}
                          pressHandler={highlightWorker}
                          keyExtractor={(item, index) => index.toString()}
                        ></WorkerCheckinItem>
                      </View>
                      <View style={{ flex: 1, flexGrow: 2 }}>
                        <Text
                          style={{
                            position: "relative",
                            alignSelf: "flex-end",
                          }}
                        >
                          ${item.daysUnpaid * rate}
                        </Text>
                      </View>
                    </View>
                  )}
                ></FlatList>
              </View>
            </View>
            {/* Options/buttons found at the bottom of the screen */}
            <View style={styles.bottom}>
              <View
                style={{
                  flexDirection: "row",
                  textAlignVertical: "center",
                }}
              >
                <Text>Total balance:{"     "}</Text>
                <View style={{ flexDirection: "column" }}>
                  <Text
                    style={{
                      alignSelf: "flex-start",
                      textAlignVertical: "top",
                      position: "relative",
                    }}
                  >
                    ~${balance.toString()}
                  </Text>
                  <Text
                    style={{
                      textAlignVertical: "bottom",
                      position: "relative",
                      alignSelf: "flex-start",
                    }}
                  >
                    {ethers.utils
                      .formatEther(
                        ethers.BigNumber.from(balance)
                          .mul(exchangeRate)
                          .toString()
                      )
                      .slice(0, 7)}{" "}
                    ETH
                  </Text>
                </View>
              </View>
              {/* Portion that allows the rate (and subsequently the balances) to be changed according to userInput */}
              <View>
                <Text style={{ padding: 15, paddingBottom: 5 }}>
                  Rate to pay workers (USD per day)
                </Text>
                <View>
                  <TextInput
                    style={[styles.input, { borderColor: tc }, { color: tc }]}
                    keyboardType='numeric'
                    onChangeText={textChange}
                    placeholder="Rate"
                    value={rate != 0 || rate != "" ? rate : ""}
                    placeholderTextColor="grey"
                  />
                </View>
              </View>
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => handleRefresh()}
              >
                <Text style={styles.buttonTextStyle}> Refresh List </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => batchPay(rate, workers.filter((worker) => worker.selected == true))}
              >
                <Text style={styles.buttonTextStyle}> Pay selected workers </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )
      }
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 80,
  },
  mainText: {
    fontSize: 20,
    color: "black",
    paddingBottom: 5,
    paddingTop: 0,
    marginTop: 0,
  },
  content: {
    padding: 10,
    marginTop: 90,
    overflow: "scroll",
    height: "50%",
    borderWidth: "3px",
    borderColor: "black",
    borderStyle: "solid",
    marginBottom: 0,
  },
  list: {
    marginTop: 0,
    marginBottom: 0,
    paddingVertical: 0,
  },
  bottom: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 20,
    marginBottom: 50,
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
    marginTop: 10,
    marginBottom: 10,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    height: 40,
    margin: 12,
    marginVertical: 0,
    borderWidth: 1,
    padding: 10,
    paddingVertical: 0,
  },
});
