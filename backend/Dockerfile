FROM openjdk:21-jdk-slim

WORKDIR /app

RUN apt-get update && apt-get install -y maven

COPY . .

CMD ["mvn", "spring-boot:run"]