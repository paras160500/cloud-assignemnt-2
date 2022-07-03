var AWS = require('aws-sdk');
const reqq = require('request');
const port = 3000;
// Set the region 
AWS.config.update({region: 'us-east-1'});
// var url_Append = ""
// Create S3 service object
const s3 = new AWS.S3({apiVersion: '2006-03-01',signatureVersion: 'v4', credentials: {
  accessKeyId: "ASIAU7MDS6UCTSNCQOPO",
  secretAccessKey: "O7bMAiFooBkaEvFjhZuiPafDNCttaHxn02Nc46fC",
  sessionToken: "FwoGZXIvYXdzEGAaDNxBUi2WAyRizmy7sSLAAbBFYCD6jr5pWV8duf7h6Xge3fLpswP87SgirlxlOFpDqX5AkVNYS0Fe+gxGDXrhsoSR6TASygtsmO6aM/1+ybvnLs3wu3dBs9xisgLMl/SNB/eh2UxV5OvaeRyFe1cIVNPan2+973D7jQxsLLjHXAnQePDC7BzUvpYVpMjaaEJ09w2KlYNELAc9WlQcMjBvHjFTsFvNjDcyn8mi2K5Cj2cK1ktW9j4fLEwm29NMaFHm0F/0LBzQDq235y1AACvL2Cie1oaWBjItxHu4ICoJRoiNApRajTeocRLdh5KFQP/U+65kLckETezU2Tl83B5aijTe4bst"
}});

var bucketParams = {
        Bucket : "parascloud"
};

const express = require('express')
const app = express();
app.use(express.json())

app.post('/storedata' , async (req,res) => {
    const data = req.body.data
    console.log(data)
    const object = await s3.putObject({
      Bucket: "parascloud" ,Key: "trial.txt", Body: data, ACL: 'public-read'
    }).promise();

    return res.send({
      "s3uri" : "https://parascloud.s3.amazonaws.com/trial.txt"
    })
})

app.post('/deletefile', async  (req, res) => {
        var deleteParams = {
        Bucket: 'parascloud',
        Key: 'trial.txt'
      }
  try {
    await s3.deleteObject(deleteParams).promise()
    return res.send({
      message: "file deleted!"
    })
  } catch (error) {
    return res.send({
      error
    })
  }
})

// app.post('/deletefile' , (req , res) => {
//   console.log(" I am calling ")
//   const requestedUrl = req.body.s3uri;

//   if(url_Append !== ""){
//     if(requestedUrl === url_Append){
//       console.log("File deletion")
      

//       var deleteParams = {
//         Bucket: 'parascloud',
//         Key: 'trial.txt'
//       }

//       s3.deleteObject(deleteParams, function(err, data) {
//       if (err) {
//         console.log(err, err.stack); 
//         res.status(404).json({
//           "Error" : "There is some error"
//         })
//       }
//       else {    
//         url_Append = ""
//         res.status(200).json({
//           "Message" : "File Deleted Sucessfully"
//         }) 
                 
//       }
//       });     
//     }else {
//       res.status(404).json({
//           "Error" : "Url Doesnt match with the original URL"
//         })
//     }
//   }else {
//     res.status(404).json({
//           "Error" : "Not Found"
//         })
//   }
  
// })

app.post('/appenddata' , async (req,res) => {

  const dataToAdd = req.body.data;
  const remoteFile = await s3.getObject({
        Bucket: 'parascloud',
        Key: 'trial.txt'
      }).promise();
    
  const remoteData = remoteFile.Body.toString();

  const newData = `${remoteData}${dataToAdd}`;
  
  await s3.putObject({
      Bucket: "parascloud" ,Key: "trial.txt", Body: newData, ACL: 'public-read'
    }).promise();


    return res.send({
      s3uri: "https://parascloud.s3.amazonaws.com/trial.txt"
    })
  // //Reading the data of the file in bucket
  // s3.getObject(
  // { Bucket: "parascloud" ,Key: "trial.txt" }, 
  // function(err, data) {
  //   if (!err) {
  //     const body = Buffer.from(data.Body).toString('utf8');
  //     //res.send({data : body}) 
  //     d = body + req.body.data
  //     var para = {
  //       Bucket : "parascloud",
  //       Key : "trial.txt",
  //       Body : body + req.body.data
  //     }

  //     s3.upload(para , (err , data) => {
  //     if(err){
  //       res.send({Message : "Err" , Err : err}) 
  //     }else {
  //       console.log("data of File :- " + d)
  //       var params = {Bucket: 'arpitpatel', Key: 'trial.txt'};
  //       s3.getSignedUrl('getObject', params, function (err, url) {
  //       console.log('The URL is', url);
  //       url_Append = "https://parascloud.s3.amazonaws.com/trial.txt"
  //       res.status(200).json({
  //         "s3uri" : "https://parascloud.s3.amazonaws.com/trial.txt"
  //       })
  //       //res.send({Url : url , Err : err}) 
  //       });

  //   }
// })


//     }else {
//       res.send({data : err}) 
//     }
//   }
// );
})

// const abc = async(req,res) =>  s3.createBucket(bucketParams , (err,data) => {
//   if (err) {
//     console.log("Error", err);
//   } else {
//     console.log("Success", data.Location);
//     s3 = new AWS.S3({params:bucketParams})
//     //console.log(req.body)
//     var para = {
//         Key : "trial.txt",
//         Body : req.body.data
//     }
//     def(para,req,res)
//   }
// })

// const def = async(para,req,res) => s3.upload(para , (err , data) => {
//     if(err){
//       res.send({Message : "Err" , Err : err}) 
//     }else {
//         var params = {Bucket: 'parascloud', Key: 'trial.txt'};
//         s3.getSignedUrl('getObject', params, function (err, url) {
//         console.log('The URL is', url);
//         url_Append = "https://parascloud.s3.amazonaws.com/trial.txt";
//         res.status(200).json({
//           "s3uri" : "https://parascloud.s3.amazonaws.com/trial.txt"
//         })
//         //res.send({Url : url , Err : err}) 
//         });

//     }
// })




app.listen(port , () => console.log("Listening on port", port))
