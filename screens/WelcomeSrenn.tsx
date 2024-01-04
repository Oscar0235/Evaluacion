import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';

export default function WelcomeScreen({ navigation }: any) {
  const imageUrl = 'https://c4.wallpaperflare.com/wallpaper/561/62/373/night-sky-4k-hd-full-screen-wallpaper-preview.jpg';

  return (
    <View style={styles.container}>
      <Text style={styles.name}>Oscar Prado</Text>
      <Image
        source={{ uri: imageUrl }}
        style={styles.logo}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Tabs')}
      >
        <Text style={styles.buttonText}>ACCEDER</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    marginBottom: 20,
  },
  logo: {
    width: 500, 
    height: 400, 
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#20272F',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});
