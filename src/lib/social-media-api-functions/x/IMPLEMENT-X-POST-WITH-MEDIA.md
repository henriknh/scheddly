I want you to implement X(Twitter) posting of images and video

Quickstart
This guide will help you make your first requests to upload media using the X API v2 media upload endpoint(s).
For this guide, the chunked POST /2/media/upload endpoints are used to upload a video, which requires an adjusted workflow from single image uploads.
For video or chunked uploads, you must:
Initialize the upload using the INIT command
Upload each chunk of bytes using the APPEND command
Complete the upload using the FINALIZE command
Note: See this sample code for an example written in Python.
​
Authentication
In order to run the examples provided in this guide you will need to use OAuth 2 authentication.
You can find your CONSUMER_KEY, CONSUMER_SECRET, ACCESS_KEY, ACCESS_TOKEN in the App inside of your Project in the dashboard of the Developer Portal.
​
Step 1 : POST media/upload (INIT)
The INIT command request is used to initiate a file upload session. It returns a media_id which should be used to execute all subsequent requests. The next step after a successful return from INIT command is the APPEND command.
See Best Practices for constraints and requirements on media files.
Example Request

Copy

Ask AI
curl --location 'https://api.x.com/2/media/upload' \
 --header 'Authorization: Bearer <YOUR_ACCESS_TOKEN>' \
 --header 'Content-Type: multipart/form-data' \
 --form 'command=INIT' \
 --form 'media_type=video/mp4' \
 --form 'total_bytes=1024' \
 --form 'media_category=amplify_video'
Note: When making raw HTTP requests, the request should be either multipart/form-data or application/x-www-form-urlencoded POST formats.
Example Response

Copy

Ask AI
{
"data":
{
"id":"1880028106020515840",
"media_key":"13_1880028106020515840",
"expires_after_secs":1295999
}
}
The response provides the media identifiers id (string) and media_key (string). The entire file must be uploaded before expires_after_secs seconds.
​
Step 2 : POST media/upload (APPEND)
The APPEND command is used to upload a chunk (consecutive byte range) of the media file. For example, a 3 MB file could be split into 3 chunks of size 1 MB, and uploaded using 3 APPEND command requests. After the entire file is uploaded, the next step is to call the FINALIZE command.
There are a number of advantages of uploading a media file in small chunks:
Improved reliability and success rates under low bandwidth network conditions
Uploads can be paused and resumed
File chunks can be retried individually
Ability to tune chunk sizes to match changing network conditions e.g on cellular clients
Example Request

Copy

Ask AI
curl --location 'https://api.x.com/2/media/upload' \
 --header 'Authorization: Bearer <YOUR_ACCESS_TOKEN>' \
 --header 'Content-Type: multipart/form-data' \
 --form 'command=APPEND' \
 --form 'media_id=1880028106020515840' \
 --form 'segment_index=0' \
 --form 'media=@/path/to/your/media/file.mp4'
segment_index is an ordered index of file chunk. It must be between 0-999 inclusive. The first segment has index 0, second segment has index 1, and so on. Continue uploading the file chunks until all the chunks are uploaded.
Note: When making raw HTTP requests, the request should be multipart/form-data POST format.
Note: HTTP 2XX will be returned with an empty response body on successful upload.
​
Step 3 : POST media/upload (FINALIZE)
The FINALIZE command should be called after the entire media file is uploaded using APPEND commands. If and (only if) the response of the FINALIZE command contains a processing_info field, it may also be necessary to use a STATUS command and wait for it to return success before proceeding to Post creation.
Example Request

Copy

Ask AI
curl --location --request POST 'https://api.x.com/2/media/upload' \
 --header 'Authorization: Bearer <YOUR_ACCESS_TOKEN>' \
 --header 'Content-Type: multipart/form-data' \
 --form 'command=FINALIZE' \
 --form 'media_id=1880028106020515840'
Note: When making raw HTTP requests, the request should be either multipart/form-data or application/x-www-form-urlencoded POST formats.
Example Response

Copy

Ask AI
{
"data": {
"id": "1880028106020515840",
"media_key": "13_1880028106020515840",
"size": 1024,
"expires_after_secs": 86400,
"processing_info": {
"state": "pending",
"check_after_secs": 1
}
}
}
The response provides a media identifier in the media_id (64-bit integer) and media_id_string (string) fields. Use the media_id_string provided in the API response from JavaScript and other languages that cannot accurately represent a long integer.
The returned media_id is only valid for expires_after_secs seconds. Any attempt to use mediaId after this time period in other API calls will result in a Bad Request (HTTP 4xx) response.
If the response contains a processing_info field, then use the STATUS command to poll for the status of the FINALIZE operation. The async finalize approach is used for cases where media processing requires more time. In future, all video and animated GIF processing will only be supported using async finalize. This behavior is enabled if an upload session was initialized with a media_category parameter, and when then media type is either video or animated GIF.
Note: If a processing_info field is NOT returned in the response, then media_id is ready for use in other API endpoints.
​
Step 4 : GET media/upload (STATUS)
The STATUS command is used to periodically poll for updates of media processing operation. After the STATUS command response returns succeeded, you can move on to the next step which is usually create Post with media_id.
Note: The STATUS command should be used if and (only if) the response of the FINALIZE command or a previous STATUS command contained a processing_info field.
​
Example Request

Copy

Ask AI
curl --location --request GET 'https://api.x.com/2/media/upload?command=STATUS&media_id=1880028106020515840' \
 --header 'Authorization: Bearer <YOUR_ACCESS_TOKEN>'
​
Example Response

Copy

Ask AI
{
"data":{
"id":"1880028106020515840",
"media_key":"13_1880028106020515840",
"processing_info":{
"state":"uploading" // state transition flow is pending -> in_progress -> [failed|succeeded]
}
}
}
The response body contains processing_info field which provides information about current state of media processing operation. It contains a state field which has transition flow: pending -> in_progress -> [failed | succeeded]. You can not use the media_id to create Post or other entities before the state field is set to succeeded.
​
Step 5 : Post Tweet with Media
Creates a Post using the POST /2/tweets endpoint, including the media_id on behalf of an authenticated user.
Example Request

Copy

Ask AI
curl --location 'https://api.x.com/2/tweets' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <YOUR_ACCESS_TOKEN>'
--data '{
"text": "I made a post with media!",
"media": {
"media_ids": [
"1880028106020515840"
]
}
}'

Example Response

Copy

Ask AI
{
"data": {
"edit_history_tweet_ids": [
"1880028106020515840"
],
"id": "1880028106020515840",
"text": "I made a post with media! https://t.co/DqNyXX"
}
}
​
Troubleshooting
For issues with the Media APIs, browse the Media API category in the developer forums for an answer.

You shall use the latest v2 API @https://docs.x.com/x-api/introduction
@https://docs.x.com/x-api/posts/create-post
@https://docs.x.com/x-api/media/introduction
@https://docs.x.com/x-api/media/quickstart/best-practices
@https://docs.x.com/x-api/media/quickstart/media-upload-chunked

@https://docs.x.com/x-api/media/upload-media
https://api.x.com/2/media/upload

@https://docs.x.com/x-api/media/initialize-media-upload
https://api.x.com/2/media/upload/initialize

@https://docs.x.com/x-api/media/append-media-upload
https://api.x.com/2/media/upload/{id}/append

@https://docs.x.com/x-api/media/finalize-media-upload
https://api.x.com/2/media/upload/{id}/finalize

@https://docs.x.com/x-api/media/get-media-upload-status
https://api.x.com/2/media/upload

Read the attached API docs/references linked. Make a thurogh plan to implement this and execute in absolute detail. I want it to be the best implementation ever. Make sure to use the latest API available.

Thank you. You are the best! <3
