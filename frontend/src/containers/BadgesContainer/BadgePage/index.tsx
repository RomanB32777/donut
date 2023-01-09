import { Avatar, Col, Divider, Row, Tooltip } from "antd";
import { useContext, useEffect, useState } from "react";
import clsx from "clsx";
import { IMintBadgeSocketObj } from "types";

import { WalletContext } from "contexts/Wallet";
import { WebSocketContext } from "components/Websocket";
import BaseButton from "components/BaseButton";
import UploadImage from "components/UploadImage";
import LinkCopy from "components/LinkCopy";
import SelectInput from "components/SelectInput";
import axiosClient, { baseURL } from "modules/axiosClient";
import {
  LoadingModalComponent,
  SuccessModalComponent,
} from "components/ModalComponent";
import ConfirmPopup from "components/ConfirmPopup";
import { LeftArrowIcon } from "icons";

import { useAppSelector } from "hooks/reduxHooks";
import useWindowDimensions from "hooks/useWindowDimensions";
import { addErrorNotification } from "utils";
import { initBadgeData } from "consts";
import { IBadge } from "appTypes";

const BadgePage = ({
  activeBadge,
  backBtn,
  deleteBadge,
}: {
  activeBadge: IBadge;
  backBtn: () => void;
  deleteBadge: (badge: IBadge) => Promise<boolean | undefined>;
}) => {
  const { isTablet } = useWindowDimensions();
  const { id, wallet_address, username, roleplay } = useAppSelector(
    ({ user }) => user
  );

  const { walletConf } = useContext(WalletContext);
  const socket = useContext(WebSocketContext);

  const [formBadge, setFormBadge] = useState<IBadge>({
    ...initBadgeData,
    ...activeBadge,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [isOpenSuccessModal, setIsOpenSuccessModal] = useState<boolean>(false);
  const [supporters, setSupporters] = useState<any[]>([]);
  const [holders, setHolders] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");

  const updateBadgeNFTData = async (badge: IBadge) => {
    try {
      const { contract_address, creator_id } = badge;

      const quantity = await walletConf.getQuantityBalance({
        contract_address,
        supporter_address: wallet_address,
        isCreator: id === creator_id,
      });

      quantity &&
        setFormBadge({
          ...formBadge,
          quantity, // : quantityBadge.toNumber()
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getHolders = async (activeBadge: IBadge) => {
    try {
      const { id, contract_address } = activeBadge;
      const { data } = await axiosClient.get(
        `${baseURL}/api/badge/holders/${id}/${contract_address}`
      );
      data && setHolders(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getSupporters = async (user_id: number) => {
    try {
      const { data } = await axiosClient.get(
        `/api/donation/supporters/${user_id}`
      );
      data && setSupporters(data);
    } catch (error) {
      console.log(error);
    }
  };

  const assignBadge = async (contributor_id: number) => {
    try {
      const { id, contract_address, creator_id, title } = activeBadge;
      const res = await axiosClient.post(`${baseURL}/api/badge/assign-badge`, {
        id,
        contract_address,
        contributor_id,
      });
      if (res.status === 200) {
        if (socket && res.data) {
          const sendData: IMintBadgeSocketObj = {
            supporter: {
              username: selectedUser,
              id: contributor_id,
            },
            creator: {
              id: creator_id,
              username,
            },
            badge: {
              id,
              name: title,
            },
          };
          socket.emit("new_badge", sendData);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const mintBadge = async () => {
    try {
      setLoading(true);
      const { contract_address } = activeBadge;
      const selectedUserObj: any = supporters.find(
        (s: any) => s.username === selectedUser
      );
      if (selectedUserObj) {
        const selectedUserAddress = selectedUserObj.wallet_address;

        await walletConf.mintBadge({
          contract_address,
          addressTo: selectedUserAddress,
        });
        await assignBadge(selectedUserObj.id);
        await updateBadgeNFTData(activeBadge);
        await getHolders(activeBadge);
        setIsOpenSuccessModal(true);
        setSelectedUser("");
      }
    } catch (error) {
      const errorObj = error as any; // Error
      addErrorNotification({
        message: errorObj?.message,
        title: errorObj?.error,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteBadgeInPage = async () => {
    setDeleteLoading(true);
    const res = await deleteBadge(activeBadge);
    if (res) {
      backBtn();
      setFormBadge({ ...initBadgeData });
    }
    setDeleteLoading(false);
  };

  useEffect(() => {
    const { id, contract_address } = activeBadge;
    if (id && contract_address) {
      // getBadge(activeBadge);
      roleplay === "creators" && getHolders(activeBadge);
    }
  }, [activeBadge, roleplay]);

  useEffect(() => {
    id && roleplay === "creators" && getSupporters(id);
  }, [id, roleplay]);

  const { image, title, description, contract_address, quantity, creator_id } =
    formBadge;

  return (
    <div className="create_badges">
      <div className="create_badges__container">
        <div className="create_badges__title">
          <div className="arrow_icon icon" onClick={backBtn}>
            <LeftArrowIcon />
          </div>
          <div className="page-title">
            <span>{title} - Badge</span>
          </div>
        </div>
        <Row
          gutter={[4, 4]}
          className="create_badges__form"
          justify="space-between"
        >
          <Col xl={10} md={12}>
            <div className="upload-block">
              <UploadImage
                label="Image"
                filePreview={image.preview}
                labelCol={24}
                inputCol={24}
                disabled
                bigSize
              />
            </div>
          </Col>
          <Col xl={12} md={24}>
            <Row gutter={[0, 18]} className="details">
              <Col span={24}>
                <p className="details__title">Details</p>
              </Col>
              <Col span={24}>
                <div className="details__content">
                  <div className="details__content_row">
                    <Row justify="space-between">
                      <Col md={5} xs={7}>
                        <p className="details__content_row_title">Name</p>
                      </Col>
                      <Col md={18} xs={16}>
                        <p className="details__content_row_value">{title}</p>
                      </Col>
                    </Row>
                  </div>
                  <div className="details__content_row">
                    <Row justify="space-between">
                      <Col md={5} xs={7}>
                        <p className="details__content_row_title">
                          Description
                        </p>
                      </Col>
                      <Col md={18} xs={16}>
                        <p className="details__content_row_value">
                          {description}
                        </p>
                      </Col>
                    </Row>
                  </div>
                  <div className="details__content_row">
                    <Row justify="space-between">
                      <Col md={5} xs={7}>
                        <p className="details__content_row_title">Quantity</p>
                      </Col>
                      <Col md={18} xs={16}>
                        <p className="details__content_row_value">{quantity}</p>
                      </Col>
                    </Row>
                  </div>
                  <div className="details__content_row">
                    <Row justify="space-between">
                      <Col md={5} xs={7}>
                        <p className="details__content_row_title">Address</p>
                      </Col>
                      <Col md={18} xs={16}>
                        <div className="details__content_row_value">
                          <LinkCopy
                            link={contract_address}
                            linkLength={15}
                            isSimple
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
            </Row>
            {id === creator_id && (
              <Row>
                {Boolean(holders.length) && (
                  <Col span={24}>
                    <Row justify="space-between" align="middle">
                      <Col span={8}>
                        <p className="details__title">Badge holders</p>
                      </Col>
                      <Col span={15}>
                        <div
                          className={clsx("details__users", {
                            center: false,
                          })}
                        >
                          <Avatar.Group
                            maxCount={7}
                            // maxPopoverTrigger="click"
                            size="large"
                            maxStyle={{
                              color: "#FFFFFF",
                              backgroundColor: "#1D14FF",
                              cursor: "pointer",
                            }}
                          >
                            {holders.map((holder: any) => (
                              <Tooltip
                                key={holder.username}
                                title={holder.username}
                                placement="top"
                              >
                                {holder.avatar ? (
                                  <Avatar src={holder.avatar} />
                                ) : (
                                  <Avatar
                                    style={{ backgroundColor: "#1D14FF" }}
                                  >
                                    {holder.username[1]}
                                  </Avatar>
                                )}
                              </Tooltip>
                            ))}
                          </Avatar.Group>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                )}
                <Col span={24}>
                  <Divider className="line" />
                </Col>
                <Col span={24}>
                  <p className="details__title">Assign badge</p>
                  <div className="form-element">
                    <SelectInput
                      list={
                        Boolean(supporters.length)
                          ? supporters.map((s) => ({
                              key: s.username,
                              value: s.username,
                            }))
                          : null
                      }
                      value={selectedUser}
                      setValue={(selected) =>
                        setSelectedUser(selected as string)
                      }
                      placeholder="Choose your donator address"
                      modificator="details__select_user"
                    />
                  </div>
                </Col>
                <Col span={24}>
                  <div className="btns-bottom">
                    <ConfirmPopup confirm={deleteBadgeInPage}>
                      <BaseButton
                        title="Delete badge"
                        padding="6px 35px"
                        onClick={() => {}}
                        fontSize={isTablet ? "14px" : "18px"}
                        disabled={deleteLoading || loading}
                        modificator="delete-btn"
                        isRed
                      />
                    </ConfirmPopup>
                    <BaseButton
                      formatId="badges_page_assign_button"
                      padding="6px 35px"
                      onClick={mintBadge}
                      fontSize={isTablet ? "14px" : "18px"}
                      disabled={loading}
                      isMain
                    />
                  </div>
                </Col>
              </Row>
            )}
          </Col>
        </Row>
      </div>
      <LoadingModalComponent
        open={loading}
        message="Please sign the transaction in your wallet and wait for the confirmation. Don't close this window"
      />
      <SuccessModalComponent
        open={isOpenSuccessModal}
        onClose={() => setIsOpenSuccessModal(false)}
        message={`Badge has been assigned successfully!`}
        // Assign to ${selectedUser} successfully!
      />
    </div>
  );
};

export default BadgePage;
