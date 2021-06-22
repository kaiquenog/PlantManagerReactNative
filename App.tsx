import React, { useEffect, useState } from 'react';
import AppLoading from 'expo-app-loading'
import Routes from './src/routes';
import * as Notification from 'expo-notifications'

import {
  useFonts,
  Jost_400Regular,
  Jost_600SemiBold
} from '@expo-google-fonts/jost'
import { PlantProps } from './libs/storage';
import { loadAsync } from 'expo-font';


export default function App() {


  const [fontesLoaded] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold
  });



  useEffect(() => {
    const subscription = Notification.addNotificationReceivedListener(
      async notification => {
        const data = notification.request.content.data.plant as PlantProps;
      })
    return () => subscription.remove();



    // async function notification() {
    //   const data = await Notification.getAllScheduledNotificationsAsync()
    //   console.log("#### NOTIFICAO ####")
    //   console.log(data)

  }, [])

  if (!fontesLoaded) return <AppLoading />

  return (
    <Routes />
  );

}
