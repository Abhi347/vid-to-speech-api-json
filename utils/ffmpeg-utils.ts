import { EventEmitter } from "events";

import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";
import { DownloadedFileInfo } from "../@types/types";

ffmpeg.setFfmpegPath(ffmpegPath);

export const extractAudio = async (fileInfo: DownloadedFileInfo) => {
  let tempAudioPath = "/tmp/" + fileInfo.source.name + ".flac";
  fileInfo.destination.temp.audio = tempAudioPath;
  const {
    destination: {
      temp: { video: tempVideoPath },
    },
  } = fileInfo;
  const stream = ffmpeg(tempVideoPath)
    .videoBitrate(19200)
    .inputOptions("-vn")
    .format("flac")
    .audioChannels(1)
    .output(tempAudioPath);
  stream.run();
  await streamToPromise(stream);
  return fileInfo;
};

const streamToPromise = async (stream: EventEmitter) => {
  return new Promise((resolve, reject) => {
    stream.on("end", () => resolve());
    stream.on("error", (err) => reject(err));
  });
};

export default extractAudio;
