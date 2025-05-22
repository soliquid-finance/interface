import { address } from '@solana/kit';
import type { UiWalletAccount } from '@wallet-standard/react';
import { useContext, useMemo } from 'react';
import useSWRSubscription from 'swr/subscription';

import { Text, Tooltip } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

import { ChainContext } from '@/context/ChainContext';
import { RpcContext } from '@/context/RpcContext';
// import { getErrorMessage } from '../errors';
import { balanceSubscribe } from '../../functions/balance';
// import { ErrorDialog } from './ErrorDialog';

type Props = Readonly<{
    account: UiWalletAccount;
}>;

const seenErrors = new WeakSet();

export function Balance({ account }: Props) {
    const { chain } = useContext(ChainContext);
    const { rpc, rpcSubscriptions } = useContext(RpcContext);
    
    const subscribe = useMemo(() => balanceSubscribe.bind(null, rpc, rpcSubscriptions), [rpc, rpcSubscriptions]);
    const { data: lamports, error } = useSWRSubscription({ address: address(account.address), chain }, subscribe);

    if (error && !seenErrors.has(error)) {
        return (
            <>
                {/* <ErrorDialog
                    error={error}
                    key={`${account.address}:${chain}`}
                    onClose={() => {
                        seenErrors.add(error);
                    }}
                    title="Failed to fetch account balance"
                /> */}
                <Text size="sm" fw={400} c="#627170">
                    <Tooltip label={`Could not fetch balance: ${error?.message || 'Unknown reason'}`} withArrow>
                        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                            <IconAlertTriangle color="red" size={16} style={{ verticalAlign: 'text-bottom' }} />
                        </span>
                    </Tooltip>
                </Text>
            </>
        );
    } else if (lamports == null) {
        return <Text>&ndash;</Text>;
    } else {
        const formattedSolValue = new Intl.NumberFormat(undefined, { maximumFractionDigits: 5 }).format(
            // @ts-expect-error This format string is 100% allowed now.
            `${lamports}E-9`,
        );
        return <Text size="sm" fw={400} c="#627170">~{`${formattedSolValue} SOL`}</Text>;
    }
}
