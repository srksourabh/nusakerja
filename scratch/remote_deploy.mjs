import { Client } from "ssh2";

const conn = new Client();

conn.on("ready", () => {
  console.log("SSH Connection Established to Hostinger VPS (187.124.96.63)!");

  const dockerCmd = `
    echo 'Creating PostgreSQL volume...' &&
    docker volume create nusakerja_postgres_data &&
    echo 'Spinning up PostgreSQL 16 container...' &&
    docker run -d \\
      --name nusakerja-postgres \\
      --restart always \\
      -p 5432:5432 \\
      -e POSTGRES_USER=postgres \\
      -e POSTGRES_PASSWORD=NusaKerja2026SecurePass! \\
      -e POSTGRES_DB=nusakerja_db \\
      -v nusakerja_postgres_data:/var/lib/postgresql/data \\
      postgres:16-alpine &&
    echo 'Listing active Docker containers:' &&
    docker ps
  `;

  conn.exec(dockerCmd, (err, stream) => {
    if (err) {
      console.error("Exec error:", err);
      conn.end();
      return;
    }
    stream
      .on("close", (code, signal) => {
        console.log(`SSH Remote Command finished with exit code: ${code}`);
        conn.end();
      })
      .on("data", (data) => {
        console.log("STDOUT: " + data);
      })
      .stderr.on("data", (data) => {
        console.error("STDERR: " + data);
      });
  });
}).connect({
  host: "187.124.96.63",
  port: 22,
  username: "root",
  password: "MT(PvLyA5#I;p)086.vM",
});
