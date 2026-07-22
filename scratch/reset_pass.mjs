import { Client } from "ssh2";

const conn = new Client();

conn.on("ready", () => {
  console.log("Setting postgres password inside nusakerja-postgres container...");

  const resetCmd = `
    docker exec nusakerja-postgres psql -U postgres -c "ALTER USER postgres WITH PASSWORD 'NusaKerja2026SecurePass!';"
  `;

  conn.exec(resetCmd, (err, stream) => {
    if (err) {
      console.error("Exec error:", err);
      conn.end();
      return;
    }
    stream
      .on("close", (code, signal) => {
        console.log(`Password reset finished with exit code: ${code}`);
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
