import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};

const colors = {
  brand: {
    50: '#e6f6ff',
    100: '#b3e0ff',
    200: '#80cbff',
    300: '#4db5ff',
    400: '#1a9fff',
    500: '#0080e6',
    600: '#0066b3',
    700: '#004d80',
    800: '#00334d',
    900: '#001a26',
  },
};

const theme = extendTheme({ config, colors });

export default theme;