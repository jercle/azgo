const { exec } = require('child_process');
const fs = require('fs');

const createReport = async (opt) => {
  const date = new Date().toString();
  const folderName = './sec_reports';
  const logFile = `${folderName}/scanLogs.log`;
  const fileName = `${opt}`;
  const filePath = `${folderName}/${fileName}`;
  const imageName = process.cwd().split('/').slice('-1')[0].toLowerCase();
  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    } else {
    }
  } catch (err) {
    console.error(err);
  }

  fs.writeFileSync(logFile, `Scan started: ${date}\n`);

  if (opt === 'image') {
    exec(
      `docker build -f ./pipelines/Dockerfile -t trivy-${imageName} --platform linux/amd64 .`,
      (err, data) => {
        exec(
          `trivy -d ${opt} -f json -o ./${filePath}.json trivy-${imageName}`,
          (err, data) => {
            const jsonFile = fs.readFileSync(`${filePath}.json`);
            const results = JSON.parse(jsonFile.toString());
            const dataObj = { dateRun: date, results };
            fs.writeFileSync(
              `${filePath}.json`,
              JSON.stringify(dataObj, null, 2)
            );
          }
        ).stdio.forEach((i) => {
          i.on('data', (output) => {
            output.split('\n').map((line) => {
              if (line != '') {
                console.log(`${opt}ScanJson: ${line}`);
                fs.appendFileSync(logFile, `${opt}ScanJson: ${line}\n`, 'utf8');
              }
            });
          });
        });
        exec(
          `trivy -d ${opt} -o ./${filePath}.txt trivy-${imageName}`,
          (err, data) => {
            const txtFile = fs.readFileSync(`${filePath}.txt`);
            fs.writeFileSync(`${filePath}.txt`, `${date}\n\n`);
            fs.appendFileSync(`${filePath}.txt`, txtFile.toString());
          }
        ).stdio.forEach((i) => {
          i.on('data', (output) => {
            output.split('\n').map((line) => {
              if (line != '') {
                console.log(`${opt}ScanText: ${line}`);
                fs.appendFileSync(logFile, `${opt}ScanText: ${line}\n`, 'utf8');
              }
            });
          });
        });
        exec(
          `trivy -d ${opt} -t @${__dirname}/../trivyTemplates/html.tpl -f template -o ./${filePath}.html trivy-${imageName}`,
          (err, data) => {}
        ).stdio.forEach((i) => {
          i.on('data', (output) => {
            output.split('\n').map((line) => {
              if (line != '') {
                console.log(`${opt}ScanHtml: ${line}`);
                fs.appendFileSync(logFile, `${opt}ScanHtml: ${line}\n`, 'utf8');
              }
            });
          });
        });
      }
    ).stdio.forEach((i) => {
      i.on('data', (output) => {
        output.split('\n').map((line) => {
          if (line != '') {
            console.log(`${opt}Build: ${line}`);
            fs.appendFileSync(logFile, `${opt}Build: ${line}\n`, 'utf8');
          }
        });
      });
    });
  } else {
    exec(
      `trivy -d ${opt} -f json -o ./${filePath}.json --skip-dirs ${folderName} .`,
      (err, data) => {
        const jsonFile = fs.readFileSync(`${filePath}.json`);
        const results = JSON.parse(jsonFile.toString());
        const dataObj = { dateRun: date, results };
        fs.writeFileSync(`${filePath}.json`, JSON.stringify(dataObj, null, 2));
      }
    ).stdio.forEach((i) => {
      i.on('data', (output) => {
        output.split('\n').map((line) => {
          if (line != '') {
            console.log(`${opt}ScanJson: ${line}`);
            fs.appendFileSync(logFile, `${opt}ScanJson: ${line}\n`, 'utf8');
          }
        });
      });
    });
    exec(
      `trivy -d ${opt} -o ./${filePath}.txt --skip-dirs ${folderName} .`,
      (err, data) => {
        const txtFile = fs.readFileSync(`${filePath}.txt`);
        fs.writeFileSync(`${filePath}.txt`, `${date}\n\n`);
        fs.appendFileSync(`${filePath}.txt`, txtFile.toString());
      }
    ).stdio.forEach((i) => {
      i.on('data', (output) => {
        output.split('\n').map((line) => {
          if (line != '') {
            console.log(`${opt}ScanText: ${line}`);
            fs.appendFileSync(logFile, `${opt}ScanText: ${line}\n`, 'utf8');
          }
        });
      });
    });
    exec(
      `trivy -d ${opt} -t @${__dirname}/../trivyTemplates/html.tpl -f template -o ./${filePath}.html --skip-dirs ${folderName} .`,
      (err, data) => {}
    ).stdio.forEach((i) => {
      i.on('data', (output) => {
        output.split('\n').map((line) => {
          if (line != '') {
            console.log(`${opt}ScanHtml: ${line}`);
            fs.appendFileSync(logFile, `${opt}ScanHtml: ${line}\n`, 'utf8');
          }
        });
      });
    });
  }
};

const generateIacReports = async () => {
  createReport('fs');
  createReport('config');
  !process.cwd().split('/').slice('-1')[0].toLowerCase().includes('iac') &&
    createReport('image');
};

generateIacReports();
