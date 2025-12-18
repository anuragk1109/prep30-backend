/**
 * @swagger
 * components:
 *   schemas:
 *     OtpRequest:
 *       type: object
 *       required:
 *         - mobile
 *       properties:
 *         mobile:
 *           type: string
 *           description: Mobile number to send OTP
 *           example: "9876543210"
 *     
 *     OtpVerify:
 *       type: object
 *       required:
 *         - mobile
 *         - name
 *       properties:
 *         mobile:
 *           type: string
 *           description: Mobile number
 *           example: "9876543210"
 *         name:
 *           type: string
 *           description: User name
 *           example: "John Doe"
 *     
 *     GoogleLogin:
 *       type: object
 *       required:
 *         - email
 *         - googleId
 *         - name
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Google email
 *           example: "john@gmail.com"
 *         googleId:
 *           type: string
 *           description: Google ID
 *           example: "1234567890"
 *         name:
 *           type: string
 *           description: User name
 *           example: "John Doe"
 *     
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT authentication token
 *         user:
 *           $ref: '#/components/schemas/User'
 *     
 *     CourseCreate:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Course name
 *           example: "JEE Preparation"
 *         description:
 *           type: string
 *           description: Course description
 *           example: "Complete JEE preparation course"
 *     
 *     SubjectCreate:
 *       type: object
 *       required:
 *         - name
 *         - courseId
 *       properties:
 *         name:
 *           type: string
 *           description: Subject name
 *           example: "Physics"
 *         courseId:
 *           type: string
 *           description: Course ID
 *           example: "60d725e6b8e4a2f4b8f8d8e8"
 *     
 *     ChapterCreate:
 *       type: object
 *       required:
 *         - name
 *         - subjectId
 *       properties:
 *         name:
 *           type: string
 *           description: Chapter name
 *           example: "Mechanics"
 *         subjectId:
 *           type: string
 *           description: Subject ID
 *           example: "60d725e6b8e4a2f4b8f8d8e9"
 *     
 *     QuizCreate:
 *       type: object
 *       required:
 *         - title
 *         - chapterId
 *       properties:
 *         title:
 *           type: string
 *           description: Quiz title
 *           example: "Newton's Laws Quiz"
 *         chapterId:
 *           type: string
 *           description: Chapter ID
 *           example: "60d725e6b8e4a2f4b8f8d8ea"
 *         questions:
 *           type: array
 *           items:
 *             type: object
 *           description: Quiz questions array
 *     
 *     QuizSubmission:
 *       type: object
 *       required:
 *         - quizId
 *         - answers
 *       properties:
 *         quizId:
 *           type: string
 *           description: Quiz ID
 *           example: "60d725e6b8e4a2f4b8f8d8eb"
 *         answers:
 *           type: array
 *           items:
 *             type: object
 *           description: User's answers
 */

/**
 * @swagger
 * /api/auth/otp/send:
 *   post:
 *     summary: Send OTP to mobile number
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OtpRequest'
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "OTP sent to 9876543210"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/auth/otp/verify:
 *   post:
 *     summary: Verify OTP and authenticate user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OtpVerify'
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     summary: Authenticate with Google
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GoogleLogin'
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid Google credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/admin/course:
 *   post:
 *     summary: Create a new course (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourseCreate'
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/admin/subject:
 *   post:
 *     summary: Create a new subject (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubjectCreate'
 *     responses:
 *       201:
 *         description: Subject created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/admin/chapter:
 *   post:
 *     summary: Create a new chapter (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChapterCreate'
 *     responses:
 *       201:
 *         description: Chapter created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chapter'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/admin/quiz:
 *   post:
 *     summary: Create a new quiz (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuizCreate'
 *     responses:
 *       201:
 *         description: Quiz created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quiz'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/quiz/:
 *   get:
 *     summary: Get all available quizzes
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of quizzes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Quiz'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/quiz/submit:
 *   post:
 *     summary: Submit quiz answers
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuizSubmission'
 *     responses:
 *       200:
 *         description: Quiz submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 score:
 *                   type: number
 *                   description: Quiz score
 *                   example: 85
 *                 totalQuestions:
 *                   type: number
 *                   description: Total number of questions
 *                   example: 20
 *                 correctAnswers:
 *                   type: number
 *                   description: Number of correct answers
 *                   example: 17
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Invalid submission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
