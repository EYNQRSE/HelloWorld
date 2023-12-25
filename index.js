const express = require('express');
const app = express();
const port = process.env.PORT || 3002;
//const mongoURI = process.env.MONGODB_URI
app.use(express.json());

app.get('/',(req,res) => {
    res.send('welcome to YOMOM')
});

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cybercafe Management System API',
      description: 'API for managing visitors in a cybercafe',
      version: '1.0.0',
    },
  },
  apis: ['./swagger.js'], //files containing annotations as above
};
const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


//connect to mongodb
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://B022120016:hUF1LQVnNZ5d2QpI@group12.7c7yswx.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

client.connect().then(res => {
  console.log(res);
});

//admin configuration
app.post('/login/admin', (req, res) => {
  console.log(req.body);
  login(req.body.username, req.body.password)
    .then(result => {
      if (result.message === 'Access Granted') {
        const token = generateToken({ username: req.body.username });
        res.send({ message: 'Successful login', token });
      } else {
        res.send('Login unsuccessful');
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).send("Internal Server Error");
    });
});

async function login(reqUsername, reqPassword) {
  let matchUser = await client.db('cybercafe').collection('admin').findOne({ username: { $eq: reqUsername } });

  if (!matchUser)
    return { message: "User not found!" };

  if (matchUser.password === reqPassword)
    return { message: "Access Granted", user: matchUser };
  else
    return { message: "Invalid password" };
}

//display all customer
app.get('/view/customer/admin', verifyToken, async (req, res) => {
    try {

      console.log(req.admin);

      const result = await client
        .db('cybercafe')
        .collection('customer')
        .find()
        .toArray();
  
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });
app.put('/update/computer/:computername', verifyToken, async (req, res) => {
    const computername = req.params.computername;
    const { systemworking,available} = req.body;
  
    try {
      console.log(req.admin)
      const updatecomputerResult = await client
        .db('configure')
        .collection('computer')
        .updateOne({computername},
          { $set: { systemworking, available}});
  
      if (updatecomputerResult.modifiedCount === 0) {
        return res.status(404).send('computer not found or unauthorized');
      }
  
      res.send('computer updated successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
});
// Function to get available cabins
async function getAvailableCabins() {
  try {
    const result = await client
      .db('configure')
      .collection('computer')
      .find({ systemworking: 'yes' }, { _id: 0, cabinno: 1, computername: 1, available: 1 })
      .toArray();

    return result.map(computer => ({
      cabinno: computer.cabinno,
      computername: computer.computername,
      availability: computer.available,
      // Include other relevant computer information
    }));
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

  
// Route to see available cabins
app.get('/available/cabins', async (req, res) => {
  try {
    const availableCabins = await getAvailableCabins();
    res.send(availableCabins);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

  
//customer signup
app.post('/create/customer', async (req, res) => {
  let result = createcustomer(
    req.body.customername,
    req.body.idproof,
    req.body.password
  ); 
  res.send(result);
});

function createcustomer(reqcustomername, reqidproof, reqpassword, reqentrytime = 0, reqcabin = 0, reqpayment = 0, reqtimespend = 0) {
client.db('cybercafe').collection('customer').insertOne({
    "customername": reqcustomername,
    "idproof": reqidproof,
    "password": reqpassword,
    "cabinno": reqcabin,
    "entrytime": reqentrytime,
    "payment": reqpayment,
    "timespend": reqtimespend,
  });
  return "your account has been created. Welcome YOMOM member!!:D";
}

// customer login
app.post('/login/customer', async (req, res) => {
    try {
      const result = await customerLogin(req.body.idproof, req.body.password);
      if (result.message === 'Correct password') {
        const token = generateToken({ idproof: req.body.idproof });
        res.send({ message: 'Successful login. Welcome to YOMOM CYBERCAFE', token });
      } else {
        res.send('Login unsuccessful');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  async function customerLogin(idproof, password) {
    let matchUser = await client.db('cybercafe').collection('customer').findOne({ idproof: { $eq: idproof } });
  
    if (!matchUser) {
      return { message: 'User not found!' };
    }
  
    if (matchUser.password === password) {
      return { message: 'Correct password', user: matchUser };
    } else {
      return { message: 'Invalid password' };
    }
  }
  
//computer configuration
app.get('/view/computer/admin', verifyToken, async (req, res) => {
    try {
      const result = await client
      .db('configure').collection('computer').find().toArray();
  
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
});

function generateToken(userData) {
  const token = jwt.sign(
    userData,
    'password',
    {expiresIn: 600}
  );

  console.log(token);
  return token;
}

function verifyToken(req, res, next) {
  let header = req.headers.authorization;
  if (!header) {
    res.status(401).send('Unauthorized');
    return;
  }

  let token = header.split(' ')[1];

  jwt.verify(token, 'password', function (err, decoded) {
    if (err) {
      res.status(401).send('Unauthorized');
      return;
    }
    req.admin = decoded;
    next();
  });
}
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.post('/create/customer/admin', verifyToken, async (req, res) => {
  let result = createcustomer(
    req.body.customername,
    req.body.idproof
  ); 
  res.send(result);
});

app.patch('/update/value/:id',async(req,res)=>{
  const search = req.params.id;
  const value = req.body.value;
  await client.db().collection().updateOne({id: search},{$set:value});
}) 