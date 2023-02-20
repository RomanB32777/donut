import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Col, Empty, Row } from "antd";
import { FormattedMessage } from "react-intl";
import { IBadgeInfo } from "types";

import PageTitle from "components/PageTitle";
import ContentCard from "./ContentCard";
import BaseButton from "components/BaseButton";
import BadgePage from "./BadgePage";
import CreateBadgeForm from "./CreateBadge";
import Loader from "components/Loader";

import { useAppSelector, useActions } from "hooks/reduxHooks";
import {
  useDeleteBadgeMutation,
  useGetBadgesQuery,
} from "store/services/BadgesService";
import { scrollToPosition } from "utils";

import "./styles.sass";

const BadgesContainer = () => {
  const { setUpdatedFlag } = useActions();

  const { id, wallet_address, roleplay } = useAppSelector(({ user }) => user);
  const { list, shouldUpdateApp } = useAppSelector(
    ({ notifications }) => notifications
  );

  const [searchParams, setSearchParams] = useSearchParams();

  const [activeBadge, setActiveBadge] = useState<IBadgeInfo | null>(null);
  const [isOpenCreateForm, setIsOpenCreateForm] = useState(false);

  const queryID = searchParams.get("id");

  const {
    data: badgesList,
    isLoading,
    refetch: getBadges,
  } = useGetBadgesQuery(wallet_address, { skip: !wallet_address });
  const [deleteBadge] = useDeleteBadgeMutation();

  const removeQueryParams = useCallback(() => {
    searchParams.delete("id");
    setSearchParams(searchParams);
  }, [searchParams, setSearchParams]);

  const toBadgePage = useCallback(
    (badgeData: IBadgeInfo) => {
      setSearchParams(`id=${badgeData.id}`);
      setActiveBadge({ ...badgeData });
      scrollToPosition();
    },
    [setSearchParams]
  );

  const toCreationForm = () => {
    setIsOpenCreateForm(true);
    scrollToPosition();
  };

  const backToMainPage = useCallback(
    (updateList: boolean = false) =>
      () => {
        setActiveBadge(null);
        setIsOpenCreateForm(false);
        removeQueryParams();
        updateList && getBadges();
      },
    [getBadges, removeQueryParams]
  );

  const deleteSelectedBadge = useCallback(
    async (badgeID: number) => await deleteBadge(badgeID),
    [deleteBadge]
  );

  useEffect(() => {
    if (queryID) {
      const findActiveBadge = badgesList?.find(
        (badge) => badge.id === +queryID
      );
      if (findActiveBadge) setActiveBadge(findActiveBadge);
    }
  }, [queryID, badgesList]);

  useEffect(() => {
    if (list.length && shouldUpdateApp) getBadges();
  }, [list, shouldUpdateApp, getBadges]);

  useEffect(() => {
    setUpdatedFlag(true);
  }, []);

  if (isLoading) return <Loader size="big" />;

  if (activeBadge)
    return <BadgePage activeBadge={activeBadge} backBtn={backToMainPage} />;

  if (isOpenCreateForm) return <CreateBadgeForm backBtn={backToMainPage} />;

  return (
    <div className="badges-container fadeIn">
      <PageTitle formatId="page_title_badges" />

      {id && roleplay === "creators" && (
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
          {badgesList && Boolean(badgesList.length) ? (
            badgesList.map((badge) => (
              <Col xl={6} md={8} sm={12} xs={24} key={"badge-panel" + badge.id}>
                <div className="badge-panel">
                  <ContentCard
                    data={badge}
                    onClick={toBadgePage}
                    deleteBadge={deleteSelectedBadge}
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
