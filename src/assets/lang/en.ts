export const en = {
  hero2: {
    title: 'For the minds that question everything.',
    subtitle:
      'Path of Wonders is a cinematic education universe built for teenagers who think, and parents who know school is not enough.',
    ctaStartLearning: 'Join Early Access',
    ctaKnowMore: 'Watch the Trailer →',
    heroImageAlt: 'Watch Now',
    playVideoAriaLabel: 'Play video',
  },
  hero3: {
    title: 'For the minds that question everything.',
    subtitle: 'Path of Wonders is a cinematic education universe built for teenagers who think, and parents who know school is not enough.',
    cta: 'Join Early Access',
    heroImageAlt: 'Introduction video thumbnail',
    playVideoAriaLabel: 'Play introduction video',
    videoCaptionTitle: '90-sec introduction',
    videoCaptionSubtitle: 'Watch how teens transform their thinking.',
  },
  journey: {
    title: 'Empowering Teens Through Story-Driven Science Education',
    description:
      'Path Of Wonders is dedicated to nurturing curiosity, confidence, and purpose in teenagers through engaging and meaningful learning experiences.',
    stats: [
      { value: '10K+', label: 'Students' },
      { value: '500+', label: 'Courses' },
      { value: '95%', label: 'Success Rate' },
    ] as const,
    learnMore: 'Learn More',
    imageAlt: 'Students learning together',
    overlayTitle: 'Excellence in Education',
    overlaySubtitle: 'Empowering the next generation of learners',
  },
} as const;

export type En = typeof en;
