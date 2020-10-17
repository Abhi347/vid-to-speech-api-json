import path from "path";
import { Storage, Bucket, File } from "@google-cloud/storage";

const appConfig = require("../app-config");

const storageClient = new Storage();

export const videoBucket = storageClient.bucket(appConfig.buckets.video);
export const flacBucket = storageClient.bucket(appConfig.buckets.audio);
export const outputBucket = storageClient.bucket(
  appConfig.buckets.speechResponse
);

export const getFilePathFromFile = (storageFile: File) => {
  return `gs://${storageFile.bucket.name}/${storageFile.name}`;
};

export const downloadFile = async (file: File, fileName: string) => {
  console.log("Download started for " + fileName);
  let sourcePath = path.parse(fileName);
  let tempDestination = "/tmp/" + fileName;
  const response = await file.download({
    destination: tempDestination,
  });
  return {
    source: {
      name: sourcePath.name,
      ext: sourcePath.ext,
    },
    destination: { temp: { video: tempDestination } },
  };
};

export const uploadToBucket = async (bucket: Bucket, filepath: string) => {
  return bucket.upload(filepath);
};

export const uploadFlac = (filepath: string) => {
  return flacBucket.upload(filepath);
};

export const uploadJsonOutput = (filepath: string) => {
  return outputBucket.upload(filepath);
};
