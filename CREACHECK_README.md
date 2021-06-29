Creacheck custom Build of ckeditor5

Where to fin inside this Repo:

/packages/ckeditor5-build-inline-creacheck

How to deploy:

After writing you Plugins and storing them in src - folder of the custom build
you have to make a "yarn build"

Make sure that the project folder of this Repo is on same directory lvl as the creacheck
mein repo folder. Otherwise the path for deployment will be wrong.
Otherwise change the deploy path by changing the output path in webpack config:
packages/ckeditor5-build-inline-creacheck/webpack.config.js

Before deploying to creacheck project we have to delete the ckeditor files inside
creacheck project. So we delete following files / folders:

- ckeditor.js
- ckeditor.js.map
- translations

In path: creacheck/creacheck/web/js/cc-editor/build/

This is nessaccery because of an bug inside webpack ckeditor build scripts on deploying
translations folder outside the ckeditor repo.
Link to github issue: https://github.com/ckeditor/ckeditor5/issues/8450

After deploying to creacheck project we have to run the following commands there:

- cd creacheck && npm run dev
- cd ..
- ./bin/docker-phpsync.sh dev
