/**
 * PM2 ecosystem for Imran portfolio on techversol-server.
 * Always port 3004.
 *
 * Usage (from portfolio/):
 *   npm run build
 *   pm2 start ecosystem.config.cjs
 *   pm2 save
 *
 * Do not run `cloudflared service install` — that would overwrite the
 * existing system cloudflared.service token and break other tunnels.
 */
module.exports = {
  apps: [
    {
      name: "imran-portfolio",
      cwd: "/mnt/1TB-EXT/ImranChodriPort/portfolio",
      script: "scripts/pm2-start.sh",
      interpreter: "bash",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: "3004",
        BIND_HOST: "0.0.0.0",
      },
    },
    {
      name: "imran-portfolio-tunnel",
      cwd: "/mnt/1TB-EXT/ImranChodriPort/portfolio",
      script: "scripts/start-cloudflare-tunnel.sh",
      interpreter: "bash",
      autorestart: true,
      max_restarts: 50,
      min_uptime: "5s",
    },
    {
      name: "imran-portfolio-watch",
      cwd: "/mnt/1TB-EXT/ImranChodriPort/portfolio",
      script: "scripts/watch-production.sh",
      interpreter: "bash",
      autorestart: true,
      max_restarts: 50,
      min_uptime: "5s",
      env: {
        DEPLOY_BRANCH: "Production",
        DEPLOY_POLL_SECONDS: "60",
      },
    },
  ],
};
