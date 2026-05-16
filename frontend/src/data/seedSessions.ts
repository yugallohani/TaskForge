import { WorkSession } from "@/types/project";

/**
 * Seed work sessions for the 5 dummy members.
 * Creates realistic operational data so the admin dashboard,
 * work sessions page, and charts have real data to display.
 */
const hoursAgo = (h: number) =>
  new Date(Date.now() - h * 3600 * 1000).toISOString();

const daysAgo = (d: number, hour: number = 9) => {
  const date = new Date();
  date.setDate(date.getDate() - d);
  date.setHours(hour, Math.floor(Math.random() * 60), 0, 0);
  return date.toISOString();
};

const session = (
  id: string,
  memberId: string,
  memberName: string,
  memberAvatar: string,
  startedAt: string,
  durationSeconds: number,
  projectId?: string,
  projectName?: string
): WorkSession => ({
  id,
  memberId,
  memberName,
  memberAvatar,
  projectId,
  projectName,
  startedAt,
  endedAt: new Date(
    new Date(startedAt).getTime() + durationSeconds * 1000
  ).toISOString(),
  durationSeconds,
  status: "completed",
});

export const seedSessions: WorkSession[] = [
  // ─── Today ───
  session("s1", "u1", "Priya Patel", "PP", hoursAgo(3), 5400, "proj_t2i", "Text-to-Image Compare"),
  session("s2", "u2", "Rahul Sharma", "RS", hoursAgo(5), 7200, "proj_t2i", "Text-to-Image Compare"),
  session("s3", "u3", "Amit Kumar", "AK", hoursAgo(2), 3600, "proj_mask_milo", "Mask Milo"),
  session("s4", "u4", "Sneha Gupta", "SG", hoursAgo(4), 6300, "proj_mask_milo", "Mask Milo"),

  // ─── Yesterday ───
  session("s5", "u1", "Priya Patel", "PP", daysAgo(1, 9), 7200, "proj_t2i", "Text-to-Image Compare"),
  session("s6", "u2", "Rahul Sharma", "RS", daysAgo(1, 10), 5400, "proj_t2i", "Text-to-Image Compare"),
  session("s7", "u5", "Vikram Singh", "VS", daysAgo(1, 11), 4800, "proj_mask_milo", "Mask Milo"),
  session("s8", "u3", "Amit Kumar", "AK", daysAgo(1, 14), 3600, "proj_mask_milo", "Mask Milo"),

  // ─── 2 days ago ───
  session("s9", "u1", "Priya Patel", "PP", daysAgo(2, 9), 6600, "proj_t2i", "Text-to-Image Compare"),
  session("s10", "u4", "Sneha Gupta", "SG", daysAgo(2, 10), 5400, "proj_t2i", "Text-to-Image Compare"),
  session("s11", "u2", "Rahul Sharma", "RS", daysAgo(2, 13), 4200, "proj_mask_milo", "Mask Milo"),

  // ─── 3 days ago ───
  session("s12", "u5", "Vikram Singh", "VS", daysAgo(3, 9), 7200, "proj_mask_milo", "Mask Milo"),
  session("s13", "u3", "Amit Kumar", "AK", daysAgo(3, 10), 5400, "proj_t2i", "Text-to-Image Compare"),
  session("s14", "u1", "Priya Patel", "PP", daysAgo(3, 14), 3600, "proj_t2i", "Text-to-Image Compare"),

  // ─── 4 days ago ───
  session("s15", "u2", "Rahul Sharma", "RS", daysAgo(4, 9), 7800, "proj_t2i", "Text-to-Image Compare"),
  session("s16", "u4", "Sneha Gupta", "SG", daysAgo(4, 11), 5400, "proj_mask_milo", "Mask Milo"),

  // ─── 5 days ago ───
  session("s17", "u1", "Priya Patel", "PP", daysAgo(5, 9), 6000, "proj_t2i", "Text-to-Image Compare"),
  session("s18", "u5", "Vikram Singh", "VS", daysAgo(5, 10), 4800, "proj_mask_milo", "Mask Milo"),
  session("s19", "u3", "Amit Kumar", "AK", daysAgo(5, 13), 3600, "proj_t2i", "Text-to-Image Compare"),

  // ─── 6 days ago ───
  session("s20", "u2", "Rahul Sharma", "RS", daysAgo(6, 9), 7200, "proj_t2i", "Text-to-Image Compare"),
  session("s21", "u4", "Sneha Gupta", "SG", daysAgo(6, 10), 5400, "proj_mask_milo", "Mask Milo"),
];
