import { DataSource } from "typeorm";
import { RankingScore, BadgeLevel } from "../entities/RankingScore";
import { SpecialistProfile } from "../entities/SpecialistProfile";
import { CurationVote } from "../entities/CurationVote";
import { Activity } from "../entities/Activity";

export async function recalculateRanking(
  db: DataSource,
  specialistId: string
): Promise<void> {
  const voteRepo = db.getRepository(CurationVote);
  const activityRepo = db.getRepository(Activity);
  const specialistRepo = db.getRepository(SpecialistProfile);
  const rankingRepo = db.getRepository(RankingScore);

  const curationPoints = await voteRepo.count({ where: { specialist: { id: specialistId } } });

  const activities = await activityRepo.find({
    where: { specialist: { id: specialistId }, verified: true },
  });
  const activityPoints = activities.reduce((sum, a) => sum + a.participantsCount * 10, 0);

  const specialist = await specialistRepo.findOneBy({ id: specialistId });
  if (!specialist) return;

  const googleRating = Number(specialist.googleRating) || 0;
  const linkedinConn = specialist.linkedinConnections || 0;
  const externalScore =
    (googleRating / 5.0) * 20 + Math.min(linkedinConn / 500.0, 1.0) * 10;

  const totalScore = curationPoints + activityPoints + externalScore;

  let badge: BadgeLevel = "standard";
  if (totalScore >= 500) badge = "distinguished";
  else if (totalScore >= 150) badge = "elevated";

  const existing = await rankingRepo.findOne({ where: { specialist: { id: specialistId } } });
  if (existing) {
    existing.curationPoints = curationPoints;
    existing.activityPoints = activityPoints;
    existing.externalScore = externalScore;
    existing.totalScore = totalScore;
    existing.badge = badge;
    await rankingRepo.save(existing);
  } else {
    const newRanking = rankingRepo.create({
      specialist,
      curationPoints,
      activityPoints,
      externalScore,
      totalScore,
      badge,
    });
    await rankingRepo.save(newRanking);
  }

  await refreshRanks(db);
}

async function refreshRanks(db: DataSource): Promise<void> {
  const rankingRepo = db.getRepository(RankingScore);
  const all = await rankingRepo.find({ order: { totalScore: "DESC" } });
  for (let i = 0; i < all.length; i++) {
    all[i].rank = i + 1;
  }
  await rankingRepo.save(all);
}
