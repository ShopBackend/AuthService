Auth Service
Overview
This Auth Service is a microservice designed to handle user authentication and authorization. It is a key part of a larger system that is currently in progress. As a microservice, it will be integrated with other services such as an API Gateway and will leverage Kafka for communication and scalability.

The service is still under development, with Docker integration and additional features coming soon to support easier deployment and scaling across environments.

Features
User Authentication: Supports sign-up, login, and JWT token generation for secure user sessions.

Integration with Kafka: Communication with other services will be facilitated via Kafka for message queuing and asynchronous processing.

API Gateway Integration: The service is intended to be used with an API Gateway for routing, authentication, and load balancing across services.

Scalable: Designed to scale as part of a larger distributed microservices architecture.

Current State
This project is still in progress. The core authentication functionality is in place, but there are planned features and enhancements to be rolled out.

Dockerization: Docker integration is coming soon to facilitate deployment across different environments (development, testing, production).

Service-Oriented Architecture: As part of a larger service mesh, this auth service will communicate with other microservices via Kafka for event-driven communication, and all API calls will be routed through the API Gateway.

Tech Stack
Node.js/TypeScript: The service is built using Node.js and TypeScript for type safety and scalability.

JWT: JSON Web Tokens (JWT) are used for secure token-based authentication.

Kafka: Used for inter-service communication, providing event-driven architecture.

API Gateway: The service will be integrated with an API Gateway for request routing, rate limiting, and authentication delegation.

Docker (Coming Soon): Docker support is being added for consistent and isolated deployments.

PostgreSQL (Coming Soon): Will use relational databases for persistent storage of user credentials, depending on the requirements.

