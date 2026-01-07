cd app
npm install
npm run build
cd ../render
npm install
npm run build
cd ..
mkdir render/dist/electron

cp -a app/dist render/dist/electron
