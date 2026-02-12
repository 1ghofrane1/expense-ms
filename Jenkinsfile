pipeline {
  agent any

  environment {
    // Your Docker Hub username/org
    DOCKERHUB_NAMESPACE = '1ghofrane1'
    // Image name that will be pushed to Docker Hub
    IMAGE_NAME = 'expense-ms-expenses'
    // Tag used for this build (easy to explain: one tag per Jenkins build)
    IMAGE_TAG = "${BUILD_NUMBER}"
  }

  stages {
    stage('Checkout Source') {
      steps {
        // Jenkins retrieves code from GitHub (configured in the job SCM)
        checkout scm
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
      // Push only on main branch
      when { branch 'main' }
      steps {
        // dockerhub-creds must be a "Username with password" credential in Jenkins
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub-creds',
          usernameVariable: 'DOCKERHUB_USER',
          passwordVariable: 'DOCKERHUB_TOKEN'
        )]) {
          sh '''
            // Login to Docker Hub
            echo "${DOCKERHUB_TOKEN}" | docker login -u "${DOCKERHUB_USER}" --password-stdin

            // Push version tag
            docker push docker.io/${DOCKERHUB_NAMESPACE}/${IMAGE_NAME}:${IMAGE_TAG}

            // Optional: also push latest for easier pull command
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
