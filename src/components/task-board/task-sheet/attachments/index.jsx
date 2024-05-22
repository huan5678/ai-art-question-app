'use client';
import { Fragment, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Icon } from '@iconify/react';
import { Link, Upload } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
const Attachments = () => {
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles.map((file) => Object.assign(file)));
    },
  });
  const renderFilePreview = (file) => {
    if (file.type.startsWith('image')) {
      return (
        <Image
          width={48}
          height={48}
          alt={file.name}
          src={URL.createObjectURL(file)}
          className=" rounded border p-0.5"
        />
      );
    } else {
      return <Icon icon="tabler:file-description" />;
    }
  };
  const handleRemoveFile = (file) => {
    const uploadedFiles = files;
    const filtered = uploadedFiles.filter((i) => i.name !== file.name);
    setFiles([...filtered]);
  };
  const fileList = files.map((file) => (
    <div
      key={file.name}
      className=" my-6 flex justify-between rounded-md border px-3.5 py-3"
    >
      <div className="flex items-center space-x-3">
        <div className="file-preview">{renderFilePreview(file)}</div>
        <div>
          <div className=" text-card-foreground  text-sm">{file.name}</div>
          <div className=" text-muted-foreground text-xs font-light">
            {Math.round(file.size / 100) / 10 > 1000 ? (
              <>{(Math.round(file.size / 100) / 10000).toFixed(1)}</>
            ) : (
              <>{(Math.round(file.size / 100) / 10).toFixed(1)}</>
            )}
            {' kb'}
          </div>
        </div>
      </div>
      <Button
        size="icon"
        color="destructive"
        variant="outline"
        className=" rounded-full border-none"
        onClick={() => handleRemoveFile(file)}
      >
        <Icon icon="tabler:x" className=" size-5" />
      </Button>
    </div>
  ));
  const handleRemoveAllFiles = () => {
    setFiles([]);
  };
  return (
    <div className="p-4">
      <div className="mb-4 flex items-center gap-1 px-4 py-1">
        <Icon
          icon="heroicons:link-20-solid"
          className="text-default-500 size-4"
        />
        <div className="text-default-500 text-sm font-medium">Attachments</div>
      </div>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <div className="border-default-300 bg-default-50 rounded-sm border border-dashed py-9 text-center">
          <div className="text-default-900 flex items-center justify-center gap-1 text-sm font-medium">
            <Link className="text-default-600 size-4" />
            Drag & drop or
            <span className="underline">choose files</span>
          </div>
        </div>
      </div>
      {files.length ? (
        <Fragment>
          <div>{fileList}</div>
          <div className=" flex justify-end space-x-2">
            <Button color="destructive" onClick={handleRemoveAllFiles}>
              Remove All
            </Button>
          </div>
        </Fragment>
      ) : null}
    </div>
  );
};
export default Attachments;
