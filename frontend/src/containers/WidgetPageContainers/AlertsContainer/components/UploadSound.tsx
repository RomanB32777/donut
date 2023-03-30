import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { addNotification } from "utils";
import { maxSoundDuration } from "consts";

interface IUploadSound {
  sendFile: (file: File) => Promise<void>;
}

const UploadSound: FC<IUploadSound> = ({ sendFile }) => {
  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const target = e.currentTarget;
    const resulUploaded = new Promise((resolve, reject) => {
      if (target.files && target.files.length) {
        const file = target.files[0];
        const audio = new Audio();
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = (e) => {
          audio.src = e?.target?.result as string;
          audio.addEventListener(
            "loadedmetadata",
            async () => {
              const duration = Math.round(audio.duration);
              if (duration <= maxSoundDuration) await sendFile(file);
              else
                reject(`File size limit exceeded (max - ${maxSoundDuration}s)`);
            },
            false
          );
        };
        reader.onerror = (error) => reject(error);
      } else reject("File unloaded");
    });

    resulUploaded.catch((err) =>
      addNotification({
        type: "danger",
        title: err,
      })
    );
  };

  return (
    <div className="sound-upload">
      <label htmlFor="sound-upload">
        <FormattedMessage id="upload_sound_label" />
      </label>
      <input
        id="sound-upload"
        type="file"
        accept="audio/*"
        onChange={inputHandler}
      />
    </div>
  );
};

export default UploadSound;
