# Wave 2 A 路线 · 时间一致性扫描报告

**扫描日期**：2026-04-23
**员工池**：200 人
**状态分布**：
  - regular: 178
  - probation: 1
  - transferring: 2
  - offboarding: 4
  - terminated: 15

**总异常数**：0（error 级）

## [B4] terminated/offboarding 员工池分布

- **严重度**：info
- **命中数**：0
- **抽样（前 10 条）**：

```json
{"label":"terminated 员工数","value":15}
{"label":"offboarding 员工数","value":4}
{"label":"说明","value":"offboarding mock 通过 filter 确保对齐，此规则在 filter 保证下无异常"}
```

