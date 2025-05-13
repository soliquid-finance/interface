import { Box, Menu, Switch, Tooltip, Text, Group, Button, TextInput } from '@mantine/core';
import styles from './SwapSetting.module.css';

const SwapSettingMenu = ({
    maxSlippage,
    setMaxSlippage,
    customSlippage,
    setCustomSlippage,
    zeroSlippage,
    setZeroSlippage,
}: {
    maxSlippage: number | null;
    setMaxSlippage: (value: number | null) => void;
    customSlippage: string;
    setCustomSlippage: (value: string) => void;
    zeroSlippage: boolean;
    setZeroSlippage: (value: boolean) => void;
}) => {
    const handleCustomSlippageChange = (value: string) => {
        setCustomSlippage(value);
        setMaxSlippage(null); // Unselect predefined options
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
            withArrow={false}
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
                                            lineHeight: '9px',
                                            textAlign: 'center',
                                        }}
                                    >
                                        This controls the maximum slippage allowed during swaps
                                    </Text>
                                </Box>
                            }
                            position="bottom"
                            withArrow
                            arrowSize={6}
                            styles={{
                                tooltip: {
                                    background: 'transparent',
                                    padding: 0,
                                },
                                arrow: {
                                    background: '#070A0A',
                                },
                            }}
                        >
                            <Box
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: 'rgba(195, 255, 251, 0.15)',
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                                    <path
                                        d="M5 0C2.25371 0 0 2.25371 0 5C0 7.74629 2.25371 10 5 10C7.74629 10 10 7.74629 10 5C10 2.25371 7.74629 0 5 0ZM5.58594 7.34375C5.58594 7.66676 5.32301 7.92969 5 7.92969C4.67699 7.92969 4.41406 7.66676 4.41406 7.34375V4.41406C4.41406 4.09105 4.67699 3.82812 5 3.82812C5.32301 3.82812 5.58594 4.09105 5.58594 4.41406V7.34375ZM5 3.24219C4.67699 3.24219 4.41406 2.97926 4.41406 2.65625C4.41406 2.33324 4.67699 2.07031 5 2.07031C5.32301 2.07031 5.58594 2.33324 5.58594 2.65625C5.58594 2.97926 5.32301 3.24219 5 3.24219Z"
                                        fill="#C3FFFB"
                                        fillOpacity="0.5"
                                    />
                                </svg>
                            </Box>
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
                            bg={maxSlippage === 0 ? '#2A3838' : 'transparent'}
                            size="xs"
                            color="primary.9"
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
                            bg={maxSlippage === 0.005 ? '#2A3838' : 'transparent'}
                            size="xs"
                            color="primary.9"
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
                            onChange={(e) => handleCustomSlippageChange(e.target.value)}
                            classNames={{
                                input: styles['max-slippage-input'],
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
                                            lineHeight: '9px',
                                            textAlign: 'center',
                                        }}
                                    >
                                        This ensures zero slippage during swaps
                                    </Text>
                                </Box>
                            }
                            position="bottom"
                            withArrow
                            arrowSize={6}
                            styles={{
                                tooltip: {
                                    background: 'transparent',
                                    padding: 0,
                                },
                                arrow: {
                                    background: '#070A0A',
                                },
                            }}
                        >
                            <Box
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: 'rgba(195, 255, 251, 0.15)',
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                                    <path
                                        d="M5 0C2.25371 0 0 2.25371 0 5C0 7.74629 2.25371 10 5 10C7.74629 10 10 7.74629 10 5C10 2.25371 7.74629 0 5 0ZM5.58594 7.34375C5.58594 7.66676 5.32301 7.92969 5 7.92969C4.67699 7.92969 4.41406 7.66676 4.41406 7.34375V4.41406C4.41406 4.09105 4.67699 3.82812 5 3.82812C5.32301 3.82812 5.58594 4.09105 5.58594 4.41406V7.34375ZM5 3.24219C4.67699 3.24219 4.41406 2.97926 4.41406 2.65625C4.41406 2.33324 4.67699 2.07031 5 2.07031C5.32301 2.07031 5.58594 2.33324 5.58594 2.65625C5.58594 2.97926 5.32301 3.24219 5 3.24219Z"
                                        fill="#C3FFFB"
                                        fillOpacity="0.5"
                                    />
                                </svg>
                            </Box>
                        </Tooltip>
                    </Box>
                    <Switch size="sm" checked={zeroSlippage} onChange={(event) => setZeroSlippage(event.currentTarget.checked)} />
                </Box>
            </Menu.Dropdown>
        </Menu>
    );
};

export default SwapSettingMenu;
