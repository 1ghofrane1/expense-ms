pipeline {
  agent any

  parameters {
    // Public repo URL (GitHub or GitLab)
    string(name: 'GIT_REPO_URL', defaultValue: 'https://github.com/your-username/expense-ms.git', description: 'GitHub/GitLab repository URL')
    // Branch to build
    string(name: 'GIT_BRANCH', defaultValue: 'main', description: 'Git branch to checkout')
  }

  environment {
    // Your Docker Hub username/org
    DOCKERHUB_NAMESPACE = 'your-dockerhub-username'
    // Image name that will be pushed to Docker Hub
    IMAGE_NAME = 'expense-ms-expenses'
    // Tag used for this build (easy to explain: one tag per Jenkins build)
    IMAGE_TAG = "${BUILD_NUMBER}"
  }

  stages {
    stage('Checkout Source') {
      steps {
        // Jenkins clones the source code from GitHub/GitLab
        git branch: params.GIT_BRANCH, url: params.GIT_REPO_URL
        // If your repo is private, use this format instead:
        // git branch: params.GIT_BRANCH, credentialsId: 'scm-creds', url: params.GIT_REPO_URL
      }
    }

    stage('Build Docker Image') {
      steps {
        // Build one Docker image from the Dockerfile of expenses-service
        sh '''
          docker build \
            -f expenses-service/Dockerfile \
            -t docker.io/${DOCKERHUB_NAMESPACE}/${IMAGE_NAME}:${IMAGE_TAG} \
            expenses-service
        '''
      }
    }

    stage('Push to Docker Hub') {
      // Push only when the selected branch is "main"
      when { expression { params.GIT_BRANCH == 'main' } }
      steps {
        // dockerhub-creds must be a "Username with password" credential in Jenkins
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub-creds',
          usernameVariable: 'DOCKERHUB_USER',
          passwordVariable: 'DOCKERHUB_TOKEN'
        )]) {
          sh '''
            # Login to Docker Hub
            echo "${DOCKERHUB_TOKEN}" | docker login -u "${DOCKERHUB_USER}" --password-stdin

            # Push version tag
            docker push docker.io/${DOCKERHUB_NAMESPACE}/${IMAGE_NAME}:${IMAGE_TAG}

            # Optional: also push latest for easier pull command
            docker tag docker.io/${DOCKERHUB_NAMESPACE}/${IMAGE_NAME}:${IMAGE_TAG} \
                      docker.io/${DOCKERHUB_NAMESPACE}/${IMAGE_NAME}:latest
            docker push docker.io/${DOCKERHUB_NAMESPACE}/${IMAGE_NAME}:latest
          '''
        }
      }
    }
  }

  post {
    always {
      sh 'docker logout || true'
    }
  }
}
