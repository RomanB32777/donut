import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Col, Empty, Row } from "antd";
import { FormattedMessage } from "react-intl";
import { useDispatch } from "react-redux";
import { IBadgeShort } from "types";

import { WalletContext } from "contexts/Wallet";
import PageTitle from "components/PageTitle";
import ContentCard from "./ContentCard";
import BaseButton from "components/BaseButton";
import BadgePage from "./BadgePage";
import CreateBadgeForm from "./CreateBadge";

import { useAppSelector } from "hooks/reduxHooks";
import axiosClient from "modules/axiosClient";
import { setUpdateAppNotifications } from "store/types/Notifications";
import { IBadge } from "appTypes";
import { addNotification } from "utils";
import { initBadgeData, ipfsFileformat, ipfsFilename } from "consts";

import "./styles.sass";

const BadgesContainer = () => {
  const dispatch = useDispatch();
  const { user, notifications } = useAppSelector((state) => state);
  const [searchParams, setSearchParams] = useSearchParams();
  const { walletConf } = useContext(WalletContext);

  const { list, shouldUpdateApp } = notifications;

  const [badgesList, setBadgesList] = useState<IBadge[]>([]);
  const [activeBadge, setActiveBadge] = useState<IBadge>({
    ...initBadgeData,
  });
  const [isOpenCreateForm, setIsOpenCreateForm] = useState<boolean>(false);
  const [isOpenBadgePage, setIsOpenBadgePage] = useState<boolean>(false);

  const queryID = searchParams.get("id");

  const getBadges = async (id: number) => {
    const url =
      user.roleplay === "creators"
        ? `/api/badge/${id}?status=success`
        : `/api/badge/badges-backer/${id}?status=success`;

    const { data } = await axiosClient.get(url);
    if (Array.isArray(data) && data.length) {
      setBadgesList(data);
    }
  };

  const getBadgeData = async (badge: IBadgeShort) => {
    try {
      const { contract_address, creator_id } = badge;

      const badgeURI = await walletConf.getBadgeURI(contract_address);

      const quantity = await walletConf.getQuantityBalance({
        contract_address,
        supporter_address: user.wallet_address,
        isCreator: user.id === creator_id,
      });

      if (user.roleplay === "backers" && quantity < 1) return;

      if (badgeURI) {
        const rootCid = badgeURI.split("//")[1];
        const dataBadgeJSON = await axiosClient.get(
          `https://${rootCid}.ipfs.w3s.link/metadata.json`
        );

        if (dataBadgeJSON.status === 200) {
          // const client = makeStorageClient();
          const imgURI = dataBadgeJSON.data.URI;
          const imageCid = imgURI.split("//")[1];
          const fileImage = `https://${imageCid}.ipfs.w3s.link/${ipfsFilename}.${ipfsFileformat}`;

          // const res = await client.get(imgCid);

          // if (res) {
          // const files = await res.files(); // Web3File[]

          // const fileImage = await new Promise((resolve, reject) => {
          //   const reader = new FileReader();
          //   reader.readAsDataURL(files[0]);
          //   reader.onload = ({ target }) => target && resolve(target.result);
          //   reader.onerror = reject;
          // });

          return {
            ...dataBadgeJSON.data,
            image: {
              preview: (fileImage as string) || "",
            },
            contract_address,
            quantity,
          };
          // }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteBadge = async (badge: IBadge) => {
    try {
      const { id, contract_address, title, quantity } = badge;
      if (title && quantity < 1) {
        const res = await axiosClient.delete(
          `/api/badge/${id}/${contract_address}`
        );
        if (res.status === 200 && user.id) {
          await getBadges(user.id);
          return true;
        }
      } else if (title && quantity > 0) {
        addNotification({
          type: "warning",
          title: "Badge removal is not possible",
          message: "Badge removal is not possible (contributor users > 0)",
        });
        return false;
      } else {
        addNotification({
          type: "warning",
          title: "Badge removal is not possible",
          message: `Deleting a badge is not possible until its content is loaded`,
        });
        return false;
      }
    } catch (error) {
      addNotification({
        type: "danger",
        title: "Error",
        message:
          (error as any)?.response?.data?.message ||
          `An error occurred while deleting data`,
      });
      return false;
    }
  };

  const removeQueryParams = () => {
    searchParams.delete("id");
    setSearchParams(searchParams);
  };

  useEffect(() => {
    const goToQueryActiveBadge = async () => {
      if (queryID) {
        const findActiveBadge = badgesList.find(
          (badge) => badge.id === +queryID
        );
        if (findActiveBadge) {
          const badgeInfo = await getBadgeData(findActiveBadge);
          setActiveBadge({ ...findActiveBadge, ...badgeInfo });
          setIsOpenBadgePage(true);
          removeQueryParams();
        }
      }
    };

    goToQueryActiveBadge();
  }, [queryID, badgesList]);

  useEffect(() => {
    if (user.id && user.roleplay && !isOpenCreateForm && shouldUpdateApp) {
      getBadges(user.id);
    }
  }, [user, isOpenCreateForm, list, shouldUpdateApp]);

  useEffect(() => {
    dispatch(setUpdateAppNotifications(true));
  }, []);

  if (isOpenBadgePage)
    return (
      <BadgePage
        activeBadge={activeBadge}
        deleteBadge={deleteBadge}
        backBtn={() => setIsOpenBadgePage(false)}
      />
    );

  if (isOpenCreateForm)
    return (
      <CreateBadgeForm
        backBtn={() => setIsOpenCreateForm(false)}
        setActiveBadge={(activeBadge: IBadge) => setActiveBadge(activeBadge)}
        openBadgePage={() => setIsOpenBadgePage(true)}
      />
    );

  return (
    <div className="badges-container fadeIn">
      <PageTitle formatId="page_title_badges" />

      {user && user.id && user.roleplay && user.roleplay === "creators" && (
        <div className="badges-container__new-badge-wrapper">
          <span>
            <FormattedMessage id="badges_page_new_title" />
          </span>
          <BaseButton
            formatId="create_badge_form_button"
            padding="6px 43px"
            fontSize="18px"
            onClick={() => setIsOpenCreateForm(true)}
            disabled
            isMain
          />
        </div>
      )}

      <div className="badges-container__list">
        <Row gutter={[36, 36]}>
          {badgesList && badgesList.length > 0 ? (
            badgesList.map(({ id, contract_address, creator_id }, rowIndex) => (
              <Col xl={6} md={8} sm={12} xs={24} key={"badge-panel" + rowIndex}>
                <div className="badge-panel">
                  <ContentCard
                    data={{
                      id,
                      creator_id,
                      contract_address,
                    }}
                    onClick={(badgeData) => {
                      setActiveBadge({ ...badgeData });
                      setIsOpenBadgePage(true);
                    }}
                    deleteBadge={deleteBadge}
                    getBadgeData={getBadgeData}
                  />
                </div>
              </Col>
            ))
          ) : (
            <Empty className="empty-el" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </Row>
      </div>
    </div>
  );
};

export default BadgesContainer;
