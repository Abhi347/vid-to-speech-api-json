import { videoBucket, downloadFile, uploadFlac } from "../utils/storage-utils";
import { extractAudio } from "../utils/ffmpeg-utils";

export default async (event) => {
  const videoFile = videoBucket.file(event.data.name);
  console.log("downloading video file 2...");
  const fileInfo = await downloadFile(videoFile, event.data.name);

  //extract audio and transcode to FLAC
  const {
    destination: {
      temp: { audio: tempAudioPath },
    },
  } = await extractAudio(fileInfo);

  console.log(`Uploading ${tempAudioPath} to flac bucket`);
  return uploadFlac(tempAudioPath);
};
