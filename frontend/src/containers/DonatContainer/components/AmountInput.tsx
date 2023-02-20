import {
  FC,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import clsx from "clsx";
import { blockchainsSymbols, ISendDonat } from "types";

import { WalletContext } from "contexts/Wallet";
import FormInput from "components/FormInput";
import SelectComponent from "components/SelectComponent";
import TabsComponent from "components/TabsComponent";
import BlockchainOption from "components/SelectInput/options/BlockchainOption";

import { useActions, useAppSelector } from "hooks/reduxHooks";
import { useLazyGetUsdKoefQuery } from "store/services/DonationsService";
import { formatNumber } from "utils";
import { IBlockchain } from "appTypes";
import { IFormHandler } from "../types";

const tabCountTypes = [5, 10, 30];

const countTabs = tabCountTypes.map((tab) => ({
  key: String(tab),
  label: `${tab} USD`,
}));

interface IAmountInput {
  color: string;
  form: ISendDonat;
  usdtKoef: number;
  isNotValid: boolean;
  formHandler: ({ field, value }: IFormHandler) => void;
  setUsdtKoef: (num: number) => void;
}

const AmountInput: FC<IAmountInput> = ({
  form,
  color,
  usdtKoef,
  isNotValid,
  formHandler,
  setUsdtKoef,
}) => {
  const { setWallet } = useActions();
  const [getUsdKoef] = useLazyGetUsdKoefQuery();
  const blockchain = useAppSelector(({ blockchain }) => blockchain);
  const walletConf = useContext(WalletContext);

  const [tabCount, setTabCount] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");

  const { amount, selectedBlockchain } = form;

  const setBlockchainInfo = async ({
    selected,
    blockchainInfo,
  }: {
    selected: blockchainsSymbols;
    blockchainInfo: IBlockchain;
  }) => {
    formHandler({ field: "selectedBlockchain", value: selected });
    setWallet(blockchainInfo.name);
    const { data: newUsdtKoef } = await getUsdKoef(
      blockchainInfo.nativeCurrency.exchangeName
    );

    if (newUsdtKoef) {
      setUsdtKoef(newUsdtKoef);

      if (tabCount) {
        const blockchainValue = tabCount / newUsdtKoef;
        formHandler({ field: "amount", value: blockchainValue });
        setInputValue(String(formatNumber(blockchainValue)));
      }
    }
  };

  const setAmountValue = (num: string) => {
    // const filteredSymbols = ["+", "-", "e"];
    // const numericPattern = /^([0-9]+(\.*[0-9]*)?|\.[0-9]+)$/;
    // console.log(num, numericPattern.test(num));
    // if (!numericPattern.test(num)) return;

    const amountValue = +num;
    setInputValue(num);
    formHandler({ field: "amount", value: amountValue });
    // setTabCount(null);
  };

  const setBlockchain = async (selected: blockchainsSymbols) => {
    const blockchainInfo = walletConf.main_contract.blockchains.find(
      (b) => b.nativeCurrency.symbol === selected
    );
    if (blockchainInfo) {
      const newBlockchaind = await walletConf.changeBlockchain(
        blockchainInfo.name
      );
      if (newBlockchaind) await setBlockchainInfo({ blockchainInfo, selected });
    }
  };

  const setTabContent = useCallback(
    async (key: string) => {
      const blockchainInfo = walletConf.main_contract.blockchains.find(
        (b) => b.nativeCurrency.symbol === selectedBlockchain
      );

      if (blockchainInfo) {
        const numberFormat = +key;
        const blockchainValue = numberFormat / usdtKoef;

        setTabCount(numberFormat);
        formHandler({ field: "amount", value: blockchainValue });
        setInputValue(String(formatNumber(blockchainValue)));
      }
    },
    [walletConf, usdtKoef, selectedBlockchain, formHandler]
  );

  const convertedUsdSum = useMemo(
    () => formatNumber(+amount * usdtKoef),
    [amount, usdtKoef]
  );

  const selectedBlockchainIconInfo = useMemo(() => {
    const info = walletConf.main_contract.blockchains.find(
      (b) => b.nativeCurrency.symbol === selectedBlockchain
    );
    return info;
  }, [walletConf, selectedBlockchain]);

  useEffect(() => {
    if (blockchain) {
      const blockchainInfo = walletConf.main_contract.blockchains.find(
        (b) => b.name === blockchain
      );
      if (blockchainInfo) {
        const blockchainSymbol = blockchainInfo.nativeCurrency.symbol;
        formHandler({ field: "selectedBlockchain", value: blockchainSymbol });
        setBlockchainInfo({
          selected: blockchainSymbol,
          blockchainInfo,
        });
      }
    }
  }, [walletConf, blockchain]);

  useEffect(() => {
    const value = +convertedUsdSum;
    setTabCount(tabCountTypes.includes(value) ? value : null);
  }, [convertedUsdSum]);

  return (
    <div className="item">
      <FormInput
        value={inputValue}
        setValue={setAmountValue}
        typeInput="number"
        addonAfter={
          <SelectComponent
            title={
              <div className="selected-blockchain">
                {selectedBlockchainIconInfo && (
                  <div
                    className="blockchain-icon"
                    style={{
                      background: selectedBlockchainIconInfo.color,
                    }}
                  >
                    <img
                      src={selectedBlockchainIconInfo.icon}
                      alt={selectedBlockchain}
                    />
                  </div>
                )}
                <span>{selectedBlockchain}</span>
              </div>
            }
            list={walletConf.main_contract.blockchains.map(
              ({ name, nativeCurrency }) => nativeCurrency.symbol
            )}
            selected={selectedBlockchain}
            selectItem={setBlockchain}
            renderOption={(item) => (
              <BlockchainOption value={item} key={item} />
            )}
            listWrapperModificator="blockchains-list"
            modificator="inputs-select"
            styles={{ background: color }}
          />
        }
        placeholder="Donation amount"
        modificator={clsx("inputs-amount", { isNotValid })}
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
              Equal to&nbsp;
              {convertedUsdSum}
              &nbsp;USD
            </p>
          </>
        }
      />
    </div>
  );
};

export default memo(AmountInput);
