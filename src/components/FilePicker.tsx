import { useEffect, useState } from "react";
import { useFilePicker } from "use-file-picker";
import { parseMap, TreasureMap, writeMap } from "../lib/TreasureMap";

const FilePicker = ({ onUpload, currentMap }: { onUpload: (tm: TreasureMap) => void; currentMap?: TreasureMap; }) => {
  const [filename, setFilename] = useState(null as string | null);
  const [error, setError] = useState(null as string | null);
  const [openFilePicker, { filesContent }] = useFilePicker({
    accept: ".txt"
  });

  // When filesContent changes, upload the data.
  useEffect(() => {
    if (filesContent.length > 0) {
      console.log("thing");
      try {
        const map = parseMap(filesContent[0].content);
        onUpload(map);
        setFilename(filesContent[0].name);
        setError(null);
      } catch (e) {
        setFilename(null);
        setError((e as any).message);
      }
    }
  }, [filesContent, onUpload]);

  const fileToDownload = currentMap && new Blob([writeMap(currentMap)], {
    type: "text/plain"
  });

  return (
    <div>
      <button onClick={openFilePicker}>Upload a new map</button>
      {
        filename && (<>
          Open file: {filename}
        </>)
      }
      {error}
      <br />
      {
        fileToDownload &&
        <a href={URL.createObjectURL(fileToDownload)} download={filename}>
          Download current map's result
        </a>
      }
    </div >
  );
};

export default FilePicker;