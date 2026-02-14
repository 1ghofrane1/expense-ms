.# Jenkins Pipeline Setup (Simple Version)

This repository now includes:
- a ready-to-run Jenkins environment (`jenkins/`)
- a CI/CD pipeline (`Jenkinsfile`)

The pipeline does:
1. checkout source from GitHub/GitLab
2. build 3 Docker images from the service Dockerfiles
3. push the 3 images to Docker Hub

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
2. In `Pipeline definition`, choose `Pipeline script from SCM`
3. SCM: `Git`
4. Repository URL: your GitHub/GitLab repository URL
5. Branch Specifier: `*/main` (or your branch)
6. Script Path: `Jenkinsfile`
7. Save

Important:
- Use `Pipeline script from SCM` with this Jenkinsfile version.
- This is required because the pipeline uses `checkout scm`.

If your source repo is private:
- add SCM credentials in the job configuration (Git credentials field)
- create matching Jenkins credentials ID `scm-creds` if you prefer using an ID-based SCM setup

## 4) Configure Docker Hub Values

Edit these values in `Jenkinsfile`:
- `DOCKERHUB_NAMESPACE` (your Docker Hub username/org)
- `EXPENSES_IMAGE`
- `ANALYTICS_IMAGE`
- `FRONTEND_IMAGE`

The pipeline automatically tags with `${BUILD_NUMBER}` and also pushes `latest` for each image.
`Push to Docker Hub` stage runs only when the checked-out branch is `main`.

## 5) Run the Job

Click `Build Now`.
