# tuba-player

You can find it in production at Play Store: https://play.google.com/store/apps/details?id=com.tubaplayer

Installing instructions:

```
npm install
```

Follow this guide to setup your environment: https://reactnative.dev/docs/environment-setup

## To publish or update your app: 

* Change the app version manually at ```android/app/build.gradle``` in defaultConfig.
* Set the app password in ```android/gradle.properties```.
* (Once) Run ```keytool -genkeypair -v -keystore tubaplayer.keystore -alias tubaplayer -keyalg RSA -keysize 2048 -validity 10000```.
* (Once) Place the generated .keystore file inside ```android/app```.
* Build a release APK:

```
$ cd android
$ ./gradlew bundleRelease
```

* Unninstal the app that was already intalled in your emulator.
* Test the release app with ```npm run android --variant=release```.
* Make sure the React window in in sync with the android emulator.
* Upload the generated app from ```android/app/build/outputs/bundle/release/app.aab``` to https://play.google.com/console.
* Do it so by accessing ```Production > Create New Release```.

## TODO

* Progress bar for uploading files
* Profile page to confirm email and change password
* Default color changing