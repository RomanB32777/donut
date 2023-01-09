import { useContext, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { ISendDonat } from "types";

import { WalletContext } from "contexts/Wallet";
import FormInput from "components/FormInput";
import SelectComponent from "components/SelectComponent";
import { TabsComponent } from "components/TabsComponent";
import { setSelectedBlockchain } from "store/types/Wallet";
import { getUsdKoef } from "utils";
import { useAppSelector } from "hooks/reduxHooks";
import { IBlockchain } from "appTypes";

const tabCountTypes = [5, 10, 15];

const AmountInput = ({
  form,
  usdtKoef,
  setForm,
  setUsdtKoef,
}: {
  form: ISendDonat;
  usdtKoef: number;
  setForm: (value: React.SetStateAction<ISendDonat>) => void;
  setUsdtKoef: (num: number) => void;
}) => {
  const dispatch = useDispatch();
  const blockchain = useAppSelector(({ blockchain }) => blockchain);
  const { walletConf } = useContext(WalletContext);

  const [tabCount, setTabCount] = useState(""); // String(tabCountTypes[0])

  const { amount, selectedBlockchain } = form;

  const setBlockchainInfo = async ({
    selected,
    blockchainInfo,
  }: {
    selected: string;
    blockchainInfo: IBlockchain;
  }) => {
    setForm((form) => ({
      ...form,
      selectedBlockchain: selected,
    }));
    dispatch(setSelectedBlockchain(blockchainInfo.name));
    await getUsdKoef(blockchainInfo.nativeCurrency.exchangeName, setUsdtKoef);
  };

  const setBlockchain = async (selected: string) => {
    const blockchainInfo = walletConf.blockchains.find(
      (b) => b.nativeCurrency.symbol === selected
    );
    if (blockchainInfo) {
      const newBlockchaind = await walletConf.changeBlockchain(
        blockchainInfo.name
      );
      if (newBlockchaind) await setBlockchainInfo({ blockchainInfo, selected });
    }
  };

  const selectedBlockchainIconInfo = useMemo(() => {
    const info = walletConf.blockchains.find(
      (b) => b.nativeCurrency.symbol === selectedBlockchain
    );
    if (info)
      return {
        icon: info.icon,
        color: info.color,
      };
  }, [selectedBlockchain]);

  const countTabs = useMemo(
    () =>
      tabCountTypes.map((tab) => ({
        key: String(tab),
        label: `${tab} ${selectedBlockchain}`,
      })),
    [selectedBlockchain]
  );

  useEffect(() => {
    const setInitSelectedBlockchain = async () => {
      const currBlockchain = await walletConf.getCurrentBlockchain();
      if (currBlockchain) {
        setForm((form) => ({
          ...form,
          selectedBlockchain: currBlockchain.nativeCurrency.symbol,
        }));
        await getUsdKoef(
          currBlockchain.nativeCurrency.exchangeName,
          setUsdtKoef
        );
      }
    };

    setInitSelectedBlockchain();
  }, [walletConf]);

  useEffect(() => {
    if (blockchain) {
      const blockchainInfo = walletConf.blockchains.find(
        (b) => b.name === blockchain
      );
      if (blockchainInfo)
        setBlockchainInfo({
          selected: blockchainInfo.nativeCurrency.symbol,
          blockchainInfo,
        });
    }
  }, [walletConf, blockchain]);

  return (
    <div className="item">
      <FormInput
        value={String(amount)}
        setValue={(num) => {
          setForm((form) => ({
            ...form,
            amount: +num,
          }));
        }}
        // disabled={loading}
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
            list={walletConf.blockchains.map(
              ({ nativeCurrency }) => nativeCurrency.symbol
            )}
            selected={selectedBlockchain}
            selectItem={setBlockchain}
            modificator="inputs-select"
          />
        }
        addonsModificator="select-blockchain"
        modificator="inputs-amount"
        placeholder="Donation amount"
        descriptionInput={
          <>
            <TabsComponent
              setTabContent={(key) => {
                setTabCount(key);
                setForm((form) => ({
                  ...form,
                  amount: +key,
                }));
              }}
              activeKey={tabCount}
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
