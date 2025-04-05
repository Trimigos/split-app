FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . ./

# Create a simple script to inject environment variables at build time
RUN echo "const ENV_VARS = process.env;" > ./src/env-config.js && \
    echo "export const BACKEND_URL = process.env.NODE_ENV === 'production' ? \
    process.env.REACT_APP_BACKEND_URL || '${BACKEND_URL}' || '/api' : '/api';" >> ./src/env-config.js

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a simple script that will replace environment variables in the HTML files
RUN apk add --no-cache bash
COPY --from=build /app/build /usr/share/nginx/html
RUN echo '#!/bin/bash\n\
sed -i "s|BACKEND_URL_PLACEHOLDER|$BACKEND_URL|g" /usr/share/nginx/html/index.html\n\
nginx -g "daemon off;"\n' > /docker-entrypoint.sh && \
chmod +x /docker-entrypoint.sh

EXPOSE 80
CMD ["/docker-entrypoint.sh"]