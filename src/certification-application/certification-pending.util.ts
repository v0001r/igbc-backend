export function isPendingFromTotalPoints(totalPendingPoints: string | null | undefined): boolean {
  return parseFloat(totalPendingPoints ?? "0") > 0;
}
