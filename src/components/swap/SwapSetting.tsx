import { useState } from 'react';
import { Box, Menu, Switch, Tooltip, Text, Group, Button, TextInput } from '@mantine/core';
import { useSwapContext } from './SwapProvider';
import styles from './SwapSetting.module.css';

const SwapSetting = () => {
  const { maxSlippage, setMaxSlippage, zeroSlippage, setZeroSlippage } = useSwapContext();
  const [customSlippage, setCustomSlippage] = useState<string>(''); // Custom input value

  const getDisplaySlippage = () => {
    if (maxSlippage === null) {
      if (customSlippage.endsWith('%')) {
        return customSlippage; // Already formatted with '%'
      }
      return customSlippage ? `${customSlippage}%` : '-';
    }
    return maxSlippage === 0 ? '-' : `${maxSlippage * 100}%`;
  };

  return (
    <Group>
      <SwapSettingMenu
        maxSlippage={maxSlippage}
        setMaxSlippage={setMaxSlippage}
        customSlippage={customSlippage}
        setCustomSlippage={setCustomSlippage}
        zeroSlippage={zeroSlippage}
        setZeroSlippage={setZeroSlippage}
      />
      <Box className={styles.settings}>
        {zeroSlippage && (
          <span className={`icon-flash ${styles['zero-slippage']} `} />
        )}
        <Text
          size="xxs"
          fw={400}
          c="primary.9"
          style={{ display: 'inline-block' }}
        >
          {getDisplaySlippage()}
        </Text>
      </Box>
    </Group>
  );
};

interface SwapSettingMenuProps {
  maxSlippage: number | null;
  setMaxSlippage: (value: number | null) => void;
  customSlippage: string;
  setCustomSlippage: (value: string) => void;
  zeroSlippage: boolean;
  setZeroSlippage: (value: boolean) => void;
}

const SwapSettingMenu = ({ maxSlippage, setMaxSlippage, customSlippage, setCustomSlippage, zeroSlippage, setZeroSlippage }: SwapSettingMenuProps) => {
  const [isFocused, setIsFocused] = useState<boolean>(false); // Track focus state

  const handleCustomSlippageChange = (value: string) => {
    // Allow only valid numbers with up to one dot and two decimal places
    const formattedValue = value
      .replace(/[^0-9.]/g, '') // Remove non-numeric and non-dot characters
      .replace(/(\..*?)\..*/g, '$1') // Prevent multiple dots
      .replace(/^0+(\d)/, '$1') // Remove leading zeros
      .replace(/^(\d*\.\d{2}).*/, '$1'); // Limit to two decimal places
    setCustomSlippage(formattedValue);
    setMaxSlippage(null); // Unselect predefined options
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (customSlippage) {
      // Format the value to 2 decimal places and append '%'
      const formattedValue = parseFloat(customSlippage).toFixed(2);
      setCustomSlippage(`${formattedValue}%`);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Remove '%' when focusing the input
    if (customSlippage.endsWith('%')) {
      setCustomSlippage(customSlippage.slice(0, -1));
    }
  };

  const handlePredefinedSlippage = (value: number) => {
    setMaxSlippage(value);
    setCustomSlippage(''); // Clear custom input
  };

  return (
    <Menu
      width={280}
      shadow="md"
      position="bottom-start"
      withArrow={false} // Remove the arrow from the menu
      styles={{
        dropdown: {
          width: '320px',
          flexShrink: 0,
          borderRadius: '16px',
          border: '0.5px solid rgba(195, 255, 251, 0.15)',
          background: '#070A0A',
          padding: '16px',
        },
      }}
    >
      <Menu.Target>
        <Box onClick={() => { }} className={styles.iconButton}>
          <span className={`icon-setting`} />
        </Box>
      </Menu.Target>

      <Menu.Dropdown>
        {/* First Row: Max Slippage */}
        <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Text size="xs" c="primary.9" fw={500}>
              Max Slippage
            </Text>
            <Tooltip
              label={
                <Box
                  style={{
                    borderRadius: '5px',
                    border: '0.5px solid rgba(195, 255, 251, 0.15)',
                    background: '#070A0A',
                    height: '50px',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px',
                  }}
                >
                  <Text
                    style={{
                      color: '#627170',
                      fontFamily: 'Inter',
                      fontSize: '8px',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      lineHeight: '9px', // 112.5%
                      textAlign: 'center',
                    }}
                  >
                    This controls the maximum slippage allowed during swaps
                  </Text>
                </Box>
              }
              position="bottom" // Show tooltip below the SVG
              withArrow
              arrowSize={6}
              styles={{
                tooltip: {
                  background: 'transparent', // Remove Mantine's default tooltip background
                  padding: 0, // Remove default padding
                },
                arrow: {
                  background: '#070A0A', // Match tooltip background
                },
              }}
            >
              <span className={`icon-info ${styles.info}`} />
            </Tooltip>
          </Box>

          <Group
            style={{
              borderRadius: '16px',
              border: '0.5px solid rgba(195, 255, 251, 0.15)',
              background: 'transparent',
              padding: '3px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            gap={4}
          >
            <Button
              w="36px"
              h="18px"
              c="primary.9"
              bg={maxSlippage === 0 && !isFocused ? '#2A3838' : 'transparent'}
              bd={maxSlippage === 0 && !isFocused ? '0.5px solid #C3FFFB' : 'none'}
              size="xs"
              onClick={() => handlePredefinedSlippage(0)}
              styles={{
                label: {
                  fontSize: '9px',
                  fontWeight: 500,
                  fontStyle: 'normal',
                },
                root: {
                  borderRadius: '16px',
                  width: '36px',
                  height: '18px',
                  padding: '3px 5px',
                },
              }}
            >
              Auto
            </Button>

            <Button
              w="36px"
              h="18px"
              bg={maxSlippage === 0.005 && !isFocused ? '#2A3838' : 'transparent'}
              bd={maxSlippage === 0.005 && !isFocused ? '0.5px solid #C3FFFB' : 'none'}
              size="xs"
              c="primary.9"
              onClick={() => handlePredefinedSlippage(0.005)}
              styles={{
                label: {
                  fontSize: '9px',
                  fontWeight: 500,
                  fontStyle: 'normal',
                },
                root: {
                  borderRadius: '16px',
                  width: '36px',
                  height: '18px',
                  padding: '3px 5px',
                },
              }}
            >
              0.5%
            </Button>

            <TextInput
              display="inline-block"
              w="45px"
              h="18px"
              p={0}
              m={0}
              value={customSlippage}
              onFocus={handleFocus} // Handle focus
              onBlur={handleBlur} // Handle blur
              onChange={(e) => handleCustomSlippageChange(e.target.value)}
              classNames={{
                input: `${styles['max-slippage-input']} ${isFocused ? styles['highlighted-input'] : ''}`, // Apply conditional class
                wrapper: styles['max-slippage-input-wrapper'],
              }}
              placeholder="0.00%"
            />
          </Group>
        </Box>

        {/* Second Row: Zero Slippage */}
        <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Text size="xs" c="primary.9" fw={500}>
              Zero Slippage
            </Text>
            <Tooltip
              label={
                <Box
                  style={{
                    borderRadius: '5px',
                    border: '0.5px solid rgba(195, 255, 251, 0.15)',
                    background: '#070A0A',
                    height: '50px',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px',
                  }}
                >
                  <Text
                    style={{
                      color: '#627170',
                      fontFamily: 'Inter',
                      fontSize: '8px',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      lineHeight: '9px', // 112.5%
                      textAlign: 'center',
                    }}
                  >
                    This ensures zero slippage during swaps
                  </Text>
                </Box>
              }
              position="bottom" // Show tooltip below the SVG
              withArrow
              arrowSize={6}
              styles={{
                tooltip: {
                  background: 'transparent', // Remove Mantine's default tooltip background
                  padding: 0, // Remove default padding
                },
                arrow: {
                  background: '#070A0A', // Match tooltip background
                },
              }}
            >
              <span className={`icon-info ${styles.info}`} />
            </Tooltip>
          </Box>
          <Switch size="sm" checked={zeroSlippage} onChange={(event) => setZeroSlippage(event.currentTarget.checked)} />
        </Box>
      </Menu.Dropdown>
    </Menu>
  );
};

export default SwapSetting;