export function getSeasons() {
  const currentDate = new Date();
  const previousDate = new Date();
  const nextDate = new Date();
  nextDate.setMonth(previousDate.getMonth() + 3);
  previousDate.setMonth(previousDate.getMonth() - 3);
  const SEASONS = {
    winter: 'winter',
    spring: 'spring',
    summer: 'summer',
    autumn: 'autumn',
  };
  const getMonthToSeason = (month: number) => {
    if (0 <= month && month <= 2) {
      return SEASONS.winter;
    } else if (3 <= month && month <= 5) {
      return SEASONS.spring;
    } else if (6 <= month && month <= 8) {
      return SEASONS.summer;
    } else {
      return SEASONS.autumn;
    }
  };

  return {
    nextSeason: {
      year: nextDate.getFullYear(),
      season: getMonthToSeason(nextDate.getMonth()),
    },
    currentSeason: {
      year: currentDate.getFullYear(),
      season: getMonthToSeason(currentDate.getMonth()),
    },
    previousSeason: {
      year: previousDate.getFullYear(),
      season: getMonthToSeason(previousDate.getMonth()),
    },
  };
}
