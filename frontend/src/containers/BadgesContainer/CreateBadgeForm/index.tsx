import { Col, Row } from "antd";
import { useState } from "react";
import { ethers } from "ethers";
import BaseButton from "../../../commonComponents/BaseButton";
import UploadImage from "../../../components/UploadImage";
import FormInput from "../../../components/FormInput";

import PageTitle from "../../../commonComponents/PageTitle";
import { LeftArrowIcon } from "../../../icons/icons";
import { IBadgeData } from "../../../types";
import SelectComponent from "../../../components/SelectComponent";
import SelectInput from "../../../components/SelectInput";
import { abi, bytecode } from "../consts.js";
import axiosClient from "../../../axiosClient";
import { useSelector } from "react-redux";
import { makeStorageClient } from "../utils";

const CreateBadgeForm = ({ backBtn }: { backBtn: () => void }) => {
  const user = useSelector((state: any) => state.user);
  const [loading, setLoading] = useState<boolean>(false);
  const [formBadge, setFormBadge] = useState<IBadgeData>({
    image: {
      preview: "",
      file: null,
    },
    title: "",
    description: "",
    blockchain: "",
    contract_address: "",
  });

  // const [mintDetails, setMintDetails] = useState({
  //   receiver: "",
  //   tokenId: 1,
  //   quantity: 1,
  //   gaslimit: { gasLimit: 1000000000 },
  // });

  const createJSON = (_title: string, _description: string, _uri: string) => {
    const dict = { title: _title, description: _description, URI: _uri };
    const jsonDict = JSON.stringify(dict);
    const file = new File([jsonDict], "metadata.json", {
      type: "text/plain;charset=utf-8",
    });
    return [file];
  };

  const storeFiles = async (_files: any) => {
    const client = makeStorageClient();
    const cid = await client.put(_files);
    console.log("stored files with cid:", cid);
    const ipfsLink = "ipfs://" + cid;
    console.log(ipfsLink);
    return ipfsLink;
  };

  const uploadToIpfs = async () => {
    const { image, title, description } = formBadge;
    if (image.file && title && description) {
      const _uri = await storeFiles([image.file]);
      const badgeDict = createJSON(title, description, _uri);
      const new_uri = await storeFiles(badgeDict);
      return new_uri;
    }
  };

  const createContract = async () => {
    try {
      setLoading(true);
      // await changeNetwork("evmos_testnet") CHECK !!!
      const _uri = await uploadToIpfs();
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
      const signer = provider.getSigner(0);
      const Badge = new ethers.ContractFactory(abi, bytecode, signer);
      // deploy contracts
      const badgeContract = await Badge.deploy(_uri);

      if (badgeContract) {
        await axiosClient.post("/api/badge/", {
          creator_id: user.id,
          contract_address: badgeContract.address,
        });
        backBtn();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const { image, title, description, blockchain } = formBadge;

  return (
    <div className="create_badges">
      <div className="create_badges__container">
        <div className="create_badges__title">
          <div className="arrow_icon icon" onClick={backBtn}>
            <LeftArrowIcon />
          </div>
          <PageTitle formatId="badges_page_create_title" notMarginBottom />
        </div>
        <Row
          gutter={[4, 4]}
          className="create_badges__form"
          justify="space-between"
        >
          <Col span={10}>
            <div className="upload-block">
              <UploadImage
                label="Upload Image"
                formats={["PNG", "JPG"]}
                sizeStr="5 MB"
                filePreview={image.preview}
                setFile={({ preview, file }) =>
                  setFormBadge({
                    ...formBadge,
                    image: {
                      file,
                      preview,
                    },
                  })
                }
                labelCol={24}
                InputCol={24}
                bigSize
              />
            </div>
          </Col>
          <Col span={12}>
            <Row gutter={[0, 18]} className="form">
              <Col span={24}>
                <div className="form-element">
                  <FormInput
                    label="Name"
                    name="name"
                    value={title}
                    setValue={(value) =>
                      setFormBadge({ ...formBadge, title: value })
                    }
                    placeholder="Your badge name..."
                    labelCol={24}
                    InputCol={24}
                    gutter={[0, 18]}
                  />
                </div>
              </Col>
              <Col span={24}>
                <div className="form-element">
                  <FormInput
                    label="Description"
                    name="description"
                    value={description}
                    setValue={(value) =>
                      setFormBadge({ ...formBadge, description: value })
                    }
                    placeholder="Your badge description..."
                    labelCol={24}
                    InputCol={24}
                    gutter={[0, 18]}
                    isTextarea
                  />
                </div>
              </Col>
              <Col span={24}>
                <div className="form-element">
                  <SelectInput
                    value={blockchain}
                    list={["tEVMOS"]}
                    label="Blockchain"
                    placeholder="Choose blockchain"
                    setValue={(value) =>
                      setFormBadge({
                        ...formBadge,
                        blockchain: value as string,
                      })
                    }
                    labelCol={24}
                    selectCol={24}
                    gutter={[0, 18]}
                  />
                  {/* <FormInput
                    label="Quantity"
                    name="quantity"
                    value={quantity}
                    typeInput="number"
                    setValue={(value) =>
                      setFormBadge({ ...formBadge, quantity: value })
                    }
                    labelCol={24}
                    InputCol={24}
                    gutter={[0, 18]}
                  /> */}
                </div>
              </Col>
              <Col span={24}>
                <div className="saveBottom">
                  <BaseButton
                    title="Create contract"
                    padding="6px 35px"
                    onClick={createContract}
                    fontSize="18px"
                    disabled={loading}
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

export default CreateBadgeForm;
