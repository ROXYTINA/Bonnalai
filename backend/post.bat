@echo off
REM File upload request to the Bonnalai API
REM Use this command to upload files to the API

curl.exe -X POST http://localhost:3000/stuff ^
  -F "file=@D:\year4\YEAR 4 Documents\S1\Computer Architecture\02. Parallel architecture fundamental.pdf" ^
  -F "subjectId=1" ^
  -F "yearId=5" ^
  -F "title=IP" ^
  -F "description=IP"

