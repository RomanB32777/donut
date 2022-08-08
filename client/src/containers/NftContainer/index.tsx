import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import axiosClient, { baseURL } from "../../axiosClient";
import BlueButton from "../../commonComponents/BlueButton";
import NftPanel from "../../components/NftPanel";
import routes from "../../routes";
import "./styles.sass";

const NftContainer = () => {
  const navigate = useNavigate();

  const user = useSelector((state: any) => state.user);

  const [nftList, setNftList] = useState<any[]>([]);

  const [deleted, setDeleted] = useState<boolean>(false);

  const deleteNft = async (id: any) => {
    const res = await axiosClient.post(baseURL + "/api/nft/delete", {
      nft_id: id,
    });
    if (res.status === 200) {
      getNft(user.username);
      setDeleted(true);
      setTimeout(() => setDeleted(false), 3000);
    }
  };

  const getNft = async (username: string) => {
    const res = await fetch(baseURL + "/api/nft/list/" + username);
    if (res.status === 200) {
      const result = await res.json();
      setNftList(result.data.reverse());
    }
  };

  useEffect(() => {
    if (user.username) {
      getNft(user.username);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="nft-container">
      <div className="nft-container__header">
        <span>
          <FormattedMessage id="nft_page_header_title" />
        </span>
        <div>
          <BlueButton
            formatId="nft_page_header_button"
            onClick={() => navigate(routes.createNft)}
            padding="6px 36px"
            fontSize="18px"
          />
        </div>
      </div>
      <div className="nft-container__list">
        {nftList &&
          nftList.length > 0 &&
          nftList.map((nft, nftIndex) => (
            <div
              key={"nft-panel" + nftIndex}
              style={{
                marginRight:
                  nftIndex % 4 !== 3 ? (1170 - 220 * 4) / 3 + "px" : "0px",
              }}
            >
              <NftPanel
                data={nft}
                ableToDelete={true}
                onClick={() => deleteNft(nft.id)}
              />
            </div>
          ))}
      </div>
      <div
        className="deleted-message"
        style={{
          opacity: deleted ? "1" : "0",
        }}
      >
        Deleted successfully
      </div>
    </div>
  );
};

export default NftContainer;
