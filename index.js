//configure const
const express = require('express');
const app = express();
const port = process.env.PORT || 3002;
app.use(express.json());
const jwt = require('jsonwebtoken');
const cors = require('cors'); // Import the cors middleware
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb'); // Import ObjectId for creating unique IDs

// Use cors middleware
app.use(cors());

//connect to swagger
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const SwaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cybercafe Management System API',
      description: 'API for managing visitors in a cybercafe',
      version: '1.0.0',
    },
  },
  apis: ['./swagger.js'], // files containing annotations as above
};
const swaggerSpec = swaggerJsdoc(SwaggerOptions);
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

//front page
app.get('/', (req, res) => {
  res.send('welcome to YOMOM');
});

function verifyTokenAndRole(role) {
    return (req, res, next) => {
        let header = req.headers.authorization;

        if (!header) {
            return res.status(401).send('Unauthorized');
        }

        let token = header.split(' ')[1];

        try {
            let decoded = jwt.verify(token, 'password');
            req.user = decoded;

            // Ensure role is present in the token
            if (!req.user.role) {
                console.error('Role not found in the token.');
                return res.status(401).send('Unauthorized');
            }

            // Allow access if no specific role is required
            if (!role) {
                next();
            } else {
                // Ensure the user has the required role
                if (req.user.role === role) {
                    next();
                } else {
                    res.status(403).send(`Forbidden: ${role} access required`);
                }
            }
        } catch (err) {
            console.error('JWT Verification Error:', err);
            res.status(401).send('Unauthorized');
        }
    };
}

app.post('/login/admin', (req, res) => {
    login(req.body.username, req.body.password)
        .then(result => {
            if (result.message === 'Access Granted') {
                const token = generateToken({
                    username: req.body.username,
                    role: 'admin'
                });
                console.log('Generated Token:', token);
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
    try {
        const admin = await client.db('cybercafe').collection('admin').findOne({ username: reqUsername });

        if (!admin) {
            return { success: false, message: 'Admin not found!' };
        }

        // TODO: Use bcrypt to securely compare hashed passwords
        const isPasswordCorrect = await bcrypt.compare(reqPassword, admin.password);

        if (isPasswordCorrect) {
            return { success: true, message: 'Access Granted', user: admin };
        } else {
            return { success: false, message: 'Invalid password' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Internal Server Error' };
    }
}

// Admin create member
app.post('/create/member', verifyTokenAndRole('admin'), async (req, res) => {
    console.log('/create/member: req.body', req.body);
    try{
        let result = await createMember(
            req.body.memberName,
            req.body.idproof,
            req.body.password,
            req.body.phoneNumber
        );
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

async function createMember(reqmemberName, reqidproof, reqpassword, reqphone) {
    try {
        // Check if the password is strong
        if (!isPasswordStrong(reqpassword)) {
            return { success: false, message: "Password does not meet the strength criteria." };
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(reqpassword, 10);

        const result = await client.db('cybercafe').collection('customer').insertOne({
            "memberName": reqmemberName,
            "idproof": reqidproof,
            "password": hashedPassword,
            "phoneNumber": reqphone,
            "role": "member",
            "suspended": false,
            "visitors": []
        });

        console.log('MongoDB Insert Result:', result);

        return { success: true, message: "Member account has been created. Welcome YOMOM member!!:D" };

    } catch (error) {
        console.error(error);
        return { success: false, message: "Internal Server Error" };
    }
}

app.put('/retrieve/pass/:visitorname/:idproof/:memberName', verifyTokenAndRole('admin'), async (req, res) => {
    console.log('/retrieve/pass/:visitorname/:idproof/:memberName');

    // Extracting memberName from req.user (assuming it's stored in req.user)
    const memberName = req.params.memberName;
    const visitorname = req.params.visitorname;
    const idproof = req.params.idproof;

    // Assuming cabinno and computername are defined elsewhere in your code or passed as parameters
    const cabinno = req.body.cabinno; // replace with actual value
    const computername = req.body.computername; // replace with actual value

    try {
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('en-MY'); // Format date as 'MM/DD/YYYY'

        const updateaccessResult = await client
            .db('cybercafe')
            .collection('customer')
            .updateOne(
                { "visitors.visitorname": visitorname, "idproof": idproof },
                { $set: { "visitors.$.entrytime": formattedDate, "visitors.$.cabinno": cabinno, "visitors.$.computername": computername } }
            );

        if (updateaccessResult.modifiedCount === 0) {
            return res.status(404).send('Visitor not found or unauthorized');
        }

        // Save the visitor information to the visitorLog collection
        await saveToVisitorLog(memberName, visitorname, idproof, cabinno, computername);

        res.send('Access updated successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


async function saveToVisitorLog(memberName, visitorname, idproof, cabinno, computername) {
    try {
        const visitorLogData = {
            memberName,
            visitorname,
            idproof,
            entrytime: new Date().toLocaleTimeString(), // Optionally, you can store the entry time as well
            cabinno,
            computername,
        };

        const formattedLogDate = new Date().toLocaleDateString('en-MY'); // Format date as 'MM/DD/YYYY'

        // Use the formatted date as the document identifier in the visitorLog collection
        const visitorLogCollection = client.db('cybercafe').collection('visitorLog');
        const visitorLogDocument = await visitorLogCollection.findOne({ date: formattedLogDate });

        if (visitorLogDocument) {
            // If the document for the current date exists, push the visitor data to the array
            await visitorLogCollection.updateOne(
                { date: formattedLogDate },
                { $push: { visitors: visitorLogData } }
            );
        } else {
            // If the document for the current date does not exist, create a new one
            await visitorLogCollection.insertOne({
                date: formattedLogDate,
                visitors: [visitorLogData],
            });
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

//admin view member
app.get('/get/member', verifyTokenAndRole('admin'), async (req, res) => {
    try {
        if (req.user.role === 'admin') {
            const allMembers = await getAllMembers();
            res.send(allMembers);
        } else {
            res.status(403).send('Forbidden: Admin access required');
        }
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
            .find({}, { _id: 0, memberName: 1, })
            .toArray();

        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Admin view member phone number
app.get('/get/member/phone/:idproof', verifyTokenAndRole('admin'), async (req, res) => {
    const idproof = req.params.idproof;
    try {
        if (req.user.role === 'admin') {
            const memberPhoneNumber = await getMembersPhoneNumber(idproof);
            if (memberPhoneNumber) {
                res.json(memberPhoneNumber);
            } else {
                res.status(404).send('Member not found');
            }
        } else {
            res.status(403).send('Forbidden: Admin access required');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

async function getMembersPhoneNumber(idproof) {
    try {
        const result = await client
            .db('cybercafe')
            .collection('customer')
            .findOne({ idproof: idproof });

        if (result) {
            return {
                memberName: result.memberName,
                phoneNumber: result.phoneNumber,
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Admin update member suspension status
app.put('/update/suspend/:memberName', verifyTokenAndRole('admin'), async (req, res) => {
    const memberNameToUpdate = req.params.memberName;
    const { suspended } = req.body;

    try {
        const updateMemberResult = await updateMember(memberNameToUpdate, suspended);

        if (updateMemberResult.matchedCount === 0) {
            return res.status(404).send('Member not found or unauthorized');
        }

        res.send('Member account updated successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

async function updateMember(memberName, suspend) {
    try {
        const result = await client
            .db('cybercafe')
            .collection('customer')
            .updateOne(
                { memberName },
                { $set: { suspended: suspend } }
            );

        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
//member login
app.post('/login/member', async (req, res) => {
    try {
        const result = await memberLogin(req.body.memberName, req.body.password);

        if (result.success) {
            const token = generateToken({
                memberName: result.user.memberName,
                role: 'member'
            });
            console.log('Generated Token:', token);
            res.send({ message: 'Successful login', token });
        } else {
            res.send('Login unsuccessful');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

async function memberLogin(memberName, password) {
    try {
        const matchUser = await client.db('cybercafe').collection('customer').findOne({ memberName: memberName });

        if (!matchUser) {
            return { success: false, message: 'User not found!' };
        }

        if (matchUser.suspended) {
            return { success: false, message: 'Account is suspended', user: matchUser };
        }

        // Use bcrypt to securely compare hashed passwords
        const isPasswordCorrect = await bcrypt.compare(password, matchUser.password);

        if (isPasswordCorrect) {
            return { success: true, message: 'Correct password', user: { ...matchUser, memberName } };
        } else {
            return { success: false, message: 'Invalid password' };
        }
    } catch (error) {
        console.error('Error in memberLogin:', error);
        return { success: false, message: 'Internal Server Error' };
    }
}


// Member create visitor
app.post('/create/visitor', verifyTokenAndRole('member'), async (req, res) => {
    try {
        console.log(req.user)
        const membername = req.user.memberName;

        // Call the modified createVisitor function
        let result = await createVisitor(
            membername,
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

async function createVisitor(memberName, visitorName) {
    try {
        const visitorData = {
            visitorname: visitorName,
            entrytime: 0,
            cabinno: 0,
            computername: "",
        };

        await client.db('cybercafe').collection('customer').updateOne(
            { memberName },
            { $push: { visitors: visitorData } }
        );

        return "Visitor account has been created. Welcome to YOMOM Cybercafe! :D";
    } catch (error) {
        console.error(error);
        return "Failed to create visitor account. Please try again later.";
    }
}
// Member delete visitor
app.delete('/delete/visitor/:visitorname', verifyTokenAndRole('member'), async (req, res) => {
    try {
        console.log(req.user)
        const memberName = req.user.memberName;
        const visitorNameToDelete = req.params.visitorname;

        const deleteResult = await deleteVisitor(memberName, visitorNameToDelete);

        if (deleteResult.deletedCount === 0) {
            res.status(404).send('Visitor not found or unauthorized');
        } else {
            res.send('Visitor deleted successfully');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

async function deleteVisitor(memberName, visitorName) {
    try {
        const deleteResult = await client
            .db('cybercafe')
            .collection('customer')
            .updateOne(
                { memberName, 'visitors.visitorname': visitorName },
                { $pull: { visitors: { visitorname: visitorName } } }
            );

        return deleteResult;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// View visitors
app.get('/get/my-visitors', verifyTokenAndRole(), async (req, res) => {
    try {
        const memberName = req.user.memberName;

        let roleSpecificVisitors;

        if (req.user.role === 'admin') {
            roleSpecificVisitors = await getAllVisitors();
        } else {
            roleSpecificVisitors = await getVisitorsCreatedByMember(memberName);
        }

        res.send({ role: req.user.role, visitors: roleSpecificVisitors });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

async function getVisitorsCreatedByMember(memberName) {
    try {
        const cursor = await client
            .db('cybercafe')
            .collection('customer')
            .find({ memberName }, { _id: 0, visitors: 1 })
            .limit(30)
            .toArray();

        return cursor.map(({ visitors }) => visitors).filter(Boolean);
    } catch (error) {
        console.error('Error in getVisitorsCreatedByMember:', error);
        throw error;
    }
}

async function getAllVisitors() {
    try {
        const cursor = await client
            .db('cybercafe')
            .collection('customer')
            .find({}, { _id: 0, visitors: 1 })
            .limit(30)
            .toArray();

        return cursor.map(({ visitors }) => visitors).filter(Boolean);
    } catch (error) {
        console.error('Error in getAllVisitors:', error);
        throw error;
    }
}


// test create member
app.post('/test/create/member', async (req, res) => {

    let result = await testcreateMember(
        req.body.memberName,
        req.body.idproof,
        req.body.password,
        req.body.phoneNumber
    );
    res.send(result);
});

async function testcreateMember(reqmemberName, reqidproof, reqpassword, reqphone) {
    try {
        // Check if the password is strong
        if (!isPasswordStrong(reqpassword)) {
            return "Password is too weak.";
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(reqpassword, 10);

        const result = await client.db('cybercafe').collection('customer').insertOne({
            "memberName": reqmemberName,
            "idproof": reqidproof,
            "password": hashedPassword,
            "phoneNumber": reqphone,
            "role": "test-member",
            "suspended": false,
            "visitors": []
        });

        console.log('MongoDB Insert Result:', result);

        return "Test-Member account has been created. Welcome YOMOM member!!:D";
    } catch (error) {
        console.error(error);
        return "Failed to create member account. Please try again later.";
    }
}

// test Member login
app.post('/test/login/member', async (req, res) => {
    try {
        const result = await testmemberLogin(req.body.memberName, req.body.password);
        if (result.message === 'Correct password') {
            const token = generateToken({ memberName: req.body.memberName, role: 'test-member'});
            res.send({ message: 'Successful login. Welcome to YOMOM CYBERCAFE', token });
        } else {
            res.send('Login unsuccessful');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

async function testmemberLogin(memberName, password) {
    try {
        console.log('Received login request for test-member:', memberName);
        let matchUser = await client.db('cybercafe').collection('customer').findOne({ memberName: memberName });

        if (!matchUser) {
            return { message: 'User not found!' };
        }

        // Use bcrypt to securely compare hashed passwords
        const isPasswordCorrect = await bcrypt.compare(password, matchUser.password);

        if (isPasswordCorrect) {
            return { message: 'Correct password', user: matchUser };
        } else {
            return { message: 'Invalid password' };
        }
    } catch (error) {
        console.error(error);
        return { message: 'Internal Server Error' };
    }
}

// test-Member create visitor
app.post('/test/create/visitor', verifyTokenAndRole('test-member'), async (req, res) => {
    try {
        console.log(req.user)
        const membername = req.user.memberName;

        // Call the modified createVisitor function
        let result = await testcreateVisitor(
            membername,
            req.body.visitorname,
            req.body.idProof
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
async function testcreateVisitor(memberName, visitorName) {
    try {
        console.log('MemberName:', memberName);
        const visitorData = {
            visitorname: visitorName,
            entrytime: 0,
            cabinno: 0,  
            computername: ""
        }
        await client.db('cybercafe').collection('customer').updateOne(
            { memberName },
            { $push: { visitors: visitorData } }
        );

        return "Visitor account has been created. Welcome to YOMOM Cybercafe! :D";
    } catch (error) {
        console.error(error);
        return "Failed to create visitor account. Please try again later.";
    }
}

// test-Member delete visitor
app.delete('/test/delete/visitor/:visitorname', verifyTokenAndRole('test-member'), async (req, res) => {
    try {
        const memberName = req.user.memberName;
        const visitorNameToDelete = req.params.visitorname;

        const deleteResult = await testdeleteVisitor(memberName, visitorNameToDelete);

        if (deleteResult.deletedCount === 0) {
            res.status(404).send('Visitor not found or unauthorized');
        } else {
            res.send('Visitor deleted successfully');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

async function testdeleteVisitor(memberName, visitorName) {
    try {
        const deleteResult = await client
            .db('cybercafe')
            .collection('customer')
            .updateOne(
                { memberName, 'visitors.visitorname': visitorName },
                { $pull: { visitors: { visitorname: visitorName } } }
            );

        return deleteResult;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


function generateToken(userData) {
    try {
        const token = jwt.sign(
            userData,
            'password',
            { expiresIn: 600 }
        );
        console.log(token);
        return token;
    } catch (error) {
        console.error('Token Generation Error:', error);
        throw error;
    }
}


function isPasswordStrong(password) {
    const minLength = 10;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^.()])[A-Za-z\d@$!%*?&^.()]{10,}$/;
  
    return password.length >= minLength && regex.test(password);
  }
  
client.connect().then(res => {
    console.log(res);
 }).catch(error => {
    console.error('MongoDB Connection Error:', error);
 });
 

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
