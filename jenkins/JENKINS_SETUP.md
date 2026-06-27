# Jenkins Setup Guide — Sufyan Collection

## 1. Required Jenkins Plugins

Install these from Manage Jenkins → Plugin Manager:

- Git Plugin
- Pipeline
- Docker Pipeline
- Kubernetes CLI Plugin
- Credentials Binding Plugin
- GitHub Integration Plugin
- Blue Ocean (optional, for better UI)

## 2. Credentials to Add

Go to Manage Jenkins → Credentials → System → Global → Add Credentials

### Docker Hub
- Kind: Username with password
- ID: `dockerhub-credentials`
- Username: `sufyanwithcode`
- Password: your Docker Hub password/token

### Kubernetes Config
- Kind: Secret file
- ID: `kubeconfig-credentials`
- File: upload your ~/.kube/config file

## 3. Create Pipeline Job

1. New Item → Pipeline
2. Name: `sufyan-collection-pipeline`
3. Pipeline → Definition: Pipeline script from SCM
4. SCM: Git
5. Repository URL: `https://github.com/sufyanwithcode/sufyan-collection.git`
6. Branch: `*/main`
7. Script Path: `jenkins/Jenkinsfile`
8. Save → Build Now

## 4. GitHub Webhook (optional auto-trigger)

In GitHub repo → Settings → Webhooks → Add webhook:
- Payload URL: `http://YOUR_JENKINS_IP:8080/github-webhook/`
- Content type: application/json
- Events: Just the push event
