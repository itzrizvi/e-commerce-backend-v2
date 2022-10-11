const {parse, join} = require("path"); // This is node built in package
const {createWriteStream} = require("fs"); // this is node built in package
const fs = require("fs"); // this is node built in package
require('dotenv').config()
const S3 = require('aws-sdk/clients/s3')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)

const readBucketName = process.env.AWS_READ_BUCKET_NAME
const writeBucketName = process.env.AWS_WRITE_BUCKET_NAME
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
    if(fn == '') name = `${Math.floor((Math.random() * 10000) + 1)}`;
    else name = fn
    const fileName = `${name}-${Date.now()}${ext}`
    let url = join(__dirname, `../../tmp/${fileName}`);
    const imageStream = createWriteStream(url)
    await stream.pipe(imageStream);
    const folderName = folder == '' ? fileName : `${folder}/${fileName}`
    const uploadParams = {
        Bucket: writeBucketName,
        Body: stream,
        Key: folderName
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
        const folderName = folder == '' ?  fileName : `${folder}/${fileName}`
        const uploadParams = {
            Bucket: writeBucketName,
            Body: stream,
            Key: folderName
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
      Bucket: readBucketName
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


// Delete Single file from aws
  module.exports.deleteFile = (folder, key, ext) => {
    const uploadParams = {
        Bucket: writeBucketName,
        Key: folder + key + "." + ext
      }
    s3.deleteObject(uploadParams).promise()
    const uploadParams2 = {
      Bucket: readBucketName,
      Key: folder + key + "." + ext
    }
    s3.deleteObject(uploadParams2).promise()
    const sizes = ['128x128', '400x400', '800x800', '1200x1200']
    sizes.forEach( (size) => {
      const uploadParams3 = {
        Bucket: readBucketName,
        Key: folder + size + '_' + key  + "." + ext
      }
      s3.deleteObject(uploadParams3).promise()
    })
    return;
  }

  // Delete Multiple file
  module.exports.deleteFiles = (files) => {
    const uploadParams = {
        Bucket: writeBucketName,
        Delete:{
          Objects:[]
        }
      }
      files.forEach((object) => {
          uploadParams.Delete.Objects.push({
            Key: object.folder + object.key + "." + object.ext
          })
      });
    s3.deleteObjects(uploadParams).promise()


    const uploadParams2 = {
      Bucket: readBucketName,
      Delete:{
        Objects:[]
      }
    }
    files.forEach((object) => {
      uploadParams2.Delete.Objects.push({
          Key: object.folder + object.key + "." + object.ext
        })
    });
    s3.deleteObjects(uploadParams2).promise()

    const sizes = ['128x128', '400x400', '800x800', '1200x1200']
    sizes.forEach( (size) => {
      const uploadParams3 = {
        Bucket: readBucketName,
        Delete:{
          Objects:[]
        }
      }

      files.forEach((object) => {
        uploadParams3.Delete.Objects.push({
            Key: object.folder + size + '_' + object.key  + "." + object.ext
          })
      });


      s3.deleteObjects(uploadParams3).promise()
    })

    return;
} 