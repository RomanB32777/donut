import { useContext, useEffect, useState } from "react";
import { IBadgeInfo, IShortUserData } from "types";

import BaseButton from "components/BaseButton";
import SelectInput from "components/SelectInput";
import {
  LoadingModalComponent,
  SuccessModalComponent,
} from "components/ModalComponent";
import { WalletContext } from "contexts/Wallet";
import useWindowDimensions from "hooks/useWindowDimensions";
import axiosClient from "modules/axiosClient";
import { addNotification } from "utils";

const BadgeAssignBlock = ({
  badgeInfo,
  supporters,
  getSupporters,
  sendAssignedBadge,
}: {
  badgeInfo: IBadgeInfo;
  supporters: IShortUserData[];
  getSupporters: () => Promise<void>;
  sendAssignedBadge: (selectedUser: IShortUserData) => Promise<void>;
}) => {
  const { isTablet } = useWindowDimensions();
  const walletConf = useContext(WalletContext);

  const [loading, setLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState("");
  const [isOpenSuccessModal, setIsOpenSuccessModal] = useState(false);

  const loadHolders = async () => {
    setLoading(true);
    await getSupporters();
    setLoading(false);
  };

  const closeSuccessModal = () => () => setIsOpenSuccessModal(false);

  const assignBadge = async () => {
    try {
      setAssignLoading(true);
      const { id, token_id } = badgeInfo;

      const selectedUserObj = supporters.find(
        (s) => s.wallet_address === selectedUser
      );

      if (selectedUserObj) {
        const priceRes = await axiosClient.get(
          `/api/badge/price?address=${selectedUser}&quantity=1&token_id=${
            token_id || null
          }`
        );
        if (priceRes.status === 200) {
          const { price } = priceRes.data;
          const paymentRes =
            await walletConf.commission_contract_methods.payForBadgeCreation(
              price
            );

          if (paymentRes && paymentRes?.status === 1) {
            const { status } = await axiosClient.post(
              "/api/badge/assign-badge",
              {
                id,
                supporter: selectedUser,
                token_id: token_id || null,
              }
            );

            if (status === 200) {
              await sendAssignedBadge(selectedUserObj);
              setIsOpenSuccessModal(true);
              setSelectedUser("");
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
      const errorMessage = (error as Error).message;
      errorMessage &&
        addNotification({
          type: "danger",
          title: errorMessage,
        });
    } finally {
      setAssignLoading(false);
    }
  };

  useEffect(() => {
    loadHolders();
  }, []);

  return (
    <>
      <div className="form-element">
        <SelectInput
          label="Assign badge"
          list={supporters.map((s) => ({
            key: s.wallet_address,
            value: s.username,
          }))}
          value={selectedUser}
          onChange={(selected) => setSelectedUser(selected)}
          labelCol={24}
          selectCol={24}
          placeholder="Choose supporter"
          labelModificator="select_label"
          disabled={loading}
        />
      </div>
      <div className="btn-bottom">
        <BaseButton
          title="Assign"
          padding="7px 30px"
          onClick={assignBadge}
          fontSize={isTablet ? "14px" : "20px"}
          disabled={loading || !selectedUser}
          isMain
        />
      </div>
      <LoadingModalComponent
        open={assignLoading}
        message="Please sign the transaction in your wallet and wait for the confirmation. Don't close this window"
      />
      <SuccessModalComponent
        open={isOpenSuccessModal}
        onClose={closeSuccessModal()}
        message={`Badge has been assigned successfully!`}
      />
    </>
  );
};

export default BadgeAssignBlock;
