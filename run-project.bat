@echo off
echo Starting the project...

echo Starting MongoDB (make sure MongoDB is installed)
start cmd /k "echo MongoDB should be running on localhost:27017"

echo Starting API server...
start cmd /k "cd api && npm run dev"

echo Starting Socket server...
start cmd /k "cd socket && npm run dev"

echo Starting Client...
start cmd /k "cd client && npm run dev"

echo All components started!
echo API: http://localhost:8800
echo Socket: http://localhost:4000
echo Client: http://localhost:5173