import {
  FC,
  memo,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import dayjsModule from "modules/dayjsModule";

import { AppContext } from "contexts/AppContext";
import useOnClickOutside from "hooks/useClickOutside";
import { dayLocales, localeFlags } from "consts";
import { LOCALES } from "appTypes";

import "./styles.sass";

interface ILocalesSwitcher {
  modificator?: string;
  blockModificator?: string;
}

const LocalesSwitcher: FC<ILocalesSwitcher> = ({
  modificator,
  blockModificator,
}) => {
  const blockRef = useRef(null);
  const { locale, handleLocale } = useContext(AppContext);

  const [isOpenSelect, setOpenSelect] = useState(false);
  const [selectedLocale, setSelectedLocale] = useState<LOCALES>(LOCALES.EN);

  const handlerPopup = () => setOpenSelect((prev) => !prev);

  const blockchainHandler = (selectedLocale: LOCALES) => () => {
    setSelectedLocale(selectedLocale);
    handleLocale(selectedLocale);
    handlerPopup();
  };

  useOnClickOutside(isOpenSelect, blockRef, handlerPopup);

  const selectedLocaleSymbol = useMemo(() => {
    const findedLocale = Object.entries(LOCALES).find(
      ([key, value]) => value === selectedLocale
    );
    if (findedLocale) return findedLocale[0];
    return "";
  }, [selectedLocale]);

  const loadLocale = (language: LOCALES) => {
    dayLocales[language]().then(() => dayjsModule.locale(language));
  };

  useEffect(() => {
    setSelectedLocale(locale);
    loadLocale(locale);
  }, [locale]);

  return (
    <div className={clsx("localeWrapper", modificator)}>
      <div
        ref={blockRef}
        className={clsx("localeBlock", blockModificator)}
        onClick={handlerPopup}
      >
        <div className="localeIcon">
          <img src={localeFlags[selectedLocale]} alt="locale-icon" />
        </div>
        <p className="localeName">{selectedLocaleSymbol}</p>
      </div>
      {Boolean(isOpenSelect) && (
        <div className="popup fadeIn">
          {Object.entries(LOCALES)
            .filter(([key, value]) => value !== selectedLocale)
            .map(([key, value]) => {
              const localeKey = value as LOCALES;
              return (
                <div
                  key={value}
                  className="item"
                  onClick={blockchainHandler(localeKey)}
                >
                  <div className="content">
                    <div className="image">
                      <img src={localeFlags[localeKey]} alt={`icon_${value}`} />
                    </div>
                    <span className="title">{key}</span>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default memo(LocalesSwitcher);
