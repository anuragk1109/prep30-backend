const router = require("express").Router();
const c = require("../controllers/admin.controller");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.use(auth, admin);

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
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "JEE Preparation"
 *               description:
 *                 type: string
 *                 example: "Complete JEE preparation course"
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post("/course", c.createCourse);

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
 *             type: object
 *             required:
 *               - name
 *               - courseId
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Physics"
 *               courseId:
 *                 type: string
 *                 example: "60d725e6b8e4a2f4b8f8d8e8"
 *     responses:
 *       201:
 *         description: Subject created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 courseId:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post("/subject", c.createSubject);

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
 *             type: object
 *             required:
 *               - name
 *               - subjectId
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Mechanics"
 *               subjectId:
 *                 type: string
 *                 example: "60d725e6b8e4a2f4b8f8d8e9"
 *     responses:
 *       201:
 *         description: Chapter created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 subjectId:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post("/chapter", c.createChapter);

/**
 * @swagger
 * /api/admin/question:
 *   post:
 *     summary: Create a new question (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - chapterId
 *               - question
 *               - options
 *               - answer
 *             properties:
 *               chapterId:
 *                 type: string
 *                 example: "60d725e6b8e4a2f4b8f8d8ea"
 *               question:
 *                 type: string
 *                 example: "What is the capital of France?"
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *               answer:
 *                 type: string
 *                 example: "Paris"
 *     responses:
 *       201:
 *         description: Question created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 chapterId:
 *                   type: string
 *                 question:
 *                   type: string
 *                 options:
 *                   type: array
 *                 answer:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post("/question", c.createQuestion);

/**
 * @swagger
 * /api/admin/questions/bulk:
 *   post:
 *     summary: Create multiple questions (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - chapterId
 *                 - question
 *                 - options
 *                 - answer
 *               properties:
 *                 chapterId:
 *                   type: string
 *                   example: "60d725e6b8e4a2f4b8f8d8ea"
 *                 question:
 *                   type: string
 *                   example: "What is the capital of France?"
 *                 options:
 *                   type: array
 *                   items:
 *                     type: string
 *                 answer:
 *                   type: string
 *                   example: "Paris"
 *     responses:
 *       201:
 *         description: Questions created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   chapterId:
 *                     type: string
 *                   question:
 *                     type: string
 *                   options:
 *                     type: array
 *                   answer:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post("/questions/bulk", c.createQuestionsBulk);

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
 *             type: object
 *             required:
 *               - title
 *               - chapterId
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Newton's Laws Quiz"
 *               chapterId:
 *                 type: string
 *                 example: "60d725e6b8e4a2f4b8f8d8ea"
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Quiz created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 chapterId:
 *                   type: string
 *                 questions:
 *                   type: array
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post("/quiz", c.createQuiz);

module.exports = router;