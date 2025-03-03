import React from 'react';
import { Image, Text, StyleSheet, View } from 'react-native';
import { AuthColors } from '../../../styles/AuthColors';

const LogoHeader = ({ style, scale = 1 }) => {
  return (
    <View style={[styles.container, style]}>
      <Image 
        source={require('../../../../assets/images/logo.png')} 
        style={[styles.logo, { width: styles.logo.width * scale, height: styles.logo.height * scale }]} 
      />
      <View style={styles.textContainer}>
        <Text style={[styles.title, { fontSize: styles.title.fontSize * scale }]}>당신의</Text>
        <Text style={[styles.subtitle, { fontSize: styles.subtitle.fontSize * scale }]}>안전한 주택</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 80,
    marginBottom: 10,
  },
  textContainer: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: AuthColors.textColor,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: AuthColors.textColor,
    textAlign: 'center',
  },
});

export default LogoHeader;
