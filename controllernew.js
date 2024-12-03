// function checkAndInsertData(req,res,next){
//     try{
//       let dataFound;
//         console.log("checkdataaaa",req.body)
//         data = req.body
//         query1 = `select * from inventory;`
//         connection.query(query1,(err,resp)=>{
//         if(!err){
//           console.log("yhaa ayaaa")
//           for(let i = 0; i<resp.length;i++){
//             if(data.name==resp[i]['DeviceName']){
//               console.log("this iteam already exists",resp[i])
//               newquantity = parseInt(resp[i]['Quantity'])+parseInt(data.quantity)
//               console.log("newwwwquantity",newquantity)
//               updatequery = `UPDATE inventory SET Quantity=${newquantity},PricePerDay=${data.price} WHERE DeviceName="${data.name}";`
//               connection.query(updatequery,(err,resp)=>{
//               if(!err){
//                 console.log("new values for the existing data is updated",resp)
//                 }
//               else{
//                 console.log("value not inserted properly",err)
//                   }
//                 })
//                 }
//               else{
//                 dataFound = true
//               }
//               }
//             }
                
//         if(dataFound){
//           console.log("data is new")
//           query = `INSERT INTO inventory(DeviceName,Quantity, PricePerDay) VALUES('${data.name}','${data.quantity}','${data.price}');`
//           connection.query(query,(err,resp)=>{
//             if(err){
//               console.log("there is some issue in inserting data in inventory table",err)
//             }
//             else{
//               console.log("Data inserted successfully",resp)
//             }}
//         )}
//       next()
//       })
//       }
//     catch(err){
//       console.log(err.lineNumber,"ccc");
//     }
  
//   }


function checkAndInsertData(req,res,next){
  data = req.body
  console.log("body ka data",data)
  query1 = `select * from inventory where DeviceName = "${data.name}";`
  let searchDataPromise = new Promise((resolve,reject)=>{
    connection.query(query1,(dberr,dbresp)=>{
    console.log("resss",dbresp.length)
    console.log("dberr",dberr)
      if(dbresp.length>0){
        return resolve(dbresp)
        }
      else{
        return reject(dberr)
        }
      })
  })
  searchDataPromise.then((dbresp)=>{
    console.log("here then",dbresp[0]['Quantity'])
      let insertIntoInventory = new Promise((resolve,reject)=>{
        let newquantity = parseInt(dbresp[0]['Quantity'])+parseInt(data.quantity);
        updatequery = `UPDATE inventory SET Quantity=${newquantity}, PricePerDay=${data.price} WHERE DeviceName="${data.name}";`
        connection.query(updatequery,(err,resp)=>{
        // console.log("resp",resp.length)
        console.log("errrr",err)
            if(err){
                return reject(`An Error Occured while updating inventorytable ${err}`)
            }
            // else if(resp.length>0){
            //     return resolve(resp)
            // }
            else{
                return resolve(`invetory data updated successfully`);
            }
        })
      })
      return insertIntoInventory
    }).then((resp)=>{
        console.log("data updated successfully")
        // console.log(resp)    
      })
      .catch((err)=>{
        console.log("Error while inserting data",err)
      })

    searchDataPromise.catch((myerr)=>{
    console.log("errrrr",myerr)
    let insertPromise = new Promise((resolve,reject)=>{
      console.log("heyyyyyy")
      let insertQuery = `INSERT INTO inventory(DeviceName, Quantity, PricePerDay) VALUES('${data.name}','${data.quantity}','${data.price}');`
      connection.query(insertQuery,(dberr,dbresp)=>{
        console.log("yee ayya",dberr)
        console.log("yee ayya dbrespdbresp",dbresp)
        if(dberr){
          console.log("Error while inserting data in inventory table")
          return reject(`Error while inserting data in inventory table ${dberr}`)
        }
        else{
          console.log(`data is inserted successfully in inventory table`)
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



  function DataBaseHandler(req,res,next){
    console.log("yhaa aya")
    // var query1 = `SELECT EXISTS( SELECT 1 FROM information_schema.tables WHERE table_schema = 'inventory_database' AND table_name = 'inventoryeeee');`
    let inventoryQuery = `SELECT * FROM inventory;`;
    let rentQuery = `SELECT * FROM rent;`;
    connection.query(inventoryQuery,(err,resp)=>{
      if(err){
        connection.query(`CREATE TABLE inventory(
          object_Id INT AUTO_INCREMENT PRIMARY KEY ,
          DeviceName VARCHAR(255) UNIQUE,
          Quantity INT(5),
          PricePerDay Double);`,(err,resp)=>{
            if(err){
              console.log("Error while creating Inventory Table")
            }
            else{
              console.log("Inventory table created successfully")
            }
          })
      }
      else{
        console.log("Inventory table already exists")
      }
      connection.query(rentQuery,(err,resp)=>{
        if(err){
          connection.query(`CREATE TABLE rent(
            Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            RentedDate DATE NOT NULL,
            object_Id Int,
            FOREIGN KEY(object_Id) REFERENCES inventory(object_Id),
            TotalCharges DOUBLE,
            RenterEmail VARCHAR(255),
            RenterName VARCHAR(255),
            Quantity INT(5) NOT NULL,
            status ENUM("ACTIVE","INACTIVE") NOT NULL);`,(err,resp)=>{
              if(err){
                console.log("Error while creating rent table",err)
              }
              else{
                console.log("rent table created successfully")
              }
            }
          )
        }else{
          console.log("rent table already exists")
        }
      })  
    })
    next()
  }
  



// RENT WALA DATA

function rentingObject(req,res,next){
  let data = req.body
  console.log("heyyyyyyyylogggg",req.body);
  console.log("itemnameeeeeee",data['item-name']);
  let checkPromise = new Promise((resolve,reject)=>{
    let checkDbQuery = `SELECT * FROM inventory WHERE DeviceName = "${data['item-name']}";`
    connection.query(checkDbQuery,(dberr,dbresp)=>{
      console.log("dberrrrrr22",dberr)
      console.log("dbresp",dbresp)
      if(dberr){
        console.log(`didn't able to find from inventory table`,dberr)
        return reject(dberr)
      }
      else{
        console.log(`got the data from inventory table`,dbresp)
        return resolve(dbresp)
      }
    })
  })
  checkPromise.then((dbresp)=>{
    console.log("quantity in dbb",dbresp[0].PricePerDay)
    console.log("form in quantity",parseInt(data.quantity))
    if(parseInt(data.quantity)<=dbresp[0].Quantity){
      let updatedInventoryQuantity = dbresp[0].Quantity-parseInt(data.quantity)
      console.log("DB Data is more than require data",dbresp[0].Quantity-parseInt(data.quantity))
      // let date = new Date().toISOString().split('T')[0]
      console.log("dbresp[0].PricePerDay ",dbresp[0].PricePerDay)
      console.log("data['rental-duration']",data['rental-duration'])
      let TotalCharges = dbresp[0].PricePerDay*data['rental-duration']
      console.log("TOTAL CHARGEsssssS",TotalCharges)
      if(dbresp[0].Quantity-parseInt(data.quantity)>0){
        let values = [
          data['start-date'], 
          dbresp[0].object_Id, 
          TotalCharges, 
          data['renter-email'], 
          data['renter-name'], 
          data.quantity, 
          'active'
      ];
        let rentItemPromise = new Promise((resolve,reject)=>{
          let rentEntryQuery = `INSERT INTO rent (RentedDate, object_Id, TotalCharges, RenterEmail, RenterName, Quantity, status) VALUES (?, ?, ?, ?, ?, ?, ?)`;

          connection.query(rentEntryQuery,values,(dberr,dbresp)=>{
            if(dberr){
              return reject(dberr)
            }
            else{
              return resolve(dbresp)
            }
          })
        })
      rentItemPromise.then((dbresp)=>{
        console.log("rent data inserted in the database",dbresp)
      })
      }
    }
    else{
      console.log("Insufficient Data")
      
    }
  })
  checkPromise.catch((dberr)=>{
    console.log("No such iteam in our db",dberr)
  })
  next()
}


function inventoryItemCheck(req,res,next){
  // let inventoryDataObject = {}
  let deviceName = []
  let prices = []
  let itemspromise = new Promise((resolve,reject)=>{
    let checkInventor = `SELECT * FROM inventory`;
    connection.query(checkInventor,(dberr,dbresp)=>{
      console.log("yhaaaa",dberr)
      console.log("yhaaaa2",dbresp)
      if(dberr==null){
        dbresp.forEach(element => {
          console.log("elements",element)
          
        });
        // for(let i=0;i<dbresp.length;i++){
        //   console.log("idharrr2",dbresp[i].DeviceName)
        // }
        

        if(dbresp.length==0){
          console.log("nhi mila data")
          return resolve("There is no data")
        }
        else{
          console.log("mil gya he data",dbresp)
          return resolve(dbresp)
        }
      }
      else{
        console.log("idhaar kya")
        return reject(dbresp)
      }
    });
  });
  itemspromise.then((dbresp)=>{
    req.datagot = dbresp;
  })
  itemspromise.catch((dberr)=>{
    req.datagot = dberr;
  })
  itemspromise.finally(()=>{
    // req.datagot = dbresp
    next();
  });

};



  module.exports = {
    DataBaseHandler,
    checkAndInsertData,
    inventoryItemCheck,
    rentingObject
  }