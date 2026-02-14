# Expense Tracker Microservices

Application web de gestion des depenses basee sur une architecture microservices.

## 1. Description du projet

Le projet contient 3 services:

1. `expenses-service` (Node.js/Express + MongoDB, port `3001`)
2. `analytics-service` (Node.js/Express, port `3002`)
3. `frontend` (React + Vite, servi par Nginx en conteneur)

Le service `expenses-service` expose le CRUD des depenses et stocke les donnees dans MongoDB.
Le service `analytics-service` ne se connecte pas a MongoDB: il appelle `expenses-service` via HTTP pour calculer les indicateurs.
Le `frontend` consomme les 2 APIs et affiche dashboard, filtres, tableau et formulaire.

### Modele de donnee `Expense`

- `title` (obligatoire, min 2)
- `amount` (obligatoire, > 0)
- `category` (`Food`, `Transport`, `Shopping`, `Bills`, `Other`)
- `date` (ISO, obligatoire)
- `notes` (optionnel, max 200)
- `createdAt`/`updatedAt` automatiques

Des validations sont implementees (middleware `express-validator`) avec gestion centralisee des erreurs.

## 2. Architecture

### 2.1 Architecture fonctionnelle

```text
[Browser]
   |
   v
[Frontend React]
   |---------------------------> [expenses-service] ---> [MongoDB]
   |
   |---------------------------> [analytics-service] ---HTTP---> [expenses-service]
```

### 2.2 Architecture DevOps

```text
[GitHub Repository]
        |
        v
[Jenkins Pipeline]
  - checkout
  - build 3 images Docker
  - push Docker Hub (tag build + latest, branche main)
        |
        v
[Kubernetes (Minikube)]
  - Namespace expense-ms
  - Deployments + Services (ClusterIP)
  - Secret Kubernetes pour MONGODB_URI
        |
        v
[Acces local via kubectl port-forward]
```

## 3. Prerequis

- Git
- Docker + Docker Compose
- Compte Docker Hub
- Minikube + kubectl
- Helm
- MongoDB Atlas (ou MongoDB local)
- Node.js 18+ (utile pour execution locale hors conteneurs)

## 4. Reproduction complete (environnement + CI/CD + k8s)

### 4.1 Clonage

```bash
git clone https://github.com/1ghofrane1/expense-ms.git
cd expense-ms
```

### 4.2 Variables d'environnement

Creer un fichier `.env` a la racine (utilise pour le secret Kubernetes):

```env
MONGODB_URI=<votre_uri_mongodb_atlas>
```

Verifier/adapter aussi les fichiers suivants:

```env
# expenses-service/.env
PORT=3001
NODE_ENV=development
MONGODB_URI=<votre_uri_mongodb>
CORS_ORIGIN=http://localhost:5173
```

```env
# analytics-service/.env
PORT=3002
NODE_ENV=development
EXPENSES_SERVICE_URL=http://localhost:3001
CORS_ORIGIN=http://localhost:5173
```

```env
# frontend/.env
VITE_EXPENSES_API_URL=http://localhost:3001/api
VITE_ANALYTICS_API_URL=http://localhost:3002/api
```

### 4.3 Build et push Docker images

```bash
docker login

docker build -f expenses-service/Dockerfile \
  -t docker.io/1ghofrane1/expense-ms-expenses-service:latest \
  expenses-service

docker build -f analytics-service/Dockerfile \
  -t docker.io/1ghofrane1/expense-ms-analytics-service:latest \
  analytics-service

docker build -f frontend/Dockerfile \
  --build-arg VITE_EXPENSES_API_URL=http://localhost:3005/api \
  --build-arg VITE_ANALYTICS_API_URL=http://localhost:3006/api \
  -t docker.io/1ghofrane1/expense-ms-frontend:latest \
  frontend

docker push docker.io/1ghofrane1/expense-ms-expenses-service:latest
docker push docker.io/1ghofrane1/expense-ms-analytics-service:latest
docker push docker.io/1ghofrane1/expense-ms-frontend:latest
```

### 4.4 Jenkins (CI/CD)

```bash
cd jenkins
docker compose up -d --build
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
cd ..
```

Acces Jenkins: `http://localhost:8087`.

Creer les credentials Jenkins:

1. `dockerhub-creds` (type: Username with password)
2. `scm-creds` (optionnel, si repository prive)

Creer le job Pipeline:

1. New Item -> Pipeline
2. Pipeline script from SCM
3. SCM: Git
4. Repository URL: votre repo
5. Branch: `main`
6. Script Path: `Jenkinsfile`

Pipeline execute:

1. Checkout source
2. Build des 3 images Docker
3. Push vers Docker Hub (uniquement sur branche `main`)

### 4.5 Deploiement Kubernetes (Minikube)

```bash
minikube start --driver=docker

kubectl create namespace expense-ms

kubectl create secret generic expense-ms-secrets \
  --from-env-file=.env \
  -n expense-ms \
  --dry-run=client -o yaml | kubectl apply -f -

kubectl apply -f k8s/

kubectl rollout status deployment/expenses-service -n expense-ms
kubectl rollout status deployment/analytics-service -n expense-ms
kubectl rollout status deployment/frontend -n expense-ms

kubectl get deploy,po,svc -n expense-ms
```

### 4.6 Acces application (port-forward)

Terminal 1:

```bash
kubectl port-forward -n expense-ms svc/expenses-service 3005:3001
```

Terminal 2:

```bash
kubectl port-forward -n expense-ms svc/analytics-service 3006:3002
```

Terminal 3:

```bash
kubectl port-forward -n expense-ms svc/frontend-service 5175:80
```

Ouvrir: `http://localhost:5175`

### 4.7 Monitoring (Prometheus + Grafana)

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm upgrade --install kube-prometheus-stack prometheus-community/kube-prometheus-stack \
  -n expenseghof --create-namespace

kubectl get pods -n expenseghof
kubectl get svc -n expenseghof

kubectl get secret -n expenseghof kube-prometheus-stack-grafana \
  -o jsonpath="{.data.admin-password}" | base64 -d; echo
```

Acces interfaces:

```bash
kubectl port-forward -n expenseghof svc/kube-prometheus-stack-grafana 3010:80
kubectl port-forward -n expenseghof svc/kube-prometheus-stack-prometheus 9092:9090
```

- Grafana: `http://localhost:3010`
- Prometheus: `http://localhost:9092`

## 5. Endpoints API

### 5.1 Expenses Service (`3001`)

- `GET /health`
- `GET /api/expenses?from=YYYY-MM-DD&to=YYYY-MM-DD&category=...`
- `GET /api/expenses/:id`
- `POST /api/expenses`
- `PUT /api/expenses/:id`
- `DELETE /api/expenses/:id`

### 5.2 Analytics Service (`3002`)

- `GET /health`
- `GET /api/summary?from=YYYY-MM-DD&to=YYYY-MM-DD`

## 6. Etat actuel de la chaine CI/CD

- CI automatisee: oui (build + push Docker Hub via Jenkins)
- CD vers Kubernetes: partiellement automatisee (deploiement fait manuellement via `kubectl`)
- Monitoring: en place via Helm (`kube-prometheus-stack`)

## 7. Remarques

1. Le mapping Jenkins dans `jenkins/docker-compose.yml` expose `8087:8080`; l'URL locale a utiliser est donc `http://localhost:8087`.
2. Les secrets (URI MongoDB, tokens) ne doivent jamais etre commites dans Git.
3. Pour aller plus loin: automatiser le deploiement Kubernetes dans Jenkins ou finaliser un flux GitOps (ArgoCD).
