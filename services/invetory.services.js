// here we will create function which perform db related tasks like insert update and so on. 

const {connection,inventoryDataWithName} = require('../lib/db.js')

function upsertInventory(req,res,next){
    const {name,quantity,price} = req.body
    query1 = `select * from inventory where DeviceName = "${name}";`
    let searchDataPromise = new Promise((resolve,reject)=>{
      connection.query(query1,(dberr,dbresp)=>{
        if(dbresp.length>0){
          return resolve(dbresp)
          }
        else{
          return reject(dberr)
          }
        })
    })
    searchDataPromise.then((dbresp)=>{
        let insertIntoInventory = new Promise((resolve,reject)=>{
          let newquantity = parseInt(dbresp[0]['Quantity'])+parseInt(quantity);
          updatequery = `UPDATE inventory SET Quantity=${newquantity}, PricePerDay=${price} WHERE DeviceName="${name}";`
          connection.query(updatequery,(err,resp)=>{
              if(err){
                  return reject(`An Error Occured while updating inventorytable ${err}`)
              }
              else{
                  return resolve(`invetory data updated successfully`);
              }
          })
        })
        return insertIntoInventory
      }).then((resp)=>{
          console.log("data updated successfully")
        })
        .catch((err)=>{
          console.log("Error while inserting data",err)
        })
      searchDataPromise.catch((myerr)=>{
      let insertPromise = new Promise((resolve,reject)=>{
        let insertQuery = `INSERT INTO inventory(DeviceName, InventoryQuantity, PricePerDay) VALUES('${name}','${quantity}','${price}');`
        connection.query(insertQuery,(dberr,dbresp)=>{
          console.log("yee ayya",dberr)
          console.log("yee ayya dbrespdbresp",dbresp)
          if(dberr){
            return reject(`Error while inserting data in inventory table ${dberr}`)
          }
          else{
            return resolve(`data is inserted successfully in inventory table ${dbresp}`)
          }
        })
      })
      insertPromise.then((dbresp)=>{
        console.log("data inserted successfully",dbresp)
      })
      insertPromise.catch((dberr)=>{
        console.log("data didn't inserted successfully",dberr)
      })
    }) 
    next()   
}





function itemInInventory(){
    console.log("checkkkkkkkAVVVVVV")
    let deviceName = []
    let prices = []
    let totalquantity = []
    let finalData = {}
    let everyThingFromInventory = `SELECT * FROM inventory;`
    return new Promise((resolve,reject)=>{
      connection.query(everyThingFromInventory,(dberr,dbresp)=>{
        if(!dberr){
          console.log("deekh idhar response",dbresp)
          dbresp.forEach(element => {
            deviceName.push(element.DeviceName)
            prices.push(element.PricePerDay)
            totalquantity.push(element.InventoryQuantity)
          });
        }
        else{
          console.log("kuch nhi",dbresp)
        }
      finalData['prices']=prices
      finalData['deviceName']=deviceName
      finalData['totalQuantity']=totalquantity
      resolve(finalData)
      });
    });
  }








async function upsertInventoryByName(itemName,requestedQuantity){
    console.log("yhaa tk ayaa",itemName)
    console.log("updatingQuantity",typeof(requestedQuantity))
    // let finalData = await connection.query(searchQuary,(dberr,dbresp)=>{
    //   if(dberr){
    //     console.log("dberrdberr",dberr)
    //   }
    //   console.log("inventoryMe ye data mila he",dbresp)
    //   let newquantity = Number(requestedQuantity)-Number(dbresp['Quantity'])
    // })
    try {
      let dbresp = await inventoryDataWithName(itemName)
      console.log("YEEE DEKHHH",dbresp)
      console.log("inventoryMe ye data mila he", dbresp[0].InventoryQuantity);
      let updatedInventoryQuantity = Number(dbresp[0].InventoryQuantity)-Number(requestedQuantity)
      // console.log("updatedInventoryQuantityupdatedInventoryQuantity",updatedInventoryQuantity)
      let insertUpdatedQuantity = `UPDATE inventory SET InventoryQuantity = ${updatedInventoryQuantity} WHERE DeviceName = "${itemName}"; `
      let upsertStatus = await new Promise((resolve,reject)=>{
        connection.query(insertUpdatedQuantity,(dberr,dbres)=>{
          if (dberr){
            console.log("dberrrrrr",dberr)
            reject(dberr)
          }
          else{
            console.log("dbressppp",dbres)
            resolve(dbres)
          }
        })

      })
      
      console.log("final data",updatedInventoryQuantity)
      console.log("upsertStatus upsertStatus",upsertStatus)
      let dataForFrontend = {"status":upsertStatus,
        "data":"Inventory Updated",
        objectId : dbresp[0]['object_Id']
      }
      return dataForFrontend
    }catch(err){
      console.log("Error",err)
    }
}



async function insertIntoRentDb(rentStartDate,rentedId,totalBill,renterEmail,renterName,requestedQuantity,status="Active"){
  let insertQuery = `INSERT INTO rent(RentedDate,object_Id,TotalCharges,RenterEmail,RenterName,RentedQuantity,status) VALUES("${rentStartDate}",${rentedId},${totalBill},"${renterEmail}","${renterName}",${requestedQuantity},"${status}");`
  console.log("Insert Query for rent db",insertQuery)
  let queryResp = await connection.query(insertQuery,(err,res)=>{
    if(err){
      console.log("Error While Inserting in rentDb",err)
    }
    else{
      console.log("RentDB entry DOne successfully")
    }

  })
  console.log("dekh kya mila",queryResp)
}




  //   let itemspromise =  await connection.query(checkInventor,(dberr,dbresp)=>{if(dberr==null){
  //         dbresp.forEach(element => {
  //           console.log("elements",element) 
  //         });

  //         if(dbresp.length==0){
  //           console.log("nhi mila data")
  //           return resolve("There is no data")
  //         }
  //         else{
  //           console.log("mil gya he data",dbresp)
  //           return resolve(dbresp)
  //         }
  //       }
  //     });
  //   });
  //   itemspromise.then((dbresp)=>{
  //     req.datagot = dbresp;
  //   })
  //   itemspromise.catch((dberr)=>{
  //     req.datagot = dberr;
  //   })
  //   itemspromise.finally(()=>{
  //     req.datagot = dbresp
  //     next(req.datagot);
  //   });
  // };

async function rentedDataByEmail(renterEmail){
  let searchQuary = `SELECT * FROM rent WHERE RenterEmail = "${renterEmail}"`
  console.log("searchQuary",searchQuary)
  let data =  await new Promise((resolve,reject) => { 
    connection.query(searchQuary,(dberr,dbresp) =>{
    if (dberr){
      console.log("There is a problem",dberr)
      reject(dberr)
      }
    else{
      console.log("dbresssss",dbresp)
      resolve(dbresp)
      }
   })
  })
  console.log("dataaaaa",data)
  return data
}

async function deviceNameWithObjectId(objectIds,renterEmail){
  console.log("OBJECT IDS",objectIds)
  console.log("OBJECT IDS renterEmail",renterEmail)
  // let NameByObjectId = `SELECT inventory.object_Id,DeviceName,RentedQuantity,RenterEmail,TotalCharges,RentedDate,status FROM inventory,rent WHERE inventory.object_Id IN (${objectIds});`
  let NameByObjectId = `SELECT rent.object_Id,DeviceName,RentedQuantity,RenterEmail,TotalCharges,RentedDate,status FROM rent INNER JOIN inventory ON rent.object_Id = inventory.object_Id WHERE rent.object_Id IN (${objectIds}) AND rent.RenterEmail="${renterEmail}";`
  let rentedDataWithDeviceName = await new Promise((resolve,reject)=>{
    connection.query(NameByObjectId,(dberr,dbresp)=>{
      if(dberr){
        console.log("this is error of db",dberr)
        reject(dberr)
      }
      else{
        console.log("dbresponse is this",dbresp)
        resolve(dbresp)
      }
    })
  })
  return rentedDataWithDeviceName
}





module.exports={
    upsertInventory,
    itemInInventory,
    upsertInventoryByName,
    insertIntoRentDb,
    rentedDataByEmail,
    deviceNameWithObjectId
}