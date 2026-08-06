"use client";

import { useCallback, useEffect, useState } from "react";
import { Briefcase, CheckCircle2, Plus, XCircle } from "lucide-react";
import { trpcClient } from "../../../src/utils/trpc-client";
import { useAuth } from "../../../src/context/auth-context";

type Claim = {
  id: string;
  amountIdr: string;
  category: string;
  description: string;
  status: string;
};

export default function ExpensesPage() {
  const { isManager, isHrAdmin, isCompanyAdmin, shellMode } = useAuth();
  const canDecide = (isManager || isHrAdmin || isCompanyAdmin) && shellMode === "manage";

  const [mine, setMine] = useState<Claim[]>([]);
  const [pending, setPending] = useState<Claim[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState(150000);
  const [category, setCategory] = useState<"TRAVEL" | "MEAL" | "MEDICAL" | "OTHER">("TRAVEL");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      setMine((await trpcClient.expenses.myClaims.query()) as Claim[]);
      if (canDecide) {
        setPending((await trpcClient.expenses.pendingForMe.query()) as Claim[]);
      } else {
        setPending([]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load expenses");
    }
  }, [canDecide]);

  useEffect(() => {
    void load();
  }, [load]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await trpcClient.expenses.submit.mutate({
        amountIdr: amount,
        category,
        description: description || `${category} claim`,
      });
      setShowForm(false);
      setDescription("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setBusy(false);
    }
  };

  const decide = async (claimId: string, decision: "APPROVED" | "REJECTED") => {
    setBusy(true);
    setError(null);
    try {
      await trpcClient.expenses.decide.mutate({ claimId, decision });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Decision failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 900 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, display: "flex", alignItems: "center", gap: 8 }}>
            <Briefcase style={{ width: 22, height: 22 }} /> Expenses
          </h1>
          <p style={{ margin: "6px 0 0", color: "#64748B", fontSize: 14 }}>
            Categories: TRAVEL, MEAL, MEDICAL, OTHER. Routed to your immediate boss.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "#0284C7",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "10px 14px",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          <Plus style={{ width: 16, height: 16 }} />
          {showForm ? "Close" : "New claim"}
        </button>
      </div>

      {error && (
        <p style={{ background: "#FEF3C7", color: "#92400E", padding: 12, borderRadius: 12, fontSize: 13 }}>{error}</p>
      )}

      {showForm && (
        <form
          onSubmit={(e) => void submit(e)}
          style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 20 }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
            <label style={{ fontSize: 12, fontWeight: 700 }}>
              Category
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as typeof category)}
                style={{ display: "block", width: "100%", marginTop: 4, padding: 8, borderRadius: 8, border: "1px solid #CBD5E1" }}
              >
                <option value="TRAVEL">TRAVEL</option>
                <option value="MEAL">MEAL</option>
                <option value="MEDICAL">MEDICAL</option>
                <option value="OTHER">OTHER</option>
              </select>
            </label>
            <label style={{ fontSize: 12, fontWeight: 700 }}>
              Amount (IDR)
              <input
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                style={{ display: "block", width: "100%", marginTop: 4, padding: 8, borderRadius: 8, border: "1px solid #CBD5E1" }}
              />
            </label>
          </div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginTop: 12 }}>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              required
              style={{ display: "block", width: "100%", marginTop: 4, padding: 8, borderRadius: 8, border: "1px solid #CBD5E1" }}
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            style={{
              marginTop: 14,
              background: "#0F766E",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "10px 14px",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Submit to boss
          </button>
        </form>
      )}

      <section style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 20 }}>
        <h2 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 800 }}>My claims</h2>
        {mine.length === 0 ? (
          <p style={{ color: "#64748B", fontSize: 13 }}>No expense claims yet.</p>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {mine.map((c) => (
              <li key={c.id} style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: 12, fontSize: 13 }}>
                <strong>{c.category}</strong> · Rp {Number(c.amountIdr).toLocaleString("id-ID")}
                <span style={{ float: "right", fontWeight: 800 }}>{c.status}</span>
                <p style={{ margin: "4px 0 0", color: "#64748B" }}>{c.description}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {canDecide && (
        <section style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 20 }}>
          <h2 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 800 }}>Pending for me</h2>
          {pending.length === 0 ? (
            <p style={{ color: "#64748B", fontSize: 13 }}>No pending expenses.</p>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {pending.map((c) => (
                <li key={c.id} style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: 12, fontSize: 13 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                    <div>
                      <strong>{c.category}</strong> · Rp {Number(c.amountIdr).toLocaleString("id-ID")}
                      <p style={{ margin: "4px 0 0", color: "#64748B" }}>{c.description}</p>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void decide(c.id, "APPROVED")}
                        style={{
                          background: "#059669",
                          color: "#fff",
                          border: "none",
                          borderRadius: 8,
                          padding: "8px 10px",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <CheckCircle2 style={{ width: 14, height: 14 }} /> Approve
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void decide(c.id, "REJECTED")}
                        style={{
                          background: "#DC2626",
                          color: "#fff",
                          border: "none",
                          borderRadius: 8,
                          padding: "8px 10px",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <XCircle style={{ width: 14, height: 14 }} /> Reject
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
