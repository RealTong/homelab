# Portfolio IBKR 部署说明

这个目录包含了 Portfolio IBKR 应用的 Kubernetes 部署配置。

## 镜像信息

- Docker 镜像: `ghcr.io/realtong/portfolio-ibkr:sha-b101ae0`
- 项目仓库: https://github.com/RealTong/portfolio-ibkr/
- 访问域名: https://portfolio.wst.sh

## 架构说明

该应用使用以下资源：

1. **Deployment**: 运行应用容器
   - 单副本部署
   - 资源限制: 500m CPU / 512Mi 内存
   - 调度到 `realtong-server` 节点

2. **Service**: 内部服务，端口 3000

3. **Ingress**: HTTPS 访问入口
   - 域名: portfolio.wst.sh
   - 使用 nginx-ingress-controller
   - TLS 证书由 cert-manager 自动管理

4. **PersistentVolumeClaim**: 持久化存储
   - 存储 SQLite 数据库
   - 大小: 1Gi
   - 使用 NFS 存储类

5. **ExternalSecret**: 敏感配置管理
   - 从 Infisical 获取配置
   - 包含 IBKR 账户 ID 和 OAuth 配置

## 配置要求

在部署前，需要在 Infisical 中配置以下密钥（路径: `/PortfolioIBKR/`）：

1. **IBKR_ACCOUNT_ID**: 您的 IBKR 账户 ID
2. **OAUTH_JSON**: IBKR OAuth 配置 JSON 文件内容

### OAuth JSON 格式示例

```json
{
  "client_id": "your_client_id",
  "client_secret": "your_client_secret",
  "redirect_uri": "https://portfolio.wst.sh/callback",
  "authorization_endpoint": "https://...",
  "token_endpoint": "https://..."
}
```

## 部署流程

由于使用 Flux GitOps，部署流程如下：

1. 确保在 Infisical 中已配置好所需的密钥
2. 提交代码到 Git 仓库
3. Flux 会自动检测变更并应用到集群
4. 等待几分钟让所有资源创建完成

## 监控部署状态

```bash
# 查看 Pod 状态
kubectl get pods -n homelab -l app=portfolio-ibkr

# 查看 Service
kubectl get svc -n homelab portfolio-ibkr

# 查看 Ingress
kubectl get ingress -n homelab portfolio-ibkr-ingress

# 查看 PVC
kubectl get pvc -n homelab portfolio-ibkr-data

# 查看 Secret（由 external-secrets 创建）
kubectl get secret -n homelab portfolio-ibkr-secret

# 查看应用日志
kubectl logs -n homelab -l app=portfolio-ibkr -f
```

## 故障排查

### Pod 无法启动

1. 检查 Secret 是否正确创建：
   ```bash
   kubectl describe externalsecret -n homelab portfolio-ibkr-secret
   ```

2. 查看 Pod 事件：
   ```bash
   kubectl describe pod -n homelab -l app=portfolio-ibkr
   ```

### 无法访问域名

1. 检查 Ingress 状态：
   ```bash
   kubectl describe ingress -n homelab portfolio-ibkr-ingress
   ```

2. 检查 TLS 证书：
   ```bash
   kubectl get certificate -n homelab portfolio-wst-sh-tls
   ```

### 数据持久化问题

检查 PVC 绑定状态：
```bash
kubectl describe pvc -n homelab portfolio-ibkr-data
```

## 更新应用

要更新到新版本，修改 `deployment.yaml` 中的镜像标签：

```yaml
image: ghcr.io/realtong/portfolio-ibkr:new-tag
```

提交后 Flux 会自动滚动更新。

## 环境变量说明

应用支持以下环境变量（已在 deployment.yaml 中配置）：

- `PORT`: 服务端口（默认 3000）
- `PORTFOLIO_TITLE`: UI 标题
- `IBKR_OAUTH_PATH`: OAuth 配置文件路径
- `PORTFOLIO_DB_PATH`: SQLite 数据库文件路径
- `IBKR_ACCOUNT_ID`: IBKR 账户 ID（从 Secret 获取）
