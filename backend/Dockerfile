#FROM openjdk:20
#
#ARG JAR_FILE=target/*.jar
#
#COPY ./target/backend-0.0.1-SNAPSHOT.jar app.jar
#EXPOSE 8080
#ENTRYPOINT ["java","-jar","/app.jar"]
# Use a base image with Maven and Java
FROM maven:3.8.3-openjdk-17 as builder

# Set the working directory inside the container
WORKDIR /app

# Copy the pom.xml separately to leverage Docker layer caching
COPY pom.xml .

# Copy the source code
COPY src ./src

# Build the application
RUN mvn clean package

# Use a new stage to reduce final image size
FROM openjdk:17-jdk-slim

# Set the working directory
WORKDIR /app

# Copy only the built JAR from the previous stage
COPY --from=builder /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
