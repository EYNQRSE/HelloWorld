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
 *             username: 'YOMOMCYBERCAFE'
 *             password: 'donottrythisathome69'
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
 * @openapi
 * /retrieve/pass/{visitorname}/{idproof}:
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
 *       - in: path
 *         name: idproof
 *         required: true
 *         description: Idproof of the member
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
 *             memberName: 'AMIR'
 *             idproof: 'b022120016'
 *             password: 'mermaidman'
 *             phoneNumber: '0177803125'
 *             # Add other customer properties
 *     responses:
 *       '200':
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             example: 'member account has been created. Welcome YOMOM member!!:D'
 *       '500':
 *         description: Internal Server Error
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
 *                  memberName: 'AMIR'
 *                  idproof: 'b022120016'
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 *
 * @openapi
 * /get/member/phone/{phone}:
 *   get:
 *     summary: View Member Phone Number (Admin Only)
 *     description: retrieve contact number from member (admin only)
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: phone
 *         required: true
 *         description: Phone number of the member
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK 
 *         content:
 *           application/json:
 *                 memberName: 'ABU'
 *                 phoneNumber: '0199876543'
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
 * @openapi
 * /update/member/{memberName}:
 *    put:
 *      summary: Update Member Suspension Status (Admin Only)
 *      description: Update the suspension status of a member (admin only)
 *      tags:
 *        - Admin
 *      parameters:
 *       - in: path
 *         name: memberName
 *         required: true
 *         description: Username of the member to update
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             suspended: 'true'
 *     responses:
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
 *             idproof: 'b022120016'
 *             password: 'mermaidman'
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
 *             visitorname: 'AKID'
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
 *       '401':
 *         description: Unauthorized
 *       '500':
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
 *             memberName: 'John Doe'
 *             idproof: 'ABC123'
 *             password: 'memberPassword'
 *             phoneNumber: '01000022233'
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
 *             idproof: 'tryme'
 *             password: 'yopassword'
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
 *             visitorname: 'avocado'
 *     responses:
 *       '200':
 *         description: Visitor account created successfully
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 *
 * 
 *@openapi
 * /get/my-visitors:
 *   get:
 *     summary: Get My Visitors
 *     description: Get a list of visitors created by the member
 *     tags:
 *       - Test-Member
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
