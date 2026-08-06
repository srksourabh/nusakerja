"use client";

import { useCallback, useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { trpcClient } from "../../../src/utils/trpc-client";

type Notif = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  resource: string;
  readAt: string | Date | null;
  createdAt: string | Date;
};

export default function InboxPage() {
  const [items, setItems] = useState<Notif[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setItems((await trpcClient.notifications.list.query({})) as Notif[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load inbox");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const markRead = async (id: string) => {
    try {
      await trpcClient.notifications.markRead.mutate({ id });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not mark read");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 720 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, display: "flex", alignItems: "center", gap: 8 }}>
          <Bell style={{ width: 22, height: 22 }} /> Inbox
        </h1>
        <p style={{ margin: "6px 0 0", color: "#64748B", fontSize: 14 }}>
          Leave and expense notifications for your account.
        </p>
      </div>

      {error && (
        <p style={{ background: "#FEF3C7", color: "#92400E", padding: 12, borderRadius: 12, fontSize: 13 }}>{error}</p>
      )}

      <section style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 20 }}>
        {items.length === 0 ? (
          <p style={{ color: "#64748B", fontSize: 13 }}>No notifications.</p>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {items.map((n) => (
              <li
                key={n.id}
                style={{
                  border: "1px solid #E2E8F0",
                  borderRadius: 12,
                  padding: 12,
                  background: n.readAt ? "#fff" : "#F0FDFA",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <div>
                    <strong style={{ fontSize: 14 }}>{n.title}</strong>
                    <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748B" }}>{n.body}</p>
                    <p style={{ margin: "4px 0 0", fontSize: 11, color: "#94A3B8" }}>
                      {n.type} · {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!n.readAt && (
                    <button
                      type="button"
                      onClick={() => void markRead(n.id)}
                      style={{
                        border: "1px solid #CBD5E1",
                        background: "#fff",
                        borderRadius: 8,
                        padding: "6px 10px",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                        height: "fit-content",
                      }}
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
