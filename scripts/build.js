const path = require('path');
const fs = require('fs');

const root = path.dirname(__dirname);

const files = [
  'pull-down.wxs',
  'index.weapp.tsx',
  'index.template.wxml',
];
// const deleteFiles = ['ComponentResizeObserver.tsx', 'index.h5.tsx'];

function exec() {
  const fromBase = path.join(root, 'src/components/list-view');
  const toBase = path.join(root, 'dist/weapp/components/list-view');
  // deleteFiles.forEach(f => fs.unlinkSync(path.join(toBase, f)));
  files.forEach(f =>
    fs.copyFileSync(path.join(fromBase, f), path.join(toBase, f))
  );

  const indexFile = path.join(root, 'dist/weapp/index.ts');

  const content = fs.readFileSync(indexFile).toString();

  fs.writeFileSync(
    path.join(root, 'dist/weapp/index.js'),
    content.replace('h5', 'tsx')
  );

  const weappIndex = path.join(
    root,
    'dist/weapp/components/list-view/index.weapp.tsx'
  );


  fs.renameSync(weappIndex, weappIndex.replace('.weapp', ''));

  fs.unlinkSync(indexFile);
}

exec();
