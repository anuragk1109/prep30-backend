const router = require("express").Router();
const c = require("../controllers/get.controller");

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all active courses
 *     tags: [Data]
 *     responses:
 *       200:
 *         description: Courses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Courses retrieved successfully"
 *                 count:
 *                   type: number
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       isActive:
 *                         type: boolean
 *       500:
 *         description: Failed to retrieve courses
 */
router.get("/courses", c.getAllCourses);

router.get("/questions", c.getQuestions);

/**
 * @swagger
 * /api/subjects:
 *   get:
 *     summary: Get all subjects (optional filter by courseId)
 *     tags: [Data]
 *     parameters:
 *       - in: query
 *         name: courseId
 *         schema:
 *           type: string
 *         description: Filter subjects by course ID
 *     responses:
 *       200:
 *         description: Subjects retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Subjects retrieved successfully"
 *                 count:
 *                   type: number
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       courseId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           title:
 *                             type: string
 *                       title:
 *                         type: string
 *                       order:
 *                         type: number
 *       500:
 *         description: Failed to retrieve subjects
 */
router.get("/subjects", c.getAllSubjects);

/**
 * @swagger
 * /api/chapters:
 *   get:
 *     summary: Get all chapters (optional filter by subjectId)
 *     tags: [Data]
 *     parameters:
 *       - in: query
 *         name: subjectId
 *         schema:
 *           type: string
 *         description: Filter chapters by subject ID
 *     responses:
 *       200:
 *         description: Chapters retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Chapters retrieved successfully"
 *                 count:
 *                   type: number
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       subjectId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           title:
 *                             type: string
 *                       name:
 *                         type: string
 *                       title:
 *                         type: string
 *                       order:
 *                         type: number
 *       500:
 *         description: Failed to retrieve chapters
 */
router.get("/chapters", c.getAllChapters);

/**
 * @swagger
 * /api/chapters/questions:
 *   post:
 *     summary: Add questions to a chapter
 *     tags: [Data]
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
 *               - questions
 *             properties:
 *               chapterId:
 *                 type: string
 *                 description: Chapter ID
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - question
 *                     - options
 *                     - correctOption
 *                   properties:
 *                     question:
 *                       type: string
 *                       description: Question text
 *                     options:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Answer options
 *                     correctOption:
 *                       type: number
 *                       description: Index of correct answer
 *                     explanation:
 *                       type: string
 *                       description: Explanation for the answer
 *     responses:
 *       201:
 *         description: Questions added to chapter successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Questions added to chapter successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     quizId:
 *                       type: string
 *                       description: Created quiz ID
 *                     chapterId:
 *                       type: string
 *                       description: Chapter ID
 *                     questionsCount:
 *                       type: number
 *                       description: Number of questions added
 *                     title:
 *                       type: string
 *                       description: Quiz title
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "chapterId and questions array are required"
 *       404:
 *         description: Chapter not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Chapter not found"
 *       500:
 *         description: Failed to add questions to chapter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to add questions to chapter"
 */
router.post("/chapters/questions", c.addQuestionsToChapter);

module.exports = router;
