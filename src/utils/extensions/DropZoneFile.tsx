import React, { useEffect, useState } from "react";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import Vietnamese from "@uppy/locales/lib/vi_VN";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

const DropZoneFile = (props: DropZoneFileProps) => {
  const { onImport, ...rest } = props;
  const [uppy] = useState(() => new Uppy({ locale: Vietnamese }));

  useEffect(() => {
    uppy.on("complete", (result: any) => {
      const firstFile = result.successful[0];
      if (firstFile) {
        const fileData =
          firstFile.data instanceof Blob
            ? firstFile.data
            : new Blob([firstFile.data], { type: firstFile.type });

        onImport(fileData);
      }
    });

    return () => {
      uppy.cancelAll();
      uppy.off("complete");
    };
  }, [uppy, onImport]);

  return <Dashboard uppy={uppy} {...rest} />;
};

type DropZoneFileProps = {
  onImport: (file: Blob) => void;
};

export default DropZoneFile;
