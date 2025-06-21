interface BroadcastMetrics {
  totalJobsCreated: number;
  totalJobsBroadcasted: number;
  totalWorkersNotified: number;
  averageWorkersPerJob: number;
  failedBroadcasts: number;
  successfulBroadcasts: number;
  lastJobProcessed?: {
    jobId: string;
    timestamp: Date;
    workersFound: number;
    workersNotified: number;
  };
}

class BroadcastMonitor {
  private metrics: BroadcastMetrics = {
    totalJobsCreated: 0,
    totalJobsBroadcasted: 0,
    totalWorkersNotified: 0,
    averageWorkersPerJob: 0,
    failedBroadcasts: 0,
    successfulBroadcasts: 0,
  };

  private startTime: Date = new Date();

  // Track job creation
  trackJobCreation(jobId: string) {
    this.metrics.totalJobsCreated++;
    console.log(
      `📊 [METRICS] Job created - Total: ${this.metrics.totalJobsCreated}`
    );
  }

  // Track successful broadcast
  trackSuccessfulBroadcast(
    jobId: string,
    workersFound: number,
    workersNotified: number
  ) {
    this.metrics.totalJobsBroadcasted++;
    this.metrics.totalWorkersNotified += workersNotified;
    this.metrics.successfulBroadcasts++;
    this.metrics.averageWorkersPerJob =
      this.metrics.totalWorkersNotified / this.metrics.totalJobsBroadcasted;

    this.metrics.lastJobProcessed = {
      jobId,
      timestamp: new Date(),
      workersFound,
      workersNotified,
    };

    console.log(
      `📊 [METRICS] Broadcast successful - Job: ${jobId}, Workers: ${workersNotified}/${workersFound}`
    );
    console.log(
      `📊 [METRICS] Success rate: ${(
        (this.metrics.successfulBroadcasts / this.metrics.totalJobsCreated) *
        100
      ).toFixed(2)}%`
    );
  }

  // Track failed broadcast
  trackFailedBroadcast(jobId: string, error: any) {
    this.metrics.failedBroadcasts++;
    console.log(
      `📊 [METRICS] Broadcast failed - Job: ${jobId}, Error: ${error.message}`
    );
    console.log(
      `📊 [METRICS] Failure rate: ${(
        (this.metrics.failedBroadcasts / this.metrics.totalJobsCreated) *
        100
      ).toFixed(2)}%`
    );
  }

  // Track no workers found
  trackNoWorkersFound(jobId: string) {
    console.log(`📊 [METRICS] No workers found for job: ${jobId}`);
    this.metrics.lastJobProcessed = {
      jobId,
      timestamp: new Date(),
      workersFound: 0,
      workersNotified: 0,
    };
  }

  // Get current metrics
  getMetrics(): BroadcastMetrics & {
    uptime: string;
    successRate: number;
    failureRate: number;
  } {
    const uptime = this.getUptime();
    const successRate =
      this.metrics.totalJobsCreated > 0
        ? (this.metrics.successfulBroadcasts / this.metrics.totalJobsCreated) *
          100
        : 0;
    const failureRate =
      this.metrics.totalJobsCreated > 0
        ? (this.metrics.failedBroadcasts / this.metrics.totalJobsCreated) * 100
        : 0;

    return {
      ...this.metrics,
      uptime,
      successRate: Math.round(successRate * 100) / 100,
      failureRate: Math.round(failureRate * 100) / 100,
    };
  }

  // Get uptime
  private getUptime(): string {
    const now = new Date();
    const diff = now.getTime() - this.startTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  // Print current status
  printStatus() {
    const metrics = this.getMetrics();
    console.log("\n" + "=".repeat(60));
    console.log("📊 BROADCAST SYSTEM STATUS");
    console.log("=".repeat(60));
    console.log(`⏱️  Uptime: ${metrics.uptime}`);
    console.log(`📈 Total Jobs Created: ${metrics.totalJobsCreated}`);
    console.log(`📡 Total Jobs Broadcasted: ${metrics.totalJobsBroadcasted}`);
    console.log(`👥 Total Workers Notified: ${metrics.totalWorkersNotified}`);
    console.log(
      `📊 Average Workers per Job: ${metrics.averageWorkersPerJob.toFixed(2)}`
    );
    console.log(`✅ Success Rate: ${metrics.successRate}%`);
    console.log(`❌ Failure Rate: ${metrics.failureRate}%`);

    if (metrics.lastJobProcessed) {
      console.log(`🕒 Last Job Processed: ${metrics.lastJobProcessed.jobId}`);
      console.log(
        `   Time: ${metrics.lastJobProcessed.timestamp.toLocaleString()}`
      );
      console.log(`   Workers Found: ${metrics.lastJobProcessed.workersFound}`);
      console.log(
        `   Workers Notified: ${metrics.lastJobProcessed.workersNotified}`
      );
    }
    console.log("=".repeat(60) + "\n");
  }

  // Reset metrics
  reset() {
    this.metrics = {
      totalJobsCreated: 0,
      totalJobsBroadcasted: 0,
      totalWorkersNotified: 0,
      averageWorkersPerJob: 0,
      failedBroadcasts: 0,
      successfulBroadcasts: 0,
    };
    this.startTime = new Date();
    console.log("📊 [METRICS] Metrics reset");
  }
}

// Export singleton instance
export const broadcastMonitor = new BroadcastMonitor();

// Auto-print status every 5 minutes
setInterval(() => {
  broadcastMonitor.printStatus();
}, 5 * 60 * 1000);

// Print status on startup
setTimeout(() => {
  broadcastMonitor.printStatus();
}, 1000);
