pipeline {
  agent any

  environment {
    // Your Docker Hub username/org
    DOCKERHUB_NAMESPACE = '1ghofrane1'
    // 3 project image names (same naming style as your local images)
    EXPENSES_IMAGE = 'expense-ms-expenses-service'
    ANALYTICS_IMAGE = 'expense-ms-analytics-service'
    FRONTEND_IMAGE = 'expense-ms-frontend'
    // Frontend build arguments
    FRONTEND_EXPENSES_API_URL = 'http://localhost:3005/api'
    FRONTEND_ANALYTICS_API_URL = 'http://localhost:3006/api'
    // Tag used for this build (easy to explain: one tag per Jenkins build)
    IMAGE_TAG = "${BUILD_NUMBER}"
  }

  stages {
    stage('Checkout Source') {
      steps {
        // Source is configured in Jenkins job (Pipeline script from SCM)
        checkout scm
      }
    }

    stage('Build Docker Images') {
      steps {
        // Build 3 images from the 3 service Dockerfiles
        sh '''
          docker build \
            -f expenses-service/Dockerfile \
            -t docker.io/${DOCKERHUB_NAMESPACE}/${EXPENSES_IMAGE}:${IMAGE_TAG} \
            expenses-service

          docker build \
            -f analytics-service/Dockerfile \
            -t docker.io/${DOCKERHUB_NAMESPACE}/${ANALYTICS_IMAGE}:${IMAGE_TAG} \
            analytics-service

          docker build \
            -f frontend/Dockerfile \
            --build-arg VITE_EXPENSES_API_URL=${FRONTEND_EXPENSES_API_URL} \
            --build-arg VITE_ANALYTICS_API_URL=${FRONTEND_ANALYTICS_API_URL} \
            -t docker.io/${DOCKERHUB_NAMESPACE}/${FRONTEND_IMAGE}:${IMAGE_TAG} \
            frontend
        '''
      }
    }

    stage('Push to Docker Hub') {
      // Push only for main branch
      when {
        expression {
          env.GIT_BRANCH == 'origin/main' || env.GIT_BRANCH == 'main' || env.BRANCH_NAME == 'main'
        }
      }

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

            # Push version tags
            docker push docker.io/${DOCKERHUB_NAMESPACE}/${EXPENSES_IMAGE}:${IMAGE_TAG}
            docker push docker.io/${DOCKERHUB_NAMESPACE}/${ANALYTICS_IMAGE}:${IMAGE_TAG}
            docker push docker.io/${DOCKERHUB_NAMESPACE}/${FRONTEND_IMAGE}:${IMAGE_TAG}

            # Also push latest tags
            docker tag docker.io/${DOCKERHUB_NAMESPACE}/${EXPENSES_IMAGE}:${IMAGE_TAG} \
                      docker.io/${DOCKERHUB_NAMESPACE}/${EXPENSES_IMAGE}:latest
            docker tag docker.io/${DOCKERHUB_NAMESPACE}/${ANALYTICS_IMAGE}:${IMAGE_TAG} \
                      docker.io/${DOCKERHUB_NAMESPACE}/${ANALYTICS_IMAGE}:latest
            docker tag docker.io/${DOCKERHUB_NAMESPACE}/${FRONTEND_IMAGE}:${IMAGE_TAG} \
                      docker.io/${DOCKERHUB_NAMESPACE}/${FRONTEND_IMAGE}:latest

            docker push docker.io/${DOCKERHUB_NAMESPACE}/${EXPENSES_IMAGE}:latest
            docker push docker.io/${DOCKERHUB_NAMESPACE}/${ANALYTICS_IMAGE}:latest
            docker push docker.io/${DOCKERHUB_NAMESPACE}/${FRONTEND_IMAGE}:latest
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
