import { exec } from "child_process";
import fs from "fs";

const password = "MT(PvLyA5#I;p)086.vM";
const ip = "187.124.96.63";
const user = "root";

console.log("Deploying Docker PostgreSQL container to Hostinger VPS:", ip);

// Command to run on the remote Hostinger server
const remoteCommand = `
docker volume create nusakerja_postgres_data && \
docker run -d \
  --name nusakerja-postgres \
  --restart always \
  -p 5432:5432 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=NusaKerja2026SecurePass! \
  -e POSTGRES_DB=nusakerja_db \
  -v nusakerja_postgres_data:/var/lib/postgresql/data \
  postgres:16-alpine && \
docker ps --filter name=nusakerja-postgres
`;

console.log("Remote Command Prepared:\n", remoteCommand);
