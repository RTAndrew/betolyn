# Build stage (Debian-based for multi-arch: amd64 + arm64)
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /build

# Copy dependency definitions first for better layer caching
COPY pom.xml .
# Download dependencies (and cache them); skip tests
RUN mvn dependency:go-offline -B -DskipTests || true

# Copy source and build the application
COPY src ./src
RUN mvn -X package -B -DskipTests -Dspring-boot.repackage.skip=false

# Runtime stage
FROM eclipse-temurin:17-jre

WORKDIR /app

# Install wget for healthcheck only
RUN apt-get update && apt-get install -y --no-install-recommends wget \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user for security (use high IDs to avoid base image conflicts)
RUN groupadd -g 2000 appgroup && \
    useradd -u 2000 -g appgroup -m -s /bin/bash appuser

COPY --from=builder /build/target/*.jar app.jar

USER appuser

EXPOSE 8080

# JVM: respect container memory limits; optional GC tuning for containers
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
