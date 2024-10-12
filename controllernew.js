
function rentingObject(req,res,next){
  let data = req.body
  // console.log("heyyyyyyyylogggg",req.body);
  console.log("itemnameeeeeee",data.item_name);
  let checkPromise = new Promise((resolve,reject)=>{
    let checkDbQuery = `SELECT * FROM inventory WHERE DeviceName = "${data.item_name}";`
    connection.query(checkDbQuery,(dberr,dbresp)=>{
      if(dberr){
        console.log("thingssss",dberr)
        return reject(`didn't able to find from inventory table ${dberr}`)
      }
      else{
        console.log("dbrespdbresp",dbresp)
        return resolve(`got the data from inventory table ${dbresp}`)
      }
    })
  })
  checkPromise.then((dbresp)=>{
    console.log("quantity in db",dbresp[0].Quantity)
    console.log("form in quantity",parseInt(data.quantity))
    if(parseInt(data.quantity)<=dbresp[0].Quantity){
      let updatedInventoryQuantity = dbresp[0].Quantity-parseInt(data.quantity)
      console.log("DB Data is more than require data",dbresp[0].Quantity-parseInt(data.quantity))
      let date = new Date().toISOString().split('T')[0]

      let rentEntryQuery = `INSERT INTO rent(RentedDate, ReturnDate, object_Id ,TotalCharges ,RenterEmail ,RenterName ,Quantity ,status ) VALUES('${date}, ',)`
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
    checkAndInsertData,
    inventoryItemCheck,
    rentingObject
  }