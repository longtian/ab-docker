ab-docker
=======================
基于 Docker 的 AB 测试发布系统

### 配置

新建配置文件 `~/.ab-dockerrc`

```
DOCKER=""
```

### 安装

```
git clone
cd
npm install
npm start
```

**控制台**

127.0.0.1:3001

**请求**

123.0.0.1:3002

### TODOS

- [ ] 转发规则
- [ ] 使用 React 重写前端
- [ ] 使用 Redis 记录请求
- [ ] 重构路由
- [ ] 性能指标