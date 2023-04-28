import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApolloProvider } from "@apollo/client";
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { client } from './query';
import React from 'react';

import { EthereumClient } from '@web3modal/ethereum'
import { WagmiConfig, configureChains, createClient, goerli } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import * as config from "./screens/ChainBytesConfig";
import { Web3Modal } from '@web3modal/react'

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const { chains, provider } = configureChains(
    [goerli],
    [alchemyProvider({ apiKey: config.providerApiKey })],
  )
  const wagmiclient = createClient({
    autoConnect: true,
    connectors: [
      new WalletConnectConnector({
        options: {
          projectId: config.projectId,
        },
      })
    ],
    provider
  })
  const ethereumClient = new EthereumClient(wagmiclient, chains)

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <WagmiConfig client={wagmiclient}>
          <ApolloProvider client={client}>
            <Navigation />
            <StatusBar />
          </ApolloProvider>
        </WagmiConfig>
        <Web3Modal projectId={config.projectId} ethereumClient={ethereumClient} />
      </SafeAreaProvider>
    );
  }
}