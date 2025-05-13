import { Text, Group, Box, Accordion, Flex, Avatar } from '@mantine/core';
import React, { useEffect } from 'react';
import { useSwapContext } from './SwapProvider';

const NetworkFeeSection = () => {
    const { tokenFrom, tokenTo } = useSwapContext();

    const tokens = [
        tokenFrom,
        tokenFrom,
        tokenTo,
    ].filter(Boolean);

    return (
        <Accordion
            styles={{
                item: {
                    border: 'none',
                },
                control: {
                    padding: 0,
                },
                content: {
                    padding: 0,
                },
            }}
            w="100%"
            px={20}
            chevron={
                <span className="icon-arrow-down2" style={{ color: '#C3FFFB50' }} />
            }
        >
            <Accordion.Item value="network-fee">
                <Accordion.Control bg="transparent">
                    <Group justify="space-between" align="center" w="100%">
                        <Text size="xs" fw={500} c="primary.4">
                            Network Fee
                        </Text>
                        <Box
                            style={{
                                display: 'flex',
                                justifyContent: 'end',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            <Text size="xs" fw={500} c="primary.9" pr={10}>
                                0.000001 SOL
                            </Text>
                        </Box>
                    </Group>
                </Accordion.Control>
                <Accordion.Panel>
                    <Text size="xs" fw={500} c="primary.4" pt={10} pb={15}>
                        Gasless Route
                    </Text>
                    <Box
                        className="gasless-route"
                        style={{
                            width: '100%',
                            height: 'auto',
                            flexShrink: 0,
                            borderRadius: '8px',
                            border: '0.5px solid rgba(195, 255, 251, 0.10)',
                            background: 'rgba(23, 33, 33, 0.50)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            position: 'relative',
                            overflow: 'hidden',
                            padding: '20px 0px',
                        }}
                    >
                        <Flex align="center" justify="center" gap={0} px={20} style={{ width: '100%' }}>
                            {tokens.map((token: any, index: number) => (
                                <React.Fragment key={`${token?.symbol}-${index}`}>
                                    <Box
                                        style={{
                                            width: 'fit-content',
                                            minWidth: '64px',
                                            height: '20px',
                                            flexShrink: 0,
                                            borderRadius: '50px',
                                            border: '0.5px solid rgba(195, 255, 251, 0.10)',
                                            background: '#2A3838',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '3px 6px',
                                        }}
                                    >
                                        <Avatar
                                            src={token?.logoURI}
                                            alt={token?.symbol}
                                            size={14}
                                            radius="xl"
                                            style={{
                                                border: '0.5px solid rgba(195, 255, 251, 0.10)',
                                                background: '#2A3838',
                                            }}
                                        />
                                        <Text
                                            style={{
                                                color: '#FFF',
                                                textAlign: 'right',
                                                fontFamily: 'Inter',
                                                fontSize: '10px',
                                                fontStyle: 'normal',
                                                fontWeight: 600,
                                                lineHeight: 'normal',
                                                marginLeft: '5px',
                                            }}
                                        >
                                            {token?.symbol}
                                        </Text>
                                    </Box>
                                    {index < tokens.length - 1 && (
                                        <div
                                            style={{
                                                background: 'rgba(195, 255, 251, 0.30)',
                                                width: '100%',
                                                height: '0.5px',
                                                margin: '0px',
                                            }}
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                        </Flex>

                        <Text
                            style={{
                                color: '#627170',
                                textAlign: 'center',
                                fontFamily: 'Inter',
                                fontSize: '8px',
                                fontStyle: 'normal',
                                fontWeight: 600,
                                lineHeight: '12px', // 150%
                            }}
                        >
                            65% {tokenFrom?.symbol}-{tokenTo?.symbol}
                        </Text>
                        <Text
                            style={{
                                color: '#627170',
                                textAlign: 'center',
                                fontFamily: 'Inter',
                                fontSize: '8px',
                                fontStyle: 'normal',
                                fontWeight: 600,
                                lineHeight: '12px', // 150%
                            }}
                        >
                            20% {tokenFrom?.symbol}-USDC &gt; USDC-{tokenTo?.symbol}
                        </Text>
                        <Text
                            style={{
                                color: '#627170',
                                textAlign: 'center',
                                fontFamily: 'Inter',
                                fontSize: '8px',
                                fontStyle: 'normal',
                                fontWeight: 600,
                                lineHeight: '12px', // 150%
                            }}
                        >
                            15% {tokenFrom?.symbol}-USDT &gt; USDT-{tokenTo?.symbol}
                        </Text>
                    </Box>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    );
};

export default NetworkFeeSection;