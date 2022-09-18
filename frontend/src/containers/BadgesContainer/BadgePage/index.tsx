import { Avatar, Col, Divider, Row, Tooltip } from "antd";
import { useEffect, useState } from "react";
import BaseButton from "../../../commonComponents/BaseButton";
import UploadImage from "../../../components/UploadImage";

import { LeftArrowIcon } from "../../../icons/icons";
import LinkCopy from "../../../components/LinkCopy";
import { UserOutlined } from "@ant-design/icons";
import clsx from "clsx";
import SelectInput from "../../../components/SelectInput";
import { IBadgeData } from "../../../types";

const BadgePage = ({ backBtn }: { backBtn: () => void }) => {
  const [imgPreview, setImgPreview] = useState<any>("");

  const [formBadge, setFormBadge] = useState<IBadgeData>({
    image: {
      preview: "",
      file: null,
    },
    name: "",
    description: "",
    quantity: "",
  });

  const { image, name, description, quantity } = formBadge;

  return (
    <div className="create_badges">
      <div className="create_badges__container">
        <div className="create_badges__title">
          <div className="arrow_icon icon" onClick={backBtn}>
            <LeftArrowIcon />
          </div>
          <div className="page-title">
            <span>OG Fan - Badge</span>
          </div>
        </div>
        <Row
          gutter={[4, 4]}
          className="create_badges__form"
          justify="space-between"
        >
          <Col span={10}>
            <div className="upload-block">
              <UploadImage
                label="Image"
                filePreview={image.preview}
                labelCol={24}
                InputCol={24}
                disabled
                bigSize
              />
            </div>
          </Col>
          <Col span={12}>
            <Row gutter={[0, 18]} className="details">
              <Col span={24}>
                <p className="details__title">Details</p>
              </Col>
              <Col span={24}>
                <div className="details__content">
                  <div className="details__content_row">
                    <Row justify="space-between">
                      <Col span={5}>
                        <p className="details__content_row_title">Name</p>
                      </Col>
                      <Col span={18}>
                        <p className="details__content_row_value">OG Fan</p>
                      </Col>
                    </Row>
                  </div>
                  <div className="details__content_row">
                    <Row justify="space-between">
                      <Col span={5}>
                        <p className="details__content_row_title">
                          Description
                        </p>
                      </Col>
                      <Col span={18}>
                        <p className="details__content_row_value">
                          Designing for Readability: A Guide to Web Typography
                          (with Infographic). There's a lot to consider when
                          choosing a typeface for a digital design.
                        </p>
                      </Col>
                    </Row>
                  </div>
                  <div className="details__content_row">
                    <Row justify="space-between">
                      <Col span={5}>
                        <p className="details__content_row_title">Quantity</p>
                      </Col>
                      <Col span={18}>
                        <p className="details__content_row_value">10 left</p>
                      </Col>
                    </Row>
                  </div>
                  <div className="details__content_row">
                    <Row justify="space-between">
                      <Col span={5}>
                        <p className="details__content_row_title">Address</p>
                      </Col>
                      <Col span={18}>
                        <p className="details__content_row_value">
                          <LinkCopy link="0x123.......fh6" isSimple />
                        </p>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
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
                        maxPopoverTrigger="click"
                        size="large"
                        maxStyle={{
                          color: "#f56a00",
                          backgroundColor: "#fde3cf",
                          cursor: "pointer",
                        }}
                      >
                        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                        <Avatar style={{ backgroundColor: "#f56a00" }}>
                          K
                        </Avatar>
                        <Avatar style={{ backgroundColor: "#f56a00" }}>
                          K
                        </Avatar>
                        <Tooltip title="Ant User" placement="top">
                          <Avatar
                            style={{ backgroundColor: "#87d068" }}
                            icon={<UserOutlined />}
                          />
                        </Tooltip>
                      </Avatar.Group>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Divider className="line" />
              </Col>
              <Col span={24}>
                <p className="details__title">Assign badge</p>
                <div className="form-element">
                  <SelectInput
                    list={["quantity"]}
                    value="quantity"
                    placeholder="Choose your donator address"
                    modificator="details__select_user"
                  />
                </div>
              </Col>
              <Col span={24}>
                <div className="saveBottom">
                  <BaseButton
                    formatId="badges_page_assign_button"
                    padding="6px 35px"
                    onClick={() => console.log("dd")}
                    fontSize="18px"
                    isBlue
                  />
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default BadgePage;
