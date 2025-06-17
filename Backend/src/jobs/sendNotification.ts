export async function sendNotification(
  type: "job_accepted" | "job_started" | "job_completed",
  data: { userId: string; message: string }
) {
    console.log(`Notify [${data.userId}] - ${type}: ${data.message}`);
}
