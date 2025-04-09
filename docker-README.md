# Docker Setup for AWS AIOps Dashboard

This document provides instructions for running the AWS AIOps Dashboard using Docker.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed on your machine
- [Docker Compose](https://docs.docker.com/compose/install/) installed on your machine

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/AVGenAI/aws-aiops-dashboard.git
   cd aws-aiops-dashboard
   ```

2. Build and start the Docker container:
   ```bash
   docker-compose up -d
   ```

3. Access the dashboard at [http://localhost:3000](http://localhost:3000)

4. To stop the container:
   ```bash
   docker-compose down
   ```

## Configuration

### Environment Variables

The AWS AIOps Dashboard requires AWS credentials to access AWS services. You can provide these credentials in several ways:

1. **Environment Variables in docker-compose.yml**:
   
   Uncomment and modify the environment variables in `docker-compose.yml`:
   ```yaml
   environment:
     - AWS_ACCESS_KEY_ID=your_access_key
     - AWS_SECRET_ACCESS_KEY=your_secret_key
     - AWS_REGION=us-east-1
   ```

2. **Mount AWS Credentials**:
   
   If you have AWS credentials configured on your host machine, you can mount them into the container by uncommenting the volume mount in `docker-compose.yml`:
   ```yaml
   volumes:
     - ~/.aws:/home/nextjs/.aws:ro
   ```

3. **Environment File**:
   
   Create a `.env.production` file with your AWS credentials and mount it into the container by uncommenting the volume mount in `docker-compose.yml`:
   ```yaml
   volumes:
     - ./.env.production:/app/.env.production
   ```

### Multiple Environments

The AWS AIOps Dashboard supports multiple environments (Dev, UAT, Prod). You can configure credentials for each environment by setting the following environment variables:

```yaml
environment:
  - AWS_ACCESS_KEY_ID_DEV=your_dev_access_key
  - AWS_SECRET_ACCESS_KEY_DEV=your_dev_secret_key
  - AWS_REGION_DEV=us-east-1
  - AWS_ACCESS_KEY_ID_UAT=your_uat_access_key
  - AWS_SECRET_ACCESS_KEY_UAT=your_uat_secret_key
  - AWS_REGION_UAT=us-east-1
  - AWS_ACCESS_KEY_ID_PROD=your_prod_access_key
  - AWS_SECRET_ACCESS_KEY_PROD=your_prod_secret_key
  - AWS_REGION_PROD=us-east-1
```

## Building a Custom Image

To build a custom Docker image:

```bash
docker build -t your-org/aws-aiops-dashboard:your-tag .
```

## Advanced Configuration

### Customizing the Docker Image

You can customize the Docker image by modifying the `Dockerfile`. The Dockerfile uses a multi-stage build process to optimize the image size and build time.

### Extending docker-compose.yml

You can extend the `docker-compose.yml` file to add additional services, such as a database or a reverse proxy.

## Troubleshooting

### Container Fails to Start

If the container fails to start, check the logs:

```bash
docker-compose logs
```

### AWS Credentials Not Working

If the AWS credentials are not working, ensure they are correctly configured and have the necessary permissions. You can check the logs for any AWS API errors.

## Security Considerations

- Do not commit your AWS credentials to version control
- Use environment variables or mounted volumes to provide credentials
- Consider using IAM roles with limited permissions
- Use a non-root user in the container (already configured in the Dockerfile)
