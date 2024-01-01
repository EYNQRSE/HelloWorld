/**
 * @openapi
 * tags:
 *   - name: Authentication
 *     description: Endpoints related to user authentication
 *   - name: Customer
 *     description: Endpoints related to customer operations
 *   - name: Computer
 *     description: Endpoints related to computer configurations
 *   - name: Cabin
 *     description: Endpoints related to cabin operations
 *   - name: CustomerAccount
 *     description: Endpoints related to customer account management
 *   - name: Visitor
 *     description: Endpoints related to visitor operations
 * 
 *
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * * @openapi
 * /login/admin:
 *   post:
 *     summary: Admin Login
 *     description: Authenticate as an admin and receive an access token
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
 * /view/customer/admin:
 *   get:
 *     summary: View Customers (Admin Only)
 *     description: Get a list of all customers (admin only)
 *     tags:
 *       - admin
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
 *                 # Add other customer properties
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
 *       - admin
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
 *             systemworking: true
 *             available: true
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
 * /create/customer:
 *   post:
 *     summary: Customer Signup
 *     description: Create a new customer account
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
 *             example: 'Your account has been created. Welcome YOMOM member!!:D'
 *       '500':
 *         description: Internal Server Error
 *
 * @openapi
 * /login/customer:
 *   post:
 *     summary: Customer Login
 *     description: Authenticate as a customer and receive an access token
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
 * /view/computer/admin:
 *   get:
 *     summary: View Computer Configuration (Admin Only)
 *     description: Get a list of computer configurations (admin only)
 *     tags:
 *       - admin
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of computer configurations
 *         content:
 *           application/json:
 *             example:
 *               - computername: 'Computer1'
 *                 systemworking: true
 *                 available: true
 *                 # Include other relevant computer information
 *               - computername: 'Computer2'
 *                 systemworking: false
 *                 available: true
 *                 # Include other relevant computer information
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
 *       - Visitor
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
 *       - Visitor
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
 *                 # Include other relevant visitor information
 *               # Add other visitor objects as needed
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 */

const swaggerDoc = {
  openapi: '3.0.0',
  info: {
    title: 'YOMOM CYBERCAFE API',
    version: '1.0.0',
    description: 'API documentation for YOMOM CYBERCAFE',
  },
  servers: [
    {
      url: 'http://localhost:3002',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    '/login/admin': {
      post: {
        summary: 'Admin Login',
        description: 'Authenticate as an admin and receive an access token',
        requestBody: {
          content: {
            'application/json': {
              example: {
                username: 'YODADALADY',
                password: 'guesswhat',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Successful login',
            content: {
              'application/json': {
                example: {
                  message: 'Successful login',
                  token: 'yourAccessTokenHere',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
          },
          '500': {
            description: 'Internal Server Error',
          },
        },
      },
    },
    '/view/customer/admin': {
      get: {
        summary: 'View Customers (Admin Only)',
        description: 'Get a list of all customers (admin only)',
        security: [
          {
            BearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        ],
        responses: {
          '200': {
            description: 'A list of customers',
            content: {
              'application/json': {
                example: [
                  {
                    customername: 'John Doe',
                    idproof: 'ABC123',
                    // Add other customer properties
                  },
                  // Add other customer objects as needed
                ],
              },
            },
          },
          '401': {
            description: 'Unauthorized',
          },
          '500': {
            description: 'Internal Server Error',
          },
        },
      },
    },
    '/update/computer/{computername}': {
      put: {
        summary: 'Update Computer Configuration (Admin Only)',
        description: 'Update the configuration of a computer (admin only)',
        parameters: [
          {
            name: 'computername',
            in: 'path',
            required: true,
            description: 'Name of the computer to update',
            schema: {
              type: 'string',
            },
          },
        ],
        security: [
          {
            BearerAuth: [],
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              example: {
                systemworking: true,
                available: true,
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Computer updated successfully',
          },
          '401': {
            description: 'Unauthorized',
          },
          '404': {
            description: 'Computer not found or unauthorized',
          },
          '500': {
            description: 'Internal Server Error',
          },
        },
      },
    },
    '/available/cabins': {
      get: {
        summary: 'View Available Cabins',
        description: 'Get a list of available cabins',
        responses: {
          '200': {
            description: 'Successful operation',
            content: {
              'application/json': {
                example: [
                  {
                    cabinno: 1,
                    computername: 'Computer1',
                    availability: true,
                    // Include other relevant cabin information
                  },
                  // Add other cabin objects as needed
                ],
              },
            },
          },
          '500': {
            description: 'Internal Server Error',
          },
        },
      },
    },
    '/create/customer': {
      post: {
        summary: 'Customer Signup',
        description: 'Create a new customer account',
        requestBody: {
          content: {
            'application/json': {
              example: {
                customername: 'John Doe',
                idproof: 'ABC123',
                password: 'customerPassword',
                // Add other customer properties
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Account created successfully',
            content: {
              'application/json': {
                example: 'Your account has been created. Welcome YOMOM member!!:D',
              },
            },
          },
          '500': {
            description: 'Internal Server Error',
          },
        },
      },
    },
    '/login/customer': {
      post: {
        summary: 'Customer Login',
        description: 'Authenticate as a customer and receive an access token',
        requestBody: {
          content: {
            'application/json': {
              example: {
                idproof: 'ABC123',
                password: 'customerPassword',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Successful login',
            content: {
              'application/json': {
                example: {
                  message: 'Successful login. Welcome to YOMOM CYBERCAFE',
                  token: 'yourAccessTokenHere',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
          },
          '500': {
            description: 'Internal Server Error',
          },
        },
      },
    },
    '/view/computer/admin': {
      get: {
        summary: 'View Computer Configuration (Admin Only)',
        description: 'Get a list of computer configurations (admin only)',
        security: [
          {
            BearerAuth: [],
          },
        ],
        responses: {
          '200': {
            description: 'A list of computer configurations',
            content: {
              'application/json': {
                example: [
                  {
                    computername: 'Computer1',
                    systemworking: true,
                    available: true,
                    // Include other relevant computer information
                  },
                  {
                    computername: 'Computer2',
                    systemworking: false,
                    available: true,
                    // Include other relevant computer information
                  },
                ],
              },
            },
          },
          '401': {
            description: 'Unauthorized',
          },
          '500': {
            description: 'Internal Server Error',
          },
        },
      },
    },
  },
};

module.exports = swaggerDoc;
