import { FormattedMessage } from "react-intl";
import "./styles.sass";

import NftPanel from "../../components/NftPanel";
import { useDispatch, useSelector } from "react-redux";
import axiosClient, { baseURL } from "../../axiosClient";
import { getPersonInfoPage } from "../../store/types/PersonInfo";
import { useLocation } from "react-router";

const NftListContainer = () => {
  const nfts = useSelector((state: any) => state.personInfoPage).data;
  const user = useSelector((state: any) => state.personInfo).main_info;

  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const deleteNft = async (id: any) => {
    const res = await axiosClient.post(baseURL + "/api/nft/delete", {
      nft_id: id,
    });
    if (res.status === 200) {
      dispatch(
        getPersonInfoPage({
          page: "nft",
          username: pathname.slice(pathname.indexOf("@")),
        })
      );
    }
  };

  return (
    <div className="nft-list-container">
      <span className="nft-list-container__title">
        {nfts.data.length > 0 ? (
          <>
            <FormattedMessage id="nft_page_title" />
            {user.person_name && user.person_name.length > 0
              ? user.person_name
              : user.username}
          </>
        ) : (
          <FormattedMessage id="nft_page_title_none" />
        )}
      </span>

      <div className="nft-list-container__list">
        {nfts.data &&
          nfts.data.length > 0 &&
          nfts.data.reverse().map((nft: any, nftIndex: any) => (
            <div
              key={"nft-list-container__list__panel" + nftIndex}
              className="nft-list-container__list__panel"
              style={{
                marginRight:
                  nftIndex % 4 !== 3 ? (1170 - 220 * 4) / 3 + "px" : "0px",
              }}
            >
              <NftPanel
                data={nft}
                onClick={() => deleteNft(nft.id)}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default NftListContainer;
