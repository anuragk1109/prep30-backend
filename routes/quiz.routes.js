const router = require("express").Router();
const c = require("../controllers/quiz.controller");
const auth = require("../middleware/auth");

/**
 * @swagger
 * /api/quizzes/:
 *   get:
 *     summary: List user's quiz sessions
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of quiz sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 count:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       level:
 *                         type: string
 *                         enum: [COURSE, SUBJECT, CHAPTER]
 *                       courseId:
 *                         type: object
 *                       subjectId:
 *                         type: object
 *                       chapterId:
 *                         type: object
 *                       status:
 *                         type: string
 *                         enum: [CREATED, SUBMITTED]
 *                       createdAt:
 *                         type: string
 *                       submittedAt:
 *                         type: string
 *       401:
 *         description: Unauthorized
 */
router.get("/", auth, c.listMyQuizzes);

/**
 * @swagger
 * /api/quizzes/generate:
 *   get:
 *     summary: Generate quiz session by scope (course/subject/chapter)
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: courseId
 *         schema:
 *           type: string
 *         description: Course ID (course-level quiz)
 *       - in: query
 *         name: subjectId
 *         schema:
 *           type: string
 *         description: Subject ID (subject-level quiz)
 *       - in: query
 *         name: chapterId
 *         schema:
 *           type: string
 *         description: Chapter ID (chapter-level quiz)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 20
 *         description: Number of questions to include (random sample)
 *     responses:
 *       201:
 *         description: Quiz generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     quizId:
 *                       type: string
 *                     level:
 *                       type: string
 *                       enum: [COURSE, SUBJECT, CHAPTER]
 *                     courseId:
 *                       type: string
 *                       nullable: true
 *                     subjectId:
 *                       type: string
 *                       nullable: true
 *                     chapterId:
 *                       type: string
 *                       nullable: true
 *                     totalQuestions:
 *                       type: number
 *                     questions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           question:
 *                             type: string
 *                           options:
 *                             type: array
 *                             items:
 *                               type: string
 *                           difficulty:
 *                             type: string
 *                             enum: [EASY, MEDIUM, HARD]
 *       400:
 *         description: Missing/invalid scope
 *       404:
 *         description: No questions found for selected scope
 *       401:
 *         description: Unauthorized
 */
router.get("/generate", auth, c.generateQuiz);

/**
 * @swagger
 * /api/quizzes/{quizId}/questions:
 *   get:
 *     summary: Fetch quiz questions for a quiz session
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         schema:
 *           type: string
 *         required: true
 *         description: Quiz ID
 *     responses:
 *       200:
 *         description: Quiz questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     quizId:
 *                       type: string
 *                     level:
 *                       type: string
 *                       enum: [COURSE, SUBJECT, CHAPTER]
 *                     course:
 *                       type: object
 *                     subject:
 *                       type: object
 *                     chapter:
 *                       type: object
 *                     totalQuestions:
 *                       type: number
 *                     questions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           question:
 *                             type: string
 *                           options:
 *                             type: array
 *                             items:
 *                               type: string
 *                           difficulty:
 *                             type: string
 *                             enum: [EASY, MEDIUM, HARD]
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Quiz not found
 */
router.get("/:quizId/questions", auth, c.getQuizQuestions);

/**
 * @swagger
 * /api/quizzes/submit:
 *   post:
 *     summary: Submit quiz answers (single submit endpoint)
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quizId
 *               - answers
 *             properties:
 *               quizId:
 *                 type: string
 *                 example: "60d725e6b8e4a2f4b8f8d8eb"
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - questionId
 *                     - selectedIndex
 *                   properties:
 *                     questionId:
 *                       type: string
 *                     selectedIndex:
 *                       type: number
 *     responses:
 *       200:
 *         description: Quiz submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     quizId:
 *                       type: string
 *                     attemptId:
 *                       type: string
 *                     score:
 *                       type: number
 *                       example: 85
 *                     totalQuestions:
 *                       type: number
 *                       example: 20
 *                     correctAnswers:
 *                       type: number
 *                       example: 17
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid submission
 */
router.post("/submit", auth, c.submitQuiz);

module.exports = router;