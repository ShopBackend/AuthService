import cors from 'cors';

const generateCorsMiddleware = (allowedOrigins, isProduction) => {
    const corsOptions = {
        origin: (requestOrigin, togglePermission) => {
            if (!requestOrigin) {
                if (isProduction)
                    return togglePermission(new Error('Origin header missing — request denied by CORS policy'), false);

                return togglePermission(null, true);
            }

            if (!allowedOrigins.includes(requestOrigin))
                return togglePermission(new Error(`Origin ${requestOrigin} not allowed by CORS policy`), false);


            return togglePermission(null, true);
        },
        credentials: true,
        optionsSuccessStatus: 200,
    };

    return cors(corsOptions);
}

export default generateCorsMiddleware;
