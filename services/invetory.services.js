// here we will create function which perform db related tasks like insert update and so on. 

const {connection} = require('../lib/db')

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
        let insertQuery = `INSERT INTO inventory(DeviceName, Quantity, PricePerDay) VALUES('${name}','${quantity}','${price}');`
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





function checkItemAvaliabitlty(req,res,next){
    console.log("checkkkkkkkAVVVVVV")
    let deviceName = []
    let prices = []
    let itemspromise = new Promise((resolve,reject)=>{
      let checkInventor = `SELECT * FROM inventory`;
      connection.query(checkInventor,(dberr,dbresp)=>{
        if(dberr==null){
          dbresp.forEach(element => {
            console.log("elements",element) 
          });

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







module.exports={
    upsertInventory,
    checkItemAvaliabitlty
}