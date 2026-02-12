# Jenkins Pipeline Setup (Simple Version)

This repository now includes:
- a ready-to-run Jenkins environment (`jenkins/`)
- a CI/CD pipeline (`Jenkinsfile`)

The pipeline does:
1. checkout source from GitHub
2. build a Docker image from `expenses-service/Dockerfile`
3. push the image to Docker Hub

## 1) Start Jenkins

```bash
cd jenkins
docker compose up -d --build
```

Open Jenkins at `http://localhost:8080`.

Get the initial admin password:

```bash
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

## 2) Create Jenkins Credentials

Create these credentials in `Manage Jenkins -> Credentials`:

1. `dockerhub-creds` (Username with password)
- Username: your Docker Hub username
- Password: Docker Hub access token

2. `scm-creds` (optional, for private source repositories)

## 3) Create the Pipeline Job

1. `New Item -> Pipeline`
2. In `Pipeline definition`, choose `Pipeline script`
3. Paste the content of `Jenkinsfile`
4. Save

If your source repo is private, uncomment the `credentialsId: 'scm-creds'` line in `Jenkinsfile` and create the matching Jenkins credential.

## 4) Configure Docker Hub Values

Edit these values in `Jenkinsfile`:
- `DOCKERHUB_NAMESPACE` (your Docker Hub username/org)
- `IMAGE_NAME` (repository/image name)

The pipeline automatically tags with `${BUILD_NUMBER}` and also pushes `latest`.
`Push to Docker Hub` stage runs only when `GIT_BRANCH=main`.

At build time, provide:
- `GIT_REPO_URL` (your GitHub/GitLab repository URL)
- `GIT_BRANCH` (usually `main`)
