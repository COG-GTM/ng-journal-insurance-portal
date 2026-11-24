import { definePreset } from '@primeuix/themes';
import Lara from '@primeuix/themes/lara';

// Lara tuned to the bootstrap4-light-blue palette the app used before PrimeNG 19 removed CSS themes.
export const InsurancePortalPreset = definePreset(Lara, {
  primitive: {
    borderRadius: { sm: '4px', md: '4px', lg: '4px' },
  },
  semantic: {
    primary: {
      50: '#f2f8ff',
      100: '#c2dfff',
      200: '#91c6ff',
      300: '#61adff',
      400: '#3094ff',
      500: '#007bff',
      600: '#0069d9',
      700: '#0056b3',
      800: '#00448c',
      900: '#003166',
      950: '#002147',
    },
    formField: {
      paddingX: '0.75rem',
      paddingY: '0.5rem',
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '#f9fafb',
          100: '#f8f9fa',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#6c757d',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
          950: '#121416',
        },
        highlight: {
          background: '{primary.500}',
          focusBackground: '{primary.600}',
          color: '#ffffff',
          focusColor: '#ffffff',
        },
        focusRing: {
          shadow: '0 0 0 0.2rem rgba(38, 143, 255, 0.5)',
        },
        formField: {
          borderColor: '#ced4da',
          hoverBorderColor: '#ced4da',
          color: '#495057',
          placeholderColor: '#6c757d',
          iconColor: '#495057',
        },
        text: {
          color: '#212529',
          mutedColor: '#6c757d',
        },
      },
    },
  },
});
