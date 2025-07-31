
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Colors = {
  primary: '#4a90e2',
  secondary: '#50c878',
  accent: '#ff6b6b',
  warning: '#ffa500',
  danger: '#e74c3c',
  success: '#27ae60',
  info: '#3498db',
  
  background: '#f8f9fa',
  surface: '#ffffff',
  overlay: 'rgba(26, 26, 46, 0.85)',
  
  text: {
    primary: '#2c3e50',
    secondary: '#7f8c8d',
    light: '#ffffff',
    placeholder: '#a0a0a0',
  },
  
  border: '#e1e8ed',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 50,
};

export const Typography = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  h2: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  h3: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  body: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  caption: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  small: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
});

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const Layout = {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  isLargeDevice: width >= 414,
};

export default {
  Colors,
  Spacing,
  BorderRadius,
  Typography,
  Shadows,
  Layout,
};
