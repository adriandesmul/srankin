const path = require('path');
const fs = require('fs');
const Nunjucks = require('nunjucks');
const mkdirp = require('mkdirp');
const watch = require('watch');

Nunjucks.configure({noCache: true})

var environment = (process.argv[2] == '--local') ? 'local' : 'production'

function fromDir(startPath) {

  if (!fs.existsSync(startPath)) {
    return;
  }

  var files = fs.readdirSync(startPath);

  files.forEach((file) => {
    const filename = path.join(startPath, file);
    const stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      fromDir(filename);
    } else if (filename.indexOf('.html') >= 0) {
      let compiledFile = Nunjucks.render(filename);
      let saveTo = path.join('./dist',filename.split(path.normalize('./src'))[1]);
      console.log(saveTo)
      mkdirp.sync(path.dirname(saveTo))
      fs.writeFileSync(saveTo, compiledFile);
    } else {
      let saveTo = path.join('./dist',filename.split(path.normalize('./src'))[1]);
      console.log(saveTo)
      mkdirp.sync(path.dirname(saveTo))
      fs.copyFileSync(filename, saveTo);
    }

  })
}

fromDir('./src');

if (environment == 'local') {
  watch.createMonitor('./src', (monitor) => {
    monitor.on('changed', () => {

      console.log("-- Update HTML --")
      fromDir('./src');

    })
  })
}
/*
htmlFiles.map((file) => {
  let compiledFile = Nunjucks.render(file);
  let saveTo = path.join('./dist',file.split(path.normalize('./src'))[1]);
  console.log(saveTo)
  mkdirp.sync(path.dirname(saveTo))
  fs.writeFileSync(saveTo, compiledFile);
})

console.log(htmlFiles)

if (environment == 'local') {
  watch.createMonitor('./src', (monitor) => {
    monitor.on('changed', () => {

      console.log("-- Update HTML --")

      fromDir('./src', '.html');
      htmlFiles.map((file) => {
        let compiledFile = Nunjucks.render(file);
        let saveTo = path.join('./dist',file.split(path.normalize('./src'))[1]);
        console.log(saveTo)
        mkdirp.sync(path.dirname(saveTo))
        fs.writeFileSync(saveTo, compiledFile);
      })

    })
  })
}
*/
