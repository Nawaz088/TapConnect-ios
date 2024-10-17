import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

interface Props {
    data?: any;
    width?: any;
    height?: any;
    numberColor: string;
    bgcolor: string,
    title: any,
    value: any
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const boxWidth = (screenWidth/2) - 30;
const boxHeight = screenHeight * 0.19;

const Graphbox = ({ data, width, height, numberColor, bgcolor, title, value } : Props) => {
  // Normalize data to fit within the SVG viewport
  const normalizedData = normalizeData({data, width, height});
  // const totalViews = data.reduce((sum: number, current: number) => sum + current, 0);
  return (
    <View style={[styles.container, {backgroundColor: bgcolor}]}>
      <Text style={[styles.numberText, {color: numberColor }]}>{value}</Text>
      <Text style={styles.labelText}>{title}</Text>
      <Svg width={width} height={height} style={{padding: 0}}>
        <Polyline
          points={normalizedData.join(' ')}
          fill="none"
          stroke="#565660"
          strokeWidth="1"
          
        />
      </Svg>
    </View>
  );
};

// Helper function to normalize data
const normalizeData = ({data, width, height} : any) => {
  const minY = Math.min(...data);
  const maxY = Math.max(...data);
  return data.map((value: any, index: any) => {
    const x = (index / (data.length)) * width;
    const y = height - ((value - minY) / (maxY - minY)) * (height/1.5);
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",x, y);
    return `${x},${y+5}`;
  });
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    padding: 10,
    width: boxWidth,
    height: boxHeight,
    elevation: 5,
  },
  numberText: {
    fontSize: 32,
    fontWeight: 'medium',
    fontFamily: 'RobotoMedium',
    bottom: 0
  },
  labelText: {
    fontSize: 12,
    fontWeight: 'light',
    color: '#565660',
    fontFamily: 'RobotoLight',
    top: 0
  },
});

export default Graphbox;