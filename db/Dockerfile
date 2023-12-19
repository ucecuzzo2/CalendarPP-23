# Use an official MySQL Docker image as the base image
FROM mysql:8

# Set environment variables for MySQL configuration
ENV MYSQL_ROOT_PASSWORD=nobugs
ENV MYSQL_DATABASE=calendarpp
ENV MYSQL_USER=user
ENV MYSQL_PASSWORD=user

# Copy SQL scripts to initialize the database
COPY script.sql /docker-entrypoint-initdb.d/

# Expose the MySQL port (default is 3306)
EXPOSE 3306
