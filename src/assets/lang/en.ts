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
  courses: {
    universeHeading: 'The Universe',
    universeSubheading:
      'Three cinematic series. One world. Built for the minds that question everything.',
  },
  about: {
    pageTitle: 'Why this exists',
    problemHeading: 'School has a problem.',
    problemBody: [
      'Not with teachers. Not with students.',
      'With questions.',
      'When a student asks something that does not fit the lesson plan, the lesson moves on. When a teenager starts wondering why the financial system works the way it does, or what attention actually is, or what is really true versus what they have simply been told, there is no space for that in a classroom of 32 people working toward a test.',
      'So the question gets buried. And the teenager learns, slowly, that curiosity is something to manage rather than follow.',
      'Path of Wonders was built for the teenagers who never stopped asking.',
    ] as const,
    whatItIsHeading: 'What it is',
    whatItIsBody: [
      'A cinematic education universe. Anime-quality stories that follow teenagers through the questions school never makes room for. How the algorithm was designed to capture your attention and what you can do about it. How money actually works and why nobody taught you. What the mind is capable of when you stop filling every quiet moment with noise. What it means to ask whether something is really true.',
      'The story arrives as cinematic video and as a hardcover book. The exercises arrive at the end of each episode and each chapter. The journal is where the thinking continues. The real-world quests are where the story leaves the room and enters actual life.',
    ] as const,
    whereItCameFromHeading: 'Where it came from',
    whereItCameFromBody: [
      'A physics teacher in Rotterdam was explaining what the inside of the Earth looks like. A student asked how anyone could know that, since nobody had ever been there.',
      'The teacher went quiet for about ten seconds.',
      'In those ten seconds he realized he did not actually know. He believed the scientists had done a great job. That is not the same thing. And nobody in that school had ever given that student a space to ask that question before.',
      'A few weeks later the teacher stopped his training, bought a one-way ticket to India, and spent years sitting with the same kind of questions. India and Nepal changed a lot. Varanasi especially. Long silences. The ghats at night. The oldest stories humans ever told, still trying to answer what one student in Rotterdam had asked.',
      'When he came back, he went back into classrooms. Different countries. Same teenagers in the back row with real questions and nowhere to take them.',
      'Path of Wonders is what he built for them.',
    ] as const,
    ruudImageAlt: 'Ruud portrait',
    whoItIsForHeading: 'Who it is for',
    whoItIsForBullets: [
      'Teenagers between 13 and 18 who feel like the questions they actually have are not the questions anyone around them wants to answer.',
      'Parents who know their child is capable of more than grades show, and who wish something like this had existed when they were fifteen.',
      'Families who believe that the right story, told well, can change how a young person sees themselves and the world.',
    ] as const,
    whatIsComingHeading: 'What is coming',
    whatIsComingBody: [
      'Three series are live or in production now. Fifty more are planned. The universe will grow slowly, one series at a time, each one built around a question worth asking.',
      'Path of Wonders. For the minds that question everything.',
    ] as const,
  },
} as const;

export type En = typeof en;
