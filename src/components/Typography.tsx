import React from 'react';
import { Text } from '@mantine/core';


interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Heading: React.FC<TypographyProps> = ({ children, className, style }) => (
  <Text
    size="xl"
    w={600}
    // color="white"
    style={{ fontFamily: 'Inter, sans-serif', ...style }}
    className={className}
  >
    {children}
  </Text>
);

export const SubHeading: React.FC<TypographyProps> = ({ children, className, style }) => (
  <Text
    size="sm"
    w={500}
    color="white"
    style={{ fontFamily: 'Inter, sans-serif', ...style }}
    className={className}
  >
    {children}
  </Text>
);

export const Caption: React.FC<TypographyProps> = ({ children, className, style }) => (
  <Text
    size="xs"
    w={400}
    color="neutral.500"
    style={{ fontFamily: 'Inter, sans-serif', ...style }}
    className={className}
  >
    {children}
  </Text>
);
