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
  howItWorks: {
    heading: 'How it works',
    steps: [
      {
        id: 'watch',
        step: 1,
        title: 'WATCH',
        body: 'Cinematic story episodes designed to make teenagers think not memorize.',
      },
      {
        id: 'reflect',
        step: 2,
        title: 'REFLECT',
        body: 'Each episode ends with questions, not tests. The conversation continues in a handwritten journal.',
      },
      {
        id: 'live',
        step: 3,
        title: 'LIVE IT',
        body: 'Real-world quests take the insight out of the screen and into actual life.',
      },
    ] as const,
  },
  whoThisIsFor: {
    heading: 'Is this for you?',
    cards: [
      'For the teenager who asks questions school refuses to answer.',
      'For the parent who knows their child is capable of more than grades show.',
      'For families who believe stories can change how we think.',
      'For the next generation that will have to think for itself.',
    ] as const,
  },
  founderStory: {
    heading: 'Why I built this.',
    bodyPlaceholder:
      "I started teaching at 24. I bought a one-way ticket to India at 26. I taught monks in Dharamsala, primary school kids in Shanghai, and spent months in silence in meditation retreats. I have seen what happens when young people are treated as thinkers rather than students. I built Path of Wonders because I could not unsee it.",
    cta: 'Read the full story →',
    imageAlt: 'Founder portrait',
  },
} as const;

export type En = typeof en;
