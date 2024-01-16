/**
 * @openapi
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       BearerFormat: JWT
 *
 * @openapi
 * /login/admin:
 *   post:
 *     summary: Admin Login
 *     description: Authenticate as an admin and receive an access token
 *     tags: 
 *       - Admin
 *     security:
 *       - BearerAuth: []   # This line specifies the use of the BearerAuth security scheme
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             username: 'username'
 *             password: 'password'
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
 * /retrieve/pass/{visitorname}/{idproof}/{memberName}:
 *   put:
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
 *       - in: path
 *         name: idproof
 *         required: true
 *         description: Idproof of the member
 *       - in: path
 *         name: memberName
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             cabinno: '2'
 *             computername: 'PC_02'
 *     responses:
 *       '200':
 *         description: Successful retrieve visitor pass
 *       '404':
 *         description: Visitor not found
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
 *       - BearerAuth: []   # This line specifies the use of the BearerAuth security scheme
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             memberName: 'username'
 *             idproof: 'idproof'
 *             password: 'password'
 *             phoneNumber: 'phone number'
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
 *               example:
 *                  memberName: 'username'
 *                  idproof: 'idproof'
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 *
 * @openapi
 * /get/visitorLog:
 *   get:
 *     summary: View VisitorLog (Admin Only)
 *     description: Get a list of all visitor (admin only)
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of visitor 
 *         content:
 *           application/json:
 *               example:
 *                  entrytime: 'entrytime'
 *                  visitorname: 'visitorname'
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 *
 * @openapi
 * /get/member/phone/{idproof}:
 *   get:
 *     summary: View Member Phone Number (Admin Only)
 *     description: Retrieve contact number from a member (admin only)
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idproof
 *         required: true
 *         description: ID proof of the member
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               memberName: 'username'
 *               phoneNumber: 'phone number'
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 * 
 * @openapi
 * /update/suspend/{memberName}:
 *    put:
 *      summary: Update Member Suspension Status (Admin Only)
 *      description: Update the suspension status of a member (admin only)
 *      tags:
 *        - Admin
 *      parameters:
 *        - name: memberName
 *          in: path          
 *          required: true
 *          description: Username of the member to update
 *          schema:
 *            type: string
 *      security:
 *       - BearerAuth: []
 *      requestBody:
 *       content:
 *         application/json:
 *           example:
 *             suspended: true
 *      responses:
 *       '200':
 *         description: Member account updated successfully
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Member not found or unauthorized
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
 *             memberName: 'memberName'
 *             password: 'password'
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
 *             visitorname: 'visitor name'
 *     responses:
 *       '200':
 *         description: Visitor account created successfully
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 * 
 * @openapi
 * /delete/visitor/{visitorname}:
 *   delete:
 *     summary: Delete a visitor by name
 *     tags:
 *       - Member
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: visitorname
 *         in: path
 *         required: true
 *         description: The name of the visitor to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Visitor deleted successfully
 *       404:
 *         description: Visitor not found or unauthorized
 *       500:
 *         description: Internal Server Error
 * 
 * @openapi
 * /test/create/member:
 *   post:
 *     summary: test Member Signup
 *     description: Create a new test member account
 *     tags: 
 *       - Test-Member
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             memberName: 'username'
 *             idproof: 'idproof'
 *             password: 'password'
 *             phoneNumber: 'phone number'
 *     responses:
 *       '200':
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             example: 'test-member account has been created. Welcome YOMOM member!!:D'
 *       '500':
 *         description: Internal Server Error
 * 
 *@openapi
 * /test/login/member:
 *   post:
 *     summary: test member Login
 *     description: Authenticate as a member and receive an access token
 *     tags:
 *       - Test-Member
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             memberName: 'memberName'
 *             password: 'password'
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
 *@openapi
 * /test/create/visitor:
 *   post:
 *     summary: Test Create Visitor
 *     description: Create a new visitor account
 *     tags:
 *       - Test-Member
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             visitorname: 'username'
 *     responses:
 *       '200':
 *         description: Visitor account created successfully
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 *
 * @openapi
 * /test/delete/visitor/{visitorname}:
 *   delete:
 *     summary: Delete a visitor by name
 *     tags:
 *       - Test-Member
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: visitorname
 *         in: path
 *         required: true
 *         description: The name of the visitor to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Visitor deleted successfully
 *       404:
 *         description: Visitor not found or unauthorized
 *       500:
 *         description: Internal Server Error
 * 
 *@openapi
 * /get/my-visitors:
 *   get:
 *     summary: Get My Visitors
 *     description: Get a list of visitors created by the member
 *     tags:
 *       - All Role
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of visitors
 *         content:
 *           application/json:
 *             example:
 *               - visitorname: 'Visitor1'
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 */
