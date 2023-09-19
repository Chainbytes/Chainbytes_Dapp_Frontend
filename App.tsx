import Navigation from './navigation';
import { client } from './query';
import React from 'react';

import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApolloProvider } from "@apollo/client";
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';

import { WalletConnectModal, useWalletConnectModal } from "@walletconnect/modal-react-native";
import { signMessage } from './utils/MethodUtils';
import { PROTOCOL_ERRORS_SYMBOL } from '@apollo/client/errors';

const PROJECT_ID = 'fdae4b5f598281b24ca1aa16816dacef';

const clientMeta = {
  name: 'Chainbytes Coffee Provenance',
  description: 'Chainbytes-sponsored dapp that utilizes WalletConnect 2.0 in its blockchain interactions.',
  url: 'https://www.chainbytes.com',
  icons: [],
  redirect: {
    native: 'chainbytes://',
    universal: 'https://www.chainbytes.com',
  }
}

export const sessionParams = {
  namespaces: {
    eip115: {
      methods: [
        'eth_sendTransaction',
        'eth_signTransaction',
        'eth_sign',
        'personal_sign',
        'eth_signTypedData',
      ],
      chains: ['eip155:1'], // mainnet only
      events: ['chainChanged', 'accountsChanged'],
      rcpMap: {},
    },
  },
};

function App(): JSX.Element {
  return (
    <>
      <SafeAreaProvider>
        <ApolloProvider client={client}>
          <Navigation />
          <StatusBar />
        </ApolloProvider>
      </SafeAreaProvider>
      <WalletConnectModal
        projectId={PROJECT_ID}
        providerMetadata={clientMeta}
        sessionParams={sessionParams}
      />
    </>
  );
}

export default App;
