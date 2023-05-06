import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useNetwork } from 'wagmi'
import clsx from 'clsx'
import { ISendDonat } from 'types'

import FormInput from 'components/FormInput'
import SelectComponent from 'components/SelectComponent'
import TabsComponent from 'components/TabsComponent'
import BlockchainOption from 'components/SelectInput/options/BlockchainOption'

import { useLazyGetUsdKoefQuery } from 'store/services/DonationsService'
import { fullChainsInfo, BlockchainNetworks } from 'utils/wallets/wagmi'
import { formatNumber } from 'utils'
import { IFormHandler } from '../types'
import { FormattedMessage } from 'react-intl'
import Loader from 'components/Loader'

const tabCountTypes = [5, 10, 30]

const countTabs = tabCountTypes.map((tab) => ({
	key: String(tab),
	label: `${tab} USD`,
}))

interface IAmountInput {
	color: string
	form: ISendDonat
	usdtKoef: number
	isNotValid: boolean
	isLoading: boolean
	formHandler: ({ field, value }: IFormHandler) => void
	setUsdtKoef: (num: number) => void
	switchNetwork?: (chainId?: number) => void
}

const AmountInput: FC<IAmountInput> = ({
	form,
	color,
	usdtKoef,
	isNotValid,
	isLoading,
	formHandler,
	setUsdtKoef,
	switchNetwork,
}) => {
	const [getUsdKoef] = useLazyGetUsdKoefQuery()
	const [tabCount, setTabCount] = useState<number | null>(null)
	const [inputValue, setInputValue] = useState('')
	const { chain: currentChain, chains } = useNetwork()

	const { sum, blockchain: selectedBlockchain } = form

	const setBlockchainInfo = async (chainSymbol: string) => {
		formHandler({ field: 'blockchain', value: chainSymbol })
		const { data: newUsdtKoef } = await getUsdKoef(chainSymbol)

		if (newUsdtKoef) {
			setUsdtKoef(newUsdtKoef)

			if (tabCount) {
				const blockchainValue = tabCount / newUsdtKoef
				formHandler({ field: 'sum', value: blockchainValue })
				setInputValue(String(formatNumber(blockchainValue)))
			}
		}
	}

	const setAmountValue = (num: string) => {
		// const filteredSymbols = ["+", "-", "e"];
		// const numericPattern = /^([0-9]+(\.*[0-9]*)?|\.[0-9]+)$/;
		// console.log(num, numericPattern.test(num));
		// if (!numericPattern.test(num)) return;

		const amountValue = +num
		setInputValue(num)
		formHandler({ field: 'sum', value: amountValue })
		// setTabCount(null);
	}

	const setBlockchain = async (selectedSymbol: string) => {
		if (selectedBlockchain !== selectedSymbol) {
			const blockchainInfo = Object.values(fullChainsInfo).find(
				({ nativeCurrency }) => nativeCurrency.symbol === selectedSymbol
			)
			if (blockchainInfo) {
				switchNetwork?.(blockchainInfo.id)
				await setBlockchainInfo(selectedSymbol)
			}
		}
	}

	const setTabContent = useCallback(
		async (key: string) => {
			const numberFormat = +key
			const blockchainValue = numberFormat / usdtKoef

			setTabCount(numberFormat)
			formHandler({ field: 'sum', value: blockchainValue })
			setInputValue(String(formatNumber(blockchainValue)))
		},
		[usdtKoef, formHandler]
	)

	const convertedUsdSum = useMemo(() => formatNumber(+sum * usdtKoef), [sum, usdtKoef])

	const selectedBlockchainIconInfo = useMemo(
		() =>
			Object.values(fullChainsInfo).find(
				(chainInfo) => chainInfo.nativeCurrency.symbol === selectedBlockchain
			),
		[selectedBlockchain]
	)

	useEffect(() => {
		if (currentChain) {
			const chainNetwork = currentChain.network as BlockchainNetworks
			const blockchainInfo = fullChainsInfo[chainNetwork]

			if (blockchainInfo) {
				const blockchainSymbol = blockchainInfo.nativeCurrency.symbol
				formHandler({ field: 'blockchain', value: blockchainSymbol })
				setBlockchainInfo(blockchainInfo.nativeCurrency.symbol)
			}
		}
	}, [currentChain])

	useEffect(() => {
		const value = +convertedUsdSum
		setTabCount(tabCountTypes.includes(value) ? value : null)
	}, [convertedUsdSum])

	return (
		<div className="item">
			<FormInput
				value={inputValue}
				setValue={setAmountValue}
				typeInput="number"
				addonAfter={
					isLoading ? (
						<Loader size="small" modificator="blockchainLoading" />
					) : (
						<SelectComponent
							title={
								<div className="selectedBlockchain">
									{selectedBlockchainIconInfo && (
										<div
											className="blockchain-icon"
											style={{
												background: selectedBlockchainIconInfo.color,
											}}
										>
											<img src={selectedBlockchainIconInfo.icon} alt={selectedBlockchain} />
										</div>
									)}
									<span>{selectedBlockchain}</span>
								</div>
							}
							list={chains.map(({ nativeCurrency }) => nativeCurrency.symbol)}
							selected={selectedBlockchain}
							selectItem={setBlockchain}
							renderOption={(item) => <BlockchainOption value={item} key={item} />}
							listWrapperModificator="blockchains-list"
							modificator="inputs-select"
							styles={{ background: color }}
						/>
					)
				}
				placeholder="donat_form_amount"
				modificator={clsx('inputs-amount', { isNotValid })}
				addonsModificator="select-blockchain"
				descriptionModificator="count-modificator"
				descriptionInput={
					<>
						<TabsComponent
							setTabContent={setTabContent}
							activeKey={String(tabCount)}
							tabs={countTabs}
						/>
						<p className="usd-equal">
							<FormattedMessage id="donat_form_equal_usd" values={{ convertedUsdSum }} />
						</p>
					</>
				}
			/>
		</div>
	)
}

export default memo(AmountInput)
