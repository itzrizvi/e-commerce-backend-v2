const { parse, join } = require("path"); // This is node built in package
const { createWriteStream } = require("fs"); // this is node built in package
const fs = require("fs"); // this is node built in package
require('dotenv').config()
const config = require('config');
const S3 = require('aws-sdk/clients/s3')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)

const region = config.get('AWS.BUCKET_REGION');
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
})

module.exports.singleFileUpload = async ({ file, folder = '', idf, fileName = '', bucketName }) => {
  const { createReadStream, filename } = await file;
  const stream = createReadStream();
  var { ext } = parse(filename);
  if (fileName == '') imageName = `${Math.floor((Math.random() * 10000) + 1)}`;
  else imageName = fileName
  const fileNameExt = imageName + ext
  let url = join(__dirname, `../../tmp/${fileNameExt}`);
  const imageStream = createWriteStream(url)
  await stream.pipe(imageStream);
  const folderName = folder == '' ? fileNameExt : `${folder}/${idf}/${fileNameExt}`
  const uploadParams = {
    Bucket: bucketName,
    Body: stream,
    Key: folderName
  }
  const upload = await s3.upload(uploadParams).promise()
  await unlinkFile(url)
  return upload
} // This is single readfile

module.exports.multipleFileUpload = async ({ file, folder = '', idf, fileName = '', bucketName }) => {
  let fileUrl = [];
  for (let i = 0; i < file.length; i++) {
    const { createReadStream, filename } = await file[i];
    const stream = createReadStream();
    var { ext } = parse(filename);
    if (fileName == '') imageName = `${Math.floor((Math.random() * 10000) + 1)}`;
    else imageName = fileName
    const fileNameExt = `${imageName}-${Date.now()}${ext}`
    let url = join(__dirname, `../../tmp/${fileNameExt}`);
    const imageStream = createWriteStream(url)
    await stream.pipe(imageStream);
    const folderName = folder == '' ? fileNameExt : `${folder}/${idf}/${fileNameExt}`
    const uploadParams = {
      Bucket: bucketName,
      Body: stream,
      Key: folderName
    }
    const upload = await s3.upload(uploadParams).promise()
    await unlinkFile(url)
    fileUrl.push({ upload });
  }
  return fileUrl
}

// downloads a file from s3
async function getFileStream(req, res) {

  const key = req.params[0]
  const type = key.split('/')[0]
  let bucketName;

  switch (type) {
    case 'brand':
      bucketName = config.get("AWS.BRAND_IMG_DEST").split("/")[0]
      break;
    case 'product':
      bucketName = config.get("AWS.PRODUCT_IMG_THUMB_DEST").split("/")[0]
      break;
    case 'category':
      bucketName = config.get("AWS.CATEGORY_IMG_DEST").split("/")[0]
      break;
    case 'user':
      bucketName = config.get("AWS.USER_IMG_DEST").split("/")[0]
      break;
    default:
      bucketName = config.get("AWS.READ_BUCKET")
      break;
  }

  const downloadParams = {
    Key: key,
    Bucket: bucketName
  }

  // Using callbacks
  s3.headObject(downloadParams, function (err) {
    if (err && err.name) {
      return res.send('Inavalid file key, Please provide valid file key.')
    }
    return s3.getObject(downloadParams).createReadStream().pipe(res)
  });
}
exports.getFileStream = getFileStream



// downloads a file from s3
async function getMediaStream(key) {

  let bucketName = config.get("AWS.READ_BUCKET");

  const downloadParams = {
    Key: key,
    Bucket: bucketName
  }
  // Using callbacks
  s3.headObject(downloadParams, function (err) {
    if (err && err.name) {
      return 'Inavalid file key, Please provide valid file key.'
    }
    return s3.getObject(downloadParams).createReadStream().pipe()
  });
}
exports.getMediaStream = getMediaStream



// Delete Single file from aws
module.exports.deleteFile = ({ fileName, folder, idf, bucketName }) => {

  const uploadParams2 = {
    Bucket: bucketName,
    Key: `${folder}/${idf}/${fileName}`
  }
  s3.deleteObject(uploadParams2).promise()

  const sizes = config.get("AWS.IMAGE_SIZE")
  sizes.forEach((size) => {
    const uploadParams3 = {
      Bucket: bucketName,
      Key: `${folder}/${idf}/${size}_${fileName}`
    }
    s3.deleteObject(uploadParams3).promise()
  })
  return;
}

// Delete Multiple file
module.exports.deleteFiles = ({ filesName, folder, idf, bucketName }) => {
  const uploadParams = {
    Bucket: bucketName,
    Delete: {
      Objects: []
    }
  }
  filesName.forEach((object) => {
    uploadParams.Delete.Objects.push({
      Key: `${folder}/${idf}/${object}`
    })
  });
  s3.deleteObjects(uploadParams).promise()

  const sizes = config.get("AWS.IMAGE_SIZE")
  sizes.forEach((size) => {

    const uploadParams2 = {
      Bucket: bucketName,
      Delete: {
        Objects: []
      }
    }
    filesName.forEach((object, index) => {
      uploadParams2.Delete.Objects.push({
        Key: `${folder}/${idf}/${size}_${object}`
      })
    });


    s3.deleteObjects(uploadParams2).promise()
  })

  return;
} 