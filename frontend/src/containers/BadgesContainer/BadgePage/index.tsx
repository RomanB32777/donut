import { Avatar, Col, Divider, Row, Tooltip } from "antd";
import { useEffect, useState } from "react";
import BaseButton from "../../../commonComponents/BaseButton";
import UploadImage from "../../../components/UploadImage";

import { LeftArrowIcon } from "../../../icons/icons";
import LinkCopy from "../../../components/LinkCopy";
import { UserOutlined } from "@ant-design/icons";
import clsx from "clsx";
import SelectInput from "../../../components/SelectInput";
import { IBadge, IBadgeData } from "../../../types";
import { abi } from "../consts";
import { ethers } from "ethers";
import axiosClient, { baseURL } from "../../../axiosClient";
import { makeStorageClient } from "../utils";
import { useSelector } from "react-redux";

const BadgePage = ({
  activeBadge,
  backBtn,
}: {
  activeBadge: IBadge;
  backBtn: () => void;
}) => {
  const user = useSelector((state: any) => state.user);

  const [formBadge, setFormBadge] = useState<IBadgeData>({
    image: {
      preview: "",
      file: null,
    },
    title: "",
    description: "",
    blockchain: "",
    URI: "",
    contract_address: "",
    quantity: 0,
  });
  const [supporters, setSupporters] = useState<any[]>([]);
  const [holders, setHolders] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");

  const getBadgeNFTData = async (badge: IBadge) => {
    try {
      const { contract_address } = badge;

      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
      let currentContract = new ethers.Contract(
        contract_address,
        abi,
        provider
      );
      const currentToken = await currentContract.uri(1);
      const quantityBadge = await currentContract.totalSupply(1);

      const rootCid = currentToken.split("//")[1];
      const dataBadgeJSON = await axiosClient.get(
        `https://${rootCid}.ipfs.w3s.link/metadata.json`
      );

      if (dataBadgeJSON.status == 200) {
        const client = makeStorageClient();
        const imgCid = dataBadgeJSON.data.URI.split("//")[1];
        const res = await client.get(imgCid); // Web3Response

        if (res) {
          const files = await res.files(); // Web3File[]

          // new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(files[0]);
          reader.onload = () =>
            setFormBadge({
              ...formBadge,
              ...dataBadgeJSON.data,
              image: {
                ...formBadge.image,
                preview: (reader.result as string) || "",
              },
              contract_address,
              quantity: quantityBadge.toNumber(),
            });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(formBadge);
  const getBadge = async (activeBadge: IBadge) => {
    try {
      const { id, contract_address } = activeBadge;
      const { data } = await axiosClient.get(
        `${baseURL}/api/badge/${id}/${contract_address}`
      );
      data && (await getBadgeNFTData(data));
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
        `${baseURL}/api/donation/supporters/${user_id}`
      );
      data && setSupporters(data);
    } catch (error) {
      console.log(error);
    }
  };

  const assignBadge = async (contributor_id: number) => {
    try {
      const { id, contract_address } = activeBadge;
      await axiosClient.post(`${baseURL}/api/badge/assign-badge`, {
        id,
        contract_address,
        contributor_id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const mintBadge = async () => {
    try {
      const { contract_address, id } = activeBadge;
      const selectedUserObj: any = supporters.find(
        (s: any) => s.username === selectedUser
      );
      if (selectedUserObj) {
        const selectedUserAddress = selectedUserObj.metamask_token;
        const provider = new ethers.providers.Web3Provider(
          (window as any).ethereum
        );
        const signer = provider.getSigner(0);
        let currentContract = new ethers.Contract(
          contract_address,
          abi,
          signer
        );
        await currentContract.mint(selectedUserAddress, 1, 1);
        await assignBadge(selectedUserObj.id);
        await getBadgeNFTData(activeBadge);
        await getHolders(activeBadge);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const { id, contract_address } = activeBadge;
    if (id && contract_address) {
      getBadge(activeBadge);
      getHolders(activeBadge);
    }
  }, [activeBadge]);

  useEffect(() => {
    user.id && getSupporters(user.id);
  }, [user]);

  const { image, title, description, contract_address, quantity } = formBadge;

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
                        <p className="details__content_row_value">{title}</p>
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
                          {description}
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
                        <p className="details__content_row_value">{quantity}</p>
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
                          <LinkCopy link={contract_address} isSimple />
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
                        {holders.length &&
                          holders.map((holder: any) => (
                            <Tooltip title={holder.username} placement="top">
                              <Avatar style={{ backgroundColor: "#1D14FF" }}>
                                {holder.username[1]}
                              </Avatar>
                            </Tooltip>
                          ))}
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
                    list={
                      supporters.length
                        ? supporters.map((s) => s.username)
                        : [""]
                    }
                    value={selectedUser}
                    setValue={(selected) => setSelectedUser(selected as string)}
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
                    onClick={mintBadge}
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