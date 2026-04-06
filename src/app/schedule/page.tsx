"use client";

import { useState, useEffect, useCallback } from "react";
import { ScheduleForm } from "@/components/schedule/ScheduleForm";
import { ScheduleList } from "@/components/schedule/ScheduleList";
import { ScheduleStats } from "@/components/schedule/ScheduleStats";
import type { LocalScheduledPost, ScheduleStatus } from "@/lib/types";

export default function SchedulePage() {
  const [items, setItems] = useState<LocalScheduledPost[]>([]);
  const [editing, setEditing] = useState<LocalScheduledPost | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch("/api/schedule");
      if (res.ok) {
        setItems(await res.json());
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSaved = () => {
    setEditing(null);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/schedule/${id}`, { method: "DELETE" });
    fetchItems();
  };

  const handleStatusChange = async (id: string, status: ScheduleStatus) => {
    await fetch(`/api/schedule/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchItems();
  };

  const pending = items.filter((p) => p.status === "pending").length;
  const sent = items.filter((p) => p.status === "sent").length;
  const failed = items.filter((p) => p.status === "failed").length;

  return (
    <div className="space-y-8">
      <ScheduleStats pending={pending} sent={sent} failed={failed} />

      <div className="grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-6 lg:gap-8">
        <ScheduleForm
          editing={editing}
          onSaved={handleSaved}
          onCancel={() => setEditing(null)}
        />
        {loading ? (
          <div className="glass-glow p-7 flex items-center justify-center">
            <p className="text-foreground/40 text-sm">読み込み中...</p>
          </div>
        ) : (
          <ScheduleList
            items={items}
            onEdit={setEditing}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </div>
  );
}
