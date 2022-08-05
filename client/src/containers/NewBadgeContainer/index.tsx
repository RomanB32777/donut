import axiosClient from "../../axiosClient";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router";
import BlueButton from "../../commonComponents/BlueButton";
import LargeInput from "../../commonComponents/LargeInput";
import PageTitle from "../../commonComponents/PageTitle";
import getTronWallet from "../../functions/getTronWallet";
import { LargeImageIcon } from "../../icons/icons";
import routes from "../../routes";
import "./styles.sass";

const NewBadgeContainer = () => {
  const navigate = useNavigate();

  const tron_wallet = getTronWallet();

  const [form, setForm] = useState({
    badge_name: "",
    badge_desc: "",
    link: "",
    quantity: "",
  });

  const [file, setFile] = useState<any>();
  const [fileName, setFileName] = useState("");
  const [imagebase64, setImagebase84] = useState<any>("");

  const fileToBase64 = (file: any) => {
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => setImagebase84(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const saveFile = (ev: any) => {
    if (ev.target.files[0].size <= 3 * 1024 * 1024) {
      setFile(ev.target.files[0]);
      fileToBase64(ev.target.files[0]);
      setFileName(ev.target.files[0].name);
    }
  };

  const createBadge = async () => {
    const res: any = await fetch(
        "/api/badge/create-badge",
      {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({ ...form, tron_token: tron_wallet }),
      }
    );
    const result = await res.json();
    if (result) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", fileName);

      await axiosClient
        .post("/api/badge/create-image/" + result.badge.id, formData)
        .then((res) => {
          if (res) {
            navigate(routes.badges);
          }
        });
    }

    if (fileName.length > 0) {
    }

    setFileName("");
    setFile(null);
  };

  return (
    <div className="new-badge-container">
      <PageTitle formatId="create_badge_title" />

      <div className="new-badge-container__form">
        <div className="new-badge-container__form__input-wrapper">
          <span className="title">
            <FormattedMessage id="new_badge_page_file_load_title" />
          </span>
          <span className="subtitle">
            <FormattedMessage id="new_badge_page_file_load_subtitle" />
          </span>
          <div>
            {fileName.length > 0 ? (
              <img src={imagebase64} />
            ) : (
              <LargeImageIcon />
            )}

            <input type="file" onChange={saveFile} />
          </div>
        </div>
        <LargeInput
          title="create_badge_form_name_title"
          placeholder="create_badge_form_name_placeholder"
          onChange={(event) =>
            setForm({ ...form, badge_name: event.target.value })
          }
          isRedDot={true}
        />
        <LargeInput
          title="create_badge_form_desc_title"
          placeholder="create_badge_form_desc_placeholder"
          onChange={(event) =>
            setForm({ ...form, badge_desc: event.target.value })
          }
          isRedDot={true}
          isTextarea={true}
        />
        <LargeInput
          title="create_badge_form_link_title"
          placeholder="create_badge_form_link_placeholder"
          subtitle="create_badge_form_link_subtitle"
          onChange={(event) => setForm({ ...form, link: event.target.value })}
        />
        <LargeInput
          title="create_badge_form_quantity_title"
          placeholder="create_badge_form_quantity_placeholder"
          onChange={(event) => {
            if (event.target.value.match(/[0-9]/)) {
              setForm({ ...form, quantity: event.target.value });
            }
          }}
          isRedDot={true}
        />

        <div
          className="new-badge-container__form__button"
          style={{
            opacity:
              form.badge_name.length > 0 &&
              form.badge_desc.length > 0 &&
              imagebase64.length > 0 &&
              form.quantity.length > 0 &&
              form.quantity.match(/[0-9]/)
                ? "1"
                : "0",
          }}
        >
          <BlueButton
            formatId="create_badge_form_button"
            padding="6px 40px"
            onClick={createBadge}
            fontSize="18px"
          />
        </div>
      </div>
    </div>
  );
};

export default NewBadgeContainer;
