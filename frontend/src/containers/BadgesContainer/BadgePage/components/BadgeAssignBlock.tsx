import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { StepProps } from "antd";
import { IBadgeInfo, IShortUserData } from "types";

import BaseButton from "components/BaseButton";
import SelectInput from "components/SelectInput";
import {
  LoadingModalComponent,
  SuccessModalComponent,
} from "components/ModalComponent";

import useWindowDimensions from "hooks/useWindowDimensions";
import { getNotifications } from "store/types/Notifications";
import axiosClient from "modules/axiosClient";
import { addNotification } from "utils";
import { ProviderRpcError } from "appTypes";
import { useAppSelector } from "hooks/reduxHooks";
import { shortUserInfo } from "consts";

const initLoadingSteps: StepProps[] = [
  // {
  //   status: "wait",
  //   title: "Pay minting cost",
  // },
  {
    status: "wait",
    title: "Wait for the badge to be minted",
  },
  {
    status: "wait",
    title: "Verification",
  },
];

// const customDot: StepsProps["progressDot"] = (dot, { status }) => {
//   if (status === "finish")
//     return (
//       <CheckOutlined
//         style={{
//           color: "#25EC39",
//           position: "absolute",
//           right: "-11px",
//           top: "-10px",
//           fontSize: 25,
//         }}
//       />
//     );
//   if (status === "process")
//     return (
//       <LoadingOutlined
//         style={{
//           color: "#E94560",
//           position: "absolute",
//           right: "-11px",
//           top: "-5px",
//           fontSize: 25,
//         }}
//       />
//     );
//   return dot;
// };

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
  const dispatch = useDispatch();
  const { id: userID } = useAppSelector(({ user }) => user);
  const { isTablet } = useWindowDimensions();

  const [loading, setLoading] = useState(false);
  const [loadingSteps, setLoadingSteps] =
    useState<StepProps[]>(initLoadingSteps);

  const [selectedUser, setSelectedUser] = useState<IShortUserData | null>(null);
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
    setLoadingSteps((steps) =>
      steps.map((step, index) => {
        if (index === loadingStep) return { ...step, status: "process" };
        if (index === finishedStep) return { ...step, status: "finish" };
        return step;
      })
    );
  };

  const closeSuccessModal = () => {
    setIsOpenSuccessModal(false);
    setSelectedUser(shortUserInfo);
  };

  const selectHandler = (selected: string, option: any) => {
    setSelectedUser({
      ...shortUserInfo,
      wallet_address: selected,
      username: option.title,
    });
  };

  const assignBadge = async () => {
    if (!selectedUser) return;
    try {
      setLoadingCurrStep({ loadingStep: 0 });
      const { id, token_id } = badgeInfo;

      const selectedUserObj = supporters.find(
        (s) => s.wallet_address === selectedUser.wallet_address
      );

      if (selectedUserObj) {
        // const priceRes = await axiosClient.get(
        //   `/api/badge/price?address=${selectedUserObj.wallet_address}&token_id=${
        //     token_id || null
        //   }`
        // );
        // if (priceRes.status === 200) {
        // const { price } = priceRes.data;
        // const paymentRes =
        //   await walletConf.commission_contract_methods.payForBadgeCreation(
        //     price
        //   );

        // if (paymentRes && paymentRes?.status === 1) {
        // setLoadingCurrStep({ finishedStep: 0, loadingStep: 1 });
        const { status } = await axiosClient.post("/api/badge/assign-badge", {
          id,
          supporter: selectedUserObj.wallet_address,
          token_id: token_id || null,
        });

        if (status === 200) {
          // setLoadingCurrStep({ finishedStep: 1, loadingStep: 2 });
          // await delay({
          //   ms: 2000,
          //   cb: () => setLoadingCurrStep({ finishedStep: 2 }),
          // });
          await sendAssignedBadge(selectedUserObj);

          setLoadingCurrStep({ finishedStep: 0 });
          dispatch(getNotifications({ user: userID, shouldUpdateApp: false }));
          setIsOpenSuccessModal(true);
        }
        // }
        // }
      }
    } catch (error) {
      const errorMessage = error as ProviderRpcError;

      errorMessage.code !== "ACTION_REJECTED" &&
        addNotification({
          type: "danger",
          title: "Error",
          message:
            errorMessage.reason ||
            (error as any)?.response?.data?.message ||
            (error as Error).message ||
            `An error occurred while sending data`,
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
          value={selectedUser?.wallet_address}
          onChange={selectHandler}
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
      {/* <ModalComponent
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
      </ModalComponent> */}
      <LoadingModalComponent
        open={isAssignLoading}
        message={`Wait for the badge to be minted on ${selectedUser?.username} address`}
        centered
      />
      <SuccessModalComponent
        open={isOpenSuccessModal}
        onClose={closeSuccessModal}
        message={`Congratulations! You've successfully assigned the badge to ${selectedUser?.username}`}
      />
    </>
  );
};

export default BadgeAssignBlock;
