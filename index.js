//configure const
const express = require('express');
const app = express();
const port = process.env.PORT || 3002;
app.use(express.json());
const jwt = require('jsonwebtoken');

//connect to swagger
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

//connect to mongo
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

//front page
app.get('/',(req,res) => {
    res.send('welcome to YOMOM');
});

//function to verify token
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
        req.user = decoded;
        next();
    });
}

// function for admin token
function verifyAdminToken(req, res, next) {
    verifyToken(req, res, function () {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            res.status(403).send('Forbidden: Admin access required');
        }
    });
}
// admin login
app.post('/login/admin', (req, res) => {
    login(req.body.username, req.body.password)
      .then(result => {
        if (result.message === 'Access Granted') {
          const token = generateToken({ username: req.body.username, role: 'admin' });
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
    let matchUser = await client.db('cybercafe').collection('admin').findOne({ username: reqUsername });
  
    if (!matchUser)
      return { message: "User not found!" };
  
    if (matchUser.password === reqPassword)
      return { message: "Access Granted", user: matchUser };
    else
      return { message: "Invalid password" };
  }

//update computer (admin)
app.put('/update/computer/:computername', verifyAdminToken, async (req, res) => {
    const computername = req.params.computername;
    const { systemworking, available } = req.body;

    try {
        console.log(req.user)
        const updatecomputerResult = await client
            .db('configure')
            .collection('computer')
            .updateOne({ computername },
                { $set: { systemworking, available } });

        if (updatecomputerResult.modifiedCount === 0) {
            return res.status(404).send('computer not found or unauthorized');
        }

        res.send('computer updated successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

//view available computer
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
        }));
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

app.get('/available/cabins', async (req, res) => {
    try {
        const availableCabins = await getAvailableCabins();
        res.send(availableCabins);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Admin create member
app.post('/create/member', verifyAdminToken, async (req, res) => {
    console.log(req.user.role === 'admin');

    let result = await createMember(
        req.body.memberName,
        req.body.idproof,
        req.body.password
    );
    res.send(result);
});

async function createMember(reqmemberName, reqidproof, reqpassword) {
    try {
        await client.db('cybercafe').collection('customer').insertOne({
            "memberName": reqmemberName,
            "idproof": reqidproof,
            "password": reqpassword,  // Consider hashing and salting the password
            "role": "member"
        });
        return "Member account has been created. Welcome YOMOM member!!:D";
    } catch (error) {
        console.error(error);
        return "Failed to create member account. Please try again later.";
    }
}

// Member login
app.post('/login/member', async (req, res) => {
    try {
        const result = await memberLogin(req.body.idproof, req.body.password);
        if (result.message === 'Correct password') {
            const token = generateToken({ idproof: req.body.idproof, role: 'member' });
            res.send({ message: 'Successful login. Welcome to YOMOM CYBERCAFE', token });
        } else {
            res.send('Login unsuccessful');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

async function memberLogin(idproof, password) {
    try {
        let matchUser = await client.db('cybercafe').collection('customer').findOne({ idproof: idproof });

        if (!matchUser) {
            return { message: 'User not found!' };
        }

        // Consider using a library like bcrypt to compare hashed passwords
        if (matchUser.password === password) {
            return { message: 'Correct password', user: matchUser };
        } else {
            return { message: 'Invalid password' };
        }
    } catch (error) {
        console.error(error);
        return { message: 'Internal Server Error' };
    }
}

// Member create visitor
app.post('/create/visitor', verifyToken, async (req, res) => {
    try {
        console.log(req.user)
        const memberName = req.user.memberName;

        // Call the modified createVisitor function
        let result = await createVisitor(
            memberName,
            req.body.visitorname,
            req.body.idproof
        );

        // Check the result and send an appropriate response
        if (result.startsWith("Visitor account has been created")) {
            res.send(result);
        } else {
            // Handle the case where the member has reached the maximum limit
            res.status(400).send(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

async function createVisitor(memberName, visitorName, idProof) {
    try {
        // Check the number of visitors created by the member
        const existingVisitorsCount = await client
            .db('cybercafe')
            .collection('visitor')
            .countDocuments({ createdBy: memberName });

        // If the member has already created 4 visitors, return an error message
        if (existingVisitorsCount >= 4) {
            return "You have reached the maximum limit of 4 visitors. Cannot create more visitors.";
        }

        // If the member has not reached the limit, proceed with creating the visitor
        await client.db('cybercafe').collection('visitor').insertOne({
            "createdBy": memberName,
            "visitorname": visitorName,
            "idproof": idProof,
            "entrytime": 0,
            "cabinno": 0,  
            "computername": 0,
            "access": 0,
            
        });

        return "Visitor account has been created. Welcome to YOMOM Cybercafe! :D";
    } catch (error) {
        console.error(error);
        return "Failed to create visitor account. Please try again later.";
    }
}
//admin view member
app.get('/get/member', verifyAdminToken, async (req, res) => {
    try {
        const allMembers = await getAllMembers();
        res.send(allMembers);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

async function getAllMembers() {
    try {
        const result = await client
            .db('cybercafe')
            .collection('customer')
            .find({ role: 'member' }, { _id: 0, memberName: 1, })
            .toArray();

        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


//view visitor
app.get('/get/my-visitors', verifyToken, async (req, res) => {
    try {
        const memberName = req.user.memberName;

        if (req.user.role === 'admin') {
            const allVisitors = await getAllVisitors();
            res.send(allVisitors);
        } else {
            const visitors = await getVisitorsCreatedByMember(memberName);
            res.send(visitors);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

async function getVisitorsCreatedByMember(memberName) {
    try {
        const result = await client
            .db('cybercafe')
            .collection('visitor')
            .find({ createdBy: { $eq: memberName } }, { _id: 0, visitorname: 1, idproof: 1 })
            .toArray();

        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function getAllVisitors() {
    try {
        const result = await client
            .db('cybercafe')
            .collection('visitor')
            .find({}, { _id: 0, visitorname: 1 })
            .toArray();

        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

//Admin accepting the visitor pass
app.put('/retrieving/pass/:visitorname/:idproof', verifyAdminToken, async (req, res) => {
    const visitorname = req.params.visitorname;
    const idproof = req.params.idproof;

    try {
        const updateaccessResult = await client
            .db('cybercafe')
            .collection('visitor')
            .updateOne({ visitorname,idproof },
                { $set: { entrytime,cabinno,computername,access } });

        if (updateaccessResult.modifiedCount === 0) {
            return res.status(404).send('visitor not found or unauthorized');
        }

        res.send('access updated successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

function generateToken(userData) {
    const token = jwt.sign(
        userData,
        'password',
        { expiresIn: 600 }
    );

    console.log(token);
    return token;
}

app.patch('/update/value/:id', async (req, res) => {
    const search = req.params.id;
    const value = req.body.value;
    await client.db().collection().updateOne({ id: search }, { $set: value });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
