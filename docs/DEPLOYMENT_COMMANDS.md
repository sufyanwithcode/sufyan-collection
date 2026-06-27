# Sufyan Collection by Capra
## Complete Deployment Commands Reference

> All Linux, Docker, Kubernetes, Jenkins, and Git commands in one place.
> The source code (main branch) contains NO deployment commands — only here.

---

## TABLE OF CONTENTS

1. [Linux Server Setup](#1-linux-server-setup)
2. [Git Commands](#2-git-commands)
3. [Docker Commands](#3-docker-commands)
4. [Docker Compose Commands](#4-docker-compose-commands)
5. [Kubernetes Commands](#5-kubernetes-commands)
6. [Jenkins Setup Commands](#6-jenkins-setup-commands)
7. [Database Commands](#7-database-commands)
8. [Monitoring Commands](#8-monitoring-commands)
9. [Application URLs](#9-application-urls)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. LINUX SERVER SETUP

### Update the system
```bash
sudo apt update && sudo apt upgrade -y
```

### Install essential tools
```bash
sudo apt install -y curl wget git vim unzip net-tools htop
```

### Install Node.js 20
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version    # Should print v20.x.x
npm  --version
```

### Install Docker
```bash
# Remove old versions
sudo apt remove -y docker docker-engine docker.io containerd runc 2>/dev/null

# Install dependencies
sudo apt install -y ca-certificates curl gnupg lsb-release

# Add Docker GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Start & enable Docker
sudo systemctl start  docker
sudo systemctl enable docker

# Allow current user to run Docker without sudo
sudo usermod -aG docker $USER
newgrp docker

# Verify
docker --version
docker compose version
```

### Install kubectl
```bash
curl -LO "https://dl.k8s.io/release/$(curl -sL https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
kubectl version --client
```

### Install Minikube (local Kubernetes)
```bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
minikube version
```

### Open required firewall ports
```bash
sudo ufw allow 22      # SSH
sudo ufw allow 3000    # Frontend
sudo ufw allow 5000    # Backend API
sudo ufw allow 8080    # Jenkins
sudo ufw allow 9090    # Prometheus
sudo ufw allow 3001    # Grafana
sudo ufw allow 8081    # Mongo Express
sudo ufw enable
sudo ufw status
```

---

## 2. GIT COMMANDS

### Initial setup (first time only)
```bash
git config --global user.name  "Sufyan"
git config --global user.email "sufyanwithcode@gmail.com"
```

### Clone the project
```bash
# Clone from main branch
git clone https://github.com/sufyanwithcode/sufyan-collection.git
cd sufyan-collection
```

### Push the project to GitHub (first time)
```bash
# Initialize a new repo (if not already done)
git init
git add .
git commit -m "feat: initial commit - Sufyan Collection by Capra"

# Add remote and push
git remote add origin https://github.com/sufyanwithcode/sufyan-collection.git
git branch -M main
git push -u origin main
```

### Day-to-day workflow
```bash
# Check status
git status

# Stage all changes
git add .

# Commit
git commit -m "feat: add new feature"

# Push to main
git push origin main

# Pull latest changes
git pull origin main

# View commit history
git log --oneline --graph --all
```

### Branching (recommended)
```bash
# Create and switch to a new branch
git checkout -b feature/new-feature

# Push the branch
git push origin feature/new-feature

# Merge into main
git checkout main
git merge feature/new-feature
git push origin main
```

---

## 3. DOCKER COMMANDS

### Build images manually
```bash
# Build backend image
docker build -t sufyanwithcode/sc-backend:latest ./backend

# Build frontend image
docker build \
  --build-arg REACT_APP_API_URL=/api \
  -t sufyanwithcode/sc-frontend:latest \
  ./frontend

# Build with a specific version tag
docker build -t sufyanwithcode/sc-backend:v1.0.0 ./backend
```

### Push images to Docker Hub
```bash
# Login to Docker Hub
docker login -u sufyanwithcode

# Push images
docker push sufyanwithcode/sc-backend:latest
docker push sufyanwithcode/sc-frontend:latest

# Logout
docker logout
```

### Pull images
```bash
docker pull sufyanwithcode/sc-backend:latest
docker pull sufyanwithcode/sc-frontend:latest
```

### Run containers individually
```bash
# Run MongoDB
docker run -d \
  --name sc_mongo \
  -p 27017:27017 \
  -v sc_mongo_data:/data/db \
  mongo:7.0

# Run Backend
docker run -d \
  --name sc_backend \
  -p 5000:5000 \
  -e MONGO_URI=mongodb://sc_mongo:27017/sufyan_collection \
  -e JWT_SECRET=your_secret_here \
  --link sc_mongo \
  sufyanwithcode/sc-backend:latest

# Run Frontend
docker run -d \
  --name sc_frontend \
  -p 3000:80 \
  sufyanwithcode/sc-frontend:latest
```

### Docker management
```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# List images
docker images

# View container logs
docker logs sc_backend
docker logs sc_backend -f          # Follow logs

# Execute command inside a container
docker exec -it sc_backend sh
docker exec -it sc_mongo mongosh

# Stop a container
docker stop sc_backend

# Remove a container
docker rm sc_backend

# Remove an image
docker rmi sufyanwithcode/sc-backend:latest

# Clean up unused resources
docker system prune -f             # Remove stopped containers, unused networks, dangling images
docker system prune -af            # Also remove unused images
docker volume prune -f             # Remove unused volumes

# Inspect a container
docker inspect sc_backend

# Container resource usage
docker stats

# Copy files to/from container
docker cp ./file.txt sc_backend:/app/file.txt
docker cp sc_backend:/app/logs ./logs
```

---

## 4. DOCKER COMPOSE COMMANDS

### Setup environment
```bash
cd sufyan-collection

# Copy and configure env file
cp backend/.env.example backend/.env
# Edit backend/.env with your values (optional for dev)
```

### Start all services
```bash
# Build and start everything in detached mode
docker compose up --build -d

# Start without rebuilding
docker compose up -d

# Start specific services
docker compose up -d mongo backend
```

### Seed the database (run once after first start)
```bash
docker exec sc_backend node src/utils/seedData.js
```

### Stop services
```bash
# Stop all services (keep containers)
docker compose stop

# Stop and remove containers (keeps volumes)
docker compose down

# Stop, remove containers AND volumes (CAUTION: deletes all data)
docker compose down -v
```

### View logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mongo

# Last 100 lines
docker compose logs --tail=100 backend
```

### Manage services
```bash
# Restart a specific service
docker compose restart backend

# Rebuild a specific service
docker compose up -d --build backend

# Scale a service
docker compose up -d --scale backend=3

# List running services
docker compose ps

# Check service health
docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
```

### Inspect compose network
```bash
docker network ls
docker network inspect sufyan_collection_network
```

---

## 5. KUBERNETES COMMANDS

### Start Minikube
```bash
# Start Minikube with enough resources
minikube start --cpus=2 --memory=4096 --disk-size=20g

# Enable ingress addon
minikube addons enable ingress
minikube addons enable metrics-server

# Check Minikube status
minikube status

# Get Minikube IP
minikube ip

# Open Minikube dashboard
minikube dashboard
```

### Deploy the application
```bash
cd sufyan-collection

# Option A — Apply all manifests in order
kubectl apply -f k8s/00-namespace.yaml
kubectl apply -f k8s/01-secrets-configmap.yaml
kubectl apply -f k8s/02-mongo.yaml
kubectl apply -f k8s/03-backend.yaml
kubectl apply -f k8s/04-frontend.yaml
kubectl apply -f k8s/05-ingress.yaml
kubectl apply -f k8s/06-prometheus.yaml
kubectl apply -f k8s/07-grafana.yaml

# Option B — Apply entire k8s directory at once
kubectl apply -f k8s/

# Option C — Use the helper script
bash k8s/deploy-k8s.sh
```

### Seed the database in Kubernetes
```bash
# Find the backend pod name
kubectl get pods -n sufyan-collection -l app=sc-backend

# Run seed script inside the pod
kubectl exec -it <backend-pod-name> -n sufyan-collection -- node src/utils/seedData.js
# Example:
kubectl exec -it sc-backend-7d9f4c-abc12 -n sufyan-collection -- node src/utils/seedData.js
```

### Check deployment status
```bash
# List all resources in the namespace
kubectl get all -n sufyan-collection

# List pods
kubectl get pods -n sufyan-collection

# List deployments
kubectl get deployments -n sufyan-collection

# List services
kubectl get services -n sufyan-collection

# List ingress
kubectl get ingress -n sufyan-collection

# Watch pods in real-time
kubectl get pods -n sufyan-collection -w

# Detailed pod info
kubectl describe pod <pod-name> -n sufyan-collection

# Deployment rollout status
kubectl rollout status deployment/sc-backend  -n sufyan-collection
kubectl rollout status deployment/sc-frontend -n sufyan-collection
```

### View pod logs
```bash
# View backend logs
kubectl logs -l app=sc-backend -n sufyan-collection

# Follow logs
kubectl logs -l app=sc-backend -n sufyan-collection -f

# Previous container logs (if pod crashed)
kubectl logs <pod-name> -n sufyan-collection --previous

# Logs for a specific container
kubectl logs <pod-name> -c backend -n sufyan-collection
```

### Update deployments
```bash
# Update backend image to a new tag
kubectl set image deployment/sc-backend \
  backend=sufyanwithcode/sc-backend:v1.1.0 \
  -n sufyan-collection

# Update frontend image
kubectl set image deployment/sc-frontend \
  frontend=sufyanwithcode/sc-frontend:v1.1.0 \
  -n sufyan-collection

# Rollback a deployment
kubectl rollout undo deployment/sc-backend -n sufyan-collection

# Rollback to a specific revision
kubectl rollout undo deployment/sc-backend --to-revision=2 -n sufyan-collection

# View rollout history
kubectl rollout history deployment/sc-backend -n sufyan-collection
```

### Scale deployments
```bash
# Scale backend to 3 replicas
kubectl scale deployment sc-backend --replicas=3 -n sufyan-collection

# Scale frontend to 2 replicas
kubectl scale deployment sc-frontend --replicas=2 -n sufyan-collection
```

### Access services via NodePort
```bash
# Get Minikube IP
MINIKUBE_IP=$(minikube ip)

echo "Website    → http://$MINIKUBE_IP:30080"
echo "Prometheus → http://$MINIKUBE_IP:30090"
echo "Grafana    → http://$MINIKUBE_IP:30300"

# Or use minikube service (opens in browser automatically)
minikube service sc-frontend-service -n sufyan-collection
```

### Access using Ingress
```bash
# Add entry to /etc/hosts
echo "$(minikube ip)  sufyan-collection.local" | sudo tee -a /etc/hosts

# Now visit: http://sufyan-collection.local
```

### Port-forwarding (for testing)
```bash
# Forward backend API
kubectl port-forward service/sc-backend-service 5000:5000 -n sufyan-collection

# Forward frontend
kubectl port-forward service/sc-frontend-service 3000:80 -n sufyan-collection

# Forward Prometheus
kubectl port-forward service/sc-prometheus-service 9090:9090 -n sufyan-collection

# Forward Grafana
kubectl port-forward service/sc-grafana-service 3001:3000 -n sufyan-collection
```

### Delete resources
```bash
# Delete a specific deployment
kubectl delete deployment sc-backend -n sufyan-collection

# Delete everything in the namespace
kubectl delete all --all -n sufyan-collection

# Delete the entire namespace (CAUTION: deletes everything)
kubectl delete namespace sufyan-collection
```

### Stop Minikube
```bash
minikube stop
minikube delete    # Delete the cluster entirely
```

---

## 6. JENKINS SETUP COMMANDS

### Install Java (Jenkins dependency)
```bash
sudo apt update
sudo apt install -y fontconfig openjdk-17-jre
java -version
```

### Install Jenkins
```bash
# Add Jenkins GPG key and repository
sudo wget -O /usr/share/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key

echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/" | \
  sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null

# Install Jenkins
sudo apt update
sudo apt install -y jenkins

# Start and enable Jenkins
sudo systemctl start  jenkins
sudo systemctl enable jenkins
sudo systemctl status jenkins
```

### Get Jenkins initial admin password
```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

### Allow Jenkins to run Docker
```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### Allow Jenkins to run kubectl
```bash
# Copy kubeconfig to Jenkins home
sudo mkdir -p /var/lib/jenkins/.kube
sudo cp ~/.kube/config /var/lib/jenkins/.kube/config
sudo chown -R jenkins:jenkins /var/lib/jenkins/.kube
```

### Jenkins service management
```bash
sudo systemctl start   jenkins
sudo systemctl stop    jenkins
sudo systemctl restart jenkins
sudo systemctl status  jenkins

# View Jenkins logs
sudo journalctl -u jenkins -f
```

### Access Jenkins
```
URL:      http://YOUR_SERVER_IP:8080
Username: admin
Password: (from initialAdminPassword above)
```

### Create the pipeline job (via Jenkins UI)
```
1. Click "New Item"
2. Enter name: sufyan-collection-pipeline
3. Select "Pipeline" → OK
4. Under "Pipeline":
   - Definition: Pipeline script from SCM
   - SCM: Git
   - Repository URL: https://github.com/sufyanwithcode/sufyan-collection.git
   - Branch: */main
   - Script Path: jenkins/Jenkinsfile
5. Click Save → Build Now
```

### Add credentials in Jenkins (via UI)
```
Manage Jenkins → Credentials → System → Global credentials → Add Credentials

1. Docker Hub:
   - Kind: Username with password
   - ID:   dockerhub-credentials
   - Username: sufyanwithcode
   - Password: <your-dockerhub-token>

2. Kubeconfig:
   - Kind: Secret file
   - ID:   kubeconfig-credentials
   - File: upload ~/.kube/config
```

---

## 7. DATABASE COMMANDS

### Connect to MongoDB inside Docker
```bash
# Interactive MongoDB shell
docker exec -it sc_mongo mongosh

# Connect directly to the database
docker exec -it sc_mongo mongosh sufyan_collection
```

### Useful MongoDB queries
```javascript
// (Run inside mongosh)

// Switch to database
use sufyan_collection

// Show all collections
show collections

// Count documents
db.users.countDocuments()
db.products.countDocuments()
db.categories.countDocuments()
db.orders.countDocuments()

// Find all admin users
db.users.find({ role: "admin" }).pretty()

// Find featured products
db.products.find({ isFeatured: true }, { name: 1, price: 1 }).pretty()

// Find all categories
db.categories.find({}, { name: 1, icon: 1 }).sort({ order: 1 })

// Find recent orders
db.orders.find().sort({ createdAt: -1 }).limit(5).pretty()

// Update a product price
db.products.updateOne(
  { name: "Royal Embroidered Kurta" },
  { $set: { price: 3800 } }
)

// Delete test data
db.orders.deleteMany({ orderStatus: "pending", createdAt: { $lt: new Date("2024-01-01") } })
```

### Re-seed the database
```bash
# Docker Compose
docker exec sc_backend node src/utils/seedData.js

# Kubernetes
kubectl exec -it $(kubectl get pod -l app=sc-backend -n sufyan-collection -o jsonpath='{.items[0].metadata.name}') \
  -n sufyan-collection -- node src/utils/seedData.js
```

### Backup & restore MongoDB
```bash
# Backup (from inside Docker)
docker exec sc_mongo mongodump --db sufyan_collection --out /data/backup
docker cp sc_mongo:/data/backup ./mongo-backup

# Restore
docker cp ./mongo-backup sc_mongo:/data/backup
docker exec sc_mongo mongorestore --db sufyan_collection /data/backup/sufyan_collection
```

---

## 8. MONITORING COMMANDS

### Access monitoring services
```bash
# Prometheus
open http://localhost:9090

# Grafana
open http://localhost:3001
# Username: admin  |  Password: Grafana@123

# Mongo Express
open http://localhost:8081
# Username: admin  |  Password: Admin@123
```

### Useful Prometheus queries
```promql
# Total HTTP requests
sum(http_requests_total)

# Requests per second
rate(http_requests_total[5m])

# 95th percentile response time
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# API uptime
process_uptime_seconds

# Memory usage in MB
process_resident_memory_bytes / 1024 / 1024

# CPU usage percentage
rate(process_cpu_seconds_total[5m]) * 100

# Active Node.js handles
nodejs_active_handles_total

# Event loop lag
nodejs_eventloop_lag_seconds
```

### Reload Prometheus config (without restart)
```bash
curl -X POST http://localhost:9090/-/reload
```

### Grafana — import Node.js dashboard
```
1. Open http://localhost:3001
2. Login: admin / Grafana@123
3. + → Import Dashboard
4. Enter ID: 11159  (Node.js Application Dashboard)
5. Select Prometheus data source → Import
```

---

## 9. APPLICATION URLS

### Docker Compose (local development)

| Service       | URL                         | Credentials         |
|---------------|-----------------------------|---------------------|
| Website       | http://localhost:3000       | —                   |
| API           | http://localhost:5000       | —                   |
| API Health    | http://localhost:5000/health| —                   |
| API Metrics   | http://localhost:5000/metrics| —                  |
| Prometheus    | http://localhost:9090       | —                   |
| Grafana       | http://localhost:3001       | admin / Grafana@123 |
| Mongo Express | http://localhost:8081       | admin / Admin@123   |

### Kubernetes (Minikube)

```bash
MINIKUBE_IP=$(minikube ip)
echo "Website    → http://$MINIKUBE_IP:30080"
echo "Prometheus → http://$MINIKUBE_IP:30090"
echo "Grafana    → http://$MINIKUBE_IP:30300"
```

### Application Login Credentials

| Role  | Email                          | Password  |
|-------|--------------------------------|-----------|
| Admin | admin@sufyan-collection.com    | Admin@123 |
| User  | ali@test.com                   | User@123  |

---

## 10. TROUBLESHOOTING

### Container won't start
```bash
# Check logs
docker logs sc_backend

# Check if port is already in use
sudo lsof -i :5000
sudo lsof -i :3000

# Kill process using a port
sudo kill -9 $(sudo lsof -t -i :5000)
```

### MongoDB connection refused
```bash
# Check if mongo container is healthy
docker ps | grep mongo
docker inspect sc_mongo | grep -A 10 Health

# Check mongo logs
docker logs sc_mongo

# Test connection manually
docker exec -it sc_mongo mongosh --eval "db.adminCommand('ping')"
```

### Kubernetes pod stuck in Pending/CrashLoopBackOff
```bash
# Describe the pod for events
kubectl describe pod <pod-name> -n sufyan-collection

# Check if images exist
docker pull sufyanwithcode/sc-backend:latest

# Check resource constraints
kubectl top pods -n sufyan-collection
kubectl get nodes
kubectl describe node minikube

# Delete and recreate a stuck pod
kubectl delete pod <pod-name> -n sufyan-collection
```

### Jenkins build fails — Docker permission denied
```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
# Then trigger the build again
```

### Frontend can't reach backend API
```bash
# Test API directly
curl http://localhost:5000/health
curl http://localhost:5000/api/products

# Check nginx config inside frontend container
docker exec -it sc_frontend cat /etc/nginx/conf.d/default.conf

# Inspect network
docker network inspect sufyan_collection_network
```

### Reset everything and start fresh
```bash
# Docker Compose
docker compose down -v
docker rmi sufyanwithcode/sc-backend sufyanwithcode/sc-frontend
docker compose up --build -d
docker exec sc_backend node src/utils/seedData.js

# Kubernetes
kubectl delete namespace sufyan-collection
kubectl apply -f k8s/
# Wait for pods, then seed:
kubectl exec -it $(kubectl get pod -l app=sc-backend -n sufyan-collection \
  -o jsonpath='{.items[0].metadata.name}') \
  -n sufyan-collection -- node src/utils/seedData.js
```

---

*Last updated: 2024 — Sufyan Collection by Capra*
