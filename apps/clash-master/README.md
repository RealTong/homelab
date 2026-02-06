# Clash Master 部署说明

优雅且现代化的 OpenClash 流量可视化分析工具

## 项目信息

- **项目仓库**: https://github.com/foru17/clash-master
- **访问域名**: https://clash.wst.sh
- **命名空间**: homelab

## 功能特性

- 📊 实时流量监控（WebSocket 实时采集）
- 📈 趋势分析（30分钟/1小时/24小时多维度）
- 🌐 域名分析（流量、IP、连接数详情）
- 🗺️ IP 分析（ASN、地理位置）
- 🚀 代理统计（节点流量分配）
- 🌙 深色模式支持
- 🌍 双语支持（中文/英文）
- 🔄 多后端管理

## 架构说明

该应用使用以下资源：

1. **Deployment**: 运行应用容器
   - 单副本部署
   - 资源限制: 1000m CPU / 1Gi 内存
   - 三个端口: Web UI (3000), API (3001), WebSocket (3002)

2. **Service**: 内部服务
   - 暴露三个端口供内部访问

3. **Ingress**: HTTPS 访问入口
   - 域名: clash.wst.sh
   - 支持 WebSocket 连接
   - TLS 证书自动管理

4. **PersistentVolumeClaim**: 持久化存储
   - 存储 SQLite 数据库
   - 大小: 2Gi

## 部署步骤

### 1. 提交配置到 Git

```bash
git add apps/clash-master/ apps/kustomization.yaml
git commit -m "Add clash-master deployment"
git push origin main
```

### 2. 等待 Flux 部署

提交后：
- Flux 会自动检测到 Git 变更
- 拉取官方镜像 `ghcr.io/foru17/clash-master:latest`
- 创建 PVC、Service、Ingress
- 部署 Pod
- 约 3-5 分钟后完成

### 3. 验证部署

检查部署状态：

## 监控部署状态

```bash
# 查看 Pod 状态
kubectl get pods -n homelab -l app=clash-master

# 查看应用日志
kubectl logs -n homelab -l app=clash-master -f

# 查看所有相关资源
kubectl get all,ingress,pvc -n homelab -l app=clash-master

# 查看 Ingress
kubectl get ingress -n homelab clash-master-ingress

# 查看 PVC
kubectl get pvc -n homelab clash-master-data
```

## 首次使用

1. 访问 https://clash.wst.sh
2. 添加 OpenClash 后端配置
   - 后端地址: 您的 OpenClash 控制器地址
   - API Secret: OpenClash 的 secret 密钥
3. 开始监控流量

## 环境变量说明

应用支持以下环境变量（已在 deployment.yaml 中配置）：

- `NODE_ENV`: 运行环境（production）
- `API_PORT`: API 服务端口（3001）
- `WS_PORT`: WebSocket 端口（3002）
- `DB_PATH`: SQLite 数据库文件路径

## 更新应用

应用使用官方镜像，要更新到最新版本：

```bash
# 重启 Pod 拉取最新镜像
kubectl rollout restart deployment -n homelab clash-master
```

官方会持续更新镜像，重启 Pod 即可获取最新版本。

## 故障排查

### Pod 无法启动

1. 检查镜像是否存在：
   ```bash
   kubectl describe pod -n homelab -l app=clash-master
   ```

2. 查看 Pod 日志：
   ```bash
   kubectl logs -n homelab -l app=clash-master --tail=100
   ```

### WebSocket 连接失败

检查 Ingress 配置是否正确：
```bash
kubectl describe ingress -n homelab clash-master-ingress
```

确认 WebSocket 相关注解已配置。

### 数据丢失

检查 PVC 绑定状态：
```bash
kubectl describe pvc -n homelab clash-master-data
```

## 技术栈

- **前端**: Next.js 15, React 19, Tailwind CSS
- **后端**: Node.js 22
- **数据库**: SQLite
- **实时通信**: WebSocket
- **构建工具**: pnpm, Turbo

## 端口说明

| 端口 | 用途                |
|------|-------------------|
| 3000 | Web UI (前端界面)   |
| 3001 | API (后端接口)      |
| 3002 | WebSocket (实时数据) |

所有端口都通过 Service 暴露，但只有 3000 端口通过 Ingress 对外开放。
