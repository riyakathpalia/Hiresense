const Client = require('ssh2-sftp-client');
const path = require('path');
const sftp = new Client();

async function uploadFiles(){
    try{
        await sftp.connect({
            host:'3.111.149.53',
            port:22,
            username:'ubuntu',
            privateKey: require('fs').readFileSync('ai-copilot-key 1.pem')
        });

        const localDir = path.join(__dirname, '/resumes');
        console.log('Local Directory:', localDir);
        const remoteDir = '/home/ubuntu/akash/hiresense_data/resume/'
        const files = [
            'Resume1.pdf',
            'Resume2.pdf',
            'Resume3.pdf'
        ]

        for (const file of files) {
            const localPath = path.join(localDir, file);
            const remotePath = `${remoteDir}${file}`;
            await sftp.put(localPath, remotePath);
            console.log(`Uploaded: ${file}`);
          }

    }catch (err) {
        console.error('Error:', err);
      } finally {
        sftp.end();
      }
} 

uploadFiles();