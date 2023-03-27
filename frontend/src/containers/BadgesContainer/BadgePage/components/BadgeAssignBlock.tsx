import { memo, useMemo, useState } from "react";
import { StepProps } from "antd";
import { FormattedMessage } from "react-intl";
import { RpcError } from "wagmi";
import { IShortUserData } from "types";

import BaseButton from "components/BaseButton";
import SelectInput from "components/SelectInput";
import {
  LoadingModalComponent,
  SuccessModalComponent,
} from "components/ModalComponent";

import useWindowDimensions from "hooks/useWindowDimensions";
import { useAppSelector } from "hooks/reduxHooks";
import { useLazyGetNotificationsQuery } from "store/services/NotificationsService";
import { useGetSupportersQuery } from "store/services/DonationsService";
import { useAssignBadgeMutation } from "store/services/BadgesService";
import { addNotification } from "utils";
import { shortUserInfo } from "consts";
import { IBadgePage, IError } from "appTypes";

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
  badgeInfo: IBadgePage;
  sendAssignedBadge: (selectedUser: IShortUserData) => Promise<void>;
}) => {
  const { username } = useAppSelector(({ user }) => user);
  const [getNotifications] = useLazyGetNotificationsQuery();
  const [assignBadge] = useAssignBadgeMutation();
  // const [getAssignPrice] = useLazyGetAssignPriceQuery();
  const { data: supporters, isLoading } = useGetSupportersQuery();
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
      walletAddress: selected,
      username: option.title,
    });
  };

  const assignCurrentBadge = async () => {
    if (!selectedUser) return;
    try {
      setLoadingCurrStep({ loadingStep: 0 });
      const { id, tokenId } = badgeInfo;

      const selectedUserObj = supporters?.find(
        (s) => s.walletAddress === selectedUser.walletAddress
      );

      if (selectedUserObj) {
        // const { data: priceRes } = await getAssignPrice({
        //   walletAddress: selectedUserObj.walletAddress,
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
          id,
          userAddress: selectedUserObj.walletAddress,
          tokenId,
        }).unwrap();

        if (assignData) {
          // setLoadingCurrStep({ finishedStep: 1, loadingStep: 2 });
          // await delay({
          //   ms: 2000,
          //   cb: () => setLoadingCurrStep({ finishedStep: 2 }),
          // });
          await sendAssignedBadge(selectedUserObj);

          setLoadingCurrStep({ finishedStep: 0 });
          await getNotifications({ username, shouldUpdateApp: false });
          setIsOpenSuccessModal(true);
        }
        // }
        // }
      }
    } catch (error) {
      const errInfo = error as RpcError<IError>;
      if (errInfo.code !== 4001 && errInfo?.data?.statusCode !== 500) {
        addNotification({
          type: "danger",
          title: "Error",
          message:
            errInfo.message ||
            errInfo?.data?.message ||
            "An error occurred while sending data",
        });
      }
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
          label={<FormattedMessage id="badge_assign_label" />}
          list={supporters.map((s) => ({
            key: s.walletAddress,
            value: s.username,
          }))}
          value={selectedUser?.walletAddress || ""}
          onChange={selectHandler}
          labelCol={24}
          selectCol={24}
          placeholder={<FormattedMessage id="badge_assign_placeholder" />}
          labelModificator="select_label"
          disabled={isLoading}
        />
      </div>
      <div className="btn-bottom">
        <BaseButton
          formatId="badge_assign_button"
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
        message={
          <FormattedMessage
            id="badge_assign_loading"
            values={{ username: selectedUser?.username }}
          />
        }
        centered
      />
      <SuccessModalComponent
        open={isOpenSuccessModal}
        onClose={closeSuccessModal}
        message={
          <FormattedMessage
            id="badge_assign_success"
            values={{ username: selectedUser?.username }}
          />
        }
      />
    </>
  );
};

export default memo(BadgeAssignBlock);
