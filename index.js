var AWS = require('aws-sdk');
const reqq = require('request');
// Set the region 
AWS.config.update({region: 'us-east-1'});
var url_Append = ""

// Create S3 service object
s3 = new AWS.S3({apiVersion: '2006-03-01',signatureVersion: 'v4'});

var bucketParams = {
        Bucket : "parascloud"
};

const express = require('express')
const app = express();
app.use(express.json())

app.post('/storedata' , (req,res) => {
    const data = req.body
    console.log(data)
    abc(req,res)
})

app.post('/t' , (req,res) => {
  const da =  "asd asd asd asd ad ad " + req.body.content 
  res.status(200).json({
          "da" : da
        })
})

app.post('/deletefile' , (req , res) => {
  console.log(" I am calling ")
  const requestedUrl = req.body.s3uri;

  if(url_Append !== ""){
    if(requestedUrl === url_Append){
      console.log("File deletion")
      

      var deleteParams = {
        Bucket: 'parascloud',
        Key: 'trial.txt'
      }

      s3.deleteObject(deleteParams, function(err, data) {
      if (err) {
        console.log(err, err.stack); 
        res.status(404).json({
          "Error" : "There is some error"
        })
      }
      else {    
        url_Append = ""
        res.status(200).json({
          "Message" : "File Deleted Sucessfully"
        }) 
                 
      }
      });     
    }else {
      res.status(404).json({
          "Error" : "Url Doesnt match with the original URL"
        })
    }
  }else {
    res.status(404).json({
          "Error" : "Not Found"
        })
  }
  
})

app.post('/appenddata' , (req,res) => {

  const dataToAdd = req.body.toString;

  //Reading the data of the file in bucket
  new AWS.S3().getObject(
  { Bucket: "parascloud" ,Key: "trial.txt" }, 
  function(err, data) {
    if (!err) {
      const body = Buffer.from(data.Body).toString('utf8');
      //res.send({data : body}) 
      d = body + req.body.data
      var para = {
        Bucket : "parascloud",
        Key : "trial.txt",
        Body : body + req.body.data
      }

      s3.upload(para , (err , data) => {
      if(err){
        res.send({Message : "Err" , Err : err}) 
      }else {
        console.log("data of File :- " + d)
        var params = {Bucket: 'arpitpatel', Key: 'trial.txt'};
        s3.getSignedUrl('getObject', params, function (err, url) {
        console.log('The URL is', url);
        url_Append = "https://parascloud.s3.amazonaws.com/trial.txt"
        res.status(200).json({
          "s3uri" : "https://parascloud.s3.amazonaws.com/trial.txt"
        })
        //res.send({Url : url , Err : err}) 
        });

    }
})


    }else {
      res.send({data : err}) 
    }
  }
);
})

const abc = async(req,res) =>  s3.createBucket(bucketParams , (err,data) => {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data.Location);
    s3 = new AWS.S3({params:bucketParams})
    //console.log(req.body)
    var para = {
        Key : "trial.txt",
        Body : req.body.data
    }
    def(para,req,res)
  }
})

const def = async(para,req,res) => s3.upload(para , (err , data) => {
    if(err){
      res.send({Message : "Err" , Err : err}) 
    }else {
        var params = {Bucket: 'parascloud', Key: 'trial.txt'};
        s3.getSignedUrl('getObject', params, function (err, url) {
        console.log('The URL is', url);
        url_Append = "https://parascloud.s3.amazonaws.com/trial.txt";
        res.status(200).json({
          "s3uri" : "https://parascloud.s3.amazonaws.com/trial.txt"
        })
        //res.send({Url : url , Err : err}) 
        });

    }
})

const initCallme = () => {
  reqq.post(
    'http://52.23.207.11:8081/start',{ json: { 
        banner : "B00911202",
        ip : "18.212.181.67:3000",
     } },)

}


app.listen(3000 , initCallme)
