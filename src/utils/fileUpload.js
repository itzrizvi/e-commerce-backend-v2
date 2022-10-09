const {parse, join} = require("path"); // This is node built in package
const {createWriteStream} = require("fs"); // this is node built in package
const fs = require("fs"); // this is node built in package
require('dotenv').config()
const S3 = require('aws-sdk/clients/s3')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
  })

module.exports.singleFileUpload = async (file, folder = '', fn = '') => {
    const {createReadStream, filename} = await file;
    const stream = createReadStream();
    var {ext, name} = parse(filename);
    console.log(fn);
    if(fn == '') name = `${Math.floor((Math.random() * 10000) + 1)}`;
    else name = fn
    const fileName = `${name}-${Date.now()}${ext}`
    let url = join(__dirname, `../../tmp/${fileName}`);
    const imageStream = createWriteStream(url)
    await stream.pipe(imageStream);
    const uploadParams = {
        Bucket: bucketName,
        Body: stream,
        Key: folder ? `${folder}/${fileName}` : fileName
    }
    const upload =  await s3.upload(uploadParams).promise()
    await unlinkFile(url)
    return upload
} // This is single readfile

module.exports.multipleFileUpload = async (file, folder= '', fn = '') => {
    let fileUrl = [];
    for (let i = 0; i < file.length; i++) {
        const {createReadStream, filename} = await file[i];
        const stream = createReadStream();
        var {ext, name} = parse(filename);
        if(fn == '') name = `${Math.floor((Math.random() * 10000) + 1)}`;
        else name = fn
        const fileName = `${name}-${Date.now()}${ext}`
        let url = join(__dirname, `../../tmp/${fileName}`);
        const imageStream = createWriteStream(url)
        await stream.pipe(imageStream);
        const uploadParams = {
            Bucket: bucketName,
            Body: stream,
            Key: folder ? `${folder}/${fileName}` : fileName
        }
        const upload =  await s3.upload(uploadParams).promise()
        await unlinkFile(url)
        fileUrl.push({upload});
    }
    return fileUrl
}

// downloads a file from s3
  async function getFileStream(req, res) {

    const key = req.params[0]

    const downloadParams = {
      Key: key,
      Bucket: bucketName
    }

    // Using callbacks
    s3.headObject(downloadParams, function (err) {  
        if(err && err.name){
            return res.send('Inavalid file key, Please provide valid file key.')
        }
       return s3.getObject(downloadParams).createReadStream().pipe(res)
    });
  }
  exports.getFileStream = getFileStream