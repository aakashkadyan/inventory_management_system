// here i will keep the function, responsible for creating and maintaining the tables in db

const mysql = require('mysql');





let connection = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"inventory_database"
  })
  
// connection.connect()

async function ensureTableExists(req,res,next){
    let selectInventoryQuery = `SELECT * FROM inventory;`;
    let selectRentQuery = `SELECT * FROM rent;`;
    connection.query(selectInventoryQuery,(err,resp)=>{
      if(err){
        connection.query(`CREATE TABLE inventory(
          object_Id INT AUTO_INCREMENT PRIMARY KEY ,
          DeviceName VARCHAR(255) UNIQUE,
          InventoryQuantity INT(5),
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
      connection.query(selectRentQuery,(err,resp)=>{
        if(err){
          connection.query(`CREATE TABLE rent(
            Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            RentedDate DATE NOT NULL,
            object_Id Int,
            FOREIGN KEY(object_Id) REFERENCES inventory(object_Id),
            TotalCharges DOUBLE,
            RenterEmail VARCHAR(255),
            RenterName VARCHAR(255),
            RentedQuantity INT(5) NOT NULL,
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
}

const initDb = async function () {
  console.log("db bnna rha he")
  await connection.query();
  console.log("hua kya connect")
  await ensureTableExists()
};




function upsertData(req,res,next){
  data = req.body
  console.log("body kaaa ",data)
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
      let insertQuery = `INSERT INTO inventory(DeviceName, InventoryQuantity, PricePerDay) VALUES('${data.name}','${data.quantity}','${data.price}');`
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



async function inventoryDataWithName(itemName){
  let searchQuery = `SELECT * FROM inventory WHERE DeviceName = "${itemName}"`
      // Wait for the query result
      const dbresp = await new Promise((resolve, reject) => {
          connection.query(searchQuery, (err, result) => {
              if (err) {
                  reject(err);
              } else {
                  resolve(result);
              }
          });
      });
  return dbresp
}






  // console.log("heyyyyyyyylogggg",data);
  // console.log("itemnameeeeeee",itemName);
  // let checkPromise = new Promise((resolve,reject)=>{
  //   connection.query(checkDbQuery,(dberr,dbresp)=>{
  //     if(dberr){
  //       console.log("thingssss",dberr)
  //       return reject(`didn't able to find from inventory table ${dberr}`)
  //     }
  //     else{
  //       console.log("dbrespdbresp",dbresp)
  //       return resolve(`got the data from inventory table ${dbresp}`)
  //     }
  //   })
  // })
  // checkPromise.then((dbresp)=>{
  //   console.log("quantity in db",dbresp[0].Quantity)
  //   console.log("form in quantity",parseInt(data.quantity))
  //   if(parseInt(data.quantity)<=dbresp[0].Quantity){
  //     let updatedInventoryQuantity = dbresp[0].Quantity-parseInt(data.quantity)
  //     console.log("DB Data is more than require data",dbresp[0].Quantity-parseInt(data.quantity))
  //     let date = new Date().toISOString().split('T')[0]

  //     let rentEntryQuery = `INSERT INTO rent(RentedDate, ReturnDate, object_Id ,TotalCharges ,RenterEmail ,RenterName ,Quantity ,status ) VALUES('${date}, ',)`
  //   }
  //   else{
  //     console.log("Insufficient Data")
      
  //   }
  // })
  // checkPromise.catch((dberr)=>{
  //   console.log("No such iteam in our db",dberr)
  // })
  // next()






module.exports = {
    initDb,
    upsertData,
    connection,
    inventoryDataWithName
    
}
  


