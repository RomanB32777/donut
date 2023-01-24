import { useContext, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { blockchainsSymbols, ISendDonat } from "types";

import { WalletContext } from "contexts/Wallet";
import FormInput from "components/FormInput";
import SelectComponent from "components/SelectComponent";
import { TabsComponent } from "components/TabsComponent";
import { setSelectedBlockchain } from "store/types/Wallet";
import { getUsdKoef } from "utils";
import { useAppSelector } from "hooks/reduxHooks";
import { IBlockchain } from "appTypes";
import { BlockchainOption } from "components/SelectInput/options/BlockchainOption";

const tabCountTypes = [5, 10, 30];

const AmountInput = ({
  form,
  color,
  usdtKoef,
  setForm,
  setUsdtKoef,
}: {
  color: string;
  form: ISendDonat;
  usdtKoef: number;
  setForm: (value: React.SetStateAction<ISendDonat>) => void;
  setUsdtKoef: (num: number) => void;
}) => {
  const dispatch = useDispatch();
  const blockchain = useAppSelector(({ blockchain }) => blockchain);
  const walletConf = useContext(WalletContext);

  const [tabCount, setTabCount] = useState<number | null>(null); // String(tabCountTypes[0])

  const { amount, selectedBlockchain } = form;

  const setBlockchainInfo = async ({
    selected,
    blockchainInfo,
  }: {
    selected: blockchainsSymbols;
    blockchainInfo: IBlockchain;
  }) => {
    setForm((form) => ({
      ...form,
      selectedBlockchain: selected,
    }));
    dispatch(setSelectedBlockchain(blockchainInfo.name));
    await getUsdKoef(blockchainInfo.nativeCurrency.exchangeName, setUsdtKoef);
  };

  const setAmountValue = (num: string) => {
    const amountValue = +num;
    setForm((form) => ({
      ...form,
      amount: amountValue,
    }));
    setTabCount(tabCountTypes.includes(amountValue) ? amountValue : null);
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

  const setTabContent = (key: string) => {
    setTabCount(+key);
    setForm((form) => ({
      ...form,
      amount: +key,
    }));
  };

  const selectedBlockchainIconInfo = useMemo(() => {
    const info = walletConf.main_contract.blockchains.find(
      (b) => b.nativeCurrency.symbol === selectedBlockchain
    );
    return info;
  }, [walletConf, selectedBlockchain]);

  const countTabs = useMemo(
    () =>
      tabCountTypes.map((tab) => ({
        key: String(tab),
        label: `${tab} ${selectedBlockchain}`,
      })),
    [selectedBlockchain]
  );

  useEffect(() => {
    if (blockchain) {
      const blockchainInfo = walletConf.main_contract.blockchains.find(
        (b) => b.name === blockchain
      );
      if (blockchainInfo) {
        const blockchainSymbol = blockchainInfo.nativeCurrency.symbol;
        setForm((form) => ({
          ...form,
          selectedBlockchain: blockchainSymbol,
        }));
        setBlockchainInfo({
          selected: blockchainSymbol,
          blockchainInfo,
        });
      }
    }
  }, [walletConf, blockchain]);

  return (
    <div className="item">
      <FormInput
        value={String(amount)}
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
        addonsModificator="select-blockchain"
        modificator="inputs-amount"
        placeholder="Donation amount"
        descriptionInput={
          <>
            <TabsComponent
              setTabContent={setTabContent}
              activeKey={String(tabCount)}
              tabs={countTabs}
            />
            <p className="usd-equal">
              Equal to&nbsp;
              {parseFloat(String(+amount * usdtKoef)).toFixed(1)}
              &nbsp;USD
            </p>
          </>
        }
        descriptionModificator="count-modificator"
      />
    </div>
  );
};

export default AmountInput;
