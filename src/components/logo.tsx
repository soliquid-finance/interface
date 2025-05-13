import { Box, BoxProps } from '@mantine/core';

interface LogoProps extends Omit<BoxProps, 'children' | 'ref'> {
  size?: string | number;
}

export function Logo({ size, style, ...props }: LogoProps) {
  return (
    <Box
      component="img"
      src="/assets/logo.svg"
      alt="Logo"
      style={{ width: size, height: size, ...style }}
      {...props}
    />
  );
}
