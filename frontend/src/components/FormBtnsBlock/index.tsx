import BaseButton from "components/BaseButton";
import ConfirmPopup from "components/ConfirmPopup";
import "./styles.sass";

const FormBtnsBlock = ({
  saveMethod,
  resetMethod,
  disabled,
}: {
  saveMethod: () => Promise<any>;
  resetMethod: () => Promise<any>;
  disabled: boolean;
}) => {
  return (
    <div className="form-btns">
      <BaseButton
        formatId="save_changes_button"
        padding="6px 25px"
        onClick={saveMethod}
        fontSize="18px"
        disabled={disabled}
        isMain
      />
      <ConfirmPopup confirm={resetMethod} title="confirm_reset">
        <BaseButton
          formatId="reset_changes_button"
          padding="6px 35px"
          fontSize="18px"
          modificator="reset-btn"
          disabled={disabled}
          isBlack
        />
      </ConfirmPopup>
    </div>
  );
};

export default FormBtnsBlock;
