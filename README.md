# Chainbytes_Dapp_Frontend
This mobile application is made to utilize blockchain technology in order to have transactions of checking in/paying workers to be immutable and verified. 

<br>

## Roles
This application is broken up into 3 different roles with different functions:
- Farmer role: Farmers can only be determined by whoever owns the contract. This role is stored into the contract, and allows access to the farm_app, and its functions. Farmer functions: createForeman, batchPay.
    * createForeman: allows the farmer to send an address to the contract, whose role will change to a foreman.
    * batchPay: allows the farmer to send an array of addresses and their respective balances to be paid, so that they can be transferred ETH.

- Foreman role: Foremen are semi-trusted workers who are in charge of checking in the workers for the day. Foreman function: batchCheckIn.
    * batchCheckIn: allows the foreman to send an array of addresses to the contract who will be checked in for today.

- Worker Role: The worker role has 3 screens: home screen which displays some useful information, qrCode screen which makes it easier to scan their wallet address, and calendar screen that should show when they have been checkedIn.

<br>

## Running the Application
<b>Developer</b> Prerequisites:
* Git Source Control
    * Download and follow instructions [here](https://git-scm.com/downloads).
* Node.js (includes npm, nvm, and npx cmd-line tools)
    * Download and follow instructions [here](https://nodejs.org/en/download/).
* Yarn
    * This is our preferred dependency manager. Download and follow instructions [here](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable).
* Watchman
    * For macOS & Linux users, you can download for testing/diagnostic procedures [Watchman](https://facebook.github.io/watchman/docs/install#buildinstall).  
* Expo-CLI
    * To use Expo, you need to have `Node.js` installed on the machine you are running the application on.
    * Expo-CLI is part of the `expo` package, you can leverage it using `npx` - a Node.js package runner. Meaning, no installation is required!

<b>User</b> Prerequisites:
* Wallet
    * Users will have to have a an account registered with any of the wallet service providers supported by WalletConnect which can be found [here](https://explorer.walletconnect.com/?type=wallet). Our preferred provider has been `Metamask`. Users are expected to have registered an account with one of the providers.
* Expo application downloaded on mobile phone from android/iOS app store.
    * Title: "Expo Go"
    * Developer: "Nametag"

Command-Line Instructions  
* Once in the terminal command-line interface:
    * Enter `yarn install` in order to download all of the correct dependencies onto your machine.
    * You can then run this application locally by typing in the terminal: `npx expo start`.  
        * This will generate a scannable QR code, which will run the application onto your device.

<br>

## Deploying the Application

<b>
** Note: Build has not yet completed! We are waiting for full WalletConnect 2.0 migration with react-native-dapps! **  
</b> 

Prerequisites:
* Need Expo developer account (You can sign up on their website [here](https://expo.dev/))
* Expo-CLI installed (Reference "Running the Application" Section)

These have been set, but can be changed
* Set app name and app slug name to desired values
* Write a little description about the application 
* Configure splash screen / icons correctly

1. To deploy this application, first login into expo-cli: `expo login`. Provide credentials.
    * To check if you are logged in, you can do this by entering in the command line `expo whoami`.
2. `expo publish` - this command will package the application and then publish it onto your Expo Developer account.
3. Access the application by looking at published applications under profile. There should be a <b>shareable link</b> to use this application, as well as a scannable <b>QR code</b>. Now, the application can be accessed by anyone, anywhere, as long as they have the Expo Go application on their device, and are authorized to access this application. Authorization can be changed on the Expo Go website [here](https://expo.dev).
    * [Manifest](https://exp.host/@jos224/chainbytes-coffee)
    * [Project page](https://expo.dev/@jos224/chainbytes-coffee?serviceType=classic&distribution=expo-go) 

<i>NOTE</i>: To learn how to publish channels using Expo, you can do so [here](https://docs.expo.dev/archive/classic-updates/publishing/). More advanced deployment instructions can also be found at this [link](https://docs.expo.dev/archive/classic-updates/advanced-release-channels/).

## Additional Notes:
There are lots of dependencies that will probably be out of date as this project gets passed on. Be very careful when updating a certain packages or when forcing updates/audits in npm/yarn, as this can mess up other dependencies and leave you incredibly confused. Two major dependency updates will  take form in the Expo and WalletConnect versions. Our current version is 46.0.0 and 1.0, respectively, but will be deprecated as time progresses.