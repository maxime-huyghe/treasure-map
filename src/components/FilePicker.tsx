import { useEffect, useState } from "react";
import { useFilePicker } from "use-file-picker";
import { EXAMPLE_MAP } from "../lib/consts";
import { parseMap, TreasureMap, writeMap } from "../lib/TreasureMap";
import Button from "./Button";

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

  const openDefaultMap = () => {
    const map = parseMap(EXAMPLE_MAP);
    setFilename("example.txt");
    setError(null);
    onUpload(map);
  };

  const fileToDownload = currentMap && new Blob([writeMap(currentMap)], {
    type: "text/plain"
  });

  return (
    <>
      {
        filename && (
          <p className="pb-2">
            Open file: {filename}
          </p>
        )
      }
      {error && (
        <p className="pb-2">
          error
        </p>
      )}
      <div>
        <Button onClick={openFilePicker}>Upload a new map</Button>
        <Button onClick={openDefaultMap}>Use the default map</Button>
        {
          fileToDownload && (
            <Button.AsLink href={URL.createObjectURL(fileToDownload)} download={filename}>
              Download current map's result
            </Button.AsLink>
          )
        }
      </div>
    </>
  );
};

export default FilePicker;