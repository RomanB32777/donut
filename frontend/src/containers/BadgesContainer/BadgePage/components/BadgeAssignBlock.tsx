import { useContext, useEffect, useMemo, useState } from "react";
import { Col, Row, StepProps, Steps, StepsProps } from "antd";
import { CheckOutlined, LoadingOutlined } from "@ant-design/icons";
import { IBadgeInfo, IShortUserData } from "types";

import BaseButton from "components/BaseButton";
import SelectInput from "components/SelectInput";
import ModalComponent, {
  SuccessModalComponent,
} from "components/ModalComponent";

import { WalletContext } from "contexts/Wallet";
import useWindowDimensions from "hooks/useWindowDimensions";
import axiosClient from "modules/axiosClient";
import { addNotification, delay } from "utils";

const initLoadingSteps: StepProps[] = [
  {
    status: "wait",
    title: "Pay minting cost",
  },
  {
    status: "wait",
    title: "Wait for the badge to be minted",
  },
  {
    status: "wait",
    title: "Verification",
  },
];

const customDot: StepsProps["progressDot"] = (dot, { status }) => {
  if (status === "finish")
    return (
      <CheckOutlined
        style={{
          color: "#25EC39",
          position: "absolute",
          right: "-11px",
          top: "-10px",
          fontSize: 25,
        }}
      />
    );
  if (status === "process")
    return (
      <LoadingOutlined
        style={{
          color: "#E94560",
          position: "absolute",
          right: "-11px",
          top: "-5px",
          fontSize: 25,
        }}
      />
    );
  return dot;
};

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
  const walletConf = useContext(WalletContext);
  const { isTablet } = useWindowDimensions();

  const [loading, setLoading] = useState(false);
  const [loadingSteps, setLoadingSteps] =
    useState<StepProps[]>(initLoadingSteps);

  const [selectedUser, setSelectedUser] = useState("");
  const [isOpenSuccessModal, setIsOpenSuccessModal] = useState(false);

  const loadHolders = async () => {
    setLoading(true);
    await getSupporters();
    setLoading(false);
  };

  const setLoadingCurrStep = ({
    loadingStep,
    finishedStep,
  }: {
    loadingStep?: number;
    finishedStep?: number;
  }) => {
    if (loadingStep === 0) {
      setLoadingSteps([
        {
          status: "process",
          title: "Pay minting cost",
        },
        ...loadingSteps.slice(1, 3),
      ]);
    } else if (finishedStep === 0 && loadingStep === 1) {
      setLoadingSteps((prev) => [
        {
          status: "finish",
          title: "Pay minting cost",
        },
        {
          status: "process",
          title: "Wait for the badge to be minted",
        },
        ...prev.slice(2, 3),
      ]);
    } else if (finishedStep === 1 && loadingStep === 2) {
      setLoadingSteps((prev) => [
        ...prev.slice(0, 1),
        {
          status: "finish",
          title: "Wait for the badge to be minted",
        },
        {
          status: "process",
          title: "Verification",
        },
      ]);
    } else if (finishedStep === 2) {
      setLoadingSteps((prev) => [
        ...prev.slice(0, 2),
        {
          status: "finish",
          title: "Verification",
        },
      ]);
    }
  };

  const closeSuccessModal = () => () => setIsOpenSuccessModal(false);

  const assignBadge = async () => {
    try {
      setLoadingCurrStep({ loadingStep: 0 });
      const { id, token_id } = badgeInfo;

      const selectedUserObj = supporters.find(
        (s) => s.wallet_address === selectedUser
      );

      if (selectedUserObj) {
        const priceRes = await axiosClient.get(
          `/api/badge/price?address=${selectedUser}&token_id=${
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
            setLoadingCurrStep({ finishedStep: 0, loadingStep: 1 });
            const { status } = await axiosClient.post(
              "/api/badge/assign-badge",
              {
                id,
                supporter: selectedUser,
                token_id: token_id || null,
              }
            );

            if (status === 200) {
              setLoadingCurrStep({ finishedStep: 1, loadingStep: 2 });
              await delay({
                ms: 2000,
                cb: () => setLoadingCurrStep({ finishedStep: 2 }),
              });
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
      setLoadingSteps(initLoadingSteps);
    }
  };

  const isAssignLoading = useMemo(
    () => loadingSteps.some(({ status }) => status === "process"),
    [loadingSteps]
  );

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
      <ModalComponent
        open={isAssignLoading}
        title="Follow steps"
        closable={false}
        width={550}
        centered={Boolean(isTablet)}
      >
        <div className="goals-modal">
          <Row gutter={[0, 18]} className="goals-modal__form" justify="center">
            <Col span={24}>
              <Steps
                direction="vertical"
                progressDot={customDot}
                items={loadingSteps.map(({ title, status }) => ({
                  title,
                  status,
                }))}
              />
            </Col>
          </Row>
        </div>
      </ModalComponent>
      <SuccessModalComponent
        open={isOpenSuccessModal}
        onClose={closeSuccessModal()}
        message={`Badge has been assigned successfully!`}
      />
    </>
  );
};

export default BadgeAssignBlock;
