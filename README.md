# Vid to Speech API json

This project when run will generate a speech api json file from the provided videos.  

## Prerequisites
 - A Google Cloud Platform project
 - gcloud sdk installed and initialised with proper GCP project configuration. Check gcloud configuration using `gcloud config list` command. If no configuration is found, run `gcloud init`.
 - Three separate google cloud storage buckets with regional or multiregional settings in the same gcp project. Add the name of the buckets to `app-config.json`.
 - Access to Google Cloud Functions.

## Steps to initialize
 - Run `npm install`.
 - Replace the `video`, `audio` and `speechResponse` bucket names in `app-config.json` file with the name of your own GCS bucket names.
 - Deploy both functions using `npm run deploy` command.
 - Upload a video to the GCS bucket the name of which you have mentioned as your video bucket in `app-config.json`.
 - After some time the audio of the video file will be extracted in your `audio` bucket as a flac file of the same name as the video file.
 - After few more minutes depending on the size of the video the google speech api response json will be available in your `speechResponse` bucket.
 - Upload more videos to have multiple responses.

 ## Process flow
 - The cloud function `extractAudio` will watch for any new upload in the `video` bucket.
 - As soon as a new file is uploaded, the `extractAudio` function will extract the audio from the file and upload the audio as a flac file with the same name as the video file to the `audio` bucket.
 - The second cloud function `transcribeAudio` will watch any new upload in the `audio` bucket.
 - As soon as the `extractAudio` function uploads the extracted flac audio file to the `audio` bucket, the `transcribeAudio` function will be triggered.
 - `transcribeAudio` function will then upload the audio file to the google speech api.
 -  As soon as the response is received from google speech api, the response is converted to the json file and is uploaded to the `speechResponse` bucket.

 ## Known Issues
  - Currently both the functions doesn't check whether the uploaded files are of video or audio type. It'll run and throw error if you try to upload any other file than a video file to `video` bucket or any other file than an flac audio file to `audio` bucket.
  - Extracting the audio is fast, although same can't be said about transcribing the audio using google speech api. The function will timeout, thus you'll have to go to your GCP console and increase the timeout of at least the `transcribeAudio` cloud function by editing it.

  ## Source
  The original idea and most of the source is taken from the Hackernoon article mentioned below. I have created this repo, because they didn't provided any working code, just code fragments. The code is modularised and the deploy script is created by me.
   - [HackerNoon Article](https://hackernoon.com/making-audio-searchable-with-cloud-speech-36ce63b6b4d3)