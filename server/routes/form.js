const express=require('express');
const route=express.Router();
const FormData=require('../models/form');
var mongoose = require("mongoose");
const fs=require('fs');
var passport=require('passport');
var jwt=require('jsonwebtoken');
const XLSX=require('xlsx');
// const passport = require('../config/passport');
route.get("/", function (req, res) {
    res.send("okk check");
  });
  route.post( "/getAll",passport.authenticate('jwt', { session: false }),async function (req, res) {
    const result=await FormData.find();
    // console.log(result);
    res.send(result);
  });
  route.post("/getSome",passport.authenticate('jwt', { session: false }),async function (req, res) {
    const result=await FormData.find({company_user_id:req.body.company_user_id});
    // const result=await FormData.find({type:req.body.type});
    // result.getFilter();
    console.log(result.data);
    res.send(result);
  });
  route.get("/getPrevData",passport.authenticate('jwt', { session: false }),async function (req, res) {
    const result=await FormData.find({_id:req.body.objId});
    // const result=await FormData.find({type:req.body.type});
    // result.getFilter();
    console.log(result);
    res.send(result);
  });
  route.post("/save", function (req, res) {
    // console.log(req.body);
     
     const formData = new FormData(req.body);
     formData.save().then(() => res.send("unique_id"));
});

route.post("/update",passport.authenticate('jwt', { session: false }),async  function (req, res) {
      // const result = await
      await formData.updateOne({_id:req.body._id }, formData).then(() => res.send("unique_id"));
 
  });
  // ,passport.authenticate('jwt', { session: false })
  route.post("/getExcel",async  function (req, res) {
    const result=await FormData.find({},'contact_detail company_overview');

    console.log(result);
    const users=[
      {name:"ashutosh"}
    ]

    let dataArray=[];
    let tempObj={
      Company_Name:"",
      Name1:"",
      Designation1:"",
      Email1:"",
      Mobile1:"",
      Name2:"",
      Designation2:"",
      Email2:"",
      Mobile2:""
    };
 
    console.log(dataArray);
    for(var i=0;i<result.length;i++)
    {
tempObj.Company_Name=result[i].company_overview.name;
      if(result[i].contact_detail.length>=1)
      {
        tempObj.Name1=result[i].contact_detail[0].name;
        tempObj.Designation1=result[i].contact_detail[0].designation,
        tempObj.Email1=result[i].contact_detail[0].email,
        tempObj.Mobile1=result[i].contact_detail[0].mobile
      }
       if(result[i].contact_detail.length===2)
      {
        tempObj.Name2=result[i].contact_detail[1].name;
        tempObj.Designation2=result[i].contact_detail[1].designation,
        tempObj.Email2=result[i].contact_detail[1].email,
        tempObj.Mobile2=result[i].contact_detail[1].mobile
      }
      dataArray.push(tempObj);
    }
    
console.log(dataArray);
 

  //   "contact_detail": [
  //     {
  //         "_id": "620e65cfd3e9a95b48a171d1",
  //         "name": "Strin",
  //         "designation": "Strin",
  //         "email": "Strin",
  //         "mobile": "Strin"
  //     }
  // ]
    // for(var i=0;i<result.length;i++)
    // {
    //   let tempObj={}
    //     if(Object.keys(result[i].company_overview).includes('name'))
    //     tempObj.Company=result[i].company_overview.name;
    //     if(Object.keys(result[i].contact_detail[0]).includes('name'))
    //     tempObj.Name=result[i].contact_detail[0].name;
    //     if(result[i].contact_detail[0].designation!=undefined)
    //     tempObj.Designation=result[i].contact_detail[0].designation;
    //     if(result[i].contact_detail[0].email!=undefined)
    //     tempObj.Email=result[i].contact_detail[0].email;
    //     if(result[i].contact_detail[0].mobile!=undefined)
    //     tempObj.Mobile=result[i].contact_detail[0].mobile;
       
    //     tempObj.space="";
    //     if(result[i].contact_detail.length>1)
    //     {
    //       tempObj.Name2=result[i].contact_detail[1].name;
    //       tempObj.Designation2=result[i].contact_detail[1].designation;
    //       tempObj.Email2=result[i].contact_detail[1].email;
    //       tempObj.Mobile2=result[i].contact_detail[1].mobile;
    //     }
        // Name_2:result[0].contact_detail[1].name,
        // Designation_2:result[0].contact_detail[1].designation,
        // Email_2:result[0].contact_detail[1].email,
        // Mobile_2:result[0].contact_detail[1].mobile,
      
    //   dataArray=[...dataArray,tempObj];
    // }
    const createExcelSheet=()=>{
      const workSheet=XLSX.utils.json_to_sheet(dataArray);
      const workBook=XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workBook,workSheet,"FORM DATA");
      XLSX.write(workBook,{bookType:'xlsx',type:'buffer'})
      // XLSX.write(workBook,{bookType:'xlsx',type:'binary'})
      XLSX.writeFile(workBook,"formdata.xlsx");
      return "File created"
    }
   const response2= await createExcelSheet();
   res.download(`formdata.xlsx`);
   const deleteExcelSheet=()=>{
    fs.unlink(`formdata.xlsx`, function (err) {
      if (err) throw err;
      console.log('File deleted!');
    });
   }
  //  const response3= await deleteExcelSheet();
    res.send(result);
});

  module.exports=route