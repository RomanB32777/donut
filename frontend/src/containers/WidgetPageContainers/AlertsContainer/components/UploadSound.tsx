import { addNotification } from "utils";

const maxDuration = 5;

const UploadSound = ({
  sendFile,
}: {
  sendFile: (file: File) => Promise<void>;
}) => {
  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("dfdf");
    
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
              if (duration <= maxDuration) await sendFile(file);
              else reject(`File size limit exceeded (max - ${maxDuration}s)`);
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
      <label htmlFor="sound-upload">Upload custom sound +</label>
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
