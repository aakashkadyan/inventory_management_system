
const {upsertInventory, itemInInventory,upsertInventoryByName,insertIntoRentDb} = require("../services/invetory.services")


const path = require("path");
const templatePath = path.join(__dirname,"..")+"/templates"
console.log("templaathhhh",templatePath)


function IndexPage(req,resp,next){
  resp.sendFile(path.join(templatePath,"index.html"))
  next()
}


function addItemPage(req,res,next){
  res.sendFile(path.join(templatePath,"add_item.html"))
  next()
}


function rentPage(req,res,next){
  // let date = new Date().toISOString().split('T')[0]
  // console.log("heyyy22332",date)
  res.sendFile(path.join(templatePath,"rent.html"))
  next()
}


function returnPage(req,res,next){
  res.sendFile(path.join(templatePath,"return.html"))
  next()
}


function overviewPage(req,res,next){
  res.sendFile(path.join(templatePath,"overview.html"))
  next()
}


function contactPage(req,res,next){
  res.sendFile(path.join(templatePath,"contact.html"))
  next()
}

function customerPage(req,res,next){
  res.sendFile(path.join(templatePath,"customer.html"))
}


function upsertInventoryProduct(req,res,next){
  console.log("yeee ",req.body)
  upsertInventory(req,res,next)
  next()
}







// function checkAndInsertData(req,res,next){
//   try{
//     let dataFound;
//       console.log("checkdataaaa",req.body)
//       data = req.body
//       query1 = `select * from inventory;`
//       connection.query(query1,(err,resp)=>{
//       if(!err){
//         if(resp.length<=0){
//         console.log("yhaa ayaaa",resp)
//         for(let i = 0; i<resp.length;i++){
//           console.log("nameee",resp)
//           if(data.name==resp[i]['DeviceName']){
//             console.log("this iteam already exists",resp[i])
//             newquantity = parseInt(resp[i]['Quantity'])+parseInt(data.quantity)
//             console.log("newwwwquantity",newquantity)
//             updatequery = `UPDATE inventory SET Quantity=${newquantity},PricePerDay=${data.price} WHERE DeviceName="${data.name}";`
//             connection.query(updatequery,(err,resp)=>{
//             if(!err){
//               console.log("new values for the existing data is updated",resp)
//               }
//             else{
//               console.log("value not inserted properly",err)
//                 }
//               })
//               }
//           else{
//               dataFound = true
//               console.log("heeey")
//             }
//             }
//           }
              
//       if(dataFound){
//         console.log("data is new")
//         query = `INSERT INTO inventory(DeviceName,Quantity, PricePerDay) VALUES('${data.name}','${data.quantity}','${data.price}');`
//         connection.query(query,(err,resp)=>{
//           if(err){
//             console.log("there is some issue in inserting data in inventory table",err)
//           }
//           else{
//             console.log("Data inserted successfully",resp)
//           }}
//       )}
//     next()
//     })
//     }
//   catch(err){
//     console.log(err.lineNumber,"ccc");
//   }
// }



  

// RENT WALA DATA

// function rentingObject(req,res,next){
//   let data = req.body
//   console.log("itemnameeeeeee",data.item_name);
//   let checkPromise = new Promise((resolve,reject)=>{
//     let checkDbQuery = `SELECT * FROM inventory WHERE DeviceName = "${data.item_name}";`
//     connection.query(checkDbQuery,(dberr,dbresp)=>{
//       if(dberr){
//         console.log("thingssss",dberr)
//         return reject(`didn't able to find from inventory table ${dberr}`)
//       }
//       else{
//         console.log("dbrespdbresp",dbresp)
//         return resolve(`got the data from inventory table ${dbresp}`)
//       }
//     })
//   })
//   checkPromise.then((dbresp)=>{
//     console.log("quantity in db",dbresp[0].Quantity)
//     console.log("form in quantity",parseInt(data.quantity))
//     if(parseInt(data.quantity)<=dbresp[0].Quantity){
//       let updatedInventoryQuantity = dbresp[0].Quantity-parseInt(data.quantity)
//       console.log("DB Data is more than require data",dbresp[0].Quantity-parseInt(data.quantity))
//       let date = new Date().toISOString().split('T')[0]

//       let rentEntryQuery = `INSERT INTO rent(RentedDate, ReturnDate, object_Id ,TotalCharges ,RenterEmail ,RenterName ,Quantity ,status ) VALUES('${date}, ',)`
//     }
//     else{
//       console.log("Insufficient Data")
      
//     }
//   })
//   checkPromise.catch((dberr)=>{
//     console.log("No such iteam in our db",dberr)
//   })
//   next()
// }


async function inventoryItemCheck(req,res,next){
  try{
    console.log("CONTROLLERRRRR",req.body.status)
    const elements =await itemInInventory()
    res.newfinalData = elements;
    // res.send(elements)
    // console.log("Dattaaa",elements)
    // res.send(elements)
    next()

  }catch(error){
    console.error("Error While fatching inventory")
  } 
}



async function rentingObject(req,res,next){
  console.log("heyyyyyyyyyyyyyyyyyyyy",req.body)
  let data = req.body
  let itemName = req.body.item_name
  let requestedQuantity = data.quantity
  let Quantity = data.Quantity
  let rentStartDate = data['start-date']
  let renterName = data['renter-name']
  let renterEmail = data['renter-email']
  let rentingTimePeriod = data['rental-duration']
  console.log("itemNameitemName",itemName)
  console.log("dataaaa",data.item_name)
  console.log("Quantity",Quantity)
  console.log("price",data.price)
  console.log("requestedQuantity",requestedQuantity)
  console.log("rental-duration",data["rental-duration"])

  // const {itemName,Quantity,price,rentDuration,requestedQuantity,startDate,renterName,renterContact,renterEmail} = req.body
  if (Number(requestedQuantity) > Number(Quantity)) {
    return res.status(400).json({
      status: "error",
      message: "Insufficient quantity available"
    });
  }

  try {

    let upsertOutPut = await upsertInventoryByName(itemName, requestedQuantity);
    console.log("dataaa milaa he kya", upsertOutPut);
    let rentedId = upsertOutPut.objectId
    let totalBill = data.price*data['rental-duration']
    let insertDataInRentDb = await insertIntoRentDb(rentStartDate,rentedId,totalBill,renterEmail,renterName,requestedQuantity)

    // Send response back to client after inventory update
    res.status(200).json({
      status: "success",
      message: "Rental request successfully processed",
      GrandTotal_Bill : totalBill
    });
  } catch (err) {
      console.log("Error while updating inventory:", err);
      res.status(500).json({
      status: "error",
      message: "An error occurred while processing the rental request"
    });
  }
}
  // }else{
  //   console.log("yhaaa mila kuchchh")
  //   updatingQuantity = requestedQuantity
  //   console.log("yhaa name he",itemName)
  //   let upsertOutPut = await upsertInventoryByName(itemName,updatingQuantity)
  //   console.log("dataaa milaa he kya",upsertOutPut)

    // let findByNameQuery = async function ({itemName}){
    //   console.log("idhar naam dekh",itemName)
    //   const result = await connection.promise().query(`SELECT * FROM inventory WHERE DeviceName = "${itemName}"`);
    //   console.log("Resultttt",result)
    // console.log("findanameeee",findByNameQuery)













  module.exports = {
    inventoryItemCheck,
    rentingObject, IndexPage,
    addItemPage, rentPage,
    returnPage, overviewPage,
    contactPage, customerPage,
    upsertInventoryProduct,
    rentingObject
  }