export interface DownloadedFileInfo {
  source: {
    name: string;
    ext: string;
  };
  destination: { temp: { video: string; audio?: string } };
}
