"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AUTH_ENABLED } from "@/lib/auth";

const STORAGE_KEY = "kalideck.favorites";

function readLocal(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeLocal(slugs: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    // Storage blocked; favorites stay in memory for the session.
  }
}

/**
 * Favorite tool slugs. In solo mode these live in localStorage; with auth on,
 * they sync to the favorites table keyed by the signed-in user.
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      if (AUTH_ENABLED) {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from("favorites")
            .select("tool_slug")
            .eq("user_id", user.id);
          if (active && data) {
            setFavorites(new Set(data.map((row) => row.tool_slug as string)));
            setReady(true);
            return;
          }
        }
      }
      if (active) {
        setFavorites(new Set(readLocal()));
        setReady(true);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  const toggle = useCallback(async (slug: string) => {
    let willAdd = false;
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
        willAdd = true;
      }
      if (!AUTH_ENABLED) writeLocal([...next]);
      return next;
    });

    if (!AUTH_ENABLED) return;

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    if (willAdd) {
      await supabase
        .from("favorites")
        .upsert({ user_id: user.id, tool_slug: slug });
    } else {
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("tool_slug", slug);
    }
  }, []);

  return { favorites, toggle, ready };
}
