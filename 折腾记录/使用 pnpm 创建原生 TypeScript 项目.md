# 使用 pnpm 创建原生 TypeScript 项目

## 1. 安装 pnpm

```bash
npm install -g npm
```

## 2. 创建项目

```bash
mkdir app && cd app

pnpm init

pnpm add --save-dev typescript
pnpm add --save-dev vite

npx tsc --init
```

目录结构如下：

```bash
├── dist/
├── node_modules/
├── src/
│   └── main.ts
├── index.html
├── package.json
├── pnpm-lock.yaml
└── tsconfig.json
```

**package.json：**

```json
{
    "name": "app",
    "version": "1.0.0",
    "description": "",
    "main": "public/index.html",
    "scripts": {
        "dev": "vite",
        "build": "tsc && vite build",
        "preview": "vite preview"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "packageManager": "pnpm@10.24.0",
    "devDependencies": {
        "typescript": "^5.9.3",
        "vite": "^7.2.6"
    }
}
```

**tsconfig.json：**

```json
{
    // Visit https://aka.ms/tsconfig to read more about this file
    "compilerOptions": {
        // File Layout
        "rootDir": "./src",
        "outDir": "./dist",

        // Environment Settings
        // See also https://aka.ms/tsconfig/module
        "module": "esnext",
        "target": "esnext",
        "types": ["vite/client"],
        // For nodejs:
        // "lib": ["esnext"],
        // "types": ["node"],
        // and npm install -D @types/node

        // Other Outputs
        "sourceMap": true,
        "declaration": true,
        "declarationMap": true,

        // Stricter Typechecking Options
        "noUncheckedIndexedAccess": true,
        "exactOptionalPropertyTypes": true,

        // Style Options
        "noImplicitReturns": true,
        "noImplicitOverride": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "noFallthroughCasesInSwitch": true,
        "noPropertyAccessFromIndexSignature": true,

        // Recommended Options
        "strict": true,
        "jsx": "react-jsx",
        "verbatimModuleSyntax": true,
        "isolatedModules": true,
        "noUncheckedSideEffectImports": true,
        "moduleDetection": "force",
        "skipLibCheck": true
    }
}
```

## 3. 运行与构建

```bash
# 开发模式，支持热更新
pnpm dev

# 生产构建预览
pnpm preview

# 构建项目
pnpm build
```
