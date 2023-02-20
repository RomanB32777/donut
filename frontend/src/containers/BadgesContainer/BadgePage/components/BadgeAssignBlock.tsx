import { memo, useMemo, useState } from "react";
import { StepProps } from "antd";
import { IBadgeInfo, IShortUserData } from "types";

import BaseButton from "components/BaseButton";
import SelectInput from "components/SelectInput";
import {
  LoadingModalComponent,
  SuccessModalComponent,
} from "components/ModalComponent";

import useWindowDimensions from "hooks/useWindowDimensions";
import { useLazyGetNotificationsQuery } from "store/services/NotificationsService";
import { useGetSupportersQuery } from "store/services/DonationsService";
import { useAssignBadgeMutation } from "store/services/BadgesService";
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
  sendAssignedBadge,
}: {
  badgeInfo: IBadgeInfo;
  sendAssignedBadge: (selectedUser: IShortUserData) => Promise<void>;
}) => {
  const { id: userID } = useAppSelector(({ user }) => user);
  const [getNotifications] = useLazyGetNotificationsQuery();
  const [assignBadge] = useAssignBadgeMutation();
  // const [getAssignPrice] = useLazyGetAssignPriceQuery();
  const { data: supporters, isLoading } = useGetSupportersQuery(userID, {
    skip: !badgeInfo.is_creator,
  });
  const { isTablet } = useWindowDimensions();

  const [loadingSteps, setLoadingSteps] =
    useState<StepProps[]>(initLoadingSteps);
  const [selectedUser, setSelectedUser] = useState<IShortUserData | null>(null);
  const [isOpenSuccessModal, setIsOpenSuccessModal] = useState(false);

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

  const assignCurrentBadge = async () => {
    if (!selectedUser) return;
    try {
      setLoadingCurrStep({ loadingStep: 0 });
      const { id, token_id } = badgeInfo;

      const selectedUserObj = supporters?.find(
        (s) => s.wallet_address === selectedUser.wallet_address
      );

      if (selectedUserObj) {
        // const { data: priceRes } = await getAssignPrice({
        //   wallet_address: selectedUserObj.wallet_address,
        //   token_id,
        // });

        // if (priceRes) {
        //   const paymentRes =
        //     await walletConf.commission_contract_methods.payForBadgeCreation(
        //       priceRes
        //     );
        // if (paymentRes && paymentRes?.status === 1) {
        // setLoadingCurrStep({ finishedStep: 0, loadingStep: 1 });
        const assignData = await assignBadge({
          badgeID: id,
          supporter_wallet_address: selectedUserObj.wallet_address,
          token_id,
        }).unwrap();

        if (assignData) {
          // setLoadingCurrStep({ finishedStep: 1, loadingStep: 2 });
          // await delay({
          //   ms: 2000,
          //   cb: () => setLoadingCurrStep({ finishedStep: 2 }),
          // });
          await sendAssignedBadge(selectedUserObj);

          setLoadingCurrStep({ finishedStep: 0 });
          await getNotifications({ user: userID, shouldUpdateApp: false });
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

  if (!supporters) return null;

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
          disabled={isLoading}
        />
      </div>
      <div className="btn-bottom">
        <BaseButton
          title="Assign"
          padding="7px 30px"
          onClick={assignCurrentBadge}
          fontSize={isTablet ? "14px" : "20px"}
          disabled={isLoading || !selectedUser}
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

export default memo(BadgeAssignBlock);
