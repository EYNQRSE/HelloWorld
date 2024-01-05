/**
 * @openapi
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * @openapi
 * /login/admin:
 *   post:
 *     summary: Admin Login
 *     description: Authenticate as an admin and receive an access token
 *     tags: 
 *       - Admin
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             username: 'adminUsername'
 *             password: 'adminPassword'
 *     responses:
 *       '200':
 *         description: Successful login
 *         content:
 *           application/json:
 *             example:
 *               message: 'Successful login'
 *               token: 'yourAccessTokenHere'
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 * 
 * @openapi
 * /create/member:
 *   post:
 *     summary: Member Signup
 *     description: Create a new member account
 *     tags: 
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             customername: 'John Doe'
 *             idproof: 'ABC123'
 *             password: 'customerPassword'
 *             # Add other customer properties
 *     responses:
 *       '200':
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             example: 'member account has been created. Welcome YOMOM member!!:D'
 *       '500':
 *         description: Internal Server Error
 *
 * @openapi
 * /get/member:
 *   get:
 *     summary: View Member (Admin Only)
 *     description: Get a list of all members (admin only)
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of customers
 *         content:
 *           application/json:
 *             example:
 *               - customername: 'John Doe'
 *                 idproof: 'ABC123'
 *              
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 *
 * @openapi
 * /update/computer/{computername}:
 *   put:
 *     summary: Update Computer Configuration (Admin Only)
 *     description: Update the configuration of a computer (admin only)
 *     tags:
 *       - Admin
 *     parameters:
 *       - name: computername
 *         in: path
 *         required: true
 *         description: Name of the computer to update
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             systemworking: yes
 *             available: yes
 *     responses:
 *       '200':
 *         description: Computer updated successfully
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Computer not found or unauthorized
 *       '500':
 *         description: Internal Server Error
 *
 * @openapi
 * /available/cabins:
 *   get:
 *     summary: View Available Cabins
 *     description: Get a list of available cabins
 *     tags:
 *       - Visitor
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             example:
 *               - cabinno: 1
 *                 computername: 'Computer1'
 *                 availability: true
 *                 # Include other relevant cabin information
 *               # Add other cabin objects as needed
 *       '500':
 *         description: Internal Server Error
 *
 * @openapi
 * /login/member:
 *   post:
 *     summary: member Login
 *     description: Authenticate as a member and receive an access token
 *     tags:
 *       - Member
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             idproof: 'ABC123'
 *             password: 'customerPassword'
 *     responses:
 *       '200':
 *         description: Successful login
 *         content:
 *           application/json:
 *             example:
 *               message: 'Successful login. Welcome to YOMOM CYBERCAFE'
 *               token: 'yourAccessTokenHere'
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 *
 * @openapi
 * /create/visitor:
 *   post:
 *     summary: Create Visitor
 *     description: Create a new visitor account
 *     tags:
 *       - Member
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             visitorname: 'John Doe'
 *             idproof: 'ABC123'
 *     responses:
 *       '200':
 *         description: Visitor account created successfully
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 *
 * @openapi
 * /get/my-visitors:
 *   get:
 *     summary: Get My Visitors
 *     description: Get a list of visitors created by the member
 *     tags:
 *       - Member
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of visitors
 *         content:
 *           application/json:
 *             example:
 *               - visitorname: 'Visitor1'
 *                 idproof: 'ABC123'
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 *
 * @openapi
 * /retrieve/pass/{visitorname}/{membername}:
 *   get:
 *     summary: Retrieve visitor pass information
 *     description: Retrieve pass information for a visitor based on their name
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: visitorname
 *         required: true
 *         description: Name of the visitor
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response with visitor pass information
 *       '404':
 *         description: Visitor not found
 *       '500':
 *         description: Internal Server Error
 */
