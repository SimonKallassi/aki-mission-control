"use client";

import { useMemo } from "react";
import { useListBoardsApiV1BoardsGet } from "@/api/generated/boards/boards";
import { useListTasksApiV1BoardsBoardIdTasksGet } from "@/api/generated/tasks/tasks";
import type { AkiTask } from "@/components/organisms/PixelOfficePanel";

/**
 * Fetches in-progress tasks from the first board and maps them
 * to AkiTask shape (matching assigned_agent_id → AkiAgent ids).
 */
export function useInProgressTasks(): AkiTask[] {
  const boardsQuery = useListBoardsApiV1BoardsGet(
    { limit: 10 },
    { query: {} }
  );
  const boards =
    boardsQuery.data?.status === 200 ? boardsQuery.data.data.items ?? [] : [];
  const firstBoardId = boards[0]?.id ?? null;

  const tasksQuery = useListTasksApiV1BoardsBoardIdTasksGet(
    firstBoardId ?? "",
    { status: "in_progress", limit: 50 },
    { query: { enabled: Boolean(firstBoardId) } }
  );

  const rawItems =
    tasksQuery.data?.status === 200
      ? ((tasksQuery.data.data as { items?: unknown[] }).items ?? [])
      : [];

  return useMemo(
    () =>
      (rawItems as Array<{ id: string; title: string; assigned_agent_id?: string | null }>).map(
        (t) => ({ id: t.id, title: t.title, agent: t.assigned_agent_id ?? null })
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(rawItems)]
  );
}
