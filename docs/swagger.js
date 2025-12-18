const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Prep30 Backend API",
      version: "1.0.0",
      description: "API documentation for Prep30 backend application",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          required: ["name", "mobile", "email"],
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            mobile: { type: "string" },
            role: { type: "string", enum: ["user", "admin"] },
            isVerified: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Course: {
          type: "object",
          required: ["title"],
          properties: {
            _id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            isActive: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Subject: {
          type: "object",
          required: ["courseId", "title"],
          properties: {
            _id: { type: "string" },
            courseId: { type: "string" },
            name: { type: "string" },
            title: { type: "string" },
            order: { type: "number" },
            course: { $ref: "#/components/schemas/Course" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Chapter: {
          type: "object",
          required: ["subjectId", "title"],
          properties: {
            _id: { type: "string" },
            subjectId: { type: "string" },
            name: { type: "string" },
            title: { type: "string" },
            order: { type: "number" },
            subject: { $ref: "#/components/schemas/Subject" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Quiz: {
          type: "object",
          required: ["courseId", "level", "title", "questions"],
          properties: {
            _id: { type: "string" },
            courseId: { type: "string" },
            subjectId: { type: "string" },
            chapterId: { type: "string" },
            level: { type: "string", enum: ["COURSE", "SUBJECT", "CHAPTER"] },
            title: { type: "string" },
            questions: {
              type: "array",
              items: {
                type: "object",
                required: ["question", "options", "correctIndex"],
                properties: {
                  question: { type: "string" },
                  options: { type: "array", items: { type: "string" } },
                  correctIndex: { type: "number" },
                },
              },
            },
            quizDate: { type: "string", format: "date-time" },
            isPublished: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Error message"
            }
          }
        },
        Success: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Success message"
            }
          }
        }
      }
    }
  },
  apis: ["./routes/*.js"]
};

const specs = swaggerJsdoc(options);

module.exports = { specs };
