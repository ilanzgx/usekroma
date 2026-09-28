import { queue, QUEUES } from "./queue";
import { db, jobs } from "@/database";
import { eq } from "drizzle-orm";

interface ImageResultPayload {
  jobId: string;
  status: "done" | "failed";
  resultKey?: string;
  errorMessage?: string;
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function startResultsConsumer(): Promise<void> {
  await queue.consume(QUEUES.IMAGE_RESULTS, async (data: ImageResultPayload) => {
    const { jobId, status, resultKey, errorMessage } = data;

    // Ignora mensagens com IDs inválidos (como testes antigos na fila)
    if (!jobId || !UUID_REGEX.test(jobId)) {
      console.warn(`[Queue] Mensagem descartada com jobId inválido: ${jobId}`);
      return;
    }

    if (status === "done" && resultKey) {
      await db
        .update(jobs)
        .set({
          status: "done",
          resultKey,
          completedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(jobs.id, jobId));
    } else {
      await db
        .update(jobs)
        .set({
          status: "failed",
          errorMessage: errorMessage ?? "Unknown error",
          completedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(jobs.id, jobId));
    }
  });
}
