import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import BaseButton from "../../../commonComponents/BaseButton";
import UploadImage from "../../../components/UploadImage";
import FormInput from "../../../components/FormInput";

import PageTitle from "../../../commonComponents/PageTitle";
import { LeftArrowIcon } from "../../../icons/icons";
import { IBadgeData, IFileInfo } from "../../../types";
import SelectComponent from "../../../components/SelectComponent";
import SelectInput from "../../../components/SelectInput";

const CreateBadgeForm = ({ backBtn }: { backBtn: () => void }) => {
  const [formBadge, setFormBadge] = useState<IBadgeData>({
    image: {
      preview: "",
      file: null,
    },
    name: "",
    description: "",
    blockchain: "",
  });

  console.log(formBadge);

  // const changeNetwork = () => {
  //   if (window.ethereum) {
  //     window.ethereum.request({method: "wallet_addEthereumChain",
  //     params: [{
  //       chainId: `0x${Number(9000).toString(16)}`,
  //       chainName: "Evmos Testnet",
  //       nativeCurrency: {
  //         name: "test-Evmos",
  //         symbol: "tEVMOS",
  //         decimals: 18
  //       },
  //       rpcUrls: ["https://eth.bd.evmos.dev:8545"],
  //       blockExplorerUrls: ["https://evm.evmos.dev"]
  //     }]
  //   })} else {
  //     alert("install metamask extension!!")
  //   }
  // }

  // const createContract = async () => {
  //   // console.log(networks.evmos_testnet)
  //   await changeNetwork("evmos_testnet")
  //   const _uri = await uploadToIpfs()
  //   const provider = await new ethers.providers.Web3Provider(window.ethereum);
  //   const signer = provider.getSigner(0);
  //   const Badge = new ethers.ContractFactory(abi, bytecode, signer);
  //   // deploy contracts
  //   const badgeContract = await Badge.deploy(_uri)  
  //   setContractAddress(badgeContract.address)
  // }

  // const mintBadge = async () => {
  //   const provider = await new ethers.providers.Web3Provider(window.ethereum);
  //   const signer = provider.getSigner(0);
  //   let currentContract = new ethers.Contract(contractAddress, abi, signer);
  //   await currentContract.mint(mintDetails.receiver, mintDetails.tokenId, mintDetails.quantity)  
  // }
  

  const { image, name, description, blockchain } = formBadge;

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
                    value={name}
                    setValue={(value) =>
                      setFormBadge({ ...formBadge, name: value })
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
                    list={["EVMOS"]}
                    label="Blockchain"
                    placeholder="Choose blockchain"
                    setValue={(value) =>
                      setFormBadge({ ...formBadge, blockchain: value as string })
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
                    formatId="badges_page_new_button"
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

export default CreateBadgeForm;
