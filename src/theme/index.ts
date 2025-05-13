import { createTheme, rem } from '@mantine/core';

export const theme = createTheme({
  colors: {
    primary: [
      'rgba(195, 255, 251, 0.05)',  // 10% opacity
      'rgba(195, 255, 251, 0.2)',  // 20% opacity
      'rgba(195, 255, 251, 0.3)',  // 30% opacity
      'rgba(195, 255, 251, 0.4)',  // 40% opacity
      'rgba(195, 255, 251, 0.5)',  // 50% opacity
      'rgba(195, 255, 251, 0.6)',  // 60% opacity
      'rgba(195, 255, 251, 0.7)',  // 70% opacity
      'rgba(195, 255, 251, 0.8)',  // 80% opacity
      'rgba(195, 255, 251, 0.9)',  // 90% opacity
      'rgba(195, 255, 251, 1)',    // 100% opacity
    ],
  },
  primaryColor: 'primary',
  components: {
    Text: {
      defaultProps: {
        size: 'md',
        weight: 400,
        color: '#627170',
        lineClamp: 1,
        lineHeight: '1.5rem',
        textWrap: 'wrap',
        textOverflow: 'ellipsis',
        textAlign: 'left',
        textTransform: 'none',
        textDecoration: 'none',
      },

      styles: {
        root: {
          fontFamily: 'Inter, sans-serif',
        },
      },
    },
  },
  cursorType: 'pointer',
  fontFamily: 'Inter, sans-serif',
  fontSizes: {
    xxs: rem(10),
    xs: rem(12),
    sm: rem(14),
    md: rem(16),
    lg: rem(18),
    xl: rem(20),
    xxl: rem(24),
  },
  breakpoints: {
    xs: '30em',
    sm: '40em',
    md: '48em',
    lg: '64em',
    xl: '80em',
    '2xl': '96em',
    '3xl': '120em',
    '4xl': '160em',
  },
  headings: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 'bold',
    // textWrap: 'wrap' | 'nowrap' | 'balance' | 'pretty' | 'stable';
    sizes: {
      h1: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        lineHeight: '2.8rem'
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 'semi-bold',
        lineHeight: '2.2rem'
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 'semi-bold',
        lineHeight: '2rem'
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 'semi-bold',
        lineHeight: '1.8rem'
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 'semi-bold',
        lineHeight: '1.5rem'
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 'semi-bold',
        lineHeight: '1.2rem'
      },
    }
  }
})
