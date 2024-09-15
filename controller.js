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
    console.log("resss",dbresp)
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
        updatequery = `UPDATE inventory SET Quantity=${newquantity},PricePerDay=${data.price} WHERE DeviceName="${data.name}";`
        connection.query(updatequery,(err,resp)=>{
        console.log("errrr",err)
          if(err){
            return reject(err)
          }
          else{
            return resolve(resp)
          }
        })
      })
      insertIntoInventory.then((resp)=>{
        console.log("data updated successfully",resp)
        console.log(resp)
      })
      insertIntoInventory.catch((err)=>{
        console.log("Error while inserting data",err)
      })
  })
  searchDataPromise.catch((myerr)=>{
    console.log("errrrr",myerr)
    let insertPromise = new Promise((resolve,reject)=>{
      console.log("heyyyyyy")
      let insertQuery = `INSERT INTO inventory(DeviceName, Quantity, PricePerDay) VALUES('${data.name}','${data.quantity}','${data.price}');`
      connection.query(insertQuery,(dberr,dbresp)=>{
        console.log("yee ayya",dberr)
        if(dberr){
          console.log("Error while inserting data in inventory table")
          return reject(dberr)
        }
        else{
          console.log(`data is inserted successfully in inventory table`)
          return resolve(dbresp)
        }
      })
    })
    insertPromise.then((dbresp)=>{
      console("data inserted successfully",dbresp)
    })
    insertPromise.catch((dberr)=>{
      console("data didn't inserted successfully",dberr)
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
          Id INT AUTO_INCREMENT PRIMARY KEY ,
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
            Id INT NOT NULL PRIMARY KEY,
            RentedDate DATE NOT NULL,
            ReturnDate DATE NOT NULL,
            FOREIGN KEY(Id) REFERENCES inventory(Id),
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
      next()
    })
  }
  



function rentingObject(req,res,next){
  console.log("heyyyyyyyylogggg",req.body)
  let renting

  return 

}



  module.exports = {
    DataBaseHandler,
    checkAndInsertData,
    rentingObject
  }