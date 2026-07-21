export const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "Task Manager API",
    version: "1.0.0",
    description: "REST API for managing users and tasks",
  },
  servers: [
    {
      url: "/",
      description: "Current API host",
    },
  ],
  tags: [
    { name: "System", description: "API health" },
    { name: "Auth", description: "Registration and authentication" },
    { name: "Users", description: "User management" },
    { name: "Tasks", description: "Current user's tasks" },
    { name: "Comments", description: "Comments on the current user's tasks" },
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
      RegisterInput: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", minLength: 2, maxLength: 100, example: "John Doe" },
          email: { type: "string", format: "email", example: "john@example.com" },
          password: {
            type: "string",
            format: "password",
            minLength: 8,
            maxLength: 72,
            example: "password123",
          },
        },
      },
      LoginInput: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "john@example.com" },
          password: { type: "string", format: "password", example: "password123" },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "John Doe" },
          email: { type: "string", format: "email", example: "john@example.com" },
          avatar: {
            type: "string",
            nullable: true,
            example: "/uploads/avatar-550e8400-e29b-41d4-a716-446655440000.webp",
          },
          role: { type: "string", enum: ["USER", "ADMIN"], example: "USER" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Task: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          title: { type: "string", example: "Learn Node.js" },
          description: { type: "string", nullable: true, example: "Build a REST API" },
          status: {
            type: "string",
            enum: ["TODO", "IN_PROGRESS", "DONE"],
            example: "TODO",
          },
          priority: {
            type: "string",
            enum: ["LOW", "MEDIUM", "HIGH"],
            example: "HIGH",
          },
          userId: { type: "integer", example: 1 },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateTaskInput: {
        type: "object",
        required: ["title"],
        properties: {
          title: { type: "string", maxLength: 200, example: "Learn Node.js" },
          description: { type: "string", maxLength: 5000, example: "Build a REST API" },
          status: { type: "string", enum: ["TODO", "IN_PROGRESS", "DONE"] },
          priority: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
        },
      },
      UpdateTaskInput: {
        type: "object",
        minProperties: 1,
        properties: {
          title: { type: "string", maxLength: 200 },
          description: { type: "string", nullable: true, maxLength: 5000 },
          status: { type: "string", enum: ["TODO", "IN_PROGRESS", "DONE"] },
          priority: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
        },
      },
      Comment: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          text: { type: "string", example: "Remember to add tests" },
          taskId: { type: "integer", example: 1 },
          userId: { type: "integer", example: 1 },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      CreateCommentInput: {
        type: "object",
        required: ["text"],
        properties: {
          text: {
            type: "string",
            minLength: 1,
            maxLength: 2000,
            example: "Remember to add tests",
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
  paths: {
    "/": {
      get: {
        tags: ["System"],
        summary: "Check whether the API is running",
        responses: {
          "200": {
            description: "API is running",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "API is running" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "User registered",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { data: { $ref: "#/components/schemas/User" } },
                },
              },
            },
          },
          "400": {
            description: "Validation failed",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
          "409": {
            description: "Email already exists",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
          "429": {
            description: "Too many registration attempts",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Log in and receive a JWT token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: { type: "string", description: "JWT access token" },
                    user: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Validation failed",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
          "401": {
            description: "Invalid email or password",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
          "429": {
            description: "Too many failed login attempts",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
        },
      },
    },
    "/users": {
      get: {
        tags: ["Users"],
        summary: "Get all users",
        description: "Available only to users with the ADMIN role.",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "List of users",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
          },
          "401": {
            description: "Authentication is required",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
          "403": {
            description: "Admin role is required",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
        },
      },
    },
    "/users/{id}": {
      delete: {
        tags: ["Users"],
        summary: "Delete a user",
        description: "Available only to users with the ADMIN role.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", minimum: 1 },
          },
        ],
        responses: {
          "204": { description: "User deleted" },
          "400": {
            description: "Invalid user id",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
          "401": {
            description: "Authentication is required",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
          "403": {
            description: "Admin role is required",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
          "404": {
            description: "User not found",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
        },
      },
    },
    "/users/avatar": {
      post: {
        tags: ["Users"],
        summary: "Upload the current user's avatar",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["avatar"],
                properties: {
                  avatar: {
                    type: "string",
                    format: "binary",
                    description:
                      "JPEG, PNG, or WebP image up to 5 MB. Stored as a 512x512 WebP avatar.",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Avatar uploaded",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Avatar is missing or invalid",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
          "401": {
            description: "Authentication is required",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
        },
      },
    },
    "/tasks": {
      post: {
        tags: ["Tasks"],
        summary: "Create a task",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateTaskInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Task created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { data: { $ref: "#/components/schemas/Task" } },
                },
              },
            },
          },
          "400": { description: "Validation failed" },
          "401": { description: "Authentication is required" },
        },
      },
      get: {
        tags: ["Tasks"],
        summary: "Get the current user's tasks",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "status",
            in: "query",
            schema: { type: "string", enum: ["TODO", "IN_PROGRESS", "DONE"] },
          },
          {
            name: "priority",
            in: "query",
            schema: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
          },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 } },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", minimum: 1, maximum: 100, default: 10 },
          },
          {
            name: "sort",
            in: "query",
            schema: {
              type: "string",
              enum: ["createdAt", "priority", "title"],
              default: "createdAt",
            },
          },
          {
            name: "order",
            in: "query",
            schema: { type: "string", enum: ["asc", "desc"], default: "desc" },
          },
        ],
        responses: {
          "200": {
            description: "Paginated task list",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Task" },
                    },
                    page: { type: "integer", example: 1 },
                    limit: { type: "integer", example: 10 },
                    total: { type: "integer", example: 25 },
                  },
                },
              },
            },
          },
          "400": { description: "Invalid query parameters" },
          "401": { description: "Authentication is required" },
        },
      },
    },
    "/tasks/{id}": {
      get: {
        tags: ["Tasks"],
        summary: "Get one task",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", minimum: 1 },
          },
        ],
        responses: {
          "200": {
            description: "Task found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { data: { $ref: "#/components/schemas/Task" } },
                },
              },
            },
          },
          "401": { description: "Authentication is required" },
          "404": { description: "Task not found" },
        },
      },
      patch: {
        tags: ["Tasks"],
        summary: "Update a task",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", minimum: 1 },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateTaskInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Task updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { data: { $ref: "#/components/schemas/Task" } },
                },
              },
            },
          },
          "400": { description: "Validation failed" },
          "401": { description: "Authentication is required" },
          "404": { description: "Task not found" },
        },
      },
      delete: {
        tags: ["Tasks"],
        summary: "Delete a task",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", minimum: 1 },
          },
        ],
        responses: {
          "204": { description: "Task deleted" },
          "401": { description: "Authentication is required" },
          "404": { description: "Task not found" },
        },
      },
    },
    "/tasks/{id}/comments": {
      post: {
        tags: ["Comments"],
        summary: "Add a comment to a task",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Task id",
            schema: { type: "integer", minimum: 1 },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateCommentInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Comment created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { data: { $ref: "#/components/schemas/Comment" } },
                },
              },
            },
          },
          "400": { description: "Validation failed" },
          "401": { description: "Authentication is required" },
          "404": { description: "Task not found or does not belong to the user" },
        },
      },
      get: {
        tags: ["Comments"],
        summary: "Get all comments for a task",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Task id",
            schema: { type: "integer", minimum: 1 },
          },
        ],
        responses: {
          "200": {
            description: "Comments ordered from oldest to newest",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Comment" },
                    },
                  },
                },
              },
            },
          },
          "401": { description: "Authentication is required" },
          "404": { description: "Task not found or does not belong to the user" },
        },
      },
    },
    "/comments/{id}": {
      delete: {
        tags: ["Comments"],
        summary: "Delete the current user's comment",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Comment id",
            schema: { type: "integer", minimum: 1 },
          },
        ],
        responses: {
          "204": { description: "Comment deleted" },
          "400": { description: "Invalid comment id" },
          "401": { description: "Authentication is required" },
          "404": { description: "Comment not found or does not belong to the user" },
        },
      },
    },
  },
} as const;
