export type lt = {
  status: string;
  message: string;
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  acceptanceRate: number;
  ranking: number;
  contributionPoints: number;
  reputation: number;
  submissionCalendar: Object;
};

export type cf = {
  status: string;
  result: [
    {
      contribution: number;
      lastOnlineTimeSeconds: number;
      rating: number;
      friendOfCount: number;
      titlePhoto: string;
      rank: string;
      handle: string;
      maxRating: number;
      avatar: string;
      registrationTimeSeconds: number;
      maxRank: string;
    }
  ];
};

export type cf_check = {
  status: string;
  result: [
    {
      id: number;
      contestId: number;
      creationTimeSeconds: number;
      relativeTimeSeconds: number;
      problem: Object;
      author: Object;
      programmingLanguage: string;
      verdict: string;
      testset: string;
      passedTestCount: number;
      timeConsumedMillis: number;
      memoryConsumedBytes: number;
    }
  ];
};

export type CodeForcesProps = {
  userId: string | null;
  showCheck?: boolean;
};

export type LeetcodeProps = {
  userId: string | null;
  showCheck?: boolean;
};
