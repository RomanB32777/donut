import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Col, Empty, Row } from "antd";
import { FormattedMessage } from "react-intl";
import { useDispatch } from "react-redux";
import { IBadgeInfo } from "types";

import PageTitle from "components/PageTitle";
import ContentCard from "./ContentCard";
import BaseButton from "components/BaseButton";
import BadgePage from "./BadgePage";
import CreateBadgeForm from "./CreateBadge";
import Loader from "components/Loader";

import { useAppSelector } from "hooks/reduxHooks";
import axiosClient from "modules/axiosClient";
import { setUpdateAppNotifications } from "store/types/Notifications";
import { scrollToPosition } from "utils";

import "./styles.sass";

const BadgesContainer = () => {
  const dispatch = useDispatch();
  const { user, notifications } = useAppSelector((state) => state);
  const [searchParams, setSearchParams] = useSearchParams();

  const { id, wallet_address } = user;
  const { list, shouldUpdateApp } = notifications;

  const [badgesList, setBadgesList] = useState<IBadgeInfo[]>([]);
  const [activeBadge, setActiveBadge] = useState<IBadgeInfo | null>(null);
  const [isOpenCreateForm, setIsOpenCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const queryID = searchParams.get("id");

  const removeQueryParams = () => {
    searchParams.delete("id");
    setSearchParams(searchParams);
  };

  const toBadgePage = (badgeData: IBadgeInfo) => {
    setSearchParams(`id=${badgeData.id}`);
    setActiveBadge({ ...badgeData });
    scrollToPosition();
  };

  const toCreationForm = () => {
    setIsOpenCreateForm(true);
    scrollToPosition();
  };

  const backToMainPage = (updateList: boolean = false) => () => {
    setActiveBadge(null);
    setIsOpenCreateForm(false);
    removeQueryParams();
    updateList && getBadges();
  };

  const getBadges = async () => {
    try {
      setLoading(true);
      const { data, status } = await axiosClient.get(
        `/api/badge/${wallet_address}`
      );
      if (status === 200) setBadgesList(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBadge = async (badge: IBadgeInfo) => {
    try {
      const { id } = badge;
      const { status } = await axiosClient.delete(`/api/badge/${id}`);
      if (status === 200) await getBadges();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (queryID) {
      const findActiveBadge = badgesList.find((badge) => badge.id === +queryID);
      if (findActiveBadge) setActiveBadge(findActiveBadge);
      // removeQueryParams();
    }
  }, [queryID, badgesList]);

  useEffect(() => {
    if (id && shouldUpdateApp) getBadges();
  }, [id, list, shouldUpdateApp]);

  useEffect(() => {
    dispatch(setUpdateAppNotifications(true));
  }, []);

  if (loading) return <Loader size="big" />;

  if (activeBadge)
    return (
      <BadgePage
        activeBadge={activeBadge}
        deleteBadge={deleteBadge}
        backBtn={backToMainPage}
      />
    );

  if (isOpenCreateForm) return <CreateBadgeForm backBtn={backToMainPage} />;

  return (
    <div className="badges-container fadeIn">
      <PageTitle formatId="page_title_badges" />

      {user && user.id && user.roleplay && user.roleplay === "creators" && (
        <div className="new-badge-wrapper">
          <span>
            <FormattedMessage id="badges_page_new_title" />
          </span>
          <BaseButton
            formatId="create_badge_form_button"
            padding="6px 25px"
            fontSize="18px"
            onClick={toCreationForm}
            isMain
          />
        </div>
      )}

      <div className="list">
        <Row gutter={[36, 36]}>
          {Boolean(badgesList.length) ? (
            badgesList.map((badge) => (
              <Col xl={6} md={8} sm={12} xs={24} key={"badge-panel" + badge.id}>
                <div className="badge-panel">
                  <ContentCard
                    data={badge}
                    onClick={toBadgePage}
                    deleteBadge={deleteBadge}
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
